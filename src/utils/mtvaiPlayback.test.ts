// @ts-ignore Bun regression runner
import { expect, test } from 'bun:test';
import { createVideoCompletionGate } from './mtvaiPlayback';
test('music advances once after real playing and ended regardless of repeated playing updates', () => {
  const gate = createVideoCompletionGate();
  expect(gate.observe(0)).toBe(false);
  for (let i=0;i<30;i++) expect(gate.observe(1)).toBe(false);
  expect(gate.observe(0)).toBe(true);
  expect(gate.observe(0)).toBe(false);
  expect(gate.observe(1)).toBe(false);
  expect(gate.observe(0)).toBe(false);
});