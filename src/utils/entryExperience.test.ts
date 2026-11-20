// @ts-ignore Bun regression runtime
import { expect, test } from 'bun:test';
import { ACCESS_GATE_ENABLED, shouldShowOpening } from './entryExperience';
test('entry requires no PIN while the gate is temporarily disabled', () => {
  expect(ACCESS_GATE_ENABLED).toBe(false);
});
test('music opens once per homepage session, not on deep links or subsequent navigation', () => {
  expect(shouldShowOpening('/', null)).toBe(true);
  expect(shouldShowOpening('/', '1')).toBe(false);
  expect(shouldShowOpening('/movie-script-writer-gpt', null)).toBe(false);
  expect(shouldShowOpening('/privacy-policy', null)).toBe(false);
});