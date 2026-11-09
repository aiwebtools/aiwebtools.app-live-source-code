export interface OfficialSocialAccount {
  platform: string;
  handle: string;
  url: string | null;
  followers: number | null;
  audienceSource?: string;
  checkedAt?: string;
  purpose?: string;
}

// Owner-confirmed identities. Unknown audience counts must not imply zero.
export const OFFICIAL_SOCIAL_ACCOUNTS: OfficialSocialAccount[] = [
  { platform: "YouTube", handle: "@AIWEBTOOLS-MTVai", url: "https://www.youtube.com/@AIWEBTOOLS-MTVai", followers: 341, audienceSource: "https://www.youtube.com/@AIWEBTOOLS-MTVai/videos", checkedAt: "2026-11-07" },
  { platform: "TikTok", handle: "@kennethbastian869", purpose: "Primary", url: "https://www.tiktok.com/@kennethbastian869", followers: 1, audienceSource: "https://www.tiktok.com/@kennethbastian869", checkedAt: "2026-11-07" },
  { platform: "TikTok", handle: "@aiwebtools", purpose: "Second account", url: "https://www.tiktok.com/@aiwebtools", followers: null },
  { platform: "Instagram", handle: "@ai.web.tools", purpose: "Music flow", url: "https://www.instagram.com/ai.web.tools", followers: 466, audienceSource: "https://www.instagram.com/ai.web.tools/", checkedAt: "2026-11-07" },
  { platform: "Instagram", handle: "@aiwebtools.ai", purpose: "Posting account", url: "https://www.instagram.com/aiwebtools.ai", followers: null },
  { platform: "Facebook", handle: "Truth Is Scary Page", url: "https://www.facebook.com/TruthIsScary", followers: null },
  { platform: "Facebook", handle: "AIWebTools News", url: "https://www.facebook.com/profile.php?id=100092436578624", followers: null },
  { platform: "Bluesky", handle: "@mtvailive.bsky.social", url: "https://bsky.app/profile/mtvailive.bsky.social", followers: 0, audienceSource: "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=mtvailive.bsky.social", checkedAt: "2026-11-07" },
  { platform: "Odysee", handle: "@MTVai", url: "https://odysee.com/@MTVai", followers: null },
];

export function orderSocialAccounts(accounts: OfficialSocialAccount[]) {
  return [...accounts].sort((a, b) => (b.followers ?? -1) - (a.followers ?? -1));
}