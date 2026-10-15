import { getGptAppTheme } from "@/utils/gptAppTheme";
import type { StudioBot } from "./botCatalog";

const LABELS: Record<string, string> = {
  "time-machine": "History & Time Travel", clinic: "Health & Wellness", chambers: "Legal & Government",
  ledger: "Business & Finance", observatory: "Science & Research", oracle: "Spiritual & Philosophy",
  blueprint: "Engineering & Planning", studio: "Creative & Design", soundstage: "Film, Music & Media",
  academy: "Education & Learning", field: "Farming, Food & Outdoors", forge: "Trades & Home",
  sentinel: "Security & Safety", matrix: "General & Productivity",
};
const ORDER = Object.values(LABELS);

/** Groups sidebar bots by subject (shared room theme); community bots get their own group. */
export function groupBotsByCategory(bots: StudioBot[]): [string, StudioBot[]][] {
  const groups = new Map<string, StudioBot[]>();
  for (const bot of bots) {
    const label = bot.slug.startsWith("community-") ? "Community Creations" : LABELS[getGptAppTheme(bot.slug, bot.display_name).key] || "General & Productivity";
    groups.set(label, [...(groups.get(label) || []), bot]);
  }
  return [...groups.entries()].sort(([a], [b]) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
}
