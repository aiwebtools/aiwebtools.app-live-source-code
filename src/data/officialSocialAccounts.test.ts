// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { OFFICIAL_SOCIAL_ACCOUNTS, orderSocialAccounts } from "./officialSocialAccounts";

test("exactly the eight owner-supplied URLs are retained without other socials or tracking", () => {
  expect(OFFICIAL_SOCIAL_ACCOUNTS.map(a => a.url).sort()).toEqual([
    "https://www.youtube.com/@AIWEBTOOLS-MTVai",
    "https://www.tiktok.com/@kennethbastian869",
    "https://www.tiktok.com/@aiwebtools",
    "https://www.instagram.com/ai.web.tools",
    "https://www.instagram.com/aiwebtools.ai",
    "https://bsky.app/profile/mtvailive.bsky.social",
    "https://odysee.com/@MTVai",
    "https://www.facebook.com/TruthIsScary",
  ].sort());
});

test("verified follower counts sort highest first without treating unknown as zero", () => {
  const accounts = OFFICIAL_SOCIAL_ACCOUNTS.slice(0, 3).map((a, i) => ({ ...a, followers: [10, null, 500][i] }));
  expect(orderSocialAccounts(accounts).map(a => a.followers)).toEqual([500, 10, null]);
});