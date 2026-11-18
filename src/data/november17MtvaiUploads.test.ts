// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { NOVEMBER_17_MTVAI_UPLOADS } from "./november17MtvaiUploads";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS, findMtvaiAudiobooks } from "./mtvaiAudiobooks";

test("today's two music uploads lead the shared main, pinned and book music queue once", () => {
  const ids = ["t6YMggPuE08", "5hhOEjiZoRQ"];
  expect(MTVAI_CATALOG.slice(3, 5).map(v => v.id)).toEqual(ids);
  for (const id of ids) {
    expect(MTVAI_CATALOG.filter(v => v.id === id)).toHaveLength(1);
    expect(MTVAI_AUDIOBOOKS.some(v => v.id === id)).toBe(false);
  }
});

test("both Copernicus parts are searchable in audiobooks only, newest part first", () => {
  const ids = ["PAYxkZc_YN0", "UYvbYIIqwEQ"];
  expect(findMtvaiAudiobooks("nicolaus copernicus").map(v => v.id)).toEqual([...ids, "140FVwHeSLI"]);
  for (const id of ids) expect(MTVAI_CATALOG.some(v => v.id === id)).toBe(false);
  expect(MTVAI_AUDIOBOOKS.slice(6, 8).map(v => v.id)).toEqual(ids);
  expect(NOVEMBER_17_MTVAI_UPLOADS.filter(v => v.kind === "audiobook").map(v => v.durationSeconds)).toEqual([28537, 30070]);
});