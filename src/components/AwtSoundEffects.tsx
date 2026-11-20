import { useEffect, useRef, useState } from "react";
import { AudioLines, Download, Loader2, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestAudio, useGeneratedAudio } from "@/hooks/useGeneratedAudio";
import { audioNotice } from "@/utils/audioNotice";
import { synthesizeSound } from '@/utils/localAudio';
import { deliverFile } from '@/utils/fileDelivery';

export default function AwtSoundEffects() {
  const [prompt, setPrompt] = useState("A shimmering science-fiction portal opening with a deep whoosh and sparkling electric crackles.");
  const [duration, setDuration] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [clip, setClip] = useState<Blob | null>(null);
  const [local, setLocal] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const audio = useGeneratedAudio();
  const generate = async () => {
    if (busy || !prompt.trim()) return;
    setBusy(true); setError(""); audio.stop();
    const controller = new AbortController(); request.current = controller;
    try {
      await audio.unlock();
      let blob: Blob;
      try { blob = await requestAudio("awt-sound-effects", { prompt: prompt.trim(), duration }, AbortSignal.any([controller.signal,AbortSignal.timeout(6000)])); setLocal(false); }
      catch (error) { if(controller.signal.aborted) throw error; blob=synthesizeSound(prompt,duration);setLocal(true); }
      if (!controller.signal.aborted) { setClip(blob); await audio.load(blob); }
    } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Sound generation failed."); }
    finally { setBusy(false); request.current = null; }
  };
  return <section aria-label="AWT sound effects generator" className="border-t border-primary/20 py-10">
    <div className="mx-auto max-w-3xl px-4">
      <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-primary"><AudioLines />AWT Sound Effects Studio</h2>
      <p className="mb-4 text-sm text-muted-foreground">Free · No sign-up. Local synthesized audio remains available when AI audio is unavailable.</p>
      {local && <p role="status" className="mb-3 text-sm text-foreground">Locally synthesized sound · WAV</p>}
      <label className="text-sm text-foreground" htmlFor="sound-description">Sound description</label>
      <textarea id="sound-description" value={prompt} onChange={e => setPrompt(e.target.value)} maxLength={1000} rows={3} className="mt-2 w-full rounded-lg border border-primary/30 bg-card p-3 text-base text-foreground" />
      <label className="mt-4 flex items-center gap-4 text-sm text-foreground">Duration · {duration} seconds<input aria-label="Sound duration" className="min-w-0 flex-1 accent-primary" type="range" min="0.5" max="22" step="0.5" value={duration} onChange={e => setDuration(Number(e.target.value))} /></label>
      {error && <p role="alert" className="mt-4 text-sm studio-notice">{audioNotice(error)}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={generate} disabled={busy || !prompt.trim()} className="bg-primary text-primary-foreground">{busy ? <Loader2 className="animate-spin" /> : <AudioLines />}{busy ? "Generating…" : "Generate sound"}</Button>
        <Button variant="outline" disabled={!audio.clipUrl || busy} aria-label={audio.playing ? "Pause sound" : "Replay sound"} onClick={() => void audio.toggle().catch(e => setError(e.message))}>{audio.playing ? <Pause /> : <Play />}</Button>
        <Button variant="outline" disabled={!busy && !audio.clipUrl} aria-label="Stop sound" onClick={() => { request.current?.abort(); audio.stop(); }}><Square /></Button>
        <Button variant="gold" disabled={!clip} onClick={()=>{if(clip) void deliverFile(clip,`aiwebtools-sound-effect.${clip.type.includes('wav')?'wav':'mp3'}`);}}><Download />Download {clip?.type.includes('wav')?'WAV':'MP3'}</Button>
      </div>
    </div>
  </section>;
}