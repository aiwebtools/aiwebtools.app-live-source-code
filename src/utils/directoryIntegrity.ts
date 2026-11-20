import type { Tool } from "@/types/tools";
import { mainCategories } from "@/utils/mainCategoryMapping";
import { getToolPricing } from "@/utils/pricingClassification";

export const directoryNameKey = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** One displayed identity per name; source files and alternative destinations stay untouched. */
export function uniqueDirectoryTools(tools: Tool[]): Tool[] {
  const winners = new Map<string, Tool>();
  const quality = (tool: Tool) => (tool.imageUrl ? 40 : 0) + (tool.videoUrl ? 25 : 0) +
    (tool.description.length > 240 ? 20 : tool.description.length > 120 ? 12 : 0) +
    ((tool.tags?.length || 0) >= 4 ? 10 : 0);
  for (const tool of tools) {
    const key = directoryNameKey(tool.title);
    const previous = winners.get(key);
    if (!previous) { winners.set(key, tool); continue; }
    const winner = quality(tool) > quality(previous) ? tool : previous;
    const other = winner === tool ? previous : tool;
    winners.set(key, {
      ...winner,
      imageUrl: winner.imageUrl || other.imageUrl,
      videoUrl: winner.videoUrl || other.videoUrl,
      directUrl: winner.directUrl || other.directUrl,
      tags: [...new Set([...(winner.tags || []), ...(other.tags || [])])],
    });
  }
  return [...winners.values()];
}

// Purpose metadata, not incidental words in prose ("smart", "upload photos",
// "starting", "design a workflow"), determines membership.
const categorySubjects: Record<string, RegExp> = {
  "AI AGENTS": /\b(agents?|autonomous|task automation|ai assistants?)\b/,
  "AI CHAT & ASSISTANTS": /\b(chatbots?|chat|conversational|assistants?|large language models?|llms?)\b/,
  "EDUCATION & LEARNING": /\b(education|educational|learning|tutor|tutoring|lessons?|courses?|teaching|study|academic|training)\b/,
  "CONTENT CREATION & WRITING": /\b(writing|writer|copywriting|text generation|content creation|grammar|blog|articles?|storytelling|screenplay)\b/,
  "IMAGE & DESIGN AI TOOLS": /\b(image|images|photo|photography|graphic|graphics|illustration|art|logo|design|background removal|color palette)\b/,
  "VIDEO & MULTIMEDIA": /\b(video|videos|multimedia|animation|filmmaking|motion capture)\b/,
  "AUDIO & VOICE TOOLS": /\b(audio|voice|music|speech|transcription|sound|podcast)\b/,
  "SOUND EFFECTS & SFX": /\b(sfx|sound effects|sound design|voice cloning|voice synthesis|text to speech|audio generation|music generation|music production)\b/,
  "3D & VISUALIZATION": /\b(3d|visualization|virtual reality|augmented reality|rendering)\b/,
  "BUSINESS OPERATIONS & PRODUCTIVITY": /\b(business|productivity|operations|workflow|project management|career|resume|email management)\b/,
  "DATA & ANALYTICS AI TOOLS": /\b(data|analytics|analytical|analysis|business intelligence|statistics|predictive)\b/,
  "MARKETING & SALES SOLUTIONS": /\b(marketing|sales|social media|advertising|seo|ecommerce|e commerce|lead generation)\b/,
  "COMMUNICATION & COLLABORATION TOOLS": /\b(communication|collaboration|team messaging|meetings|meeting transcription)\b/,
  "CREATIVE & ENTERTAINMENT": /\b(creative|entertainment|gaming|games?|trivia|interactive fiction)\b/,
  "GAMING & ENTERTAINMENT": /\b(gaming|games?|gameplay|npc|esports|virtual worlds|trivia)\b/,
  "HEALTH, WELLNESS & PERSONAL LIFESTYLE": /\b(health|healthcare|medical|wellness|fitness|nutrition|lifestyle|veterinary|veterinarian|pet care|mental health|personal development|relationship|culinary|pharmaceutical|cannabis)\b/,
  "WEB3 & BLOCKCHAIN": /\b(web3|blockchain|decentralized|crypto|nft)\b/,
  "HISTORICAL & TIME-BASED AI TOOLS": /\b(history|historical|time travel|time machine|historical figure)\b/,
  "INDUSTRY SPECIFIC AI TOOLS": /\b(industry|industrial|legal|medical|healthcare|agriculture|farming|construction|manufacturing|logistics|insurance|real estate|forensic|appraisal|valuation|professional services|specialized|niche)\b/,
  "AI GADGETS, ROBOTS & DEVICES": /\b(gadgets?|robots?|robotics|devices?|hardware|wearables?|smart glasses|iot)\b/,
  "SECURITY & PRIVACY": /\b(security|cybersecurity|privacy|encryption|threat detection|password|access control)\b/,
  "SPIRITUALITY & PHILOSOPHY": /\b(spirituality|spiritual|philosophy|philosophical|religious|religion|wisdom|meditation|sacred|mythology)\b/,
  "AI TOOL DATABASES": /\b(ai tool databases?|ai directories|ai tool directory|ai tool aggregators?|ai discovery|ai marketplaces?|ai tool lists?)\b/,
};

export function belongsToDirectoryCategory(tool: Tool, name: string): boolean {
  const key = directoryNameKey(name);
  const main = mainCategories.find(category => directoryNameKey(category.name) === key);
  if (key === "all ai tools") return true;
  if (key === "ai web tools originals" || key === "aiwebtools gpts collection" || key === "ai originals") {
    const url = (tool.directUrl || "").split("?")[0];
    return /aiwebtools|\.lovable\.app|chatgpt\.com\/g\/|gemini\.google\.com\/gem\//i.test(url) ||
      (tool.tags || []).some(tag => /^(custom gpt|gemini gem|aiwebtools)$/i.test(tag));
  }
  const category = directoryNameKey(tool.category || "");
  if (!main) return category === key;
  if (main.name === "PERPLEXITY BOTS") return category === "perplexity bots";
  if (main.name === "IMAGE & DESIGN AI TOOLS") {
    const imagePurpose = /^(?:ai )?(?:image generat(?:ion|or)|text to image|image creat(?:ion|or)|image edit(?:ing|or)|photo edit(?:ing|or)|photo enhancement|photo restoration|product photography|background remov(?:al|er)|image upscal(?:ing|er)|graphic design|logo (?:design|maker|generator|generation)|illustration|color palette(?: generator)?|digital art|art generat(?:ion|or)|ui ux design|web design|interior design|fashion design|game asset generator)$/;
    const purposeTags = (tool.tags || []).some(tag => imagePurpose.test(directoryNameKey(tag)));
    // Pure video animation, workflow/course design and image-as-input are not
    // image creation. Cross-category entries need an explicit image capability.
    if (/\b(game design|software|coding|appraisal|valuation|video|multimedia|voice|education|3d)\b/.test(category)) return purposeTags;
    return Boolean(categorySubjects[main.name].test(category) || purposeTags);
  }
  const explicit = [main.name, ...main.subcategories].some(label => directoryNameKey(label) === category);
  const subject = categorySubjects[main.name];
  if (main.name === "VIDEO & MULTIMEDIA" || main.name === "COMMUNICATION & COLLABORATION TOOLS") {
    // Legacy mappings include generic Entertainment/Creative/Content Creation;
    // those labels alone do not prove video or workplace communication capability.
    return Boolean(subject?.test(category) || (tool.tags || []).some(tag => subject?.test(directoryNameKey(tag))));
  }
  return explicit || Boolean(subject?.test(category) ||
    (tool.tags || []).some(tag => subject?.test(directoryNameKey(tag))));
}

export const directoryCategoryTools = (tools: Tool[], name: string): Tool[] =>
  uniqueDirectoryTools(tools).filter(tool => belongsToDirectoryCategory(tool, name));

const searchTextCache = new WeakMap<Tool, string>();
export function filterDirectoryTools(tools: Tool[], query = "", freeOnly = false): Tool[] {
  const words = directoryNameKey(query).split(" ").filter(Boolean);
  return tools.filter(tool => {
    if (freeOnly && getToolPricing(tool) !== "free") return false;
    if (!words.length) return true;
    let text = searchTextCache.get(tool);
    if (text === undefined) {
      text = directoryNameKey([tool.title, tool.category, tool.description, ...(tool.tags || [])].join(" "));
      searchTextCache.set(tool, text);
    }
    return words.every(word => text.includes(word));
  });
}

export const sortDirectoryAlphabetically = (tools: Tool[], direction: "asc" | "desc" = "asc"): Tool[] =>
  [...tools].sort((a, b) => (direction === "asc" ? 1 : -1) * directoryNameKey(a.title).localeCompare(directoryNameKey(b.title), "en", { sensitivity: "base", numeric: true }));