import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AwtSoundEffects from "@/components/AwtSoundEffects";
import { requestAudio, useGeneratedAudio } from "@/hooks/useGeneratedAudio";
import { Volume2, Square, Download, Mic2, Loader2, Play, Pause } from "lucide-react";

/**
 * AWT Voice Studio — real, distinct studio voices with a true MP3 download.
 * Audio is generated server-side so every voice genuinely sounds different
 * and the resulting clip can be saved to the visitor's device.
 */

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
  const [previewing, setPreviewing] = useState<string | null>(null);
  const audio = useGeneratedAudio();
  const { clipUrl, playing } = audio;
  const previewCache = useRef<Map<string, Blob>>(new Map());
  const request = useRef<AbortController | null>(null);

  const previewSample = async (id: string) => {
    if (loading || previewing) return;
    setVoice(id); setError(null); setPreviewing(id); audio.stop();
    const controller = new AbortController(); request.current = controller;
    try {
      await audio.unlock();
      let blob = previewCache.current.get(id);
      if (!blob) {
        const name = VOICES.find(v => v.id === id)?.label.split("—")[0].trim() || id;
        blob = await requestAudio("awt-tts", { text: `Hi, I'm ${name}. Let's bring your words to life.`, voice: id, speed: 1, instructions: "Warm, relaxed, expressive human conversation, speaking to a friend." }, controller.signal);
        previewCache.current.set(id, blob);
      }
      if (!controller.signal.aborted) await audio.load(blob);
    } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Voice preview could not play."); }
    finally { setPreviewing(null); request.current = null; }
  };

  const generate = async () => {
    if (!text.trim() || loading || previewing) return;
    setLoading(true); setError(null); audio.stop();
    const controller = new AbortController(); request.current = controller;
    try {
      await audio.unlock();
      const instructions = [language ? `Speak entirely in ${language}.` : "", style ? `Delivery: ${style}.` : "Warm, natural conversational delivery."].join(" ");
      const blob = await requestAudio("awt-tts", { text: text.trim(), voice, speed, instructions }, controller.signal);
      if (!controller.signal.aborted) await audio.load(blob);
    } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Voice generation failed."); }
    finally { setLoading(false); request.current = null; }
  };
  const togglePlay = () => void audio.toggle().catch(e => setError(e.message));
  const stop = () => { request.current?.abort(); audio.stop(); };
  const download = () => {
    if (!clipUrl) return;
    const link = document.createElement("a");
    link.href = clipUrl; link.download = `aiwebtools-voice-${voice}.mp3`;
    document.body.appendChild(link); link.click(); link.remove();
  };

  const charCount = text.length;

  return (
    <>
    <section
      aria-label="Free AI Web Tools text to speech generator"
      className="py-12 md:py-16 relative overflow-hidden"
      
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            <span className="text-primary" >
              🔊 FREE AWT TEXT-TO-SPEECH GENERATOR
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Type anything, pick a real studio voice and language, hear it — then download
            it as an MP3. Free, no account, no limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-primary/30 bg-card/80 p-4 sm:p-6 shadow-2xl shadow-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-primary/10">
              <Mic2 className="h-4 w-4 text-primary" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              AWT Voice Studio
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground/70">
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
            className="w-full resize-y rounded-xl border border-primary/25 bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px]"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Voice</span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-lg border border-primary/25 bg-background/70 px-2 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-primary/25 bg-background/70 px-2 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.label} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Style</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg border border-primary/25 bg-background/70 px-2 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {STYLES.map((s) => (
                  <option key={s.label} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                Speed · {speed.toFixed(2)}x
              </span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="accent-primary mt-2"
                aria-label="Speech speed"
              />
            </label>
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Preview the voices
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {VOICES.map((v) => {
                const name = v.label.split("—")[0].trim();
                const active = voice === v.id;
                return (
                  <Button
                    key={v.id}
                    type="button"
                    onClick={() => void previewSample(v.id)}
                    disabled={previewing !== null || loading}
                    aria-label={`Preview the ${name} voice`}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                      active
                        ? "border-primary bg-primary/15 text-muted-foreground"
                        : "border-primary/30 text-primary/80 hover:bg-primary/10"
                    }`}
                  >
                    {previewing === v.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="h-3 w-3" aria-hidden="true" />
                    )}
                    {name}
                  </Button>
                );
              })}
            </div>
          </div>



          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Button
              type="button"
              onClick={generate}
              disabled={!text.trim() || loading || previewing !== null}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
              
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
              {loading ? "Generating…" : "Speak It"}
            </Button>

            <Button
              type="button"
              onClick={togglePlay}
              disabled={!clipUrl && !loading && !previewing}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-40"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {playing ? "Pause" : "Replay"}
            </Button>

            <Button
              type="button"
              onClick={stop}
              disabled={!clipUrl && !loading && !previewing}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-40"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop
            </Button>

            <Button
              type="button"
              onClick={download}
              disabled={!clipUrl}
              className="op-gold-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download MP3
            </Button>
          </div>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
            100% free · no sign-up · 11 studio voices · downloadable MP3 · AIWEBTOOLS.APP
          </p>
        </div>
      </div>
    </section>
    <AwtSoundEffects />
    </>
  );
};

export default AwtTextToSpeech;
