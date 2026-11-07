// Nightly link-rot sweep.
//
// Modes:
//   POST { mode: "seed", tools: [{ title, url, category }] }  -> upsert catalog rows
//   POST { mode: "sweep", limit?: number }                    -> check the least
//                                                                recently verified
//                                                                slice and email a
//                                                                report on failures
//
// This job NEVER deletes or edits a tool. It only records health and reports.
import { sendAdminEmail } from "../_shared/admin-email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FAILURE_THRESHOLD = 3;
const DEFAULT_LIMIT = 300;
const REQUEST_TIMEOUT_MS = 12000;

const escapeHtml = (str: string): string =>
  String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));

const isAuthorized = async (req: Request): Promise<boolean> => {
  const CRON_SECRET = Deno.env.get("DIGEST_CRON_SECRET");
  const provided = req.headers.get("x-cron-secret") || "";
  if (CRON_SECRET && provided === CRON_SECRET) return true;

  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return false;
  try {
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData } = await authClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    const userId = claimsData?.claims?.sub;
    if (!userId) return false;
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: userId, _role: "admin" });
    return isAdmin === true;
  } catch (e) {
    console.warn("link-health auth check failed:", e);
    return false;
  }
};

const probe = async (url: string): Promise<{ ok: boolean; status: number | null; error: string | null }> => {
  const attempt = async (method: "HEAD" | "GET") => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "AIWebToolsLinkHealth/1.0 (+https://aiwebtools.ai)" },
      });
      return { ok: res.status < 400, status: res.status, error: null as string | null };
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    const head = await attempt("HEAD");
    // Plenty of hosts reject HEAD outright — confirm with a GET before flagging.
    if (head.ok || (head.status !== 405 && head.status !== 403 && head.status !== 501)) return head;
    return await attempt("GET");
  } catch (e) {
    try {
      return await attempt("GET");
    } catch (e2) {
      return { ok: false, status: null, error: String((e2 as Error)?.message ?? e2).slice(0, 300) };
    }
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!(await isAuthorized(req))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let body: { mode?: string; limit?: number; tools?: Array<{ title?: string; url?: string; category?: string }> } = {};
  try { body = await req.json(); } catch {}

  // ── SEED MODE ────────────────────────────────────────────────────────────
  if (body.mode === "seed") {
    const rows = (body.tools || [])
      .filter((t) => typeof t?.url === "string" && /^https?:\/\//i.test(t.url!) && t.url!.length <= 2048)
      .map((t) => ({
        tool_title: String(t.title ?? "Untitled").slice(0, 300),
        tool_category: t.category ? String(t.category).slice(0, 200) : null,
        url: t.url!,
      }));
    if (rows.length === 0) {
      return new Response(JSON.stringify({ ok: true, seeded: 0 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { error } = await supabase.from("link_health").upsert(rows, { onConflict: "url", ignoreDuplicates: false });
    if (error) {
      console.error("seed failed", error);
      return new Response(JSON.stringify({ error: "Seed failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, seeded: rows.length }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── SWEEP MODE ───────────────────────────────────────────────────────────
  const limit = Math.min(Math.max(Number(body.limit) || DEFAULT_LIMIT, 1), 800);
  const { data: batch, error: fetchErr } = await supabase
    .from("link_health")
    .select("id, tool_title, tool_category, url, consecutive_failures")
    .order("last_checked_at", { ascending: true, nullsFirst: true })
    .limit(limit);

  if (fetchErr) {
    console.error("batch fetch failed", fetchErr);
    return new Response(JSON.stringify({ error: "Could not load batch" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const now = new Date().toISOString();
  const newlyFlagged: Array<{ title: string; url: string; status: number | null; failures: number }> = [];
  let checked = 0;
  let failures = 0;

  const CONCURRENCY = 10;
  for (let i = 0; i < (batch?.length ?? 0); i += CONCURRENCY) {
    const slice = (batch ?? []).slice(i, i + CONCURRENCY);
    await Promise.all(slice.map(async (row) => {
      const result = await probe(row.url);
      checked++;
      const consecutive = result.ok ? 0 : (row.consecutive_failures ?? 0) + 1;
      if (!result.ok) {
        failures++;
        if (consecutive >= FAILURE_THRESHOLD) {
          newlyFlagged.push({ title: row.tool_title, url: row.url, status: result.status, failures: consecutive });
        }
      }
      await supabase.from("link_health").update({
        last_checked_at: now,
        last_status_code: result.status,
        consecutive_failures: consecutive,
        status: result.ok ? "ok" : (consecutive >= FAILURE_THRESHOLD ? "flagged" : "failing"),
        last_error: result.error,
      }).eq("id", row.id);
    }));
  }

  // ── REPORT ───────────────────────────────────────────────────────────────
  let emailed = false;
  if (newlyFlagged.length > 0) {
    const rowsHtml = newlyFlagged.slice(0, 200).map((f) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #003b12;">${escapeHtml(f.title)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #003b12;">${escapeHtml(f.url)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #003b12;">${f.status ?? "no response"}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #003b12;">${f.failures}</td>
      </tr>`).join("");
    try {
      await sendAdminEmail(`Link health: ${newlyFlagged.length} tool links need review`, `
            <div style="background:#000;color:#00ff41;font-family:'Courier New',monospace;padding:24px;">
              <h2 style="color:#00ff41;">Link Health Sweep</h2>
              <p>Checked <strong>${checked}</strong> links — <strong>${failures}</strong> failed this pass.</p>
              <p>The links below have failed ${FAILURE_THRESHOLD}+ consecutive checks. Nothing was removed — review and decide.</p>
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <tr><th align="left">Tool</th><th align="left">URL</th><th align="left">Status</th><th align="left">Fails</th></tr>
                ${rowsHtml}
              </table>
            </div>`);
      emailed = true;
    } catch (e) {
      console.error("report email error", e);
    }
    if (emailed) {
      await supabase.from("link_health").update({ reported_at: now })
        .in("url", newlyFlagged.map((f) => f.url));
    }
  }

  return new Response(JSON.stringify({ ok: true, checked, failures, flagged: newlyFlagged.length, emailed }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
