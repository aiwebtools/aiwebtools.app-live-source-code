import { directoryTools as allTools } from "@/data/toolsData";
import { getMainCategoriesWithCountsAsync, peekMainCategoryCounts, getToolsByMainCategory } from "./toolFiltering";
let ready = false;
let pending: Promise<void> | null = null;
export async function initializeCategoryCache(): Promise<void> {
  if (ready) return;
  if (!pending) pending = getMainCategoriesWithCountsAsync(allTools).then(() => { ready = true; }).finally(() => { pending = null; });
  return pending;
}
export function getCachedToolsByMainCategory(name: string) { return ready || name === "ALL AI TOOLS" ? getToolsByMainCategory(allTools, name) : null; }
export function getCachedCategoryCounts() { return peekMainCategoryCounts(allTools); }
export function isCategoryCacheReady() { return ready; }
export async function prefetchCategory(name: string): Promise<void> { getToolsByMainCategory(allTools, name); }
