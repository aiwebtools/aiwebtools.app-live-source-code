import type { Tool } from "@/types/tools";
import { mainCategories } from "@/utils/mainCategoryMapping";
import { directoryCategoryTools, directoryNameKey, uniqueDirectoryTools } from "@/utils/directoryIntegrity";
import { orderCategoryTools } from "@/utils/category/categoryOrdering";
import type { CategoryCounts, MainCategoryCounts } from "./types";

export const getCategoriesWithCounts = (tools: Tool[]): CategoryCounts => {
  const counts: CategoryCounts = {};
  const labels = new Map<string, string>();
  uniqueDirectoryTools(tools).forEach(tool => {
    if (!tool.category) return;
    const key = directoryNameKey(tool.category);
    const label = labels.get(key) || tool.category;
    labels.set(key, label);
    counts[label] = (counts[label] || 0) + 1;
  });
  return counts;
};

export const getToolsByCategory = (tools: Tool[], name: string): Tool[] =>
  orderCategoryTools(uniqueDirectoryTools(tools).filter(tool => directoryNameKey(tool.category || "") === directoryNameKey(name)), name);

// Array identity, not length or persisted indices, prevents stale same-size catalogs.
const cache = new WeakMap<Tool[], Map<string, Tool[]>>();
export const getToolsByMainCategory = (tools: Tool[], name: string): Tool[] => {
  let categories = cache.get(tools);
  if (!categories) { categories = new Map(); cache.set(tools, categories); }
  let result = categories.get(name);
  if (!result) { result = orderCategoryTools(directoryCategoryTools(tools, name), name); categories.set(name, result); }
  return result;
};

const countCache = new WeakMap<Tool[], MainCategoryCounts>();
export const peekMainCategoryCounts = (tools: Tool[]): MainCategoryCounts | null => countCache.get(tools) || null;
export const getMainCategoriesWithCounts = (tools: Tool[]): MainCategoryCounts => {
  const ready = countCache.get(tools);
  if (ready) return ready;
  const counts = Object.fromEntries(mainCategories.map(category => [category.name, getToolsByMainCategory(tools, category.name).length]));
  countCache.set(tools, counts);
  return counts;
};
export const getMainCategoriesWithCountsAsync = async (tools: Tool[]): Promise<MainCategoryCounts> => {
  const ready = countCache.get(tools);
  if (ready) return ready;
  const counts: MainCategoryCounts = {};
  for (const category of mainCategories) {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
    counts[category.name] = getToolsByMainCategory(tools, category.name).length;
  }
  countCache.set(tools, counts);
  return counts;
};
