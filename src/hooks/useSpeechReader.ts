import { useCallback, useEffect, useRef, useState } from "react";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";

const STORAGE_KEY = "awt-voice-enabled";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awt-tts`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const stripForSpeech = (text: string) =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
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
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const spokenRef = useRef(0);
  const bufferRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!supported) return;
    setEnabled(localStorage.getItem(STORAGE_KEY) !== "off");
  }, [supported]);

  const stop = useCallback(() => {
    requestRef.current?.abort();
    audioRef.current?.pause();
    audioRef.current = null;
    if (supported) window.speechSynthesis.cancel();
    spokenRef.current = 0;
    bufferRef.current = "";
    setSpeaking(false);
  }, [supported]);

  const speakStudio = useCallback(async (text: string) => {
    const clean = stripForSpeech(text).slice(0, 4000);
    if (!clean || !profile || !ANON_KEY) return false;
    requestRef.current?.abort();
    audioRef.current?.pause();
    const controller = new AbortController();
    requestRef.current = controller;
    setSpeaking(true);
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ text: clean, voice: profile.voice, speed: profile.speed, instructions: profile.instructions }),
        signal: controller.signal,
      });
      if (!response.ok) return false;
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setSpeaking(false); };
      audio.onerror = () => { URL.revokeObjectURL(url); setSpeaking(false); };
      await audio.play();
      return true;
    } catch {
      setSpeaking(false);
      return false;
    }
  }, [profile]);

  const speakChunk = useCallback(
    (chunk: string) => {
      const clean = stripForSpeech(chunk);
      if (!clean) return;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.02;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  /** Feed the growing reply; only newly completed sentences are spoken. */
  const feed = useCallback(
    (fullText: string) => {
      if (!supported || !enabled) return;
      bufferRef.current = fullText;
      // Studio profiles are generated once the full answer arrives. This avoids
      // overlapping browser speech and preserves one consistent character voice.
      if (profile) return;
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
      speakChunk(ready);
    },
    [enabled, profile, speakChunk, supported],
  );

  /** Speak whatever is left once the reply has finished streaming. */
  const flush = useCallback(() => {
    if (!supported || !enabled) return;
    const rest = bufferRef.current.slice(spokenRef.current);
    spokenRef.current = bufferRef.current.length;
    const completeReply = bufferRef.current;
    if (profile) void speakStudio(completeReply).then((played) => { if (!played) speakChunk(rest); });
    else speakChunk(rest);
  }, [enabled, profile, speakChunk, speakStudio, supported]);

  /** Start a fresh reply. */
  const reset = useCallback(() => {
    requestRef.current?.abort();
    audioRef.current?.pause();
    audioRef.current = null;
    spokenRef.current = 0;
    bufferRef.current = "";
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const toggle = useCallback(() => {
    setEnabled((was) => {
      const next = !was;
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      if (!next) {
        requestRef.current?.abort();
        audioRef.current?.pause();
        audioRef.current = null;
        setSpeaking(false);
        if (supported) window.speechSynthesis.cancel();
      }
      return next;
    });
  }, [supported]);

  /**
   * Read one specific message out loud on demand (a play button), regardless of
   * whether auto-read is switched on. Calling it again while it is talking stops it.
   */
  const speakNow = useCallback(
    (text: string) => {
      if (!supported) return;
      if (speaking || window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        requestRef.current?.abort();
        audioRef.current?.pause();
        audioRef.current = null;
        window.speechSynthesis.cancel();
        setSpeaking(false);
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
    [profile, speakStudio, speaking, supported],
  );

  useEffect(() => () => {
    requestRef.current?.abort();
    audioRef.current?.pause();
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { supported, enabled, toggle, feed, flush, reset, stop, speakNow, speaking };
};

export default useSpeechReader;
