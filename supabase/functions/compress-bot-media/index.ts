import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import manifest from "./manifest.json" with { type: "json" };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
// A fixed verified manifest, not caller-selected paths, restricts this one-time operation.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = Deno.env.get("SUPABASE_URL");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !service || !anon) return json({ error: "Missing server configuration" }, 503);
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) return json({ error: "Administrator sign-in required" }, 401);
  const auth = createClient(url, anon);
  const { data: user, error: authError } = await auth.auth.getUser(token);
  if (authError || !user.user) return json({ error: "Administrator sign-in required" }, 401);
  const db = createClient(url, service);
  const { data: admin } = await db.rpc("has_role", { _user_id: user.user.id, _role: "admin" });
  if (admin !== true) return json({ error: "Administrator access required" }, 403);
  const body = await req.json().catch(() => null);
  if (!body || !Number.isInteger(body.offset) || body.offset < 0 || body.offset >= manifest.length) return json({ error: "Invalid batch offset" }, 400);
  const results = [];
  for (const entry of manifest.slice(body.offset, body.offset + 10)) {
    const response = await fetch(entry.compressed_url);
    if (!response.ok) return json({ error: "Verified compressed copy unavailable", path: entry.path }, 502);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length !== entry.compressed_bytes || bytes.length >= entry.bytes) return json({ error: "Compressed copy failed size verification", path: entry.path }, 409);
    const { error } = await db.storage.from("tool-images").upload(entry.path, bytes, { upsert: true, contentType: "image/webp", cacheControl: "31536000" });
    if (error) return json({ error: "Picture replacement failed", path: entry.path }, 500);
    results.push(entry.path);
  }
  return json({ ok: true, replaced: results, nextOffset: body.offset + results.length, total: manifest.length });
});