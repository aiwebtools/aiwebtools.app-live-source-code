import { useCallback, useEffect, useRef, useState } from "react";
import { splitSpeechText } from "@/utils/speechText";
import { useToast } from "@/hooks/use-toast";
import { beginSpeechClip, drainStudioQueue, playSpeechClip, stopSpeechPlayback, unlockSpeechPlayback, type SpeechClip } from "@/utils/streamSpeech";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";
import { deviceSpeechAvailable, speakDeviceText, unlockDeviceSpeech } from "@/utils/deviceSpeech";
import { stopBotIntro } from "@/utils/botIntroVoice";

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
  const supported = typeof window !== "undefined" && (Boolean(profile) || deviceSpeechAvailable());
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const listeningRef = useRef(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const spokenRef = useRef(0);
  const bufferRef = useRef("");
  const requestRef = useRef<AbortController | null>(null);
  const pendingRef = useRef<Array<{ text: string; clip: SpeechClip | null }>>([]);
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
    toast(deviceSpeechAvailable()
      ? { title: "Using your device's free voice", description: "The lifelike studio voice is unavailable right now, so replies are read by your device's built-in voice instead." }
      : { title: "Voice unavailable", description: "This browser has no available device voice. Your complete reply will still appear in the chat." });
  }, [toast]);

  useEffect(() => {
    if (!supported) return;
    enabledRef.current = localStorage.getItem(STORAGE_KEY) !== "off";
    setEnabled(enabledRef.current);
  }, [supported]);

  const stop = useCallback(() => {
    stopBotIntro();
    window.dispatchEvent(new Event("awt-response-voice"));
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

  const speakChunk = useCallback((chunk: string) => {
    const signal = requestRef.current?.signal;
    return new Promise<void>((resolve, reject) => {
      if (signal?.aborted) { resolve(); return; }
      const finish = () => { signal?.removeEventListener("abort", finish); resolve(); };
      signal?.addEventListener("abort", finish, { once: true });
      speakDeviceText(stripForSpeech(chunk), {
        onStart: () => setSpeaking(true),
        onEnd: finish,
        onUnavailable: () => {
          signal?.removeEventListener("abort", finish);
          const message = "Your browser could not start its voice. Tap Play reply to try again; check your media volume.";
          setVoiceError(message);
          reject(new Error(message));
        },
        signal,
        rate: profile?.speed,
        feminine: /feminine|mother|shimmer|coral|nova/i.test(`${profile?.voice} ${profile?.instructions}`),
      });
    });
  }, [profile]);

  /** Speak text in order; every clip is started at once so later sentences arrive early. */
  const speakStudio = useCallback(
    async (text: string) => {
      const clean = stripForSpeech(text);
      if (!clean) return false;
      requestRef.current?.abort();
      stopSpeechPlayback();
      const controller = new AbortController();
      requestRef.current = controller;
      setSpeaking(true);
      try {
        const clips = splitSpeechText(clean, 220).filter(speakable).map((chunk) => ({ text: chunk, clip: studioDownRef.current || !profile || !ANON_KEY ? null : startClip(chunk, controller.signal) }));
        await drainStudioQueue(clips, {
          play: (clip) => playSpeechClip(clip, clipSpeed(profile?.speed)),
          isAborted: () => controller.signal.aborted,
          onStudioDown: noteStudioDown,
          playFallback: speakChunk,
        });
        // The device-voice fallback already read the reply when the studio
        // engine failed, so that case is a success, not a surfaced failure.
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
    [profile, startClip, toast, noteStudioDown, speakChunk],
  );

  const enqueue = useCallback(
    (text: string) => {
      if (!stripForSpeech(text)) return;
      if (!requestRef.current || requestRef.current.signal.aborted) requestRef.current = new AbortController();
      const controller = requestRef.current;
      window.dispatchEvent(new Event("awt-response-voice"));
      stopBotIntro();
      pendingRef.current.push(...splitSpeechText(stripForSpeech(text), 220).filter(speakable).map((chunk) => ({ text: chunk, clip: profile && ANON_KEY && !studioDownRef.current ? startClip(chunk, controller.signal) : null })));
      if (queueBusyRef.current) return;
      queueBusyRef.current = true;
      const generation = generationRef.current;
      setSpeaking(true);
      void (async () => {
        try {
          await drainStudioQueue(pendingRef.current, {
            play: (clip) => playSpeechClip(clip, clipSpeed(profile?.speed)),
            isAborted: () => generation !== generationRef.current || controller.signal.aborted,
            onStudioDown: noteStudioDown,
            playFallback: speakChunk,
          });
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
    [profile, startClip, toast, noteStudioDown, speakChunk],
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
      enqueue(ready);
    },
    [enqueue, profile, speakChunk, supported],
  );

  /** Speak whatever is left once the reply has finished streaming. */
  const flush = useCallback(() => {
    if (!supported || !enabledRef.current || listeningRef.current) return;
    const rest = bufferRef.current.slice(spokenRef.current);
    spokenRef.current = bufferRef.current.length;
    enqueue(rest);
  }, [enqueue, profile, speakChunk, supported]);

  /** Start a fresh reply. */
  const reset = useCallback(() => {
    stopBotIntro();
    window.dispatchEvent(new Event("awt-response-voice"));
    generationRef.current += 1;
    pendingRef.current = [];
    queueBusyRef.current = false;
    requestRef.current?.abort();
    stopSpeechPlayback();
    spokenRef.current = 0;
    bufferRef.current = "";
    if (supported) window.speechSynthesis?.cancel();
    setSpeaking(false);
    setVoiceError("");
    // Reset is called from submit, before fetching the reply. Unlock while the
    // browser still has the visitor's click/keypress gesture (especially iOS).
    if (enabledRef.current) unlockDeviceSpeech();
    if (profile && enabledRef.current) {
      void unlockSpeechPlayback().catch((error) => {
        if (!deviceSpeechAvailable()) setVoiceError(error instanceof Error ? error.message : "Tap Play to enable audio.");
      });
    }
  }, [profile, supported, toast]);

  const toggle = useCallback(() => {
      const next = !enabledRef.current;
      enabledRef.current = next;
      setEnabled(next);
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      if (next) { setVoiceError(""); unlockDeviceSpeech(); }
      if (next && profile) {
        void unlockSpeechPlayback().catch((error) => {
          if (!deviceSpeechAvailable()) setVoiceError(error instanceof Error ? error.message : "Tap Play to enable audio.");
        });
      }
      if (!next) {
        stopBotIntro();
        window.dispatchEvent(new Event("awt-response-voice"));
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
      stop();
      setVoiceError("");
      unlockDeviceSpeech();
      // Web Audio failure must not prevent the independent free device fallback.
      void unlockSpeechPlayback().catch(() => undefined);
      void speakStudio(text);
    },
    [profile, speakStudio, enqueue, reset, speaking, stop, supported, toast],
  );

  useEffect(() => () => {
    stopBotIntro();
    generationRef.current += 1;
    pendingRef.current = [];
    requestRef.current?.abort();
    stopSpeechPlayback();
    if (supported) window.speechSynthesis?.cancel();
  }, [supported]);

  const pauseForMicrophone = useCallback(() => { listeningRef.current = true; stop(); }, [stop]);
  const resumeAfterMicrophone = useCallback(() => { listeningRef.current = false; }, []);
  return { supported, enabled, toggle, feed, flush, reset, stop, speakNow, speaking, voiceError, pauseForMicrophone, resumeAfterMicrophone };
};

export default useSpeechReader;
