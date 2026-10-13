import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const schema = z.object({ prompt: z.string().trim().min(1).max(1000), duration: z.number().min(0.5).max(22) });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (error: string, status: number) => new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return json('Use a Generate action to create sound.', 405);
  const input = schema.safeParse(await req.json().catch(() => null));
  if (!input.success) return json('Enter a sound description and choose a duration between 0.5 and 22 seconds.', 400);
  const key = Deno.env.get('ELEVENLABS_API_KEY');
  if (!key) return json('Sound effects need the ElevenLabs connection enabled.', 503);
  try {
    const upstream = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.data.prompt, duration_seconds: input.data.duration, prompt_influence: 0.3 }), signal: req.signal,
    });
    if (!upstream.ok) {
      const details = await upstream.text();
      console.error(`Sound effects failed [${upstream.status}]: ${details}`);
      let message = details;
      try { const data = JSON.parse(details); message = data.detail?.message || data.message || details; } catch { /* plain safe provider error */ }
      return json(message, upstream.status);
    }
    if (!upstream.body) return json('The sound provider returned no audio.', 502);
    return new Response(upstream.body, { headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error('Sound effects error', e);
    return json('Sound generation could not finish. Please start a fresh request.', 502);
  }
});