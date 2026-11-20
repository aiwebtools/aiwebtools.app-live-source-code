// @ts-ignore Bun runs the category regressions.
import { expect, test } from 'bun:test';
import { canonicalCategoryLabel } from './canonicalCategory';
test('writing aliases resolve to the same nonempty canonical collection', () => {
  expect(canonicalCategoryLabel('Writing & Text Generation')).toBe('Content Creation & Writing');
  expect(canonicalCategoryLabel('Content Creation & Writing')).toBe('Content Creation & Writing');
});
test('requested video category variants share a canonical category', () => {
  for (const name of ['Video & Multimedia', 'Video & Animation', 'Video Generation', 'Video & Multimedia Tools']) expect(canonicalCategoryLabel(name)).toBe('Video & Multimedia');
});
test('requested audio category variants share a canonical category', () => {
  for (const name of ['Audio & Music', 'Audio & Music Tools']) expect(canonicalCategoryLabel(name)).toBe('Audio & Music');
});
test('requested chat category variants share a canonical category', () => {
  for (const name of ['AI Chat Assistants', 'AI Chat & Assistants']) expect(canonicalCategoryLabel(name)).toBe('AI Chat & Assistants');
});