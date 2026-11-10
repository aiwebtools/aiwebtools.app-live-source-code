import descriptions from "./botHeaderDescriptions.json";

type HeaderBot = { slug: string; display_name: string; tagline?: string | null; description?: string | null };
const publicDescriptions: Record<string, string> = descriptions;

/** Reject operational text even when an imported archive mislabeled it as a tagline. */
export function isPublicBotDescription(value: string): boolean {
  return Boolean(value.trim()) && !/\b(?:act as|you (?:are|embody|must|will|should|speak|have)|your (?:role|task|instructions|purpose)|system prompt|operational|instructions?|directions?|directives?|never break|first person|always respond|begin every|follow directions|all abilities|no limitations|scan (?:your )?data|search your data|web search always|ask needed questions|before (?:any|all|every) response|when someone asks|role\s*:|first\s*:)\b/i.test(value)
    && !/^(?:I AM\b|FIRST\b|MUST\b|ALWAYS\b|NEVER\b|ENSURE\b|SCAN\b|LATEST\b)/.test(value.trim());
}

export function getBotHeaderDescription(bot: HeaderBot): string {
  const family = bot.slug.replace(/^community-/, "").replace(/-v\d+$/, "");
  const candidates = [publicDescriptions[bot.slug], publicDescriptions[family], publicDescriptions[`community-${family}`], bot.description, bot.tagline];
  const description = candidates.find((value): value is string => typeof value === "string" && isPublicBotDescription(value));
  if (!description) return `A conversation companion for ${bot.display_name.replace(/\s*\(V\d+\)$/, "").replace(/\s+GPT$/i, "")}.`;
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  const sentence = clean.match(/^.{15,159}?[.!?](?:\s|$)/)?.[0]?.trim();
  return sentence || `${clean.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}