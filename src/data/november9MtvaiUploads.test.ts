// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { NOVEMBER_9_MTVAI_UPLOADS } from "./november9MtvaiUploads";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";

test("all 15 newly verified recordings reach the shared three-player catalog exactly once", () => {
  expect(NOVEMBER_9_MTVAI_UPLOADS).toHaveLength(19);
  expect(NOVEMBER_9_MTVAI_UPLOADS.filter(v => v.kind === "music")).toHaveLength(9);
  for (const v of NOVEMBER_9_MTVAI_UPLOADS) {
    expect(MTVAI_CATALOG.filter(item => item.id === v.id)).toHaveLength(1);
    expect(v.url).toBe(`https://www.youtube.com/watch?v=${v.id}`);
    expect(v.thumbnailUrl).toBe(`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`);
  }
  expect(MTVAI_CATALOG.slice(0, 15).map(v => v.id)).toEqual(NOVEMBER_9_MTVAI_UPLOADS.map(v => v.id));
});

test("all five new book recordings also reach the audiobook area without duplicate editions", () => {
  for (const id of ["140FVwHeSLI", "WSHG6VsBmVg", "ULM2RZLSgVo", "JHwJNDR3G40", "b6qXfy8MPWE"]) {
    expect(MTVAI_AUDIOBOOKS.filter(v => v.id === id)).toHaveLength(1);
  }
  expect(MTVAI_AUDIOBOOKS).toHaveLength(37);
});