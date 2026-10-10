/**
 * Per-bot portrait avatars. Files live in src/assets/bot-avatars and are named
 * after the bot slug. Only URLs are bundled (no module code), so this stays tiny.
 */
const files = import.meta.glob("@/assets/bot-avatars/*.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const BY_SLUG: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const slug = path.split("/").pop()?.replace(/\.jpg$/, "");
  if (slug) BY_SLUG[slug] = url;
}

// Alternate slugs that should share a portrait with the main bot.
const ALIASES: Record<string, string> = {
  "jarvis-10-25": "jarvis-the-steward-of-humanity-gpt",
  "jarvis-ryans-jarvis": "jarvis-the-steward-of-humanity-gpt",
  "alan-watts-gpt": "alan-watts-gpt-page",
  "chef-sizzle": "chef-sizzle-culinary-assistant",
};

export const getBotPortrait = (slug: string): string | undefined => BY_SLUG[slug] ?? BY_SLUG[ALIASES[slug] ?? ""];
