import { getBotCategory } from "./botSubjects";
import { botFamilyKey, botVersionNumber, type StudioBot } from "./botCatalog";

const byName = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" });

/** A bot plus every archived version of its operational instructions, V1 first. */
export type BotFamily = { key: string; base: StudioBot; versions: StudioBot[] };

export function groupBotFamilies(bots: StudioBot[]): BotFamily[] {
  const map = new Map<string, StudioBot[]>();
  for (const bot of bots) {
    const key = botFamilyKey(bot.slug);
    map.set(key, [...(map.get(key) || []), bot]);
  }
  return [...map.entries()].map(([key, list]) => {
    const versions = [...list].sort((a, b) => botVersionNumber(a.slug) - botVersionNumber(b.slug));
    return { key, base: versions[0], versions };
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
