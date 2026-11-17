// @ts-ignore -- Bun runs project regressions.
import { test, expect } from "bun:test";
import legacy from "./mtvaiLegacyCatalog.json";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { MTVAI_CATALOG, MTVAI_TRACK_COUNT } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";
import { REMOVED_MTVAI_UPLOAD_IDS, isMtvaiAudiobook } from "./mtvaiRemovedUploads";

test("all existing pinned and book tracks survive in the shared catalog exactly once", () => {
  expect(MTVAI_TRACK_COUNT).toBe(1073);
  const ids = MTVAI_CATALOG.map(v => v.id);
  expect(new Set(ids).size).toBe(1073);
  const books = new Set(MTVAI_AUDIOBOOKS.map(v => v.id));
  for (const video of [...legacy, ...RECENT_MTVAI_UPLOADS]) if (!REMOVED_MTVAI_UPLOAD_IDS.has(video.id) && !books.has(video.id) && !isMtvaiAudiobook(video)) expect(ids.includes(video.id)).toBe(true);
});
test("the theater, pinned and book queue lead with the verified latest music preview", () => {
  expect(MTVAI_CATALOG[0].id).toBe("t6YMggPuE08");
});
test("music lineup never contains audiobooks, removed uploads or repeats", () => {
  const books = new Set(MTVAI_AUDIOBOOKS.map(v => v.id));
  expect(MTVAI_CATALOG.filter(v => books.has(v.id) || isMtvaiAudiobook(v))).toHaveLength(0);
  expect(MTVAI_CATALOG.filter(v => REMOVED_MTVAI_UPLOAD_IDS.has(v.id))).toHaveLength(0);
  expect(MTVAI_AUDIOBOOKS.filter(v => REMOVED_MTVAI_UPLOAD_IDS.has(v.id))).toHaveLength(0);
  expect(MTVAI_AUDIOBOOKS).toHaveLength(38);
});