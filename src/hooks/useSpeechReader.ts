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
    queueRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    releaseStudioAudio();
    if (supported) window.speechSynthesis?.cancel();
    spokenRef.current = 0;
    bufferRef.current = "";
    setSpeaking(false);
  }, [releaseStudioAudio, supported]);

  const speakStudio = useCallback(async (text: string) => {
    const clean = stripForSpeech(text);
    if (!clean || !profile || !ANON_KEY) return false;
    requestRef.current?.abort();
    releaseStudioAudio();
    const controller = new AbortController();
    requestRef.current = controller;
    setSpeaking(true);
    try {
      for (const chunk of splitSpeechText(clean)) {
        if (controller.signal.aborted) return false;
        const response = await fetch(FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
          body: JSON.stringify({ text: chunk, voice: profile.voice, speed: profile.speed, instructions: profile.instructions }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          throw new Error(detail.error || detail.message || "Voice playback is unavailable right now.");
        }
        const blob = await response.blob();
        if (controller.signal.aborted) return false;
        if (!blob.size || !blob.type.startsWith("audio/")) throw new Error("The voice engine returned no playable audio.");
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          const finish = () => { controller.signal.removeEventListener("abort", abort); releaseStudioAudio(); resolve(); };
          const abort = () => { audio.pause(); finish(); };
          controller.signal.addEventListener("abort", abort, { once: true });
          audio.onended = finish;
          audio.onerror = () => { controller.signal.removeEventListener("abort", abort); reject(new Error("Audio could not play. Please tap Play voice again.")); };
          void audio.play().catch(reject);
        });
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
  }, [profile, releaseStudioAudio, toast]);

  const enqueue = useCallback((text: string) => {
    if (!stripForSpeech(text)) return;
    queueRef.current.push(text);
    if (queueBusyRef.current) return;
    queueBusyRef.current = true;
    const generation = generationRef.current;
    void (async () => {
      while (generation === generationRef.current && queueRef.current.length) {
        const chunk = queueRef.current.shift();
        if (!chunk) break;
        const success = await speakStudio(chunk);
        if (generation !== generationRef.current) return;
        if (!success) { queueRef.current = []; break; }
      }
      if (generation === generationRef.current) queueBusyRef.current = false;
    })();
  }, [speakStudio]);

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
    queueRef.current = [];
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
        queueRef.current = [];
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
    queueRef.current = [];
    requestRef.current?.abort();
    releaseStudioAudio();
    if (supported) window.speechSynthesis?.cancel();
  }, [releaseStudioAudio, supported]);

  const pauseForMicrophone = useCallback(() => { listeningRef.current = true; stop(); }, [stop]);
  const resumeAfterMicrophone = useCallback(() => { listeningRef.current = false; }, []);
  return { supported, enabled, toggle, feed, flush, reset, stop, speakNow, speaking, pauseForMicrophone, resumeAfterMicrophone };
};

export default useSpeechReader;
