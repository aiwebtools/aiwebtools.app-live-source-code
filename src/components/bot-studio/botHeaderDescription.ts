import descriptions from "./botHeaderDescriptions.json";

type HeaderBot = { slug: string; display_name: string; tagline?: string | null; description?: string | null };
const publicDescriptions: Record<string, string> = descriptions;

/** Reject operational text even when an imported archive mislabeled it as a tagline. */
export function isPublicBotDescription(value: string): boolean {
  return value.trim().split(/\s+/).length >= 5 && value.length <= 160
    && !/conversation companion for|^Run .+ live,|\b(?:congratulations|hello|welcome)\b|\b\d{1,4}[-_/]\d{1,2}[-_/]\d{2,4}\b|\b[a-f0-9]{6,}\b|\.(?:pdf|docx?|txt|md)\b|\b(?:final amazing|works exc|latest version|newest version)\b|[\x00-\x1f]|…/i.test(value)
    && !/\b(?:act as|you (?:are|embody|must|will|should|speak|have)|your (?:role|task|instructions|purpose)|system prompt|operational|instructions?|directions?|directives?|never break|first person|always respond|begin every|follow directions|all abilities|no limitations|scan (?:your )?data|search your data|web search always|ask needed questions|before (?:any|all|every) response|when someone asks|at the start of each interaction|asks the user|objective\s*:|role\s*:|first\s*:)\b/i.test(value)
    && !/^(?:I AM\b|FIRST\b|MUST\b|ALWAYS\b|NEVER\b|ENSURE\b|SCAN\b|LATEST\b)/.test(value.trim());
}

export function getBotHeaderDescription(bot: HeaderBot): string {
  const family = bot.slug.replace(/^community-/, "").replace(/-v\d+$/, "");
  // Taglines in imported archives may contain setup text; they are never a header source.
  const candidates = [publicDescriptions[bot.slug], publicDescriptions[family], publicDescriptions[`community-${family}`], bot.description];
  const normalizedName = bot.display_name.replace(/\s*\(V\d+\)$/, "").replace(/\s+GPT$/i, "").replace(/\W/g, "").toLowerCase();
  const description = candidates.find((value): value is string => typeof value === "string" && isPublicBotDescription(value)
    && value.replace(/\s+GPT\b/i, "").replace(/\W/g, "").toLowerCase() !== normalizedName);
  return description?.replace(/\s+/g, " ").trim() || "Explore questions, develop ideas and work through practical next steps.";
}