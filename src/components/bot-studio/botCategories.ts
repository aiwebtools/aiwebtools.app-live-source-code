import { getBotCategory } from "./botSubjects";
import type { StudioBot } from "./botCatalog";

// Family arithmetic must remain independent of browser-only catalog/media loading.
const botFamilyKey = (slug: string) => slug.replace(/^community-/, "").replace(/-v\d+$/, "");
// These two preserved archive rooms are the same named tutor, not two sidebar entries.
const duplicateFamilies: Record<string, string> = {
  "community-free-college-lessons-or-any-subject-education-open-source-pr-2": "free-college-lessons-or-any-subject-education-open-source-pr",
  'community-movie-script-writer-gpt-original-version-1': 'movie-script-writer-gpt',
  'community-movie-script-maker-v1-og-version-gpt': 'movie-script-writer-gpt',
  'community-movie-writer-gpt': 'movie-script-writer-gpt',
  'community-movie-script-helper-gpt': 'movie-script-writer-gpt',
  'screenplay-writer': 'movie-script-writer-gpt',
  'screenplay-writer-gpt-page': 'movie-script-writer-gpt',
  'community-screenplay-writer-gpt-page-v2': 'movie-script-writer-gpt',
  'community-playwright-gpt': 'playwriter-gpt',
};
const botVersionNumber = (slug: string) => Number(slug.match(/-v(\d+)$/)?.[1] || 1);

const byName = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" });

/** A bot plus every archived version of its operational instructions, V1 first. */
export type BotFamily = { key: string; base: StudioBot; versions: StudioBot[]; featured?: boolean };
export const botEditionLabel = (bot: StudioBot, index: number) => {
  if (bot.slug === 'movie-script-writer-gpt') return 'Featured';
  if (/original-version-1/.test(bot.slug)) return 'Original V1';
  if (/og-version/.test(bot.slug)) return 'Maker · Original';
  if (/screenplay/.test(bot.slug)) return `Screenplay · ${bot.slug.endsWith('-v2') ? 'V2' : 'edition'}`;
  if (/helper/.test(bot.slug)) return 'Helper edition';
  if (/movie-writer/.test(bot.slug)) return 'Movie Writer edition';
  if (/playwright/.test(bot.slug)) return 'Playwright edition';
  return `V${botVersionNumber(bot.slug) || index + 1}`;
};

/** Count rooms, including versions, just like the shared studio catalog total. */
export const countCategoryAssistants = (families: BotFamily[]): number =>
  families.reduce((total, family) => total + family.versions.length, 0);

export function groupBotFamilies(bots: StudioBot[]): BotFamily[] {
  const map = new Map<string, StudioBot[]>();
  for (const bot of bots) {
    const key = duplicateFamilies[bot.slug] || botFamilyKey(bot.slug);
    map.set(key, [...(map.get(key) || []), bot]);
  }
  return [...map.entries()].map(([key, list]) => {
    const versions = [...list].sort((a, b) => Number(b.slug === key) - Number(a.slug === key) || botVersionNumber(a.slug) - botVersionNumber(b.slug));
    return { key, base: versions[0], versions, featured: key === 'movie-script-writer-gpt' };
  });
}

/** Groups sidebar bot families by subject (shared room theme); versions stay with their base bot. */
export function groupBotsByCategory(bots: StudioBot[]): [string, BotFamily[]][] {
  const groups = new Map<string, BotFamily[]>();
  for (const family of groupBotFamilies(bots)) {
    const label = getBotCategory(family.base);
    groups.set(label, [...(groups.get(label) || []), family]);
  }
  return [...groups.entries()]
    .map(([label, families]): [string, BotFamily[]] => [label, [...families].sort((a, b) => byName(a.base.display_name, b.base.display_name))])
    .sort(([a], [b]) => byName(a, b));
}
