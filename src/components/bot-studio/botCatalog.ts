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
  custom?: { instructions: string; voice: import("@/utils/gptVoiceProfiles").GptVoiceProfile["voice"] };
}
let catalogPromise: Promise<StudioBot[]> | null = null;
export function refreshStudioBots() { catalogPromise = null; return loadStudioBots(); }
export function loadStudioBots(): Promise<StudioBot[]> {
  if (!catalogPromise) {
    catalogPromise = Promise.resolve(supabase.from("gpt_apps").select("slug, display_name, tool_title, tagline, greeting, starter_prompts, supports_images, model").eq("is_active", true).order("display_name")).then(({ data, error }) => {
      if (error) { catalogPromise = null; throw new Error("The assistant directory could not load. Please try again."); }
      return ((data ?? []) as StudioBot[]).filter((bot) => bot.slug && bot.display_name);
    });
  }
  return catalogPromise;
}

// Exact IDs from the authenticated workspace catalog; the original bot model stays the default.
export const STUDIO_MODELS = [
  { id: "default", label: "Economy (cheapest)" },
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
  { id: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
];