// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { OFFICIAL_SOCIAL_ACCOUNTS, orderSocialAccounts } from "./officialSocialAccounts";

test("only the seven owner-held social identities are listed, never X", () => {
  expect(OFFICIAL_SOCIAL_ACCOUNTS.map(a => a.platform)).toEqual(["YouTube", "TikTok", "Instagram", "Facebook", "Bluesky", "Odysee", "Gab"]);
  expect(OFFICIAL_SOCIAL_ACCOUNTS.find(a => a.platform === "Bluesky")?.handle).toBe("@mtvailive.bsky.social");
  expect(OFFICIAL_SOCIAL_ACCOUNTS.find(a => a.platform === "Facebook")?.url).toBeNull();
});

test("verified follower counts sort highest first without treating unknown as zero", () => {
  const accounts = OFFICIAL_SOCIAL_ACCOUNTS.slice(0, 3).map((a, i) => ({ ...a, followers: [10, null, 500][i] }));
  expect(orderSocialAccounts(accounts).map(a => a.followers)).toEqual([500, 10, null]);
});