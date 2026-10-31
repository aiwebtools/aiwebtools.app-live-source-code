import { expect, test } from "bun:test";
import { MUSE_CODE, MUSE_JOIN_URL } from "./MuseTokensPopup";

test("Muse referral preserves Master's exact code", () => {
  expect(MUSE_CODE).toBe("PI0DS6");
});

test("Muse joins the supplied destination with affiliate tracking", () => {
  const url = new URL(MUSE_JOIN_URL);
  expect(url.origin + url.pathname).toBe("https://muse.ai/join");
  expect(url.searchParams.get("via")).toBe("aiwebtools");
});