import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const VOICES = new Set([
  'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable',
  'nova', 'onyx', 'sage', 'shimmer', 'verse',
]);

const MAX_CHARS = 4000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return json({ error: 'Voice engine is not configured yet.' }, 500);

    const body = await req.json().catch(() => null);
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const voice = typeof body?.voice === 'string' ? body.voice : 'alloy';
    const speed = Number(body?.speed);
    const instructions =
      typeof body?.instructions === 'string' ? body.instructions.slice(0, 600) : '';

    if (!text) return json({ error: 'Please type something to speak.' }, 400);
    if (text.length > MAX_CHARS) {
      return json({ error: `Please keep it under ${MAX_CHARS} characters.` }, 400);
    }
    if (!VOICES.has(voice)) return json({ error: 'Unknown voice selected.' }, 400);

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini-tts',
        input: text,
        voice,
        response_format: 'mp3',
        stream_format: 'audio',
        ...(Number.isFinite(speed) && speed >= 0.25 && speed <= 4 ? { speed } : {}),
        ...(instructions ? { instructions } : {}),
      }),
      signal: req.signal,
    });

    if (!upstream.ok) {
      const details = await upstream.json().catch(() => ({}));
      const message =
        details?.error?.message || details?.message || (upstream.status === 402
          ? 'The voice studio is out of AI credits right now.'
          : upstream.status === 429
            ? 'The voice studio is busy — try again in a moment.'
            : 'The voice studio could not generate that clip.');
      return json({ error: message, status: upstream.status }, upstream.status);
    }

    const audio = await upstream.arrayBuffer();
    if (!audio.byteLength) return json({ error: 'The voice provider returned no audio. Playback stopped; please start a fresh request when voice access is available.' }, 502);
    return new Response(audio, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error('AWT TTS error:', err);
    return json({ error: 'Unexpected voice studio error.' }, 500);
  }
});
