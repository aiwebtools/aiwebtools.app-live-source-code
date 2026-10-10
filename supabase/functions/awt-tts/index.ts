import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const VOICES = new Set([
  'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable',
  'nova', 'onyx', 'sage', 'shimmer', 'verse',
]);

const MAX_CHARS = 4000;

// Lifelike Gemini voices standing in for each hosted voice name (bot chat engine).
const GEMINI_VOICES: Record<string, string> = {
  alloy: 'Achird', ash: 'Orus', ballad: 'Enceladus', coral: 'Aoede', echo: 'Charon',
  fable: 'Sadaltager', nova: 'Leda', onyx: 'Algenib', sage: 'Sulafat', shimmer: 'Achernar', verse: 'Puck',
};

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

    if (body?.engine === 'gemini') {
      const style = typeof body?.style === 'string' ? body.style.replace(/[\n:]/g, ' ').slice(0, 120).trim() : '';
      const prompt = `Read aloud as a real, warm human speaker${style ? ` (${style})` : ''}, at a brisk, natural conversational pace with lively expression: ${text}`;
      const wantsStream = body.stream === true;
      const gem = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3.1-flash-tts-preview',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI_VOICES[voice] } } },
          },
          ...(wantsStream ? { stream_format: 'sse' } : {}),
        }),
        signal: req.signal,
      });
      if (!gem.ok) {
        const details = await gem.json().catch(() => ({}));
        const message = details?.error?.message || details?.message || (gem.status === 402
          ? 'The voice studio is out of AI credits right now.'
          : gem.status === 429 ? 'The voice studio is busy — try again in a moment.' : 'The voice could not be generated.');
        return json({ error: message, status: gem.status }, gem.status);
      }
      // Live playback: hand the browser the audio stream as it is produced so speech
      // starts the moment the first samples land instead of after the whole clip.
      if (wantsStream) {
        if (!gem.body) return json({ error: 'The voice provider returned no audio.' }, 502);
        return new Response(gem.body, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' },
        });
      }
      const wav = await gem.arrayBuffer();
      if (!wav.byteLength) return json({ error: 'The voice provider returned no audio.' }, 502);
      return new Response(wav, { headers: { ...corsHeaders, 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' } });
    }

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
