import { Tool } from "@/types/tools";
import { isAIWebToolsGPT } from "@/utils/aiWebToolsPrioritization";

/**
 * Deterministic category ordering.
 *
 * Goals (no randomness — a random sort re-shuffles on every "load more" and
 * makes already-rendered cards appear to repeat mid-scroll):
 *  1. Strong, well-documented tools surface near the top.
 *  2. One AIWebTools custom GPT is featured every 6th slot when the category
 *     actually contains matching GPTs.
 *  3. Stable order for a given category name + tool list, so pagination only
 *     ever appends new, unique cards.
 */

// Small deterministic hash so ordering feels varied per category yet is stable.
const hash = (value: string): number => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

const qualityScore = (tool: Tool): number => {
  let score = 0;
  if (typeof tool.imageUrl === "string" && tool.imageUrl.trim()) score += 40;
  if (typeof tool.videoUrl === "string" && tool.videoUrl.trim()) score += 25;
  const description = tool.description || "";
  if (description.length > 240) score += 20;
  else if (description.length > 120) score += 12;
  if (Array.isArray(tool.tags) && tool.tags.length >= 4) score += 10;
  return score;
};

const DIRECTORY_TITLE_HINTS = [
  "directory", "directories", "tool database", "tools database", "ai tools list",
  "toolify", "futurepedia", "there's an ai", "theres an ai", "futuretools",
  "aitools", "ai tool hunt", "insidr", "topai", "supertools", "aixploria",
  "product hunt", "ai finder", "tool finder", "ai marketplace", "ai hub list",
];

const isCompetingDirectory = (tool: Tool, categoryKey: string): boolean => {
  if (categoryKey === "AI TOOL DATABASES") return false;
  // Never demote our own properties.
  if (isAIWebToolsGPT(tool)) return false;
  const url = (tool.directUrl || "").toLowerCase();
  if (url.includes("aiwebtools")) return false;
  const category = (tool.category || "").toLowerCase();
  const tags = Array.isArray(tool.tags) ? tool.tags.join(" ").toLowerCase() : "";
  const title = (tool.title || "").toLowerCase();
  if (category.includes("tool database") || category.includes("ai director")) return true;
  if (tags.includes("ai tool directory") || tags.includes("tool aggregator") ||
      tags.includes("ai directory") || tags.includes("tool database")) return true;
  return DIRECTORY_TITLE_HINTS.some((hint) => title.includes(hint));
};

const normalizeTitle = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const removeRepeatedTitles = (tools: Tool[]): Tool[] => {
  const winners = new Map<string, Tool>();
  for (const tool of tools) {
    const key = normalizeTitle(tool.title);
    const current = winners.get(key);
    if (!current || qualityScore(tool) > qualityScore(current)) winners.set(key, tool);
  }
  return Array.from(winners.values());
};

export const GPT_FEATURE_INTERVAL = 6;

/** Number of AIWebTools custom GPTs that always lead a category page. */
export const GPT_LEAD_COUNT = 6;

/**
 * Remove exact repeats (same normalized title) keeping the most complete
 * record. Exported so alternative sort modes stay duplicate-free too.
 */
export const dedupeTools = (tools: Tool[]): Tool[] => removeRepeatedTitles(tools);

export const orderCategoryTools = (tools: Tool[], categoryKey: string): Tool[] => {
  const uniqueTools = removeRepeatedTitles(tools);
  if (uniqueTools.length < 2) return uniqueTools;

  // Category-specific variety drives position; metadata completeness is only a
  // tiebreaker. Competing directories stay discoverable but never monopolize
  // the prime slots outside their own category.
  const rank = (tool: Tool) =>
    hash(`${categoryKey}::${tool.title}`) * 100 + qualityScore(tool) * 0.15 -
    (isCompetingDirectory(tool, categoryKey) ? 500 : 0);

  // Calculate once per record, not twice on every sorting comparison.
  const ranks = new Map(uniqueTools.map((tool) => [tool, rank(tool)]));
  const compareRank = (a: Tool, b: Tool) => (ranks.get(b) ?? 0) - (ranks.get(a) ?? 0);

  const gpts: Tool[] = [];
  const rest: Tool[] = [];
  for (const tool of uniqueTools) {
    (isAIWebToolsGPT(tool) ? gpts : rest).push(tool);
  }

  gpts.sort(compareRank);
  rest.sort(compareRank);

  if (!gpts.length) return rest;

  // Our own custom GPTs lead every category, then one is woven into every 6th
  // slot. Competing directories can never occupy the prime positions.
  const ordered: Tool[] = [];
  let gptIndex = 0;
  let restIndex = 0;

  while (gptIndex < Math.min(GPT_LEAD_COUNT, gpts.length)) {
    ordered.push(gpts[gptIndex++]);
  }

  while (restIndex < rest.length) {
    const isFeatureSlot =
      (ordered.length + 1) % GPT_FEATURE_INTERVAL === 0 && gptIndex < gpts.length;
    ordered.push(isFeatureSlot ? gpts[gptIndex++] : rest[restIndex++]);
  }
  while (gptIndex < gpts.length) ordered.push(gpts[gptIndex++]);

  return ordered;
};
