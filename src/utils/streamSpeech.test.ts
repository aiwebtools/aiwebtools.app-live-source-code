import { expect, test } from "bun:test";
import { decodePCM } from "./streamSpeech";

const bytes = (...values: number[]) => Uint8Array.from(values);

test("converts 16-bit little-endian samples to playable floats", () => {
  const { samples, pending } = decodePCM(new Uint8Array(0), bytes(0x00, 0x40, 0x80, 0x80));
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
