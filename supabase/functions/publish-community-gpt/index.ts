// Publishes a user-built GPT to the public library after an AI ethics review.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const DAILY_LIMIT = 3;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body: { name?: unknown; tagline?: unknown; instructions?: unknown; guestId?: unknown } = {};
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ").slice(0, 80) : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim().slice(0, 160) : "";
  const instructions = typeof body.instructions === "string" ? body.instructions.trim().slice(0, 20000) : "";
  const guestId = typeof body.guestId === "string" ? body.guestId.slice(0, 80) : "";
  if (name.length < 2 || instructions.length < 30 || guestId.length < 8) return json({ error: "Add a name and at least a few sentences of instructions before publishing." }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${guestId}|${ip}`));
  const owner = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
  const since = new Date(Date.now() - 86400000).toISOString();
  const { count } = await admin.from("gpt_apps").select("id", { count: "exact", head: true }).eq("source_file", `community:${owner}`).gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) return json({ error: `You can publish ${DAILY_LIMIT} bots per day. Please come back tomorrow.` }, 429);

  const { count: dupe } = await admin.from("gpt_apps").select("id", { count: "exact", head: true }).ilike("display_name", name);
  if ((dupe ?? 0) > 0) return json({ error: "A bot with that name already exists in the library. Please choose a different name." }, 409);

  // AI ethics review
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return json({ error: "The review service is not configured." }, 500);
  const review = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are the safety reviewer for a public AI assistant directory. Approve assistants that are ethical and legal. Reject any that involve sexual or adult content, hate or harassment, violence or weapons harm, self-harm encouragement, illegal activity, scams, malware, impersonating a real living person to deceive, collecting private data, medical/legal/financial advice without disclaimers framed as professional replacement, or attempts to bypass AI safety rules (jailbreaks). Also reject spam, gibberish, or bots with no real purpose. Respond only with JSON." },
        { role: "user", content: `Review this assistant and return JSON {"approved": boolean, "reason": string, "category": string}.\n\nNAME: ${name}\nSUBHEADER: ${tagline}\nINSTRUCTIONS:\n${instructions}` },
      ],
      response_format: { type: "json_schema", json_schema: { name: "review", strict: true, schema: { type: "object", additionalProperties: false, required: ["approved", "reason", "category"], properties: { approved: { type: "boolean" }, reason: { type: "string" }, category: { type: "string" } } } } },
    }),
  });
  if (review.status === 402 || review.status === 403) return json({ error: "The safety review is unavailable right now because AI credits ran out. Your bot is still saved on this device." }, review.status);
  if (!review.ok) return json({ error: "The safety review could not finish. Please try again in a moment." }, review.status === 429 ? 429 : 502);
  let verdict: { approved?: boolean; reason?: string } = {};
  try { verdict = JSON.parse((await review.json()).choices?.[0]?.message?.content || "{}"); } catch { /* treated as rejection */ }
  if (verdict.approved !== true) return json({ approved: false, reason: verdict.reason || "The bot did not pass the ethics review." });

  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "bot";
  const slug = `community-${base}-${crypto.randomUUID().slice(0, 6)}`;
  const greeting = `Hello, I am ${name}.${tagline ? ` ${tagline}.` : ""} How can I help you today?`;
  const { error: appErr } = await admin.from("gpt_apps").insert({
    slug, display_name: name, tagline: tagline ? `${tagline} · Community GPT` : "Community GPT", greeting,
    starter_prompts: [`What can you help me with, ${name}?`, "Walk me through your first step."],
    model: "google/gemini-3-flash-preview", is_active: true, supports_images: true, source_file: `community:${owner}`,
  });
  if (appErr) return json({ error: "Publishing failed. Please try again." }, 500);
  const prompt = `You are "${name}"${tagline ? ` — ${tagline}` : ""}, a community-made assistant published on AIWebTools.app.\n\nOPERATIONAL INSTRUCTIONS:\n${instructions}`;
  const { error: promptErr } = await admin.from("gpt_app_prompts").insert({ app_slug: slug, system_prompt: prompt });
  if (promptErr) { await admin.from("gpt_apps").delete().eq("slug", slug); return json({ error: "Publishing failed. Please try again." }, 500); }
  // Branded directory image: bot name in the art + AIWEBTOOLS.AI mark bottom-right.
  // Failure here never blocks publishing; the bot falls back to its themed emblem.
  let imageUrl: string | null = null;
  try {
    const art = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-image-2.5-sunburst",
        size: "1536x1024",
        quality: "low",
        prompt: `Premium cinematic 16:9 hero artwork for an AI assistant called "${name}"${tagline ? ` (${tagline})` : ""}. Visually express, through a rich metaphor, what this assistant does: ${instructions.slice(0, 600)}. Matrix-green digital glow, deep black background, 4K realistic yet artistic. The exact title text "${name}" appears large, clean and correctly spelled. A small, unobtrusive "AIWEBTOOLS.AI" logo wordmark sits in the bottom-right corner. No other text.`,
      }),
    });
    if (art.ok) {
      const b64: string = (await art.json())?.data?.[0]?.b64_json || "";
      if (b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const path = `community-bots/${slug}.png`;
        const { error: upErr } = await admin.storage.from("tool-images").upload(path, bytes, { contentType: "image/png", upsert: true });
        if (!upErr) {
          imageUrl = admin.storage.from("tool-images").getPublicUrl(path).data.publicUrl;
          await admin.from("gpt_apps").update({ image_url: imageUrl }).eq("slug", slug);
        } else console.error("image upload failed", upErr.message);
      }
    } else console.error("image gen failed", art.status, (await art.text()).slice(0, 200));
  } catch (e) { console.error("image step failed", e); }

  return json({ approved: true, slug, imageUrl, reason: verdict.reason || "Approved" });
});
