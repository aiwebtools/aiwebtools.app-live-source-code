// @ts-ignore -- Bun executes these regression tests.
import { expect, test } from "bun:test";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";

test("recent MTV AI additions are unique uploads inside the requested two-week window", () => {
  expect(RECENT_MTVAI_UPLOADS).toHaveLength(88);
  expect(new Set(RECENT_MTVAI_UPLOADS.map(v => v.id)).size).toBe(88);
  for (const video of RECENT_MTVAI_UPLOADS) {
    if (video.publishedAt !== null) {
      expect(Date.parse(video.publishedAt)).toBeGreaterThanOrEqual(Date.parse("2026-10-18T00:00:00Z"));
      expect(Date.parse(video.publishedAt)).toBeLessThan(Date.parse("2026-11-02T00:00:00Z"));
    }
    expect(video.url).toBe(`https://www.youtube.com/watch?v=${video.id}`);
  }
  const ids: string[] = RECENT_MTVAI_UPLOADS.map(v => v.id);
  expect(ids.includes("DuyXt9mJ2uk")).toBe(false);
  expect(ids.includes("BBhxfWS2BQA")).toBe(false);
});

test("new public channel Shorts are included without invented timing metadata", () => {
  for (const id of ["BhI5E2-cMT4", "G5cvt2PrS14"]) {
    const video = RECENT_MTVAI_UPLOADS.find(v => v.id === id);
    expect(video?.kind).toBe("short");
    expect(video?.format).toBe("shorts");
    expect(video?.publishedAt).toBeNull();
    expect(video?.durationSeconds).toBeNull();
  }
});

test("Destiny and recent dated Shorts retain real IDs and recorded format", () => {
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "a4BmHSG2tGk")?.durationSeconds).toBe(394);
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "a4BmHSG2tGk")?.format).toBe("landscape");
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "uZIg-pUiE-k")?.kind).toBe("short");
});

test("nine new full-length channel uploads retain separate real identities", () => {
  for (const id of ["r6k11I_mCwU", "LJhwxXlfggw", "BoUVP0amhvQ", "jD2lLLZZZC0", "gYeAvU8ePy4", "ma4TLC6Biyo", "9TaRBLnJD8U", "q1FKFka0M4s", "lo0kUVtY9L4"]) {
    expect(RECENT_MTVAI_UPLOADS.find(v => v.id === id)?.kind).toBe("music");
  }
});

test("November 1 evening batch preserves all thirty distinct channel uploads", () => {
  const expected = ["BwFj_TkhhHo", "ciGy96PWTS4", "ifanfDzNsuM", "MJw2z3_29cU", "VCLpuZal2bU", "Ip8u0rbRi1w", "HiRrNrnHr3U", "cpL0w1eR0rk", "DWQY2xbUk7c", "XxvgNqV6beo", "eo_sf4LVVlM", "SD8CKvNheQQ", "1okv1c-fl9E", "UjF3n6JU3K0", "pYA_PiUTLos", "lDn1Kdikj0A", "Zfvzj5HYMEU", "gXXximwynw4", "R5l-_Uz3c24", "nm-BMEuaPSM", "93IMGeSZqJg", "KFUmlbKzWwc", "frezq0mBqYw", "vFd9HB29wjA", "M4VrJq-Bdw4", "em8jxPLntqs", "zPb6V35ip0U", "3fapR9cVCXo", "DjzlJUM3xwI", "MMTXqyTeaaU"];
  for (const id of expected) {
    const video = RECENT_MTVAI_UPLOADS.find(v => v.id === id);
    expect(video?.url).toBe(`https://www.youtube.com/watch?v=${id}`);
    expect(video?.durationSeconds).toBeGreaterThan(0);
  }
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "BwFj_TkhhHo")?.durationSeconds).toBe(444);
  expect(RECENT_MTVAI_UPLOADS.find(v => v.id === "ciGy96PWTS4")?.durationSeconds).toBe(402);
});
