// Cron/admin-only importer for Master's archived operational-instruction library.
// Each bot (and every distinct archived version) becomes a community- room whose prompt is the
// verbatim archived text. Upsert only — this function never deletes bots.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

type Rec = { slug: string; display_name: string; tagline: string; system_prompt: string; source_file: string; image_url?: string | null };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const secret = Deno.env.get("GPT_SEED_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) return json({ error: "Unauthorized" }, 401);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const body = await req.json().catch(() => ({}));

  if (body.action === "image") {
    const { slug, name, summary, family = [] } = body as { slug: string; name: string; summary: string; family: string[] };
    if (!String(slug).startsWith("community-")) return json({ error: "community slugs only" }, 400);
    const key = Deno.env.get("LOVABLE_API_KEY");
    const art = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-image-2.5-sunburst", size: "1536x1024", quality: "low",
        prompt: `Premium cinematic 16:9 hero artwork for an AI assistant called "${name}". Visually express, through a rich metaphor, what this assistant does: ${String(summary).slice(0, 600)}. Matrix-green digital glow, deep black background, 4K realistic yet artistic. The exact title text "${name}" appears large, clean and correctly spelled. A small, unobtrusive "AIWEBTOOLS.AI" logo wordmark sits in the bottom-right corner. No other text.`,
      }),
    });
    if (!art.ok) return json({ error: `image ${art.status}`, detail: (await art.text()).slice(0, 300) }, art.status === 429 || art.status >= 500 ? 503 : art.status);
    const b64: string = (await art.json())?.data?.[0]?.b64_json || "";
    if (!b64) return json({ error: "empty image" }, 502);
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `community-bots/${slug}.png`;
    const { error: upErr } = await admin.storage.from("tool-images").upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) return json({ error: upErr.message }, 500);
    const url = admin.storage.from("tool-images").getPublicUrl(path).data.publicUrl;
    const slugs = [slug, ...family.filter((s) => String(s).startsWith("community-"))];
    const { error } = await admin.from("gpt_apps").update({ image_url: url }).in("slug", slugs);
    return error ? json({ error: error.message }, 500) : json({ ok: true, url });
  }

  const records = (body.records || []) as Rec[];
  if (!records.length || records.some((r) => !r.slug?.startsWith("community-") || !r.system_prompt?.trim())) return json({ error: "invalid records" }, 400);
  const { error: appErr } = await admin.from("gpt_apps").upsert(records.map((r) => ({
    slug: r.slug, display_name: r.display_name, tool_title: null, tagline: r.tagline,
    greeting: `Hello, I am ${r.display_name}. How can I help you today?`, starter_prompts: [],
    model: "openai/gpt-6-luna", is_active: true, supports_images: true, source_file: r.source_file.slice(0, 500),
    ...(r.image_url ? { image_url: r.image_url } : {}),
  })), { onConflict: "slug" });
  if (appErr) return json({ error: appErr.message }, 500);
  const { error: promptErr } = await admin.from("gpt_app_prompts").upsert(records.map((r) => ({ app_slug: r.slug, system_prompt: r.system_prompt, updated_at: new Date().toISOString() })), { onConflict: "app_slug" });
  if (promptErr) return json({ error: promptErr.message }, 500);
  return json({ ok: true, upserted: records.length });
});
