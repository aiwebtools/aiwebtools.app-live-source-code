import names from "@/data/communityBotNames.json";
import storyVision from "@/assets/community-bots/pikastory-vision-fallback.jpg";
const publicNames: Record<string, string> = names;
/** Presentation only; original operational instructions and stable slugs are preserved. */
export const communityBotName = (slug: string, original: string): string => publicNames[slug] || original;
export const communityBotImage = (slug: string): string | undefined => /^community-pikastory-vision-gpt(?:-v\d+)?$/.test(slug) ? storyVision : undefined;
