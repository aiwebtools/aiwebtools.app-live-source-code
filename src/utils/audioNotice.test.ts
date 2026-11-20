// @ts-ignore Bun executes this regression.
import { test, expect } from 'bun:test';
import { audioNotice } from './audioNotice';
test('audio credit errors name the blocker without promising playback', () => {
  expect(audioNotice(new Error('402 insufficient_quota'))).toContain('no credits left');
  expect(audioNotice(new Error('402 insufficient_quota'))).toContain('No recording was created');
});
test('audio timeout resolves with a readable notice', () => {
  expect(audioNotice(new Error('TimeoutError'))).toContain('took too long');
});