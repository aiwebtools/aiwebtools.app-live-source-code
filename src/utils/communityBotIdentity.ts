import names from "@/data/communityBotNames.json";
import { offGridExpansionImages } from "./offGridExpansionImages";
import storyVision from "@/assets/community-bots/pikastory-vision-fallback.jpg";
import compatibility from "@/assets/off-grid-bots/community-compatibility-guide-gpt.jpg";
import land from "@/assets/off-grid-bots/shared-land-due-diligence-gpt.jpg";
import agreements from "@/assets/off-grid-bots/community-agreements-facilitator-gpt.jpg";
import build from "@/assets/off-grid-bots/off-grid-build-planner-gpt.jpg";
import livelihood from "@/assets/off-grid-bots/community-livelihood-planner-gpt.jpg";
const publicNames: Record<string, string> = names;
const offGridImages: Record<string, string> = {
  "community-community-compatibility-guide-gpt-47b622": compatibility,
  "community-shared-land-due-diligence-gpt-c3ce07": land,
  "community-community-agreements-facilitator-gpt-05bf34": agreements,
  "community-off-grid-build-planner-gpt-b790a2": build,
  "community-community-livelihood-planner-gpt-14d599": livelihood,
};
/** Presentation only; original operational instructions and stable slugs are preserved. */
export const communityBotName = (slug: string, original: string): string => publicNames[slug] || original;
export const communityBotImage = (slug: string): string | undefined => offGridExpansionImages[slug] || offGridImages[slug] || (/^community-pikastory-vision-gpt(?:-v\d+)?$/.test(slug) ? storyVision : undefined);
