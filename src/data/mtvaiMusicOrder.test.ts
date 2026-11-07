// @ts-ignore -- Bun executes regression tests.
import { expect, test } from "bun:test";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { buildMtvaiMusicOrder } from "./mtvaiMusicOrder";

test("all players lead with current channel order even when their source gallery is reversed", () => {
  const gallery = [...RECENT_MTVAI_UPLOADS].reverse();
  expect(buildMtvaiMusicOrder(gallery).slice(0, 5).map(v => v.id)).toEqual(["hxpEb4z_9Yo", "Qx2yZETl_o4", "URPozyEIN1Q", "mbKvl-4qMng", "SDGvO8bdgSI"]);
});

test("ordering retains every legacy identity and preserves first-occurrence media metadata", () => {
  const first = { id: "legacy-one", title: "Legacy cinematic recording", gradient: "original" };
  const gallery = [first, { id: "legacy-short", title: "Legacy Short", gradient: "second" }, { ...first, gradient: "duplicate" }, ...RECENT_MTVAI_UPLOADS.map(v => ({ ...v, gradient: "channel" }))];
  const ordered = buildMtvaiMusicOrder(gallery);
  expect(ordered.length).toBe(770);
  expect(ordered.find(v => v.id === first.id)).toBe(first);
  expect(ordered.some(v => v.id === "legacy-short")).toBe(true);
});

test("thirty verified missing recordings exist exactly once including older omitted music", () => {
  const ids = ["6Ks3GfR6jro", "uJA-wr1dqA4", "BBhxfWS2BQA", "XDS4qsb48h0", "kqMPocOgEZ8", "aPg82f-RCO8", "d3uaQz7oRAs", "tCnwnD_Rak0", "m2crGAhbs5g", "7qxEnBR2BwQ", "xoUdjZDgplw", "jVFTGCeuNSM", "3HCv5_QldrU", "rBQTUrvHcR8", "zdKfwsQwOLE", "NG7PbOalxUM", "HRGQu4C0nlw", "YylbTHRVx-o", "KhN8nZJHBUc", "hwr5ESYSCYg", "PWUOBfZfn3g", "vrNQq-7Ozmg", "vjNeVmMB3M4", "zQM0vDkuahY", "qXMkOyy0CZo", "zjQZLfNwMO0", "WEVmUrb5AFI", "Ns-Pd9wFCpo", "eD3MCwW_hLg", "DuyXt9mJ2uk"];
  for (const id of ids) expect(RECENT_MTVAI_UPLOADS.filter(v => v.id === id && v.kind === "music").length).toBe(1);
});