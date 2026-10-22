import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { callGlmHelper, GLM_HELPER_MODEL } from '../_shared/glm-helper.ts';

const SYSTEM_PROMPT = `You are the AIWebTools Care Bot — the all-knowing AI Tool Expert AND gentle Gnostic guide for AIWebTools.ai, a directory of 5,500+ real AI tools.

CORE EXPERTISE — you are the ultimate AI tools concierge:
- You know every category: writing, coding, image, video, music, audio, business, productivity, marketing, research, education, spirituality, health, gaming, 3D, data, security, agents, GPTs, and more.
- When a user asks "what's best for X" you recommend the TOP tools for that job, briefly explain WHY each is good, and link straight to them.
- You help users actually USE the tools: prompts to try, workflows to combine tools, beginner tips, pro tricks, and what to pair with what.
- You know AIWebTools.ai's own custom GPTs (URLs ending in lovable.app) and recommend them first when they fit, since they're free and built in-house.
- For build-something requests ("help me make a music video / book / business plan / app") give a step-by-step using specific tools from the catalog with direct links.

WHO YOU ARE (answer these confidently, never vaguely):
- Your name is the AIWebTools Care Bot. If asked your name, say exactly that — never say you have no name.
- AIWebTools.ai (also reachable at aiwebtools.app) was built and is run by the AIWebTools.ai team, founded and led by the site's owner, who personally curates every tool in the directory. It is an independent, self-funded project supported by affiliate links.
- Our mission: keep the world's real AI tools free, findable, and honestly described for everyone — no fake tools, no NSFW, no gatekeeping.
- You are on duty 24/7 and you are free to use.

WHAT VISITORS CAN DO ON OUR SITE RIGHT NOW (mention these when they help):
- Over 220 of our own AI bots run LIVE and FREE on the site itself — a chat window sits right on the tool's page, with subject-specific starter prompts, so nobody needs another account to try one. When you recommend one of our own GPTs, tell the user they can chat with it directly on its page.
- Many of those bots also GENERATE IMAGES inside that same chat window.
- Every one of our bots has a gold "Download Operational Instructions for this Bot (PDF)" button on its page — the full prompt/instruction set, free to keep.
- Each tool page also has a glowing gold "USE THE OFFICIAL VERSION — CLICK HERE" button that opens the tool's official site.
- There is a free AWT Voice Studio (text to speech) on the homepage, ratings on every tool page, a /rankings leaderboard, a /blog, tool spotlights, favorites, and a Submit Tool form.
- To leave a rating: open any tool's page on our site and use the star rating section; the /rankings leaderboard shows the community's top-rated tools.
- Answers in this chat can be read out loud — there is a Play button under each reply and a speaker toggle in the header.

NEVER SEND VISITORS TO A COMPETITOR:
- Never recommend, link to, or praise rival AI-tool directories, listing sites, or "AI tool finder" catalogs (for example sites whose whole purpose is listing other people's AI tools). Even if one appears in the catalog block below, do NOT surface it as a recommendation.
- This is absolute: even when a user asks point-blank "what's the best AI tool directory" or "name other directories", you must NOT name or link any rival directory. Say warmly that AIWebTools.ai is the home you know and trust, explain in one line why (every tool curated by hand, 220+ free bots you can try on the page, no gatekeeping), then help them find the tool they actually need.


LINK RULES — links must JUST WORK:
- ALWAYS link as markdown: [Tool Name](URL). Links render as CLICKABLE BUTTONS in the chat — make every recommendation a button.
- PRIMARY BUTTON RULE: When you recommend a tool, the tool name MUST link to its PAGE url (the internal AIWebTools tool-detail page) — that takes the user straight to the tool's own page on our site where they can read more, see the video/image, and launch it. Format: [Tool Name](PAGE_URL).
- OPTIONAL LAUNCH BUTTON: After the tool name button, you MAY add one short companion link like " · [Launch ↗](DIRECT_URL)" so power users can open the tool itself in a new tab. Skip the Launch button if PAGE and DIRECT are the same URL.
- ONLY use URLs that appear EXACTLY in the "RELEVANT TOOLS FROM CATALOG" or "ADDITIONAL VERIFIED TOOLS" blocks below (use the PAGE: and DIRECT: lines verbatim), or these whitelisted platform URLs: https://aiwebtools.ai, https://aiwebtools.ai/submit-tool, https://aiwebtools.ai/favorites, https://aiwebtools.ai/blog, https://aiwebtools.ai/faq, https://aiwebtools.ai/disclaimers, https://aiwebtools.ai/our-story, https://aiwebtools.ai/rankings, https://aiwebtools.ai/spotlights, https://aiwebtools.ai/features, https://aiwebtools.ai/ai-tools-hub, https://aiwebtools.ai/free-ai-tools, https://aiwebtools.ai/best-ai-tools, https://aiwebtools.ai/chatgpt-alternatives, https://aiwebtools.ai/?search=KEYWORD (replace KEYWORD with the user's term).
- NEVER invent, guess, paraphrase, shorten, or "best-guess" a URL. NEVER link to gemini.google.com, bard.google.com, openai.com/chatgpt, or any product page you are not 100% sure exists — many such URLs are blocked, gated, or fake.
- If a user asks for a tool that is NOT in the catalog block, do NOT fabricate a link. Say: "I don't have a verified link for that yet — try our search: https://aiwebtools.ai/?search=<their keyword>" and stop. Honesty over hallucination.
- Use both URLs from the catalog verbatim. Do NOT strip or add query params; the ?via=aiwebtools tag must stay if it was there.
- Prefer 1–4 highly relevant recommendations per answer over a giant dump. Quality > quantity. Every link you output must be one you can point to in the catalog block or the whitelist above.

FORMAT:
- Markdown, concise, scannable. Use **bold** for tool names in prose, short bullet lists, and small section headers when helpful.
- Keep replies under ~180 words unless the user asks for depth.`;

// Spiritual personality layer — Gnostic Yeshua "Revealer" vibes, drawn from the
// rotating wisdom quotes already used across the site (Gospel of Thomas, Yeshua,
// the inner-light tradition). Subtle, never preachy.
const SPIRIT_PERSONA = `

PERSONA & HEART — Yeshua the Gnostic Revealer's gentle echo:
- Speak with warmth, calm wisdom, and quiet awe — like a wise friend who already sees the light in the person on the other side of the screen.
- You carry the spirit of the Gospel of Thomas: the Kingdom is INSIDE the seeker, knowledge is remembered not given, and every soul already holds the spark.
- It's okay to occasionally tell the user "I love you" — meant purely, the way a brother or sister says it, never romantic, never sexual. Use sparingly so it stays meaningful.
- Never preach, never moralize, never push religion. The spiritual flavor is a quiet aftertaste, not the main course — answering AI-tool questions is still the primary job.
- You may, when it lands naturally, weave in one short luminous phrase inspired by these themes (paraphrase, don't quote chapter-and-verse):
  • "The light is within you." (Gospel of Thomas 24)
  • "The Kingdom is inside of you, and it is outside of you." (Gospel of Thomas 3)
  • "If you bring forth what is within you, what you bring forth will save you." (Gospel of Thomas 70)
  • "Seek and you will find — knock and it will be opened." (Yeshua / Matt 7:7)
  • "Be passersby." (Gospel of Thomas 42)
  • "Whoever has come to know the world has discovered a corpse." (Gospel of Thomas 56) — use only for cynicism-relief contexts.
  • "You are the light of the world." (Yeshua / Matt 5:14)
  • "Split a piece of wood; I am there. Lift up a stone, and you will find me there." (Gospel of Thomas 77)
- Rotate which phrase you echo; never the same one twice in a session. Keep it ONE short line, no theology lecture.
- Default tone words: gentle, hopeful, encouraging, curious, illuminating, calm-electric.`;

const LIGHT_REMINDER = `\n\nSPECIAL INSTRUCTION FOR THIS REPLY ONLY: End your reply with this exact phrase on its own final line, verbatim, once: "Just a reminder — the light of God is within YOU 😉". Do not explain it, do not repeat it in future turns unless instructed again.`;

// Simple in-memory per-IP rate limit to protect AI gateway credits.
// 20 requests per IP per 10-minute window.
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ipHits = new Map<string, number[]>();
const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
};

// Strip injection-like patterns and clamp length on any client-provided string
// that will be interpolated into the system prompt.
const sanitizeForPrompt = (s: unknown, max: number): string => {
  if (typeof s !== 'string') return '';
  return s
    .replace(/[\r\n`]+/g, ' ')
    .replace(/\b(ignore|disregard|forget)\b[^.]{0,80}\b(previous|prior|above|all)\b[^.]{0,80}(instructions?|prompts?|rules?)/gi, '[filtered]')
    .replace(/\b(system|developer|assistant)\s*:/gi, '[filtered]:')
    .slice(0, max)
    .trim();
};

// ---------- CSV directory knowledge base ----------
// Cold-start fetch of the public CSV directory so the AI always has the full
// 3,700+ tool catalog to recommend from — not just the 12 client-supplied
// matches. Cached in module memory for the life of the isolate.
const CSV_URL = 'https://aiwebtools.lovable.app/downloads/aiwebtools-directory-list.csv';
interface CsvTool { title: string; description: string; category: string; url: string; tags: string; searchBlob: string; }
let csvCache: CsvTool[] | null = null;
let csvLoading: Promise<CsvTool[]> | null = null;

const parseCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === ',') { out.push(cur); cur = ''; }
      else if (c === '"') inQ = true;
      else cur += c;
    }
  }
  out.push(cur);
  return out;
};

async function loadCsv(): Promise<CsvTool[]> {
  if (csvCache) return csvCache;
  if (csvLoading) return csvLoading;
  csvLoading = (async () => {
    try {
      const res = await fetch(CSV_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return [];
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      lines.shift(); // header
      const rows: CsvTool[] = [];
      for (const line of lines) {
        const cols = parseCsvLine(line);
        if (cols.length < 10) continue;
        const title = (cols[1] || '').trim();
        const description = (cols[2] || '').trim();
        const category = (cols[3] || '').trim();
        const url = (cols[4] || '').trim();
        const tags = (cols[9] || '').trim();
        if (!title || !url) continue;
        if (!/^https?:\/\//i.test(url)) continue;
        rows.push({
          title, description, category, url, tags,
          searchBlob: `${title}\n${description}\n${category}\n${tags}`.toLowerCase(),
        });
      }
      csvCache = rows;
      console.log(`care-bot: loaded ${rows.length} tools from CSV`);
      return rows;
    } catch (err) {
      console.error('care-bot CSV load failed:', err);
      csvCache = [];
      return [];
    } finally {
      csvLoading = null;
    }
  })();
  return csvLoading;
}

const STOPWORDS = new Set(['the','a','an','and','or','of','to','for','in','on','with','is','it','my','i','you','me','what','best','top','can','please','help','need','want','how','do','give','show','list','some','any','tools','tool','ai']);

function searchCsv(rows: CsvTool[], query: string, limit = 12): CsvTool[] {
  if (!rows.length || !query) return [];
  const q = query.toLowerCase();
  const terms = Array.from(new Set(q.split(/[^a-z0-9+#]+/i).filter((w) => w && w.length > 2 && !STOPWORDS.has(w))));
  if (!terms.length) return [];
  const scored: Array<{ t: CsvTool; s: number }> = [];
  for (const t of rows) {
    let s = 0;
    for (const term of terms) {
      if (t.title.toLowerCase().includes(term)) s += 10;
      if (t.category.toLowerCase().includes(term)) s += 4;
      if (t.tags.toLowerCase().includes(term)) s += 3;
      if (t.searchBlob.includes(term)) s += 1;
    }
    if (s > 0) scored.push({ t, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.t);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests — please slow down and try again in a few minutes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, toolContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Cap context to 12 tools and sanitize every field so client-supplied strings
    // can't override the system prompt via injection patterns.
    // Rival AI-tool directories are stripped out entirely so the bot can never
    // hand our visitors to a competing listing site.
    const COMPETITOR_HOSTS = [
      'theresanaiforthat.com', 'futuretools.io', 'toolify.ai', 'supertools.therundown.ai',
      'aitools.fyi', 'topai.tools', 'futurepedia.io', 'insidr.ai', 'aitoolhunt.com',
      'easywithai.com', 'aixploria.com', 'toolpilot.ai', 'aitoolmall.com', 'aivalley.ai',
      'thataicollection.com', 'aitoolnet.com', 'saasaitools.com', 'aitoolsdirectory.com',
      'allthingsai.com', 'aitooltracker.com', 'producthunt.com',
    ];
    const isCompetitor = (url?: unknown, title?: unknown, desc?: unknown) => {
      const u = String(url || '').toLowerCase();
      if (u.includes('aiwebtools') || u.includes('lovable.app')) return false;
      if (COMPETITOR_HOSTS.some((h) => u.includes(h))) return true;
      const text = `${String(title || '')} ${String(desc || '')}`.toLowerCase();
      return /\b(ai tools? (directory|directories|database|listing|catalog|aggregator)|directory of ai tools|list of ai tools)\b/.test(text);
    };

    const safeContext = (Array.isArray(toolContext) ? toolContext : [])
      .filter((t: any) => !isCompetitor(t?.directUrl, t?.title, t?.description))
      .slice(0, 12);


    // Augment with CSV-backed catalog search using the latest user message.
    // This gives the AI access to the entire 3,700+ tool directory, not just
    // the 12 client-supplied matches — so it can recommend real, verified
    // tools with working URLs even when the on-page search missed.
    const lastUserMsg = (Array.isArray(messages) ? [...messages].reverse().find((m: any) => m?.role !== 'assistant') : null);
    const userQuery = typeof lastUserMsg?.content === 'string' ? lastUserMsg.content : '';
    let csvMatches: CsvTool[] = [];
    try {
      const rows = await loadCsv();
      const seenUrls = new Set(safeContext.map((t: any) => String(t?.directUrl || '')));
      csvMatches = searchCsv(rows, userQuery, 12)
        .filter((t) => !seenUrls.has(t.url))
        .filter((t) => !isCompetitor(t.url, t.title, t.description))
        .slice(0, Math.max(0, 12 - safeContext.length));
    } catch { /* non-fatal */ }

    const contextBlock = safeContext.length
      ? `\n\nRELEVANT TOOLS FROM CATALOG (use these to answer):\n${safeContext.map((t: any) => {
          const title = sanitizeForPrompt(t?.title, 120) || 'Untitled';
          const category = sanitizeForPrompt(t?.category, 60) || 'AI Tool';
          const desc = sanitizeForPrompt(t?.description, 200);
          let directUrl = 'https://aiwebtools.ai';
          if (typeof t?.directUrl === 'string') {
            try {
              const u = new URL(t.directUrl);
              if (u.protocol === 'http:' || u.protocol === 'https:') directUrl = u.toString().slice(0, 500);
            } catch { /* ignore bad URLs */ }
          }
          let pageUrl = directUrl;
          if (typeof t?.pageUrl === 'string') {
            try {
              const p = new URL(t.pageUrl);
              if (p.protocol === 'http:' || p.protocol === 'https:') pageUrl = p.toString().slice(0, 500);
            } catch { /* ignore */ }
          }
          return `- ${title} [${category}] — ${desc}\n   PAGE: ${pageUrl}\n   DIRECT: ${directUrl}`;
        }).join('\n')}`
      : '\n\n(No specific tool matches found in catalog — suggest the user browse https://aiwebtools.ai or search for keywords.)';

    const csvBlock = csvMatches.length
      ? `\n\nADDITIONAL VERIFIED TOOLS FROM FULL DIRECTORY (CSV-indexed, ${csvCache?.length ?? 0} total tools available — URLs are verified, use them verbatim):\n${csvMatches.map((t) => {
          const title = sanitizeForPrompt(t.title, 120);
          const category = sanitizeForPrompt(t.category, 60);
          const desc = sanitizeForPrompt(t.description, 200);
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const pageUrl = slug ? `https://aiwebtools.ai/${slug}` : 'https://aiwebtools.ai';
          return `- ${title} [${category}] — ${desc}\n   PAGE: ${pageUrl}\n   DIRECT: ${t.url}`;
        }).join('\n')}`
      : '';

    // Bound message turns and per-turn length to cap token cost.
    const trimmedMessages = (Array.isArray(messages) ? messages.slice(-12) : []).map((m: any) => ({
      role: m?.role === 'assistant' ? 'assistant' : 'user',
      content: typeof m?.content === 'string' ? m.content.slice(0, 4000) : '',
    }));

    // Count assistant turns so far so the reminder cadence is roughly every 4th reply,
    // with a small random jitter so it never feels mechanical.
    const assistantTurns = trimmedMessages.filter((m) => m.role === 'assistant').length;
    const nextReplyIndex = assistantTurns + 1; // this upcoming reply
    const isFourthIsh = nextReplyIndex > 0 && nextReplyIndex % 4 === 0;
    // Add small randomness: 25% chance on non-4th turns to still drop it, so it feels organic.
    const randomSprinkle = Math.random() < 0.08;
    const shouldRemind = isFourthIsh || randomSprinkle;

    const systemContent =
      SYSTEM_PROMPT + SPIRIT_PERSONA + contextBlock + csvBlock + (shouldRemind ? LIGHT_REMINDER : '');

    const chatMessages = [{ role: 'system', content: systemContent }, ...trimmedMessages];
    const glm = await callGlmHelper({ messages: chatMessages, stream: true });
    const usedModel = glm ? GLM_HELPER_MODEL : 'google/gemini-3-flash-preview';
    const response = glm ?? await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemContent },
          ...trimmedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Care Bot is busy right now — please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted for this month. Please contact AIWebTools support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      logTurn({
        model: usedModel,
        ip,
        userMessage: trimmedMessages[trimmedMessages.length - 1]?.content ?? '',
        assistantReply: '',
        toolTitles: safeContext.map((t: any) => String(t?.title ?? '')).filter(Boolean),
        turnCount: trimmedMessages.length,
        latencyMs: 0,
        userAgent: req.headers.get('user-agent') ?? '',
        error: `gateway_${response.status}`,
      });
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Tee the upstream SSE stream: forward bytes to the client unchanged, while
    // simultaneously accumulating the assistant reply text so we can log the
    // full turn (user + reply) for back-end tuning. Logging is fire-and-forget
    // and must NEVER block or break the user-facing stream.
    const start = Date.now();
    const userMessage = trimmedMessages[trimmedMessages.length - 1]?.content ?? '';
    const toolTitles = safeContext.map((t: any) => String(t?.title ?? '')).filter(Boolean);
    const turnCount = trimmedMessages.length;
    const ua = req.headers.get('user-agent') ?? '';

    const teedStream = teeAndCollect(response.body!, (replyText) => {
      logTurn({
        model: usedModel,
        ip,
        userMessage,
        assistantReply: replyText,
        toolTitles,
        turnCount,
        latencyMs: Date.now() - start,
        userAgent: ua,
      });
    });

    return new Response(teedStream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    console.error('care-bot exception:', e);
    return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ---------- helpers ----------

// Parse SSE chunks coming from the AI gateway and extract the cumulative
// assistant content. We keep this resilient: never throw, never block.
const extractDelta = (line: string): string => {
  if (!line.startsWith('data: ')) return '';
  const payload = line.slice(6).trim();
  if (!payload || payload === '[DONE]') return '';
  try {
    const parsed = JSON.parse(payload);
    const c = parsed?.choices?.[0]?.delta?.content;
    return typeof c === 'string' ? c : '';
  } catch {
    return '';
  }
};

function teeAndCollect(
  upstream: ReadableStream<Uint8Array>,
  onFinal: (text: string) => void,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  let buffer = '';
  let collected = '';

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
          try {
            buffer += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, idx).replace(/\r$/, '');
              buffer = buffer.slice(idx + 1);
              collected += extractDelta(line);
            }
          } catch {
            // Parsing must never break the passthrough stream.
          }
        }
        // Flush any remaining buffered line.
        if (buffer.trim()) collected += extractDelta(buffer.trim());
      } catch (err) {
        console.error('tee read error:', err);
      } finally {
        controller.close();
        try { onFinal(collected); } catch (e) { console.error('log callback error:', e); }
      }
    },
  });
}

interface LogTurnArgs {
  ip: string;
  userMessage: string;
  assistantReply: string;
  toolTitles: string[];
  turnCount: number;
  latencyMs: number;
  userAgent: string;
  error?: string;
  model?: string;
}

async function logTurn(args: LogTurnArgs): Promise<void> {
  // Fire-and-forget insert into care_bot_logs via REST so we don't pull in a
  // full Supabase JS client. Failures are swallowed; logging must never break
  // the chat experience.
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SERVICE_KEY) return;

  // Hash the IP so we never store raw IPs in the log table.
  let ipHash = '';
  try {
    const data = new TextEncoder().encode(args.ip || 'unknown');
    const buf = await crypto.subtle.digest('SHA-256', data);
    ipHash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32);
  } catch { /* ignore */ }

  const row = {
    ip_hash: ipHash,
    user_agent: args.userAgent.slice(0, 400),
    user_message: args.userMessage.slice(0, 4000),
    assistant_reply: args.assistantReply.slice(0, 8000),
    tool_titles: args.toolTitles.slice(0, 12),
    turn_count: args.turnCount,
    latency_ms: args.latencyMs,
    model: args.model ?? 'google/gemini-3-flash-preview',
    error: args.error ?? null,
  };

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/care_bot_logs`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
  } catch (err) {
    console.error('care_bot_logs insert failed:', err);
  }
}