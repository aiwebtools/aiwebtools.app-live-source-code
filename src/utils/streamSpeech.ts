import { createParser } from "eventsource-parser";

/**
 * Live voice playback.
 *
 * The voice engine can deliver audio as it is produced rather than as one file,
 * so a reply begins speaking as soon as the first samples arrive (under a
 * second) instead of waiting for the whole clip to be generated (three to
 * eighteen seconds). Clips are started immediately and read in the background,
 * so the sentence after the one playing is already on its way.
 */

const SAMPLE_RATE = 24000;

/** Turn streamed 16-bit samples into playable floats, carrying an odd trailing byte. */
export const decodePCM = (pending: Uint8Array, incoming: Uint8Array) => {
  const bytes = new Uint8Array(pending.length + incoming.length);
  bytes.set(pending);
  bytes.set(incoming, pending.length);
  const usable = bytes.length - (bytes.length % 2);
  const view = new DataView(bytes.buffer, bytes.byteOffset, usable);
  const samples = new Float32Array(usable / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = view.getInt16(i * 2, true) / 32768;
  return { samples, pending: bytes.slice(usable) };
};

export type SpeechClip = {
  /** Next decoded block of audio, or null when nothing has arrived yet. */
  next: () => Float32Array<ArrayBuffer> | null;
  /** Resolves once more audio arrives, the clip finishes, or it fails. */
  wait: () => Promise<void>;
  readonly finished: boolean;
  readonly error: Error | null;
  /** True once the first audio samples have been received. */
  readonly started: boolean;
  abort: () => void;
  /** Longest believable duration (seconds); audio beyond it is a model re-read and is dropped. */
  maxSeconds?: number;
};

/**
 * Start fetching and reading one spoken clip. Audio is drained into memory right
 * away so the next sentence is ready before the current one finishes playing.
 */
export const beginSpeechClip = (url: string, init: RequestInit, outer: AbortSignal, maxSeconds?: number): SpeechClip => {
  const samples: Float32Array<ArrayBuffer>[] = [];
  let finished = false;
  let error: Error | null = null;
  let started = false;
  let wake: (() => void) | null = null;

  const controller = new AbortController();
  const abort = () => controller.abort(outer.reason);
  outer.addEventListener("abort", abort, { once: true });

  const notify = () => {
    const waiting = wake;
    wake = null;
    waiting?.();
  };

  const run = async () => {
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok || (response.headers.get("Content-Type") || "").includes("application/json")) {
        const detail = await response.json().catch(() => ({}));
        const failure = new Error(detail?.error || detail?.message || "Voice playback is unavailable right now.");
        if (response.status === 402 || detail?.status === 402) failure.name = "CreditExhausted";
        throw failure;
      }
      if (!response.body) throw new Error("The voice engine returned no playable audio.");

      let pending = new Uint8Array(0);
      let completed = false;
      let heard = 0;
      const parser = createParser({
        onEvent(event) {
          // OpenAI-style streams end with a plain [DONE] marker after the final audio event.
          if (event.data.trim() === "[DONE]") { completed = true; return; }
          const payload = JSON.parse(event.data) as { type?: string; audio?: string; error?: unknown };
          if (payload.error || payload.type === "error") throw new Error(`Speech failed: ${event.data}`);
          if (payload.type === "speech.audio.done") {
            completed = true;
            return;
          }
          if (payload.type !== "speech.audio.delta" || !payload.audio) return;
          if (completed) return;
          const decoded = decodePCM(pending, Uint8Array.from(atob(payload.audio), (c) => c.charCodeAt(0)));
          pending = new Uint8Array(decoded.pending);
          if (!decoded.samples.length) return;
          heard += decoded.samples.length;
          samples.push(decoded.samples);
          started = true;
          notify();
        },
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      try {
        for (;;) {
          const chunk = await reader.read();
          if (chunk.done) break;
          parser.feed(decoder.decode(chunk.value, { stream: true }));
        }
        parser.feed(decoder.decode());
        parser.reset({ consume: true });
      } finally {
        reader.releaseLock();
      }
      if (!completed || !heard || pending.length) throw new Error("The voice clip ended before it was complete.");
    } catch (err) {
      if (!controller.signal.aborted) error = err instanceof Error ? err : new Error("Voice clip could not play.");
    } finally {
      finished = true;
      outer.removeEventListener("abort", abort);
      notify();
    }
  };
  void run();

  return {
    next: () => samples.shift() ?? null,
    wait: () => new Promise<void>((resolve) => { wake = resolve; }),
    get finished() { return finished; },
    get error() { return error; },
    get started() { return started; },
    abort: () => controller.abort(),
    maxSeconds,
  };
};

/** True only when the lifelike engine is genuinely out of AI credits. */
export const isCreditExhausted = (error: unknown) =>
  error instanceof Error && error.name === "CreditExhausted";

/**
 * Drain a queue of spoken clips in order. Lifelike studio voices stay primary:
 * a transient failure retries the sentence once on the backup lifelike engine
 * (and surfaces a playback error if both fail). The free device
 * voice takes over for the rest of the reply only when AI credits are exhausted.
 */
export const drainStudioQueue = async (
  queue: Array<{ text: string; clip: SpeechClip | null }>,
  opts: {
    play: (clip: SpeechClip) => Promise<void>;
    isAborted: () => boolean;
    onStudioDown: () => void;
    playFallback: (text: string) => void | Promise<void>;
    retry?: (text: string) => SpeechClip | null;
  },
): Promise<void> => {
  let deviceOnly = false;
  const creditsOut = async (text: string) => {
    stopSpeechPlayback();
    opts.onStudioDown();
    deviceOnly = true;
    for (const rest of queue) rest.clip?.abort();
    await opts.playFallback(text);
  };
  while (queue.length) {
    const next = queue.shift();
    if (!next) return;
    if (opts.isAborted()) return;
    if (deviceOnly || !next.clip) {
      next.clip?.abort();
      await opts.playFallback(next.text);
      continue;
    }
    try {
      await opts.play(next.clip);
    } catch (error) {
      if (opts.isAborted()) return;
      console.warn("Lifelike voice clip failed:", error instanceof Error ? error.message : error);
      next.clip.abort();
      if (isCreditExhausted(error)) { await creditsOut(next.text); continue; }
      const backup = opts.retry?.(next.text) ?? null;
      if (backup) {
        try { await opts.play(backup); continue; }
        catch (retryError) {
          if (opts.isAborted()) return;
          console.warn("Backup lifelike voice clip failed:", retryError instanceof Error ? retryError.message : retryError);
          backup.abort();
          if (isCreditExhausted(retryError)) { await creditsOut(next.text); continue; }
        }
      }
      stopSpeechPlayback();
      for (const rest of queue) rest.clip?.abort();
      throw new Error("Lifelike voice playback failed. Tap Play reply to retry; the free voice is only used when AI credits are exhausted.");
    }
  }
};

let context: AudioContext | null = null;
const liveSources = new Set<AudioBufferSourceNode>();
let playbackGeneration = 0;

const audioContext = () => {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error("Audio playback is not supported in this browser.");
  if (!context || context.state === "closed") context = new AudioContextClass();
  return context;
};

/** Call directly from a click, before a network request, to unlock mobile audio. */
export const unlockSpeechPlayback = async () => {
  const ctx = audioContext();
  // Safari also interrupts a context when microphone capture or another media player takes focus.
  if (ctx.state !== "running" && ctx.state !== "closed") await ctx.resume();
  if (ctx.state !== "running") throw new Error("Audio is paused by your browser. Tap Play again to enable it.");
};

/** Silence anything playing right now — used by stop, mute and new replies. */
export const stopSpeechPlayback = () => {
  playbackGeneration += 1;
  for (const source of liveSources) {
    const ended = source.onended;
    source.onended = null;
    try { source.stop(); } catch { /* already finished */ }
    ended?.call(source);
  }
  liveSources.clear();
};

/**
 * Play a clip in order as its audio arrives. Returns once everything the clip
 * delivered has been heard.
 */
export const playSpeechClip = async (clip: SpeechClip, speed = 1): Promise<void> => {
  const generation = playbackGeneration;
  await unlockSpeechPlayback();
  const ctx = audioContext();
  const rate = Math.min(1.6, Math.max(0.5, speed));
  let playhead = ctx.currentTime + 0.05;
  let tail: Promise<void> = Promise.resolve();
  let heardSeconds = 0;

  for (;;) {
    if (generation !== playbackGeneration) { clip.abort(); return; }
    if (clip.maxSeconds && heardSeconds > clip.maxSeconds) { clip.abort(); break; }
    const chunk = clip.next();
    if (!chunk) {
      if (clip.error) throw clip.error;
      if (clip.finished) break;
      await clip.wait();
      continue;
    }
    const buffer = ctx.createBuffer(1, chunk.length, SAMPLE_RATE);
    buffer.copyToChannel(chunk, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.connect(ctx.destination);
    liveSources.add(source);
    tail = new Promise<void>((resolve) => {
      source.onended = () => { liveSources.delete(source); resolve(); };
    });
    playhead = Math.max(playhead, ctx.currentTime + 0.02);
    source.start(playhead);
    playhead += buffer.duration / rate;
    heardSeconds += buffer.duration;
  }

  await tail;
  if (clip.error && !(clip.maxSeconds && heardSeconds > clip.maxSeconds)) throw clip.error;
};
