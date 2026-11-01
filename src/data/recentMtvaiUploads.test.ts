// @ts-ignore -- Bun executes these regression tests.
import { expect, test } from "bun:test";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";

test("recent MTV AI additions are unique uploads inside the requested two-week window", () => {
  expect(RECENT_MTVAI_UPLOADS).toHaveLength(26);
  expect(new Set(RECENT_MTVAI_UPLOADS.map(v => v.id)).size).toBe(26);
  for (const video of RECENT_MTVAI_UPLOADS) {
    expect(Date.parse(video.publishedAt)).toBeGreaterThanOrEqual(Date.parse("2026-10-18T00:00:00Z"));
    expect(Date.parse(video.publishedAt)).toBeLessThan(Date.parse("2026-11-02T00:00:00Z"));
    expect(video.url).toBe(`https://www.youtube.com/watch?v=${video.id}`);
  }
  const ids: string[] = RECENT_MTVAI_UPLOADS.map(v => v.id);
  expect(ids.includes("DuyXt9mJ2uk")).toBe(false);
  expect(ids.includes("BBhxfWS2BQA")).toBe(false);
});

test("Destiny and recent dated Shorts retain real IDs and recorded format", () => {
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "a4BmHSG2tGk")?.durationSeconds).toBe(394);
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "a4BmHSG2tGk")?.format).toBe("landscape");
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "uZIg-pUiE-k")?.kind).toBe("short");
});