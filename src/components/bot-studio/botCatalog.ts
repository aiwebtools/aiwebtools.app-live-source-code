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
  subject?: string | null;
  custom?: { instructions: string; voice: import("@/utils/gptVoiceProfiles").GptVoiceProfile["voice"] };
}
let catalogPromise: Promise<StudioBot[]> | null = null;
export function refreshStudioBots() { catalogPromise = null; return loadStudioBots(); }
const PAGE = 1000;
async function fetchAllBots(): Promise<StudioBot[]> {
  const rows: StudioBot[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error, status } = await supabase.from("gpt_apps").select("slug, display_name, tool_title, tagline, greeting, starter_prompts, supports_images, model, image_url, voice, subject").eq("is_active", true).order("display_name").order("slug").range(from, from + PAGE - 1);
    if (error) throw new Error(status === 402
      ? "Bot service is temporarily unavailable because its hosting quota has been reached. Your search is not the problem."
      : "The assistant directory could not load. Please try again.");
    rows.push(...((data ?? []) as StudioBot[]));
    if (!data || data.length < PAGE) break;
  }
  return rows.filter((bot) => bot.slug && bot.display_name).map((bot) => ({ ...bot, display_name: communityBotName(bot.slug, bot.display_name), image_url: bot.image_url || communityBotImage(bot.slug) })).sort((a, b) => a.display_name.localeCompare(b.display_name) || a.slug.localeCompare(b.slug));
}
/** Bundled snapshot of the in-house bots, loaded only when the live directory is unreachable. */
async function loadFallbackBots(): Promise<StudioBot[]> {
  const mod = await import("@/data/generated/botCatalogFallback.json");
  const rows = (mod.default ?? mod) as unknown as StudioBot[];
  return rows.map((bot) => ({ ...bot, image_url: communityBotImage(bot.slug) })).sort((a, b) => a.display_name.localeCompare(b.display_name) || a.slug.localeCompare(b.slug));
}
export function loadStudioBots(): Promise<StudioBot[]> {
  if (!catalogPromise) {
    catalogPromise = fetchAllBots().catch(async (error) => {
      catalogPromise = null; // retry live next time
      try { const fallback = await loadFallbackBots(); if (fallback.length) return fallback; } catch { /* use original error */ }
      throw error;
    });
  }
  return catalogPromise;
}

/** Version family: official rooms and their archived community-…-vN versions share one key. */
export const botFamilyKey = (slug: string) => slug.replace(/^community-/, "").replace(/-v\d+$/, "");
export const botVersionNumber = (slug: string) => Number(slug.match(/-v(\d+)$/)?.[1] || 1);

// Verified Bionic IDs; default resolves server-side and manual picks remain explicit.
export const STUDIO_MODELS = [
  { id: "default", label: "Auto · GLM / DeepSeek" },
  { id: "bionic/glm-5.3-flash", label: "GLM 5.3 Flash · Economy" },
  { id: "bionic/deepseek-v4.1-flash", label: "DeepSeek V4.1 Flash · Reasoning / Code" },
  { id: "openai/gpt-6-luna", label: "GPT-6 Luna · Lovable" },
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
  { id: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
];