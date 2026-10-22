// Chat room watchdog.
//
// Scans gpt_chat_logs for a recent window and emails the admins when chat rooms
// stop replying, pictures fail to generate, or replies come back empty.
//
// POST { windowMinutes?: number, force?: boolean }
// Auth: x-cron-secret (DIGEST_CRON_SECRET) or an admin Bearer token.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { isReplyFailure } from "./failure-status.ts";
import { isPaused, type ProviderState } from "../_shared/chat-provider-state.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_WINDOW_MINUTES = 60;
const MAX_WINDOW_MINUTES = 60 * 24 * 7;

const escapeHtml = (str: string): string =>
  String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));

const isAuthorized = async (req: Request): Promise<boolean> => {
  const provided = req.headers.get("x-cron-secret") || "";
  const secrets = [
    Deno.env.get("CHAT_WATCHDOG_CRON_SECRET"),
    Deno.env.get("DIGEST_CRON_SECRET"),
  ].filter((s): s is string => !!s);
  if (provided && secrets.some((s) => s === provided)) return true;

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
    console.warn("chat-watchdog auth check failed:", e);
    return false;
  }
};

interface RoomTrouble {
  slug: string;
  total: number;
  replyFailures: number;
  imageFailures: number;
  emptyReplies: number;
  toolFailures: number;
  lastError: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!(await isAuthorized(req))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { windowMinutes?: number; force?: boolean; resumeProvider?: string; accessRestored?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const windowMinutes = Math.min(
    MAX_WINDOW_MINUTES,
    Math.max(5, Number(body.windowMinutes) || DEFAULT_WINDOW_MINUTES),
  );

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Protected owner action only. Cron runs inspect state but never probe blocked providers.
  if (body.resumeProvider !== undefined) {
    if (!req.headers.get("Authorization")?.startsWith("Bearer ") || !["bionic", "lovable_chat"].includes(body.resumeProvider) || body.accessRestored !== true) {
      return new Response(JSON.stringify({ error: "An administrator must confirm restored access or credits to resume." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: claims } = await supabase.auth.getClaims(req.headers.get("Authorization")?.slice(7) || "");
    const { data: admin } = await supabase.rpc("has_role", { _user_id: claims?.claims?.sub, _role: "admin" });
    if (!admin) return new Response(JSON.stringify({ error: "Administrator access required." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { error } = await supabase.from("chat_provider_state").update({ status: "ready", http_status: null, retry_at: null }).eq("provider", body.resumeProvider);
    if (error) return new Response(JSON.stringify({ error: "Provider could not resume." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: providerStates, error: stateError } = await supabase.from("chat_provider_state").select("provider,status,http_status,retry_at");
  if (stateError) return new Response(JSON.stringify({ error: "Provider safety state is unavailable." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const pausedProviders = (providerStates as ProviderState[] || []).filter((state) => isPaused(state));

  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { data: logs, error } = await supabase
    .from("gpt_chat_logs")
    .select("app_slug,status,image_requested,image_succeeded,error,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("chat-watchdog query failed", error);
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rooms = new Map<string, RoomTrouble>();
  for (const row of logs || []) {
    const slug = (row as { app_slug?: string }).app_slug || "unknown";
    let r = rooms.get(slug);
    if (!r) {
      r = { slug, total: 0, replyFailures: 0, imageFailures: 0, emptyReplies: 0, toolFailures: 0, lastError: null };
      rooms.set(slug, r);
    }
    r.total += 1;
    const status = (row as { status?: string }).status || "";
    if (isReplyFailure(status)) r.replyFailures += 1;
    if (status === "search_error" || status === "attachment_error" || status === "analysis_error") r.toolFailures += 1;
    if (status === "empty_reply") r.emptyReplies += 1;
    if (status === "image_error") r.imageFailures += 1;
    const imageRequested = (row as { image_requested?: boolean }).image_requested;
    const imageSucceeded = (row as { image_succeeded?: boolean }).image_succeeded;
    if (imageRequested && !imageSucceeded && status !== "image_error") r.imageFailures += 1;
    const err = (row as { error?: string | null }).error;
    if (err && !r.lastError) r.lastError = String(err).slice(0, 300);
  }

  const troubled = Array.from(rooms.values())
    .filter((r) => r.replyFailures + r.imageFailures + r.emptyReplies + r.toolFailures > 0)
    .sort((a, b) =>
      (b.replyFailures + b.imageFailures + b.emptyReplies + b.toolFailures) -
      (a.replyFailures + a.imageFailures + a.emptyReplies + a.toolFailures)
    );

  const totalMessages = (logs || []).length;
  const summary = {
    windowMinutes,
    totalMessages,
    roomsChecked: rooms.size,
    troubledRooms: troubled.length,
    emailed: false,
    providers: providerStates,
    pausedProviders: pausedProviders.map((state) => state.provider),
  };

  if (troubled.length === 0 && !pausedProviders.length && !body.force) {
    return new Response(JSON.stringify({ ...summary, ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admins = [
    Deno.env.get("ADMIN_EMAIL_PRIMARY"),
    Deno.env.get("ADMIN_EMAIL_SECONDARY"),
  ].filter((e): e is string => !!e && EMAIL_RE.test(e));

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (admins.length && RESEND_API_KEY) {
    const rowsHtml = troubled.slice(0, 40).map((r) => `
      <tr>
        <td style="padding:4px 8px;">${escapeHtml(r.slug)}</td>
        <td align="right" style="padding:4px 8px;">${r.total}</td>
        <td align="right" style="padding:4px 8px;color:#ff6b6b;">${r.replyFailures}</td>
        <td align="right" style="padding:4px 8px;color:#ffd166;">${r.emptyReplies}</td>
        <td align="right" style="padding:4px 8px;color:#f78fb3;">${r.imageFailures}</td>
        <td align="right" style="padding:4px 8px;color:#7ee0ff;">${r.toolFailures}</td>
        <td style="padding:4px 8px;font-size:11px;">${escapeHtml(r.lastError || "—")}</td>
      </tr>`).join("");

    const sendEmail = async (url: string, headers: Record<string, string>, to: string[] = admins) =>
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          from: "AIWebTools Chat Watchdog <onboarding@resend.dev>",
          to,
          subject: `🤖 Chat watchdog: ${troubled.length} room(s) reporting failures`,
          html: `
            <div style="background:#000;color:#00ff41;font-family:'Courier New',monospace;padding:24px;">
              <h2 style="color:#00ff41;">Chat Room Watchdog</h2>
              <p>Window: last <strong>${windowMinutes}</strong> minutes — <strong>${totalMessages}</strong> messages across <strong>${rooms.size}</strong> rooms.</p>
              <p><strong>${troubled.length}</strong> room(s) had a failed reply, an empty reply, or a picture that did not generate.</p>
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <tr>
                  <th align="left">Room</th><th align="right">Msgs</th>
                  <th align="right">Reply fails</th><th align="right">Empty</th>
                  <th align="right">Picture fails</th><th align="right">Search/file fails</th><th align="left">Last error</th>
                </tr>
                ${rowsHtml}
              </table>
              <p style="margin-top:16px;font-size:12px;">Full detail: /admin/chat-quality on aiwebtools.app</p>
            </div>`,
        }),
      });

    try {
      const direct = { Authorization: `Bearer ${RESEND_API_KEY}` };
      let res = await sendEmail("https://api.resend.com/emails", direct);
      if (!res.ok) {
        // Unverified Resend accounts may only email the account owner; retry there.
        const detail = await res.text();
        const allowed = detail.match(/own email address \(([^)]+)\)/)?.[1];
        console.warn("direct resend failed", res.status, detail);
        if (allowed && EMAIL_RE.test(allowed)) {
          res = await sendEmail("https://api.resend.com/emails", direct, [allowed]);
        } else if (LOVABLE_API_KEY) {
          res = await sendEmail(`${GATEWAY_URL}/emails`, {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          });
        }
      }
      summary.emailed = res.ok;
      if (!res.ok) console.error("watchdog email failed", res.status, await res.text());
    } catch (e) {
      console.error("watchdog email error", e);
    }
  } else {
    console.warn("chat-watchdog: email not configured (admins/keys missing)");
  }

  return new Response(JSON.stringify({ ...summary, ok: true, troubled: troubled.slice(0, 40) }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
