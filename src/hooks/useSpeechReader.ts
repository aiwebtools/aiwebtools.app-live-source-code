import { useCallback, useEffect, useRef, useState } from "react";
import { splitSpeechText } from "@/utils/speechText";
import { useToast } from "@/hooks/use-toast";
import { beginSpeechClip, playSpeechClip, stopSpeechPlayback, unlockSpeechPlayback, type SpeechClip } from "@/utils/streamSpeech";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";

const STORAGE_KEY = "awt-voice-enabled";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awt-tts`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const stripForSpeech = (text: string) =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/_Creating your image…_/g, " ")
    .replace(/_⚠[^_]*_/g, " ")
    .replace(/(?:live )?web search is unavailable[^.]*\.?|no (?:live )?sources (?:were|could be) retrieved[^.]*\.?/gi, " ")
    .replace(/_Searching the web for “[^”]+”…_/g, " ")
    .replace(/!\[[\s\S]*$/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_>`|]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Only chunks with real words go to the voice engine; punctuation-only fragments are rejected upstream. */
const speakable = (text: string) => /[\p{L}\p{N}]/u.test(text);

/** Slightly brisker than the recorded pace so replies never drag. */
const clipSpeed = (speed?: number) => Math.min(1.25, Math.max(1.05, (speed ?? 1) + 0.1));

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
  const requestRef = useRef<AbortController | null>(null);
  const pendingRef = useRef<Array<{ text: string; clip: SpeechClip }>>([]);
  const queueBusyRef = useRef(false);
  const generationRef = useRef(0);
  // Set when the lifelike studio voice fails (e.g. AI credits recharging):
  // replies fall back to the free on-device voice for the rest of the session.
  const studioDownRef = useRef(false);
  const studioToastShownRef = useRef(false);
  const noteStudioDown = useCallback(() => {
    studioDownRef.current = true;
    if (studioToastShownRef.current) return;
    studioToastShownRef.current = true;
    toast({ title: "Using your device's free voice", description: "The lifelike studio voice is unavailable right now, so replies are read by your device's built-in voice instead." });
  }, [toast]);

  useEffect(() => {
    if (!supported) return;
    enabledRef.current = localStorage.getItem(STORAGE_KEY) !== "off";
    setEnabled(enabledRef.current);
  }, [supported]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    pendingRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    stopSpeechPlayback();
    if (supported) window.speechSynthesis?.cancel();
    spokenRef.current = 0;
    bufferRef.current = "";
    setSpeaking(false);
  }, [supported]);

  /** Start one spoken clip; the voice engine streams its audio as it is produced. */
  const startClip = useCallback(
    (text: string, signal: AbortSignal): SpeechClip =>
      beginSpeechClip(
        FUNCTION_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
          body: JSON.stringify({ text, voice: profile?.voice, engine: "gemini", style: profile?.label, instructions: profile?.instructions, stream: true }),
        },
        signal,
        // ~1.6× a normal reading pace: a full second pass by the voice model gets cut off.
        text.length / 9 + 2,
      ),
    [profile],
  );

  /** Speak text in order; every clip is started at once so later sentences arrive early. */
  const speakStudio = useCallback(
    async (text: string) => {
      const clean = stripForSpeech(text);
      if (!clean || !profile || !ANON_KEY) return false;
      requestRef.current?.abort();
      stopSpeechPlayback();
      const controller = new AbortController();
      requestRef.current = controller;
      setSpeaking(true);
      try {
        const clips = splitSpeechText(clean, 600).filter(speakable).map((chunk) => ({ text: chunk, clip: startClip(chunk, controller.signal) }));
        for (let i = 0; i < clips.length; i++) {
          if (controller.signal.aborted) return false;
          try {
            await playSpeechClip(clips[i].clip, clipSpeed(profile.speed));
          } catch (clipError) {
            if (controller.signal.aborted) return false;
            // Lifelike engine failed (commonly AI credits recharging): read the
            // rest of this reply with the free on-device voice so nothing is lost.
            noteStudioDown();
            for (const rest of clips.slice(i)) speakChunk(rest.text);
            return false;
          }
        }
        return !controller.signal.aborted;
      } catch (error) {
        if (!controller.signal.aborted) {
          toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Please try voice playback again.", variant: "destructive" });
        }
        return false;
      } finally {
        if (requestRef.current === controller) {
          stopSpeechPlayback();
          setSpeaking(false);
          requestRef.current = null;
        }
      }
    },
    [profile, startClip, toast],
  );

  const enqueue = useCallback(
    (text: string) => {
      if (!stripForSpeech(text) || !profile || !ANON_KEY) return;
      if (!requestRef.current || requestRef.current.signal.aborted) requestRef.current = new AbortController();
      const controller = requestRef.current;
      pendingRef.current.push(...splitSpeechText(stripForSpeech(text), 600).filter(speakable).map((chunk) => ({ text: chunk, clip: startClip(chunk, controller.signal) })));
      if (queueBusyRef.current) return;
      queueBusyRef.current = true;
      const generation = generationRef.current;
      setSpeaking(true);
      void (async () => {
        try {
          while (generation === generationRef.current && pendingRef.current.length) {
            const next = pendingRef.current.shift();
            if (!next) break;
            if (generation !== generationRef.current || controller.signal.aborted) return;
            try {
              await playSpeechClip(next.clip, clipSpeed(profile.speed));
            } catch (clipError) {
              if (generation !== generationRef.current || controller.signal.aborted) return;
              // Lifelike engine failed (commonly AI credits recharging): the free
              // on-device voice reads this sentence and everything still queued.
              noteStudioDown();
              speakChunk(next.text);
              for (const rest of pendingRef.current.splice(0)) speakChunk(rest.text);
              return;
            }
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
    },
    [profile, startClip, toast],
  );

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
      // Speak as it types: sentence ends, and for the very first words a clause
      // break or a long run, so the voice starts within the first line.
      const first = spokenRef.current === 0;
      let lastBreak = -1;
      for (const m of pending.matchAll(/[.!?:;]\s|\n/g)) lastBreak = m.index ?? -1;
      if (lastBreak < 0 && first && pending.length > 28) {
        for (const m of pending.matchAll(/[,—–-]\s/g)) lastBreak = m.index ?? -1;
      }
      if (lastBreak < 0 && pending.length > (first ? 70 : 180)) lastBreak = pending.lastIndexOf(" ");
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
    pendingRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    stopSpeechPlayback();
    spokenRef.current = 0;
    bufferRef.current = "";
    if (supported) window.speechSynthesis?.cancel();
    setSpeaking(false);
    // Reset is called from submit, before fetching the reply. Unlock while the
    // browser still has the visitor's click/keypress gesture (especially iOS).
    if (profile && enabledRef.current) {
      void unlockSpeechPlayback().catch((error) => {
        toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Tap Play to enable audio.", variant: "destructive" });
      });
    }
  }, [profile, supported, toast]);

  const toggle = useCallback(() => {
      const next = !enabledRef.current;
      enabledRef.current = next;
      setEnabled(next);
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      if (next && profile) {
        void unlockSpeechPlayback().catch((error) => {
          toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Tap Play to enable audio.", variant: "destructive" });
        });
      }
      if (!next) {
        generationRef.current += 1;
        pendingRef.current = [];
        queueBusyRef.current = false;
        requestRef.current?.abort();
        stopSpeechPlayback();
        setSpeaking(false);
        if (supported) window.speechSynthesis?.cancel();
      }
  }, [profile, supported, toast]);

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
        void unlockSpeechPlayback().then(() => speakStudio(text)).catch((error) => {
          toast({ title: "Voice unavailable", description: error instanceof Error ? error.message : "Tap Play again to enable audio.", variant: "destructive" });
        });
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
    [profile, speakStudio, speaking, stop, supported, toast],
  );

  useEffect(() => () => {
    generationRef.current += 1;
    pendingRef.current = [];
    requestRef.current?.abort();
    stopSpeechPlayback();
    if (supported) window.speechSynthesis?.cancel();
  }, [supported]);

  const pauseForMicrophone = useCallback(() => { listeningRef.current = true; stop(); }, [stop]);
  const resumeAfterMicrophone = useCallback(() => { listeningRef.current = false; }, []);
  return { supported, enabled, toggle, feed, flush, reset, stop, speakNow, speaking, pauseForMicrophone, resumeAfterMicrophone };
};

export default useSpeechReader;
