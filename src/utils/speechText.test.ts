// @ts-nocheck
import { expect, it } from 'bun:test';
import { splitSpeechText } from './speechText';

it('reads the complete reply beyond the 4000 character request limit', () => {
  const text = 'A thoughtful answer. '.repeat(500).trim();
  const chunks = splitSpeechText(text);
  expect(chunks.length).toBeGreaterThan(1);
  expect(chunks.every((chunk) => chunk.length <= 3500)).toBe(true);
  expect(chunks.join(' ').replace(/\s+/g, ' ').trim()).toBe(text);
});

it('preserves unbroken long input without oversized requests', () => {
  const text = 'a'.repeat(8200);
  const chunks = splitSpeechText(text);
  expect(chunks.map((chunk) => chunk.length)).toEqual([3500, 3500, 1200]);
  expect(chunks.join('')).toBe(text);
});