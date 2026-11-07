// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { NOVEMBER_7_MTVAI_UPLOADS, RECOVERED_MTVAI_UPLOADS } from "./november7MtvaiUploads";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";

test("all 204 live-verified missing uploads reach the shared players once", () => {
  const additions = [...NOVEMBER_7_MTVAI_UPLOADS, ...RECOVERED_MTVAI_UPLOADS];
  expect(additions.length).toBe(204);
  for (const upload of additions) {
    expect(MTVAI_CATALOG.filter(v => v.id === upload.id)).toHaveLength(1);
    expect(upload.thumbnailUrl).toBe(`https://i.ytimg.com/vi/${upload.id}/hqdefault.jpg`);
  }
});

test("requested music and the live replacement Break the Frame are available", () => {
  for (const id of ["mbKvl-4qMng", "SDGvO8bdgSI", "URPozyEIN1Q"]) {
    expect(MTVAI_CATALOG.some(v => v.id === id && "kind" in v && v.kind === "music")).toBe(true);
  }
});

test("all eight requested audiobook parts reach the book collection", () => {
  for (const id of ["BhzmstJM7Ew", "dqxmFS051-s", "1iwXFUrn1CM", "P0tmDN4AEfU", "clX7Uz_r7J4", "fxS7aplKVsU", "_v4AWpyBqQg", "b1VzjzJJWG8"]) {
    expect(MTVAI_AUDIOBOOKS.filter(v => v.id === id)).toHaveLength(1);
  }
  expect(MTVAI_AUDIOBOOKS).toHaveLength(29);
});