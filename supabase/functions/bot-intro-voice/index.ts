import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { buildBotIntro, VOICE_MAP } from "./intro.ts";

// Speaks each bot's welcome with the linked ElevenLabs account, recorded ONCE and cached in storage,
// so replays cost nothing and never touch Lovable AI credits.
const BUCKET = "bot-intros";
const schema = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,120}$/), voice: z.string().max(20).optional() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const input = schema.safeParse(await req.json().catch(() => null));
  if (!input.success) return json({ error: "Invalid bot" }, 400);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: bot } = await db.from("gpt_apps").select("slug, display_name, tagline").eq("slug", input.data.slug).eq("is_active", true).maybeSingle();
  if (!bot) return json({ error: "Bot not found" }, 404);
  const text = buildBotIntro(bot.display_name, bot.tagline);
  const voice = VOICE_MAP[input.data.voice || ""] ? input.data.voice! : "alloy";
  const path = `${bot.slug}-${voice}-v1.mp3`;
  const url = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const cached = await fetch(url, { method: "HEAD" }).catch(() => null);
  if (cached?.ok) return json({ url, text });
  const key = Deno.env.get("ELEVENLABS_API_KEY");
  if (!key) return json({ text, error: "Voice service not connected" });
  const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_MAP[voice]}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true } }),
  });
  if (!tts.ok) {
    console.error(`Intro voice failed [${tts.status}]: ${await tts.text()}`);
    return json({ text, error: "Voice unavailable" });
  }
  const audio = new Uint8Array(await tts.arrayBuffer());
  const { error } = await db.storage.from(BUCKET).upload(path, audio, { contentType: "audio/mpeg", upsert: true, cacheControl: "31536000" });
  if (error) { console.error("Intro upload failed", error.message); return json({ text, error: "Voice unavailable" }); }
  return json({ url, text });
});
