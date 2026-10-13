import { useEffect, useRef, useState } from "react";

/** Unlock on the click, then decode server audio without losing mobile playback permission. */
export function useGeneratedAudio() {
  const ctx = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const url = useRef<string | null>(null);
  const offset = useRef(0);
  const started = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);

  const unlock = async () => {
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) throw new Error("This browser does not support audio playback.");
    if (!ctx.current || ctx.current.state === "closed") ctx.current = new Ctx();
    if (ctx.current.state === "suspended") await ctx.current.resume();
    if (ctx.current.state !== "running") throw new Error("Tap Play again to enable browser audio.");
  };
  const stop = () => {
    if (source.current) { source.current.onended = null; source.current.stop(); source.current = null; }
    offset.current = 0;
    setPlaying(false);
  };
  const play = async () => {
    await unlock();
    const context = ctx.current;
    const clip = buffer.current;
    if (!context || !clip) return;
    const node = context.createBufferSource();
    node.buffer = clip;
    node.connect(context.destination);
    node.onended = () => { source.current = null; offset.current = 0; setPlaying(false); };
    source.current = node;
    started.current = context.currentTime;
    node.start(0, offset.current);
    setPlaying(true);
  };
  const toggle = async () => {
    if (source.current && ctx.current) {
      offset.current += ctx.current.currentTime - started.current;
      source.current.onended = null;
      source.current.stop();
      source.current = null;
      setPlaying(false);
    } else await play();
  };
  const load = async (blob: Blob) => {
    stop();
    await unlock();
    if (!blob.size) throw new Error("No audio was returned.");
    const context = ctx.current;
    if (!context) return;
    buffer.current = await context.decodeAudioData(await blob.arrayBuffer());
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = URL.createObjectURL(blob);
    setClipUrl(url.current);
    await play();
  };
  useEffect(() => () => {
    if (source.current) { source.current.onended = null; source.current.stop(); }
    void ctx.current?.close();
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);
  return { unlock, load, toggle, stop, playing, clipUrl };
}

export async function requestAudio(name: string, body: object, signal?: AbortSignal) {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST", headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(body), signal,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(typeof data.error === "string" ? data.error : data.message || `Audio generation failed (${res.status}).`);
  }
  if (!(res.headers.get("Content-Type") || "").startsWith("audio/")) throw new Error("The service returned no playable audio.");
  return res.blob();
}