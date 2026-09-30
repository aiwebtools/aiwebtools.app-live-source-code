import React, { useEffect, useRef, useState } from "react";
import { Volume2, Square, Download, Mic2, Loader2, Play, Pause } from "lucide-react";

/**
 * AWT Voice Studio — real, distinct studio voices with a true MP3 download.
 * Audio is generated server-side so every voice genuinely sounds different
 * and the resulting clip can be saved to the visitor's device.
 */

const FUNCTION_URL = "https://huupailptzvcykyqdkar.supabase.co/functions/v1/awt-tts";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dXBhaWxwdHp2Y3lreXFka2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTMzODIsImV4cCI6MjA2NDQ4OTM4Mn0.IEqsLF3r-cyubqwwHOpkbSzz_IGt6v1U6LxO5fowHcQ";

const VOICES = [
  { id: "alloy", label: "Alloy — balanced neutral" },
  { id: "ash", label: "Ash — warm male" },
  { id: "ballad", label: "Ballad — soft storyteller" },
  { id: "coral", label: "Coral — bright female" },
  { id: "echo", label: "Echo — calm male" },
  { id: "fable", label: "Fable — British narrator" },
  { id: "nova", label: "Nova — energetic female" },
  { id: "onyx", label: "Onyx — deep male" },
  { id: "sage", label: "Sage — gentle female" },
  { id: "shimmer", label: "Shimmer — airy female" },
  { id: "verse", label: "Verse — expressive" },
];

const LANGUAGES = [
  { id: "", label: "Match my text (auto)" },
  { id: "English (US)", label: "English (US)" },
  { id: "English (British)", label: "English (British)" },
  { id: "Spanish", label: "Spanish" },
  { id: "French", label: "French" },
  { id: "German", label: "German" },
  { id: "Italian", label: "Italian" },
  { id: "Portuguese (Brazil)", label: "Portuguese (Brazil)" },
  { id: "Japanese", label: "Japanese" },
  { id: "Korean", label: "Korean" },
  { id: "Hindi", label: "Hindi" },
  { id: "Arabic", label: "Arabic" },
];

const STYLES = [
  { id: "", label: "Natural" },
  { id: "warm and friendly", label: "Warm & friendly" },
  { id: "bold cinematic movie-trailer", label: "Cinematic trailer" },
  { id: "calm and soothing, slow", label: "Calm & soothing" },
  { id: "excited and upbeat", label: "Excited & upbeat" },
  { id: "serious news anchor", label: "News anchor" },
  { id: "mysterious and whispered", label: "Mysterious whisper" },
];

const AwtTextToSpeech: React.FC = () => {
  const [text, setText] = useState(
    "Welcome to AI Web Tools — the largest free directory of AI tools on the internet."
  );
  const [voice, setVoice] = useState("alloy");
  const [language, setLanguage] = useState("");
  const [style, setStyle] = useState("");
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const previewCache = useRef<Map<string, string>>(new Map());
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      previewCache.current.forEach((u) => URL.revokeObjectURL(u));
      previewAudioRef.current?.pause();
      audioRef.current?.pause();
    },
    []
  );

  const previewSample = async (id: string) => {
    setVoice(id);
    setError(null);
    previewAudioRef.current?.pause();
    audioRef.current?.pause();

    const cached = previewCache.current.get(id);
    if (cached) {
      const a = new Audio(cached);
      previewAudioRef.current = a;
      void a.play();
      return;
    }

    setPreviewing(id);
    try {
      const label = VOICES.find((v) => v.id === id)?.label.split("—")[0].trim() ?? id;
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          text: `Hi, I'm ${label}. This is how I sound on AI Web Tools.`,
          voice: id,
          speed: 1,
          instructions: "",
        }),
      });
      if (!res.ok) throw new Error("Could not load that voice sample.");
      const url = URL.createObjectURL(await res.blob());
      previewCache.current.set(id, url);
      const a = new Audio(url);
      previewAudioRef.current = a;
      await a.play().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load that voice sample.");
    } finally {
      setPreviewing(null);
    }
  };


  const generate = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    audioRef.current?.pause();
    setPlaying(false);

    const instructionBits = [
      language ? `Speak entirely in ${language}.` : "",
      style ? `Delivery: ${style}.` : "",
    ].filter(Boolean);

    try {
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          text: trimmed,
          voice,
          speed,
          instructions: instructionBits.join(" "),
        }),
      });

      if (!res.ok) {
        let message = "The voice studio could not generate that clip.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* binary or empty error body */
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setClipUrl(url);

      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audio.onpause = () => setPlaying(false);
      audio.onplay = () => setPlaying(true);
      audioRef.current = audio;
      await audio.play().catch(() => setPlaying(false));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  };

  const download = () => {
    if (!clipUrl) return;
    const link = document.createElement("a");
    link.href = clipUrl;
    link.download = `aiwebtools-voice-${voice}-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const charCount = text.length;

  return (
    <section
      aria-label="Free AI Web Tools text to speech generator"
      className="py-12 md:py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #001400 50%, #0a0a0a 100%)" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-green-400" style={{ textShadow: "0 0 20px rgba(0, 255, 0, 0.5)" }}>
              🔊 FREE AWT TEXT-TO-SPEECH GENERATOR
            </span>
          </h2>
          <p className="text-green-200 max-w-2xl mx-auto">
            Type anything, pick a real studio voice and language, hear it instantly — then download
            it as an MP3. Free, no account, no limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-green-500/30 bg-slate-950/80 p-4 sm:p-6 shadow-2xl shadow-green-500/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-green-500/40 bg-green-500/10">
              <Mic2 className="h-4 w-4 text-green-400" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">
              AWT Voice Studio
            </span>
            <span className="ml-auto text-[10px] text-green-200/70">
              {charCount.toLocaleString()} / 4,000 characters
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={4000}
            placeholder="Type or paste the words you want spoken out loud…"
            aria-label="Text to speak"
            className="w-full resize-y rounded-xl border border-green-500/25 bg-black/60 p-3 text-sm text-green-100 placeholder:text-green-200/40 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 min-h-[120px]"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300/80">Voice</span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-lg border border-green-500/25 bg-black/70 px-2 py-2 text-xs text-green-100 focus:border-green-400 focus:outline-none"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300/80">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-green-500/25 bg-black/70 px-2 py-2 text-xs text-green-100 focus:border-green-400 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.label} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300/80">Style</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg border border-green-500/25 bg-black/70 px-2 py-2 text-xs text-green-100 focus:border-green-400 focus:outline-none"
              >
                {STYLES.map((s) => (
                  <option key={s.label} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300/80">
                Speed · {speed.toFixed(2)}x
              </span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="accent-green-400 mt-2"
                aria-label="Speech speed"
              />
            </label>
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300/80">
              Preview the voices
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {VOICES.map((v) => {
                const name = v.label.split("—")[0].trim();
                const active = voice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => void previewSample(v.id)}
                    disabled={previewing !== null}
                    aria-label={`Preview the ${name} voice`}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                      active
                        ? "border-green-400 bg-green-500/15 text-green-200"
                        : "border-green-500/30 text-green-300/80 hover:bg-green-500/10"
                    }`}
                  >
                    {previewing === v.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="h-3 w-3" aria-hidden="true" />
                    )}
                    {name}
                  </button>
                );
              })}
            </div>
          </div>



          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={!text.trim() || loading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
              style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
              {loading ? "Generating…" : "Speak It"}
            </button>

            <button
              type="button"
              onClick={togglePlay}
              disabled={!clipUrl}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/50 px-5 py-2.5 text-sm font-bold text-green-300 transition hover:bg-green-500/10 disabled:opacity-40"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {playing ? "Pause" : "Replay"}
            </button>

            <button
              type="button"
              onClick={stop}
              disabled={!clipUrl}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/50 px-5 py-2.5 text-sm font-bold text-green-300 transition hover:bg-green-500/10 disabled:opacity-40"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop
            </button>

            <button
              type="button"
              onClick={download}
              disabled={!clipUrl}
              className="op-gold-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download MP3
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-green-200/60">
            100% free · no sign-up · 11 studio voices · downloadable MP3 · AIWEBTOOLS.APP
          </p>
        </div>
      </div>
    </section>
  );
};

export default AwtTextToSpeech;
