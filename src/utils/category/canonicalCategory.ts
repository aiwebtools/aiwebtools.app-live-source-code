import { Tool } from "@/types/tools";

/**
 * Canonical display casing for categories.
 *
 * A handful of legacy batches were authored in ALL CAPS, so the exact same
 * category showed up twice with different casing on cards and filter chips.
 * Category membership is already matched case-insensitively — this only
 * normalises the LABEL so nothing looks out of place.
 *
 * Nothing is renamed semantically and no tool changes category.
 */
const CANONICAL_LABELS: Record<string, string> = {
  "ai chat & assistants": "AI Chat & Assistants",
  "ai chat assistants": "AI Chat & Assistants",
  "development & coding": "Development & Coding",
  "video & multimedia": "Video & Multimedia",
  "video & animation": "Video & Multimedia",
  "video generation": "Video & Multimedia",
  "video & multimedia tools": "Video & Multimedia",
  "audio & music": "Audio & Music",
  "audio & music tools": "Audio & Music",
  "3d & visualization": "3D & Visualization",
  "marketing & sales solutions": "Marketing & Sales Solutions",
};

export const canonicalCategoryLabel = (category?: string): string | undefined => {
  if (!category) return category;
  return CANONICAL_LABELS[category.toLowerCase().trim()] ?? category;
};

export const normalizeToolCategories = (tools: Tool[]): Tool[] =>
  tools.map((tool) => {
    const canonical = canonicalCategoryLabel(tool.category);
    return canonical && canonical !== tool.category ? { ...tool, category: canonical } : tool;
  });
