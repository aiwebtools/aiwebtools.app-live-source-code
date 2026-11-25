// @ts-ignore -- Bun executes project regressions.
import { expect, test } from "bun:test";
import { NOVEMBER_20_MTVAI_UPLOADS } from "./november20MtvaiUploads";
import { MTVAI_CATALOG } from "./mtvaiCatalog";

test("all three verified November 20 music uploads lead the shared players once in source order", () => {
  const ids = ["YpJ94z05OnQ", "_pT4qM0Qyu0", "mKkj8o0Mlvk"];
  expect(NOVEMBER_20_MTVAI_UPLOADS.map(v => v.id)).toEqual(ids);
  const start = MTVAI_CATALOG.findIndex(v => v.id === ids[0]);
  expect(MTVAI_CATALOG.slice(start, start + 3).map(v => v.id)).toEqual(ids);
  for (const id of ids) {
    expect(MTVAI_CATALOG.filter(v => v.id === id)).toHaveLength(1);
  }
});