// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { selectGateShort } from "./gateOpening";
import { MTVAI_CATALOG } from "@/data/mtvaiCatalog";
import { MTVAI_AUDIOBOOKS } from "@/data/mtvaiAudiobooks";

test("random gate opening selects only shared music Shorts, never audiobooks", () => {
  const books = new Set(MTVAI_AUDIOBOOKS.map(video => video.id));
  for (const random of [0, 0.25, 0.5, 0.75, 0.999999]) {
    const clip = selectGateShort(MTVAI_CATALOG, () => random);
    expect(clip).not.toBeNull();
    expect(books.has(clip?.id ?? "")).toBe(false);
    expect(clip?.format === "shorts" || (typeof clip?.durationSeconds === "number" && clip.durationSeconds <= 60)).toBe(true);
  }
});

test("random selection can choose different Shorts each opening", () => {
  const clips = [{ id: "one", title: "Music one", kind: "music", format: "shorts" }, { id: "two", title: "Music two", kind: "music", format: "shorts" }, { id: "long", title: "Long music", kind: "music", durationSeconds: 600 }, { id: "promo", title: "Tool promotion", format: "shorts" }];
  expect(selectGateShort(clips, () => 0)?.id).toBe("one");
  expect(selectGateShort(clips, () => 0.99)?.id).toBe("two");
  expect(selectGateShort([], () => 0)).toBeNull();
});