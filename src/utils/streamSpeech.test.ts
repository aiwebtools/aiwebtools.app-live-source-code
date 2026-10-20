// @ts-nocheck
import { expect, test } from "bun:test";
import { beginSpeechClip, decodePCM, unlockSpeechPlayback } from "./streamSpeech";

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
