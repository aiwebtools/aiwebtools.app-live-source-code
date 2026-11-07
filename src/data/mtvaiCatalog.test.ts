// @ts-ignore -- Bun runs project regressions.
import { test, expect } from "bun:test";
import legacy from "./mtvaiLegacyCatalog.json";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { MTVAI_CATALOG, MTVAI_TRACK_COUNT } from "./mtvaiCatalog";

test("all existing pinned and book tracks survive in the shared catalog exactly once", () => {
  expect(MTVAI_TRACK_COUNT).toBe(1070);
  const ids = MTVAI_CATALOG.map(v => v.id);
  expect(new Set(ids).size).toBe(1070);
  for (const video of [...legacy, ...RECENT_MTVAI_UPLOADS]) expect(ids.includes(video.id)).toBe(true);
});
test("the theater, pinned and book queue lead with the verified latest music preview", () => {
  expect(MTVAI_CATALOG[0].id).toBe("hxpEb4z_9Yo");
});