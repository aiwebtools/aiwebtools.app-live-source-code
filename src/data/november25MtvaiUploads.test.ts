// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { MTVAI_CATALOG } from "./mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { isMtvaiAudiobook, isMtvaiPromotion } from "./mtvaiRemovedUploads";

test("November 24–25 verified additions reach their correct shared collection exactly once", () => {
  for (const id of ["-D6DzxiBB7w", "vWOleBQKXvc", "x_5G7HWiC18"]) {
    expect(MTVAI_CATALOG.filter(video => video.id === id)).toHaveLength(1);
    expect(MTVAI_AUDIOBOOKS.some(video => video.id === id)).toBe(false);
  }
  expect(MTVAI_AUDIOBOOKS.filter(video => video.id === "tuBeEDdm2fc")).toHaveLength(1);
  expect(MTVAI_CATALOG.some(video => video.id === "tuBeEDdm2fc")).toBe(false);
});

test("tool promos never masquerade as music or audiobook recordings; source records survive", () => {
  for (const id of ["MryAyvg_N0U", "SbaG759Ue38", "Q835xINc4Bk", "vBm6l_6JqEg", "8aPpUPiDBJ4", "Zdthelofv_E", "9fpWIE20z7s", "JXLqPMfw49Y", "7qxEnBR2BwQ"]) {
    const source = RECENT_MTVAI_UPLOADS.find(video => video.id === id);
    expect(source).toBeDefined();
    if (!source) throw new Error(`Missing preserved source ${id}`);
    expect(isMtvaiPromotion(source)).toBe(true);
    expect(isMtvaiAudiobook(source)).toBe(false);
    expect(MTVAI_CATALOG.some(video => video.id === id)).toBe(false);
    expect(MTVAI_AUDIOBOOKS.some(video => video.id === id)).toBe(false);
  }
  expect(MTVAI_CATALOG.some(video => video.id === "a4BmHSG2tGk")).toBe(true);
  expect(MTVAI_CATALOG.some(video => video.id === "w7udrbcW_4M")).toBe(true);
});