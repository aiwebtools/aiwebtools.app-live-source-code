import tailoredStarters from "@/components/bot-studio/botStarters.json";

type StarterBot = {
  slug: string;
  display_name: string;
  tagline?: string | null;
  starter_prompts?: string[] | null;
  custom?: { instructions: string };
};

const catalog: Record<string, string[]> = tailoredStarters;
const generic = /what can you help|walk me through your first step|what can you do|help me get started/i;

export function getBotStarters(bot: StarterBot): string[] {
  if (catalog[bot.slug]) return catalog[bot.slug];
  const existing = (bot.starter_prompts || []).filter((text) => text.trim() && !generic.test(text));
  if (existing.length >= 2) return existing.slice(0, 2);
  const subject = bot.tagline?.replace(/\s*·\s*Community GPT\s*$/i, "").trim() || bot.display_name;
  return [
    ...existing,
    `Help me with ${subject}. Ask about my goal and relevant details before beginning.`,
    `Work through a practical ${bot.display_name} example using your instructions, and explain each step.`,
  ].slice(0, 2);
}