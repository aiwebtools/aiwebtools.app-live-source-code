// @ts-ignore -- Bun executes regression tests.
import { expect, test } from "bun:test";
import { audiobookEdition, findMtvaiAudiobooks, MTVAI_AUDIOBOOKS, VERIFIED_MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";

test("audiobook collection preserves every previously cataloged audiobook", () => {
  for (const book of RECENT_MTVAI_UPLOADS.filter(v => v.kind === "audiobook")) {
    expect(MTVAI_AUDIOBOOKS.some(v => v.id === book.id)).toBe(true);
  }
  expect(new Set(MTVAI_AUDIOBOOKS.map(v => v.id)).size).toBe(MTVAI_AUDIOBOOKS.length);
});

test("verified audiobook uploads remain in newest-first channel order", () => {
  expect(VERIFIED_MTVAI_AUDIOBOOKS.map(v => v.id)).toEqual(["-nrZhBBNChE", "FMAstSXaVVM", "7aFexKjrv1k", "nKi7ZKhfGP4", "mxFKRIWF2Ok", "oqMaMFYvqeY", "iPGIwpAnWQo", "Uay4-I0PA2I", "gsf_Ucwt1Zw", "IKrEvLSewAQ", "EYnCtw9CsxQ", "k1aYXaaAkho"]);
});

test("search locates audiobooks with multiple words regardless of punctuation", () => {
  expect(findMtvaiAudiobooks("carl sagan").map(v => v.id)).toEqual(["5W5pFFUqvSk", "1paVZJmXL3w", "mxFKRIWF2Ok"]);
  expect(findMtvaiAudiobooks("marie curie").map(v => v.id)).toEqual(["P0tmDN4AEfU", "1iwXFUrn1CM", "FMAstSXaVVM"]);
  expect(findMtvaiAudiobooks("not a real book")).toHaveLength(0);
});

test("audiobook openings are never labeled full audiobooks", () => {
  expect(audiobookEdition("Chasing Radiance — Audiobook Opening | Full-Cast Audiobook")).toBe("Opening");
  expect(audiobookEdition("Galactic Gambit — Full Audiobook")).toBe("Full audiobook");
});