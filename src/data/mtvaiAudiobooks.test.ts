// @ts-ignore -- Bun executes regression tests.
import { expect, test } from "bun:test";
import { audiobookEdition, audiobookPart, orderMtvaiAudiobooks, nextMtvaiAudiobookPart, findMtvaiAudiobooks, MTVAI_AUDIOBOOKS, VERIFIED_MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { REMOVED_MTVAI_UPLOAD_IDS } from "./mtvaiRemovedUploads";

test("audiobook collection preserves every previously cataloged audiobook", () => {
  for (const book of RECENT_MTVAI_UPLOADS.filter(v => v.kind === "audiobook" && !REMOVED_MTVAI_UPLOAD_IDS.has(v.id))) {
    expect(MTVAI_AUDIOBOOKS.some(v => v.id === book.id)).toBe(true);
  }
  expect(new Set(MTVAI_AUDIOBOOKS.map(v => v.id)).size).toBe(MTVAI_AUDIOBOOKS.length);
});

test("verified audiobook uploads remain in newest-first channel order", () => {
  expect(VERIFIED_MTVAI_AUDIOBOOKS.map(v => v.id)).toEqual(["-nrZhBBNChE", "FMAstSXaVVM", "7aFexKjrv1k", "nKi7ZKhfGP4", "mxFKRIWF2Ok", "oqMaMFYvqeY", "iPGIwpAnWQo", "Uay4-I0PA2I", "gsf_Ucwt1Zw", "IKrEvLSewAQ", "EYnCtw9CsxQ", "k1aYXaaAkho"]);
});

test("search locates audiobooks with multiple words regardless of punctuation", () => {
  expect(findMtvaiAudiobooks("carl sagan").map(v => v.id)).toEqual(["ioW4CHFb56w", "uYvRDK4v_rI"]);
  expect(findMtvaiAudiobooks("marie curie").map(v => v.id)).toEqual(["1iwXFUrn1CM", "P0tmDN4AEfU", "FMAstSXaVVM"]);
  expect(findMtvaiAudiobooks("not a real book")).toHaveLength(0);
});

test("audiobook openings are never labeled full audiobooks", () => {
  expect(audiobookEdition("Chasing Radiance — Audiobook Opening | Full-Cast Audiobook")).toBe("Opening");
  expect(audiobookEdition("Galactic Gambit — Full Audiobook")).toBe("Full audiobook");
});

test("all nine multipart audiobooks stay adjacent in Part 1 then Part 2 order", () => {
  const pairs = [["7GarV2FaHlE", "nUDuAnNzFbg"], ["DWnha_4FLzc", "FWaC-SSg2E0"], ["NeepYyQxSwE", "uPXm6E38hjA"], ["UYvbYIIqwEQ", "PAYxkZc_YN0"], ["ioW4CHFb56w", "uYvRDK4v_rI"], ["BhzmstJM7Ew", "dqxmFS051-s"], ["1iwXFUrn1CM", "P0tmDN4AEfU"], ["clX7Uz_r7J4", "fxS7aplKVsU"], ["_v4AWpyBqQg", "b1VzjzJJWG8"]];
  for (const [first, second] of pairs) {
    const index = MTVAI_AUDIOBOOKS.findIndex(book => book.id === first);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(MTVAI_AUDIOBOOKS[index + 1]?.id).toBe(second);
    expect(nextMtvaiAudiobookPart(first)?.id).toBe(second);
    expect(nextMtvaiAudiobookPart(second)).toBeNull();
  }
});

test("numeric, written and Roman parts sort numerically without mixing works or openings", () => {
  const books = [{ title: "A — Part 10" }, { title: "B — Part Two" }, { title: "A — Full Audiobook, Part 2" }, { title: "A — Part I" }, { title: "B — Part One" }, { title: "A — Audiobook Opening" }];
  expect(orderMtvaiAudiobooks(books).map(book => book.title)).toEqual(["A — Part I", "A — Full Audiobook, Part 2", "A — Part 10", "B — Part One", "B — Part Two", "A — Audiobook Opening"]);
  expect(audiobookPart("Time Machine — Installment 1 (Chapters 1–10)")).toBeNull();
  expect(nextMtvaiAudiobookPart("tuBeEDdm2fc")).toBeNull();
});