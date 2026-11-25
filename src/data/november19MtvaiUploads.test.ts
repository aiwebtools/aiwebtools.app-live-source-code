// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";
import { isMtvaiAudiobook } from "./mtvaiRemovedUploads";

test("Temple is Within remains in shared music players exactly once and is not an audiobook", () => {
  expect(MTVAI_CATALOG.filter(v => v.id === "UlaGqwBGaMc")).toHaveLength(1);
  expect(MTVAI_AUDIOBOOKS.some(v => v.id === "UlaGqwBGaMc")).toBe(false);
});

test("all 44 audiobook recordings stay out of the music queue", () => {
  expect(MTVAI_AUDIOBOOKS).toHaveLength(44);
  expect(MTVAI_CATALOG).toHaveLength(837);
  const books = new Set(MTVAI_AUDIOBOOKS.map(v => v.id));
  expect(MTVAI_CATALOG.filter(v => books.has(v.id) || isMtvaiAudiobook(v))).toHaveLength(0);
});