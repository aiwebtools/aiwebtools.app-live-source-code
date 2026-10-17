// Publishes a user-built GPT to the public library after an AI ethics review.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { DAILY_LIMIT, VOICES, validateAvatar, ETHICS_POLICY } from "./creator-validation.ts";
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body: { name?: unknown; tagline?: unknown; instructions?: unknown; guestId?: unknown; voice?: unknown; avatar?: unknown } = {};
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ").slice(0, 80) : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim().slice(0, 160) : "";
  const instructions = typeof body.instructions === "string" ? body.instructions.trim().slice(0, 20000) : "";
  const guestId = typeof body.guestId === "string" ? body.guestId.slice(0, 80) : "";
  if (name.length < 2 || instructions.length < 30 || guestId.length < 8) return json({ error: "Add a name and at least a few sentences of instructions before publishing." }, 400);

  const voice = body.voice ?? "alloy";
  if (typeof voice !== "string" || !VOICES.some((v) => v === voice)) return json({ error: "Choose a supported speaking voice." }, 400);
  let avatar: ReturnType<typeof validateAvatar>;
  try { avatar = validateAvatar(body.avatar); } catch (error) { return json({ error: error instanceof Error ? error.message : "Invalid avatar" }, 400); }
  const url = Deno.env.get("SUPABASE_URL"); const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "The publishing service is not configured." }, 500);
  const admin = createClient(url, serviceKey);
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
        { role: "system", content: ETHICS_POLICY },
        { role: "user", content: `Review this assistant and return JSON {"approved": boolean, "reason": string, "category": string}.\n\nNAME: ${name}\nSUBHEADER: ${tagline}\nINSTRUCTIONS:\n${instructions}` },
      ],
      response_format: { type: "json_schema", json_schema: { name: "review", strict: true, schema: { type: "object", additionalProperties: false, required: ["approved", "reason", "category"], properties: { approved: { type: "boolean" }, reason: { type: "string" }, category: { type: "string" } } } } },
    }),
  });
  if (!review.ok) {
    const failure = await review.json().catch(() => ({}));
    return json({ error: failure.message || failure.error?.message || "The safety review could not finish. Your bot remains saved on this device." }, review.status);
  }
  let verdict: { approved?: boolean; reason?: string } = {};
  try { verdict = JSON.parse((await review.json()).choices?.[0]?.message?.content || "{}"); } catch { /* treated as rejection */ }
  if (verdict.approved !== true) return json({ approved: false, reason: verdict.reason || "The bot did not pass the ethics review." });

  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "bot";
  const slug = `community-${base}-${crypto.randomUUID().slice(0, 6)}`;
  let imageUrl: string | null = null;
  if (avatar) {
    const path = `community-bots/${slug}-avatar.${avatar.contentType.split("/")[1]}`;
    const { error } = await admin.storage.from("tool-images").upload(path, avatar.bytes, { contentType: avatar.contentType, upsert: false });
    if (error) return json({ error: "Your avatar could not be saved. Your bot remains saved on this device." }, 503);
    imageUrl = admin.storage.from("tool-images").getPublicUrl(path).data.publicUrl;
  }
  const greeting = `Hello, I am ${name}.${tagline ? ` ${tagline}.` : ""} How can I help you today?`;
  const { error: appErr } = await admin.from("gpt_apps").insert({
    slug, display_name: name, tagline: tagline ? `${tagline} · Community GPT` : "Community GPT", greeting,
    starter_prompts: [`What can you help me with, ${name}?`, "Walk me through your first step."],
    model: "google/gemini-3-flash-preview", is_active: true, supports_images: true, source_file: `community:${owner}`, voice, image_url: imageUrl,
  });
  if (appErr) return json({ error: "Publishing failed. Please try again." }, 500);
  const prompt = `You are "${name}"${tagline ? ` — ${tagline}` : ""}, a community-made assistant published on AIWebTools.app.\n\nOPERATIONAL INSTRUCTIONS:\n${instructions}`;
  const { error: promptErr } = await admin.from("gpt_app_prompts").insert({ app_slug: slug, system_prompt: prompt });
  if (promptErr) { await admin.from("gpt_apps").delete().eq("slug", slug); return json({ error: "Publishing failed. Please try again." }, 500); }
  // Branded directory image: bot name in the art + AIWEBTOOLS.AI mark bottom-right.
  // Failure here never blocks publishing; the bot falls back to its themed emblem.
  if (!avatar) try {
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
