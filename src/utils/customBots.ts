import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";
import type { StudioBot } from "@/components/bot-studio/botCatalog";

const KEY = "aiwt.customBots.v1";

export interface CustomBot {
  slug: string;
  display_name: string;
  tagline: string;
  instructions: string;
  voice: GptVoiceProfile["voice"];
  created: number;
}

export const isCustomSlug = (slug: string) => slug.startsWith("custom-");

export function readCustomBots(): CustomBot[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((b) => b && isCustomSlug(b.slug) && b.display_name && b.instructions) : [];
  } catch {
    return [];
  }
}

export function saveCustomBot(input: Omit<CustomBot, "slug" | "created"> & { slug?: string }): CustomBot {
  const base = input.display_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "bot";
  const bot: CustomBot = { ...input, slug: input.slug || `custom-${base}-${crypto.randomUUID().slice(0, 6)}`, created: Date.now() };
  const rest = readCustomBots().filter((b) => b.slug !== bot.slug);
  localStorage.setItem(KEY, JSON.stringify([bot, ...rest]));
  return bot;
}

export function deleteCustomBot(slug: string) {
  localStorage.setItem(KEY, JSON.stringify(readCustomBots().filter((b) => b.slug !== slug)));
}

export function customToStudioBot(bot: CustomBot): StudioBot {
  return {
    slug: bot.slug,
    display_name: bot.display_name,
    tool_title: null,
    tagline: bot.tagline,
    greeting: `Hello, I am ${bot.display_name}. ${bot.tagline ? `${bot.tagline}. ` : ""}What shall we create together?`,
    starter_prompts: null,
    supports_images: true,
    model: "google/gemini-3-flash-preview",
    custom: { instructions: bot.instructions, voice: bot.voice },
  };
}
