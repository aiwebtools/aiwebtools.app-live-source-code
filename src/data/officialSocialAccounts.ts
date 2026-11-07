export interface OfficialSocialAccount {
  platform: string;
  handle: string;
  url: string | null;
  followers: number | null;
}

// Owner-confirmed identities. Unknown audience counts must not imply zero.
export const OFFICIAL_SOCIAL_ACCOUNTS: OfficialSocialAccount[] = [
  { platform: "YouTube", handle: "@AIWEBTOOLS-MTVai", url: "https://www.youtube.com/@AIWEBTOOLS-MTVai", followers: null },
  { platform: "TikTok", handle: "@kennethbastian869", url: "https://www.tiktok.com/@kennethbastian869", followers: null },
  { platform: "Instagram", handle: "@ai.web.tools", url: "https://www.instagram.com/ai.web.tools/", followers: null },
  { platform: "Facebook", handle: "MTVai Page", url: null, followers: null },
  { platform: "Bluesky", handle: "@mtvailive.bsky.social", url: "https://bsky.app/profile/mtvailive.bsky.social", followers: null },
  { platform: "Odysee", handle: "@MTVai", url: "https://odysee.com/@MTVai:1", followers: null },
  { platform: "Gab", handle: "@mtvai", url: "https://gab.com/mtvai", followers: null },
];

export function orderSocialAccounts(accounts: OfficialSocialAccount[]) {
  return [...accounts].sort((a, b) => (b.followers ?? -1) - (a.followers ?? -1));
}