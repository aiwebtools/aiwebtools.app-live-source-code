import tailoredStarters from "@/components/bot-studio/botStarters.json";
import { getOffGridBotMetadata } from "./offGridBots";
import { getSurvivalDraft } from "./survivalDrafts";

type StarterBot = {
  slug: string;
  display_name: string;
  tagline?: string | null;
  starter_prompts?: string[] | null;
  custom?: { instructions: string };
};

const catalog: Record<string, string[]> = tailoredStarters;
const unsuitable = /what can you help|walk me through your first step|what can you do|help me get started|using your instructions|this gpt|operational instructions|modeled as|ask about my goal|\.\.\.|…/i;

// Match a task, not a description of the assistant or its private instructions.
const purposeStarters: [RegExp, string][] = [
  [/\b(?:children.?s|picture)\b.*\bbook\b/, "Let's create a complete children's picture book, from the first page to the last."],
  [/\bbook\b.*\b(?:writ|maker|generat|creat)/, "Let's write a full chapter book from beginning to end."],
  [/\baether\b/, "Guide me on an exploration of aether energy and its possibilities."],
  [/\b(?:ai|alan) watts\b|mental maze|mind exploration/, "Guide me on an inward journey to explore my mind and find a fresh perspective."],
  [/\b3d\b.*\b(?:design|maker|model)\b/, "Let's create an interactive 3D design from my idea."],
  [/\b3d\b.*\bprint\b.*\b(?:concept|prototype)\b/, "Let's turn my idea into a 3D-printable concept, step by step."],
  [/\b(?:facility|runway|pipeline|port|plant|turbine|levee|dam|container|airline|grid|factory|quarry|bridge|building|construction site)\b.*\b(?:inspect|safety|integrity)/, "Help me inspect my site or equipment; I'll share photos or readings to begin."],
  [/\b(?:business plan)\b/, "Let's build a complete business plan for my idea."],
  [/\b(?:time machine|time travel|time rift)\b/, "Take me on a vivid adventure through the time and place I choose."],
  [/\b(?:stellaris|space explorer)\b/, "Be my crew guide as we begin a space-frontier mission."],
  [/\b(?:movie script|screenplay)\b/, "Let's write a complete movie script from my idea."],
  [/\b(?:movie scene)\b/, "Let's bring my movie scene to life."],
  [/\b(?:movie maker|film maker)\b/, "Let's create a movie from the first idea to the final scene."],
  [/\b(?:music video)\b/, "Let's plan a complete music video for my song."],
  [/\b(?:custom gpt|gpt maker|gpt ideas|gpts)\b/, "Let's create a custom bot for the purpose I have in mind."],
];

const subjectStarters: [RegExp, (name: string) => string][] = [
  [/\b(?:writer|writing|rewriter|draft|testimony|legislation|report)\b/, (name) => `Let's create a complete draft with ${name}.`],
  [/\b(?:game|trivia|jeopardy|quiz)\b/, () => "Let's start a session and play the first round."],
  [/\b(?:learn|teacher|tutor|college|course|school|education)\b/, () => "Teach me my chosen subject step by step, starting with the first lesson."],
  [/\b(?:design|image|sketch|art|artist|draw|logo|coloring|comic|tattoo)\b/, () => "Let's bring my creative idea to life, from concept to finished design."],
  [/\b(?:repair|renovator|automobile|automotive|fix)\b/, () => "Help me troubleshoot my problem and guide me through the next practical step."],
  [/\b(?:survival|shelter|off grid|preparedness|emergency|safety)\b/, () => "Help me prepare for my situation with a practical step-by-step plan."],
  [/\b(?:recipe|chef|culinary|mixologist|kitchen|menu)\b/, () => "Let's create something delicious using my ingredients and preferences."],
  [/\b(?:garden|plant|farm|crop|agronom|fungus|mushroom)\b/, () => "Help me plan my growing project and choose the first practical step."],
  [/\b(?:health|medicus|doctor|wellness|pet|veterinarian|fitness|nutrition)\b/, () => "Help me understand my concern and plan sensible next steps."],
  [/\b(?:history|historical|archaeologist|archivist|ancient)\b/, () => "Guide me on an exploration of the historical mystery I choose."],
  [/\b(?:spiritual|light|source|meditation|mind|wisdom|gnostic|mystic|philosophy)\b/, () => "Guide me on an inward exploration of the question on my mind."],
  [/\b(?:research|science|data|analysis|physics|quantum)\b/, () => "Let's investigate my question and work through the findings together."],
  [/\b(?:engineer|code|developer|binary|math|algebra|calculator)\b/, () => "Let's solve my problem step by step and build a working solution."],
];

function concisePurpose(bot: StarterBot): string | undefined {
  const subject = `${bot.display_name} ${bot.slug}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  return purposeStarters.find(([pattern]) => pattern.test(subject))?.[1];
}

function usablePrompt(prompts?: string[] | null): string | undefined {
  return prompts?.find((text) => text.trim().length > 10 && text.trim().length <= 180 && !unsuitable.test(text))?.trim();
}

export function getBotStarters(bot: StarterBot): string[] {
  const purpose = concisePurpose(bot);
  if (purpose) return [purpose];
  const survival = getSurvivalDraft(bot.slug);
  const offGrid = getOffGridBotMetadata(bot.slug);
  const family = bot.slug.replace(/^community-/, "").replace(/-v\d+$/, "");
  const curated = usablePrompt(survival?.starters || offGrid?.starters || catalog[bot.slug] || catalog[family]);
  if (curated) return [curated];
  const existing = usablePrompt(bot.starter_prompts);
  if (existing) return [existing];
  const name = bot.display_name.replace(/\s*\(V\d+\)$/, "").trim();
  const subject = `${name} ${family}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const fallback = subjectStarters.find(([pattern]) => pattern.test(subject));
  // Never interpolate a tagline: imported taglines can contain authored instructions.
  return [fallback ? fallback[1](name) : `Let's begin a guided ${name} session focused on my goal.`];
}