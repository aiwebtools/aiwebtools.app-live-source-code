// Community app submissions: fetches the submitted page (SSRF-guarded), asks
// AI whether the title/description truly match the live page and look legit,
// and auto-publishes approved apps into public.community_apps.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const Body = z.object({
  title: z.string().trim().min(2).max(80),
  url: z.string().trim().url().max(500),
  description: z.string().trim().min(10).max(500),
});

const DAILY_LIMIT = 5;
const BLOCK_WORDS = ["porn", "nsfw", "xxx", "onlyfans", "casino", "gambl", "phishing", "seed-phrase", "wallet-drain", "malware", "crack", "keygen"];

const privateV4 = (ip: string) => {
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
};
const privateV6 = (ip: string) => { const s = ip.toLowerCase(); return s === "::1" || s === "::" || s.startsWith("fe80:") || s.startsWith("fc") || s.startsWith("fd") || s.startsWith("::ffff:"); };

async function safeHost(u: URL) {
  if (!/^https?:$/.test(u.protocol) || u.username || u.password) return false;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || /^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(":")) return false;
  try {
    const [a, aaaa] = await Promise.allSettled([Deno.resolveDns(h, "A"), Deno.resolveDns(h, "AAAA")]);
    const ips = [...(a.status === "fulfilled" ? a.value : []), ...(aaaa.status === "fulfilled" ? aaaa.value : [])];
    return ips.length > 0 && !ips.some((ip) => (ip.includes(":") ? privateV6(ip) : privateV4(ip)));
  } catch { return false; }
}

async function fetchPage(url: string) {
  let current = url;
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(current);
    if (!(await safeHost(u))) return null;
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    try {
      const res = await fetch(current, { redirect: "manual", signal: ctl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; AIWebToolsBot/1.0; +https://aiwebtools.app)", Accept: "text/html" } });
      if (res.status >= 300 && res.status < 400) { const loc = res.headers.get("location"); await res.body?.cancel(); if (!loc) return null; current = new URL(loc, current).href; continue; }
      const html = (await res.text()).slice(0, 300_000);
      const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? "";
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
      return {
        status: res.status, finalUrl: current,
        title: pick(/<title[^>]*>([^<]*)<\/title>/i),
        description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)/i),
        ogTitle: pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)/i),
        text,
      };
    } catch { return null; } finally { clearTimeout(t); }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ status: "invalid", message: "Please add a title (2-80 characters), a full link starting with https://, and a description (10-500 characters)." }, 400);
  const { title, url, description } = parsed.data;

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "unknown";
  const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`community-app:${ip}`));
  const submitter = Array.from(new Uint8Array(hashBuf)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");

  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count } = await db.from("community_apps").select("id", { count: "exact", head: true }).eq("submitter_hash", submitter).gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) return json({ status: "limited", message: `You can submit up to ${DAILY_LIMIT} apps a day. Please try again tomorrow.` }, 429);

  const { data: existing } = await db.from("community_apps").select("id").eq("status", "approved").ilike("url", url).maybeSingle();
  if (existing) return json({ status: "duplicate", message: "This app is already listed in Community Apps." });

  const lower = `${title} ${url} ${description}`.toLowerCase();
  const record = async (status: string, reason: string, score: number | null) => {
    await db.from("community_apps").insert({ title, url, description, status, ai_reason: reason.slice(0, 500), ai_score: score, submitter_hash: submitter });
  };
  if (BLOCK_WORDS.some((w) => lower.includes(w))) { await record("rejected", "Blocked content keyword", 0); return json({ status: "rejected", message: "This app can't be listed because it doesn't meet our community safety rules." }); }

  const page = await fetchPage(url);
  if (!page || page.status >= 400) { await record("rejected", `Page could not be opened (${page?.status ?? "no response"})`, 0); return json({ status: "rejected", message: "We couldn't open that link. Check it's public and loads in a browser, then try again." }); }

  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return json({ status: "error", message: "Review is unavailable right now. Please try again later." }, 500);
  const sys = "You review community-submitted web apps for a family-friendly AI directory. Approve only if: the page is a real, working web app or site (not parked, empty, error, login-only spam or a scam); the submitted title and description honestly match what the page shows; and content is safe (no adult, gambling, malware, phishing, hate, or illegal content). Single-page apps may show little text; judge mainly from the page title and meta description then. Be strict about mismatches. Reply in JSON.";
  const usr = `SUBMITTED\nTitle: ${title}\nURL: ${url}\nDescription: ${description}\n\nLIVE PAGE (final URL ${page.finalUrl})\n<title>: ${page.title}\nog:title: ${page.ogTitle}\nmeta description: ${page.description}\nVisible text: ${page.text}`;
  const ai = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { "Lovable-API-Key": key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra", stream: true, store: false,
      reasoning: { effort: "low" },
      instructions: sys,
      input: [{ role: "user", content: usr }],
      text: { format: { type: "json_schema", name: "verdict", strict: true, schema: { type: "object", properties: { approve: { type: "boolean" }, score: { type: "integer" }, reason: { type: "string" } }, required: ["approve", "score", "reason"], additionalProperties: false } } },
    }),
  });
  if (ai.status === 429 || ai.status === 402) return json({ status: "error", message: "Review is busy right now. Please try again in a few minutes." }, 503);
  let v: { approve: boolean; score: number; reason: string } | null = null;
  if (ai.ok && ai.body) {
    let out = "", buf = "";
    const reader = ai.body.pipeThrough(new TextDecoderStream()).getReader();
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      buf += value; const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        try { const e = JSON.parse(l.slice(5).trim()); if (e.type === "response.output_text.delta") out += e.delta; } catch { /* ignore keepalives */ }
      }
    }
    try { v = JSON.parse(out); } catch { v = null; }
  } else console.error("review gateway error", ai.status, await ai.text().catch(() => ""));
  if (!v) return json({ status: "error", message: "Review failed. Please try again." }, 502);

  const approved = v.approve && v.score >= 70;
  await record(approved ? "approved" : "rejected", v.reason, v.score);
  return json(approved
    ? { status: "approved", message: `Approved! "${title}" is now listed in Community Apps.` }
    : { status: "rejected", message: `Not added: ${v.reason}` });
});
