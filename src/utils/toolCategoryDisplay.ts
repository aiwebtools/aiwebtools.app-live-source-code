/**
 * Display-only category label for individual tool pages.
 *
 * The catalog category (filtering, category pages, interleaving, keywords and
 * keywords) is never changed here — this decides the label on the tool's own
 * page and its matching first-paint/social/structured metadata.
 *
 * Muse's page presents its category as "AI Agents" instead of the consolidated
 * catalog category it inherits.
 */
export interface CategoryDisplaySource {
  title?: string;
  category?: string;
  directUrl?: string;
}

export const getDisplayedCategory = (
  tool?: CategoryDisplaySource | null
): string => {
  if (tool?.title === "Muse" && (tool.directUrl || "").includes("muse.ai")) {
    return "AI Agents";
  }
  return tool?.category || "";
};
