// @ts-nocheck
import { expect, test } from "bun:test";
import { beginSpeechClip, decodePCM, drainStudioQueue, isCreditExhausted, unlockSpeechPlayback } from "./streamSpeech";

const exhausted = () => Object.assign(new Error("Voice credits exhausted"), { name: "CreditExhausted" });

const bytes = (...values: number[]) => Uint8Array.from(values);

test("converts 16-bit little-endian samples to playable floats", () => {
  // 0x4000 = 16384 and 0x8000 = -32768, each stored low byte first.
  const { samples, pending } = decodePCM(new Uint8Array(0), bytes(0x00, 0x40, 0x00, 0x80));
  expect(samples.length).toBe(2);
  expect(samples[0]).toBe(0.5);
  expect(samples[1]).toBe(-1);
  expect(pending.length).toBe(0);
});

test("carries a split sample across streamed chunks instead of dropping it", () => {
  const first = decodePCM(new Uint8Array(0), bytes(0x00));
  expect(first.samples.length).toBe(0);
  expect(first.pending.length).toBe(1);

  const second = decodePCM(first.pending, bytes(0x40));
  expect(second.samples.length).toBe(1);
  expect(second.samples[0]).toBe(0.5);
  expect(second.pending.length).toBe(0);
});

test("streamed preview rejects missing completion rather than silently succeeding", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('data: {"type":"speech.audio.delta","audio":"AEA="}\n\n', { headers: { "Content-Type": "text/event-stream" } });
  try {
    const clip = beginSpeechClip("/test", {}, new AbortController().signal);
    while (!clip.finished) await clip.wait();
    expect(clip.started).toBe(true);
    expect(clip.error?.message).toBe("The voice clip ended before it was complete.");
  } finally { globalThis.fetch = original; }
});

test("a 200 JSON quota response is treated as a studio failure, not playable audio", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "The voice studio is out of AI credits right now.", status: 402 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const clip = beginSpeechClip("/test", {}, new AbortController().signal);
    while (!clip.finished) await clip.wait();
    expect(clip.started).toBe(false);
    expect(clip.error?.message).toBe("The voice studio is out of AI credits right now.");
  } finally { globalThis.fetch = original; }
});

test("studio voice failure hands the failed sentence and the rest of the queue to the free device voice, in order", async () => {
  const mk = (text) => ({ text, clip: { abort() {} } });
  const queue = [mk("First."), mk("Second."), mk("Third.")];
  const played = [];
  const fallback = [];
  let downCalls = 0;
  await drainStudioQueue(queue, {
    play: async (clip) => {
      played.push(clip);
      if (played.length === 2) throw exhausted();
    },
    isAborted: () => false,
    onStudioDown: () => { downCalls++; },
    playFallback: (text) => fallback.push(text),
  });
  expect(played.length).toBe(2); // the first sentence played, the second failed
  expect(downCalls).toBe(1);
  expect(fallback).toEqual(["Second.", "Third."]); // nothing skipped, nothing re-read
  expect(queue.length).toBe(0);
});

test("an aborted drain never falls back or replays queued speech", async () => {
  const mk = (text) => ({ text, clip: { abort() {} } });
  const queue = [mk("First."), mk("Second.")];
  const fallback = [];
  await drainStudioQueue(queue, {
    play: async () => { throw new Error("engine down"); },
    isAborted: () => true,
    onStudioDown: () => { throw new Error("must not mark studio down after abort"); },
    playFallback: (text) => fallback.push(text),
  });
  expect(fallback).toEqual([]);
});

test("fallback waits for each sentence before later streamed text and aborts unused studio clips", async () => {
  let complete;
  const heard = [];
  let aborted = 0;
  const queue = [{ text: "First.", clip: { abort() { aborted++; } } }, { text: "Second.", clip: { abort() { aborted++; } } }];
  const draining = drainStudioQueue(queue, {
    play: async () => { throw exhausted(); },
    isAborted: () => false,
    onStudioDown() {},
    playFallback: (text) => {
      heard.push(text);
      if (text === "First.") return new Promise((resolve) => { complete = resolve; });
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(heard).toEqual(["First."]);
  queue.push({ text: "Third.", clip: null });
  complete();
  await draining;
  expect(heard).toEqual(["First.", "Second.", "Third."]);
  expect(aborted).toBeGreaterThanOrEqual(2);
});

test("stopping during fallback never speaks the next queued sentence", async () => {
  let cancelled = false;
  const heard = [];
  await drainStudioQueue([{ text: "First.", clip: null }, { text: "Second.", clip: null }], {
    play: async () => {}, isAborted: () => cancelled, onStudioDown() {},
    playFallback: async (text) => { heard.push(text); cancelled = true; },
  });
  expect(heard).toEqual(["First."]);
});

test("gesture unlock resumes a suspended audio context before playback", async () => {
  const original = globalThis.window;
  let resumes = 0;
  class RestrictedAudioContext {
    state = "suspended";
    async resume() { resumes++; this.state = "running"; }
  }
  globalThis.window = { AudioContext: RestrictedAudioContext };
  try {
    await unlockSpeechPlayback();
    expect(resumes).toBe(1);
    await unlockSpeechPlayback();
    expect(resumes).toBe(1);
  } finally { globalThis.window = original; }
});

test("a non-credit voice failure retries the lifelike backup and keeps studio voices on", async () => {
  const mk = (text) => ({ text, clip: { abort() {} } });
  const queue = [mk("First."), mk("Second.")];
  const fallback = [];
  const retried = [];
  let downCalls = 0;
  let plays = 0;
  await drainStudioQueue(queue, {
    play: async () => { plays++; if (plays === 1) throw new Error("The voice clip ended before it was complete."); },
    isAborted: () => false,
    onStudioDown: () => { downCalls++; },
    playFallback: (text) => fallback.push(text),
    retry: (text) => { retried.push(text); return { abort() {} }; },
  });
  expect(retried).toEqual(["First."]);
  expect(downCalls).toBe(0);
  expect(fallback).toEqual([]);
  expect(plays).toBe(3);
});

test("only exhausted AI credits switch the rest of the reply to the device voice", async () => {
  const mk = (text) => ({ text, clip: { abort() {} } });
  const queue = [mk("First."), mk("Second.")];
  const fallback = [];
  let downCalls = 0;
  const credit = exhausted();
  await drainStudioQueue(queue, {
    play: async () => { throw credit; },
    isAborted: () => false,
    onStudioDown: () => { downCalls++; },
    playFallback: (text) => fallback.push(text),
    retry: () => { throw new Error("must not retry when credits are exhausted"); },
  });
  expect(downCalls).toBe(1);
  expect(fallback).toEqual(["First.", "Second."]);
});

test("quota, credit-related messages and rate limits do not prove credit exhaustion", () => {
  for (const message of ["quota", "credits recharging", "429 rate limit", "insufficient permissions", "payment required", "upstream request 402 failed"]) {
    expect(isCreditExhausted(new Error(message))).toBe(false);
  }
  expect(isCreditExhausted(exhausted())).toBe(true);
});

test("two temporary lifelike failures never select the basic voice", async () => {
  const fallback = [];
  let markedDown = false;
  let attempts = 0;
  await expect(drainStudioQueue([{ text: "Hello.", clip: { abort() {} } }], {
    play: async () => { attempts++; throw new Error("429 voice quota busy"); },
    isAborted: () => false,
    onStudioDown: () => { markedDown = true; },
    playFallback: (text) => fallback.push(text),
    retry: () => ({ abort() {} }),
  })).rejects.toThrow("Lifelike voice playback failed");
  expect(attempts).toBe(2);
  expect(markedDown).toBe(false);
  expect(fallback).toEqual([]);
});

test("a new reply tries lifelike speech after the previous reply exhausted credits", async () => {
  const heard = [];
  const opts = {
    play: async () => { throw exhausted(); }, isAborted: () => false, onStudioDown() {},
    playFallback: (text) => heard.push(text),
  };
  await drainStudioQueue([{ text: "First reply.", clip: { abort() {} } }], opts);
  let plays = 0;
  await drainStudioQueue([{ text: "Next reply.", clip: { abort() {} } }], { ...opts, play: async () => { plays++; } });
  expect(plays).toBe(1);
  expect(heard).toEqual(["First reply."]);
});

test("lifelike clips that end with an OpenAI [DONE] marker play instead of falling back", async () => {
  const { beginSpeechClip } = await import("./streamSpeech");
  const audio = btoa(String.fromCharCode(0, 1, 0, 2));
  const body = `data: {"type":"speech.audio.delta","audio":"${audio}"}\n\ndata: {"type":"speech.audio.done"}\n\ndata: [DONE]\n\n`;
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(body, { headers: { "Content-Type": "text/event-stream" } })) as typeof fetch;
  try {
    const clip = beginSpeechClip("https://x", {}, new AbortController().signal);
    while (!clip.finished) await clip.wait();
    expect(clip.error).toBeNull();
    expect(clip.started).toBe(true);
  } finally { globalThis.fetch = realFetch; }
});
