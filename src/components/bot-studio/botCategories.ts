import { getGptAppTheme } from "@/utils/gptAppTheme";
import { botFamilyKey, botVersionNumber, type StudioBot } from "./botCatalog";

const LABELS: Record<string, string> = {
  "time-machine": "History & Time Travel", clinic: "Health & Wellness", chambers: "Legal & Government",
  ledger: "Business & Finance", observatory: "Science & Research", oracle: "Spiritual & Philosophy",
  blueprint: "Engineering & Planning", studio: "Creative & Design", soundstage: "Film, Music & Media",
  academy: "Education & Learning", field: "Farming, Food & Outdoors", forge: "Trades & Home",
  sentinel: "Security & Safety", matrix: "General & Productivity",
};
const ORDER = Object.values(LABELS);

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
    const label = LABELS[getGptAppTheme(family.base.slug, family.base.display_name).key] || "General & Productivity";
    groups.set(label, [...(groups.get(label) || []), family]);
  }
  return [...groups.entries()].sort(([a], [b]) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
}
