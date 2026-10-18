import metadata from "@/data/survivalDraftMetadata.json";
import type { GptVoiceProfile } from "./gptVoiceProfiles";
export const survivalDrafts = metadata;
export const getSurvivalDraft = (slug: string) => metadata.find((bot) => bot.slug === slug);
export async function loadSurvivalBuilderDraft(slug: string) {
  const bot = getSurvivalDraft(slug);
  if (!bot) return null;
  const { default: instructions } = await import("@/data/survivalDraftInstructions.json");
  const { survivalDraftImages } = await import("./survivalDraftImages");
  const text: Record<string, string> = instructions;
  return { display_name: bot.name, tagline: bot.tagline, instructions: text[slug] || "", voice: bot.voice as GptVoiceProfile["voice"], image_url: survivalDraftImages[slug] };
}