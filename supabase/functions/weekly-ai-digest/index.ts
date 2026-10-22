import { callGlmHelper } from "../_shared/glm-helper.ts";
// Weekly AI research agent: scans AI news feeds, blends in this week's directory
// activity, writes the digest with Lovable AI, archives it and emails subscribers.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
const SITE = "https://aiwebtools.app";

const FEEDS = [
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://venturebeat.com/category/ai/feed/",
  "https://www.artificialintelligence-news.com/feed/",
  "https://hnrss.org/newest?q=AI&points=100",
];

function stripTags(s: string) {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// Strict allow-list HTML sanitizer for LLM output built from untrusted feeds.
// Blocks stored XSS: no scripts, event handlers, styles, iframes, or exotic schemes.
const ALLOWED_TAGS = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "a", "strong", "em", "b", "i",
  "br", "hr", "blockquote", "span",
]);
const VOID_TAGS = new Set(["br", "hr"]);

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitizeDigestHtml(input: string): string {
  let out = "";
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    out += escapeHtml(input.slice(last, m.index));
    last = m.index + m[0].length;
    const closing = m[0].startsWith("</");
    const tag = m[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (closing) {
      if (!VOID_TAGS.has(tag)) out += `</${tag}>`;
      continue;
    }
    if (tag === "a") {
      const href = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[2]);
      const url = (href?.[1] ?? href?.[2] ?? href?.[3] ?? "").trim();
      if (/^https:\/\//i.test(url)) {
        out += `<a href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer nofollow">`;
      } else {
        out += "<a>"; // drop unsafe/absent href
      }
      continue;
    }
    out += `<${tag}${VOID_TAGS.has(tag) ? " /" : ""}>`;
  }
  out += escapeHtml(input.slice(last));
  return out.trim();
}

async function fetchFeed(url: string) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AIWebToolsDigestBot/1.0" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split(/<item[\s>]/).slice(1, 9);
    return items.map((raw) => {
      const title = stripTags(raw.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
      const link = stripTags(raw.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "");
      const desc = stripTags(raw.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "").slice(0, 400);
      return { title, link, desc };
    }).filter((i) => i.title && i.link);
  } catch (e) {
    console.warn("feed failed", url, e);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const CRON_SECRET = Deno.env.get("DIGEST_CRON_SECRET");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!LOVABLE_API_KEY) return json({ error: "AI is not configured" }, 500);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let authorized = !!CRON_SECRET && req.headers.get("x-cron-secret") === CRON_SECRET;
  const authHeader = req.headers.get("Authorization") || "";
  if (!authorized && authHeader.startsWith("Bearer ")) {
    try {
      const authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await authClient.auth.getClaims(authHeader.replace("Bearer ", ""));
      const uid = data?.claims?.sub;
      if (uid) {
        const { data: isAdmin } = await admin.rpc("has_role", { _user_id: uid, _role: "admin" });
        authorized = isAdmin === true;
      }
    } catch (e) {
      console.warn("digest auth failed", e);
    }
  }
  if (!authorized) return json({ error: "Unauthorized" }, 401);

  let body: { send?: boolean } = {};
  try {
    body = await req.json();
  } catch { /* no body */ }
  const shouldSend = body.send !== false;

  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const [{ data: newTools }, { data: trending }] = await Promise.all([
    admin
      .from("tool_submissions")
      .select("name, url, category, description")
      .eq("status", "approved")
      .gte("submitted_at", since)
      .limit(15),
    admin
      .from("tool_popularity")
      .select("tool_title, tool_category, popularity")
      .order("popularity", { ascending: false })
      .limit(10),
  ]);

  const news = (await Promise.all(FEEDS.map(fetchFeed))).flat().slice(0, 24);

  const research = [
    "AI NEWS FROM THE PAST WEEK:",
    ...news.map((n) => `- ${n.title} (${n.link}) — ${n.desc}`),
    "",
    "NEW TOOLS ADDED TO OUR DIRECTORY THIS WEEK:",
    ...(newTools || []).map((t) => `- ${t.name} (${t.category}) — ${(t.description || "").slice(0, 160)}`),
    "",
    "TRENDING IN OUR DIRECTORY:",
    ...(trending || []).map((t) => `- ${t.tool_title} (${t.tool_category})`),
  ].join("\n");

  const digestMessages = [
        {
          role: "system",
          content:
            "You write the weekly AI digest for AIWebTools.ai — a Matrix-green, reverent, plain-spoken newsletter about real AI tools. " +
            "Never invent tools, products, companies or links: use only what the research notes contain. " +
            "Return clean HTML only (no markdown fences, no <html> or <body> wrapper): an <h2> headline, a short intro paragraph, " +
            "a 'This Week in AI' list of the biggest stories with real links, a 'New in the Directory' section, a 'Trending Tools' section, " +
            "and a closing line inviting readers to explore " + SITE + ". Keep it under 700 words.",
        },
        { role: "user", content: research },
      ];
  const aiRes = (await callGlmHelper({ messages: digestMessages })) ?? await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
    body: JSON.stringify({ model: "google/gemini-3.7-flash", messages: digestMessages }),
  });

  if (!aiRes.ok) {
    const detail = await aiRes.text().catch(() => "");
    console.error("digest ai error", aiRes.status, detail.slice(0, 400));
    if (aiRes.status === 402) return json({ error: "AI credits exhausted — digest not generated." }, 402);
    if (aiRes.status === 429) return json({ error: "Rate limited — try again later." }, 429);
    return json({ error: "Could not generate the digest." }, 502);
  }

  const aiJson = await aiRes.json();
  const rawHtml: string = aiJson?.choices?.[0]?.message?.content?.trim() || "";
  if (!rawHtml) return json({ error: "Empty digest" }, 502);
  const html = sanitizeDigestHtml(rawHtml);
  if (!html) return json({ error: "Digest sanitized to empty" }, 502);

  const issueDate = new Date().toISOString().slice(0, 10);
  const title = stripTags(html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? `AI Signal — ${issueDate}`);
  const summary = stripTags(html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "").slice(0, 300);

  const { data: digest, error: saveErr } = await admin
    .from("ai_digests")
    .upsert(
      { issue_date: issueDate, title, summary, html, status: "published", sent_at: null },
      { onConflict: "issue_date" },
    )
    .select("id, issue_date")
    .single();
  if (saveErr) {
    console.error("digest save error", saveErr);
    return json({ error: "Could not save the digest." }, 500);
  }

  let sent = 0;
  let failed = 0;
  if (shouldSend && RESEND_API_KEY) {
    const { data: subs } = await admin
      .from("email_subscribers")
      .select("email, unsubscribe_token")
      .eq("confirmed", true)
      .eq("pref_weekly_digest", true);

    for (const s of subs || []) {
      try {
        const wrapped = `
          <div style="background:#000;color:#00ff41;font-family:'Courier New',monospace;padding:32px;border-radius:12px;line-height:1.6;">
            ${html}
            <p style="margin-top:24px;">
              <a href="${SITE}" style="background:#00ff41;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Explore AIWebTools →</a>
            </p>
            <p style="opacity:0.5;font-size:11px;margin-top:24px;">
              <a href="${SITE}/digest/${digest.issue_date}" style="color:#00ff41;">Read online</a> ·
              <a href="${SITE}/?unsubscribe=${s.unsubscribe_token}" style="color:#00ff41;">Unsubscribe</a>
            </p>
          </div>`;
        const r = await fetch(`${RESEND_GATEWAY}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: "AIWebTools <onboarding@resend.dev>",
            to: [s.email],
            subject: `🕊️ ${title}`,
            html: wrapped,
          }),
        });
        r.ok ? sent++ : failed++;
      } catch (e) {
        console.warn("digest send failed", e);
        failed++;
      }
    }
    if (sent > 0) {
      await admin.from("ai_digests").update({ sent_at: new Date().toISOString() }).eq("id", digest.id);
    }
  }

  return json({ ok: true, issue_date: digest.issue_date, title, sent, failed, stories: news.length });
});
