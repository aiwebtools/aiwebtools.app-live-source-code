import { useCallback, useEffect, useRef, useState } from "react";
import { splitSpeechText } from "@/utils/speechText";
import { useToast } from "@/hooks/use-toast";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";

const STORAGE_KEY = "awt-voice-enabled";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awt-tts`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const stripForSpeech = (text: string) =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/_Creating your image…_/g, " ")
    .replace(/_Searching the web for “[^”]+”…_/g, " ")
    .replace(/!\[[\s\S]*$/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_>`|]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Reads assistant replies out loud as they stream in, sentence by sentence.
 * Visitors can mute it at any time; the choice is remembered on this device.
 */
export const useSpeechReader = (profile?: GptVoiceProfile) => {
  const supported = typeof window !== "undefined" && (Boolean(profile) || "speechSynthesis" in window);
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const listeningRef = useRef(false);
  const [speaking, setSpeaking] = useState(false);
  const spokenRef = useRef(0);
  const bufferRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const queueRef = useRef<string[]>([]);
  const pendingRef = useRef<Promise<Blob>[]>([]);
  const queueBusyRef = useRef(false);
  const generationRef = useRef(0);

  const releaseStudioAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!supported) return;
    enabledRef.current = localStorage.getItem(STORAGE_KEY) !== "off";
    setEnabled(enabledRef.current);
  }, [supported]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    queueRef.current = []; pendingRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    releaseStudioAudio();
    if (supported) window.speechSynthesis?.cancel();
    spokenRef.current = 0;
    bufferRef.current = "";
    setSpeaking(false);
  }, [releaseStudioAudio, supported]);

  /** Request one clip; started early so the next sentence is ready when the current one ends. */
  const fetchClip = useCallback(async (text: string, signal: AbortSignal): Promise<Blob> => {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      body: JSON.stringify({ text, voice: profile?.voice, engine: "gemini", style: profile?.label }),
      signal,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.error || detail.message || "Voice playback is unavailable right now.");
    }
    const blob = await response.blob();
    if (!blob.size || !blob.type.startsWith("audio/")) throw new Error("The voice engine returned no playable audio.");
    return blob;
  }, [profile]);

  const playClip = useCallback((blob: Blob, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
    releaseStudioAudio();
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;
    const audio = new Audio(url);
    audio.playbackRate = Math.min(1.25, Math.max(1.05, (profile?.speed ?? 1) + 0.1));
    audioRef.current = audio;
    const finish = () => { signal.removeEventListener("abort", abort); releaseStudioAudio(); resolve(); };
    const abort = () => { audio.pause(); finish(); };
    signal.addEventListener("abort", abort, { once: true });
    audio.onended = finish;
    audio.onerror = () => { signal.removeEventListener("abort", abort); reject(new Error("Audio could not play. Please tap Play voice again.")); };
    void audio.play().catch(reject);
  }), [profile, releaseStudioAudio]);

  /** Speak text in order, fetching every chunk ahead so playback runs without gaps. */
  const speakStudio = useCallback(async (text: string) => {
    const clean = stripForSpeech(text);
    if (!clean || !profile || !ANON_KEY) return false;
    requestRef.current?.abort();
    releaseStudioAudio();
    const controller = new AbortController();
    requestRef.current = controller;
    setSpeaking(true);
    try {
      const clips = splitSpeechText(clean, 600).map((chunk) => fetchClip(chunk, controller.signal));
      clips.forEach((c) => c.catch(() => {}));
      for (const clip of clips) {
        const blob = await clip;
        if (controller.signal.aborted) return false;
        await playClip(blob, controller.signal);
      }
      return !controller.signal.aborted;
    } catch (error) {
      if (!controller.signal.aborted) toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Please try voice playback again.", variant: "destructive" });
      return false;
    } finally {
      if (requestRef.current === controller) {
        releaseStudioAudio();
        setSpeaking(false);
        requestRef.current = null;
      }
    }
  }, [fetchClip, playClip, profile, releaseStudioAudio, toast]);

  const enqueue = useCallback((text: string) => {
    if (!stripForSpeech(text) || !profile || !ANON_KEY) return;
    if (!requestRef.current || requestRef.current.signal.aborted) requestRef.current = new AbortController();
    const controller = requestRef.current;
    const clips = splitSpeechText(stripForSpeech(text), 600).map((chunk) => {
      const clip = fetchClip(chunk, controller.signal);
      clip.catch(() => {});
      return clip;
    });
    pendingRef.current.push(...clips);
    if (queueBusyRef.current) return;
    queueBusyRef.current = true;
    const generation = generationRef.current;
    setSpeaking(true);
    void (async () => {
      try {
        while (generation === generationRef.current && pendingRef.current.length) {
          const blob = await pendingRef.current.shift()!;
          if (generation !== generationRef.current || controller.signal.aborted) return;
          await playClip(blob, controller.signal);
        }
      } catch (error) {
        if (generation === generationRef.current && !controller.signal.aborted) {
          pendingRef.current = [];
          toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Please try voice playback again.", variant: "destructive" });
        }
      } finally {
        if (generation === generationRef.current) { queueBusyRef.current = false; setSpeaking(false); }
      }
    })();
  }, [fetchClip, playClip, profile, toast]);

  const speakChunk = useCallback(
    (chunk: string) => {
      const clean = stripForSpeech(chunk);
      if (!clean) return;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.02;
      utterance.pitch = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        window.setTimeout(() => setSpeaking(window.speechSynthesis.speaking || window.speechSynthesis.pending), 0);
      };
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  /** Feed the growing reply; only newly completed sentences are spoken. */
  const feed = useCallback(
    (fullText: string) => {
      if (!supported || !enabledRef.current || listeningRef.current) return;
      bufferRef.current = fullText;
      const pending = fullText.slice(spokenRef.current);
      const lastBreak = Math.max(
        pending.lastIndexOf(". "),
        pending.lastIndexOf("! "),
        pending.lastIndexOf("? "),
        pending.lastIndexOf("\n"),
      );
      if (lastBreak < 0) return;
      const ready = pending.slice(0, lastBreak + 1);
      spokenRef.current += ready.length;
      if (profile) enqueue(ready);
      else speakChunk(ready);
    },
    [enqueue, profile, speakChunk, supported],
  );

  /** Speak whatever is left once the reply has finished streaming. */
  const flush = useCallback(() => {
    if (!supported || !enabledRef.current || listeningRef.current) return;
    const rest = bufferRef.current.slice(spokenRef.current);
    spokenRef.current = bufferRef.current.length;
    if (profile) enqueue(rest);
    else speakChunk(rest);
  }, [enqueue, profile, speakChunk, supported]);

  /** Start a fresh reply. */
  const reset = useCallback(() => {
    generationRef.current += 1;
    queueRef.current = []; pendingRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    releaseStudioAudio();
    spokenRef.current = 0;
    bufferRef.current = "";
    if (supported) window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, [releaseStudioAudio, supported]);

  const toggle = useCallback(() => {
    setEnabled((was) => {
      const next = !was;
      enabledRef.current = next;
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      if (!next) {
        generationRef.current += 1;
        queueRef.current = []; pendingRef.current = [];
        queueBusyRef.current = false;
        requestRef.current?.abort();
        releaseStudioAudio();
        setSpeaking(false);
        if (supported) window.speechSynthesis?.cancel();
      }
      return next;
    });
  }, [releaseStudioAudio, supported]);

  /**
   * Read one specific message out loud on demand (a play button), regardless of
   * whether auto-read is switched on. Calling it again while it is talking stops it.
   */
  const speakNow = useCallback(
    (text: string) => {
      if (!supported) return;
      if (speaking || window.speechSynthesis?.speaking || window.speechSynthesis?.pending) {
        stop();
        return;
      }
      if (profile) {
        void speakStudio(text);
        return;
      }
      const clean = stripForSpeech(text);
      if (!clean) return;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.02;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [profile, speakStudio, speaking, stop, supported],
  );

  useEffect(() => () => {
    generationRef.current += 1;
    queueRef.current = []; pendingRef.current = [];
    requestRef.current?.abort();
    releaseStudioAudio();
    if (supported) window.speechSynthesis?.cancel();
  }, [releaseStudioAudio, supported]);

  const pauseForMicrophone = useCallback(() => { listeningRef.current = true; stop(); }, [stop]);
  const resumeAfterMicrophone = useCallback(() => { listeningRef.current = false; }, []);
  return { supported, enabled, toggle, feed, flush, reset, stop, speakNow, speaking, pauseForMicrophone, resumeAfterMicrophone };
};

export default useSpeechReader;
