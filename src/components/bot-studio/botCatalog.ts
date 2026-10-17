import { communityBotName, communityBotImage } from "@/utils/communityBotIdentity";
import { supabase } from "@/integrations/supabase/client";

export interface StudioBot {
  slug: string;
  display_name: string;
  tool_title: string | null;
  tagline: string | null;
  greeting: string | null;
  starter_prompts: string[] | null;
  supports_images: boolean | null;
  model: string;
  image_url?: string | null;
  voice?: import("@/utils/gptVoiceProfiles").GptVoiceProfile["voice"] | null;
  custom?: { instructions: string; voice: import("@/utils/gptVoiceProfiles").GptVoiceProfile["voice"] };
}
let catalogPromise: Promise<StudioBot[]> | null = null;
export function refreshStudioBots() { catalogPromise = null; return loadStudioBots(); }
const PAGE = 1000;
async function fetchAllBots(): Promise<StudioBot[]> {
  const rows: StudioBot[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase.from("gpt_apps").select("slug, display_name, tool_title, tagline, greeting, starter_prompts, supports_images, model, image_url, voice").eq("is_active", true).order("display_name").order("slug").range(from, from + PAGE - 1);
    if (error) throw new Error("The assistant directory could not load. Please try again.");
    rows.push(...((data ?? []) as StudioBot[]));
    if (!data || data.length < PAGE) break;
  }
  return rows.filter((bot) => bot.slug && bot.display_name).map((bot) => ({ ...bot, display_name: communityBotName(bot.slug, bot.display_name), image_url: bot.image_url || communityBotImage(bot.slug) })).sort((a, b) => a.display_name.localeCompare(b.display_name) || a.slug.localeCompare(b.slug));
}
export function loadStudioBots(): Promise<StudioBot[]> {
  if (!catalogPromise) catalogPromise = fetchAllBots().catch((error) => { catalogPromise = null; throw error; });
  return catalogPromise;
}

/** Version family: official rooms and their archived community-…-vN versions share one key. */
export const botFamilyKey = (slug: string) => slug.replace(/^community-/, "").replace(/-v\d+$/, "");
export const botVersionNumber = (slug: string) => Number(slug.match(/-v(\d+)$/)?.[1] || 1);

// Exact budget IDs from the authenticated workspace catalog; default resolves server-side.
export const STUDIO_MODELS = [
  { id: "default", label: "Economy (cheapest)" },
  { id: "openai/gpt-6-luna", label: "GPT-6 Luna (cheapest)" },
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
  { id: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
];