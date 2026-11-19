// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";

test("November 18 music leads the shared music queue once and stays out of audiobooks", () => {
  const ids = ["-qE3gB7CCTA", "X2afwNekjCc", "RwzijP6_kDU"];
  const start = MTVAI_CATALOG.findIndex(v => v.id === ids[0]);
  expect(MTVAI_CATALOG.slice(start, start + 3).map(v => v.id)).toEqual(ids);
  for (const id of ids) {
    expect(MTVAI_CATALOG.filter(v => v.id === id)).toHaveLength(1);
    expect(MTVAI_AUDIOBOOKS.some(v => v.id === id)).toBe(false);
  }
});

test("November 18 audiobook parts appear only in the audiobook collection", () => {
  const ids = ["nUDuAnNzFbg", "7GarV2FaHlE", "DWnha_4FLzc", "FWaC-SSg2E0", "uPXm6E38hjA", "NeepYyQxSwE"];
  expect(MTVAI_AUDIOBOOKS.slice(0, 6).map(v => v.id)).toEqual(ids);
  for (const id of ids) expect(MTVAI_CATALOG.some(v => v.id === id)).toBe(false);
});
