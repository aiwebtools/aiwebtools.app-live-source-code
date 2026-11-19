// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { MTV_CHANNEL_PATH, gateOpeningEventAction, selectGateShort, isGateMusicVideo } from "./gateOpening";
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
  const clips = [{ id: "one", title: "One — Choir | Official AI Music Video", kind: "music", format: "shorts" }, { id: "two", title: "Two — Choir | Official AI Music Video", kind: "music", format: "shorts" }, { id: "long", title: "Long music", kind: "music", durationSeconds: 600 }, { id: "promo", title: "Tool promotion", format: "shorts" }];
  expect(selectGateShort(clips, () => 0)?.id).toBe("one");
  expect(selectGateShort(clips, () => 0.99)?.id).toBe("two");
  expect(selectGateShort([], () => 0)).toBeNull();
});

test("the opening closes on a real ended event even when YouTube's playing notice was missed", () => {
  expect(gateOpeningEventAction({ state: 0 })).toBe("finish");
  expect(gateOpeningEventAction({ state: 1 })).toBe("play");
  expect(gateOpeningEventAction({ state: 2 })).toBeNull();
  expect(gateOpeningEventAction({ error: 150 })).toBe("finish");
  expect(gateOpeningEventAction(null)).toBeNull();
});

test("opening video's channel button leads to the full MTV page", () => {
  expect(MTV_CHANNEL_PATH).toBe("/music-stream");
  const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
  expect(app).toContain(`path="${MTV_CHANNEL_PATH}"`);
  const opening = readFileSync(new URL("../components/GateOpeningVideo.tsx", import.meta.url), "utf8");
  expect(opening).toContain("href={MTV_CHANNEL_PATH}");
});
test("rejects tool promos and commercials", () => {
    expect(isGateMusicVideo("Property Data Finder GPT - Free AI Tools on AiWebTools.Ai")).toBe(false);
    expect(isGateMusicVideo("BOOK WRITER GPT - AIWEBTOOLS.AI Commercial")).toBe(false);
    expect(isGateMusicVideo("Clone This Website 100% Free - Begin Your Ai Empire")).toBe(false);
});
test("keeps real music videos", () => {
    expect(isGateMusicVideo("Temple is Within — The Sugarlight Choir | Official AI Music Video")).toBe(true);
});
