import { getOffGridBotMetadata } from "@/utils/offGridBots";
import type { StudioBot } from "./botCatalog";
import { botSubjectOverrides } from "./botSubjectOverrides";

export const BOT_SUBJECTS = ["Off Grid Living", "History & Time Travel", "Health & Wellness", "Legal & Government", "Business & Finance", "Science & Research", "Spiritual & Philosophy", "Engineering & Planning", "Creative & Design", "Film, Music & Media", "Education & Learning", "Farming, Food & Outdoors", "Trades & Home", "Security & Safety", "General & Productivity"] as const;
export type BotSubject = typeof BOT_SUBJECTS[number];
type SubjectBot = Pick<StudioBot, "slug" | "display_name" | "tagline">;
// Word boundaries prevent "art" in artificial, "plan" in planet and "car" in care.
const RULES: [RegExp, BotSubject][] = [
  [/\b(?:time machine|time travel|time rift|histor(?:y|ical)|titanic|archaeolog\w*|ancient egypt|ancient rome|age of exploration|interpretis|etymolog\w*)\b/, "History & Time Travel"],
  [/\b(?:cyber\w*|security|hacking|hacker|antihack\w*|firearm\w*|firefight\w*|survival\w*|disaster|emergency|crime prevention|safety instructor)\b/, "Security & Safety"],
  [/\b(?:genome|genetic\w*|pharma research|clinical trial\w*|scientific|scientist|science|research|data analysis|data analyst|fact checker|probability|physics|quantum|tesla|einstein|stellaris|astronom\w*|space explor\w*)\b/, "Science & Research"],
  [/\b(?:doctor|dr|medicus|medical|health|wellness|nutrition\w*|fitness|pharmaceutical assistant|petcare|pet care|veterinar\w*|dental|nurse|therap\w*|mental|marriage mender)\b/, "Health & Wellness"],
  [/\b(?:law|legal|defender|attorney|contract|legislat\w*|testimony|court|criminolog\w*|insurance|politic\w*|government)\b/, "Legal & Government"],
  [/\b(?:college|degree|course|school\w*|learn\w*|teach\w*|quiz|training manual|tutor\w*|education\w*|academic|language learning|skill\w*)\b/, "Education & Learning"],
  [/\b(?:oraculum|g mode|god\w*|dream interpret\w*|spirit\w*|magdalene|sophia|prophet\w*|tarot|mystic\w*|neo|matrix|alan watts|angel\w*|bible|meditat\w*|gnostic\w*|gospel|yesh\w*|apothecary|ancient wisdom|alchemy|alchemist)\b/, "Spiritual & Philosophy"],
  [/\b(?:tax\w*|trader|trading|credit|finance|financial|money|invest\w*|budget\w*|business|startup|saas|grant|resume|job\w*|valuation|appraisal|property|real estate|retail|marketing|sales|entrepreneur\w*)\b/, "Business & Finance"],
  [/\b(?:movie|film|scene|trailer|video|podcast|playwrit\w*|celebrity|music|melod\w*|song|lyric\w*|screenplay|sound|audio|stage\w*)\b/, "Film, Music & Media"],
  [/\b(?:farm\w*|agronom\w*|fish\w*|chef|food|recipe|mixolog\w*|cannabis|hemp|fungus|mushroom|garden\w*|plant\w*|animal|nature|seed library)\b/, "Farming, Food & Outdoors"],
  [/\b(?:art|artist|design\w*|image|draw\w*|sketch\w*|logo|graphic\w*|coloring|tattoo|photo\w*|poster|restyle|book|writer|writing|blog|article|menu|ad maker|ad creator|advertis\w*|story\w*)\b/, "Creative & Design"],
  [/\b(?:engineer\w*|architect\w*|blueprint|construct\w*|develop\w*|coding|code|program\w*|3d print\w*|binary|solar|algebra\w*|mathemat\w*|planning|planner)\b/, "Engineering & Planning"],
  [/\b(?:home|renovat\w*|car|auto|automobile|automotive|drill|oil|gas|repair|material|handyman|inspect\w*)\b/, "Trades & Home"],
];
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function getBotCategory(bot: SubjectBot): BotSubject {
  if (getOffGridBotMetadata(bot.slug)) return "Off Grid Living";
  const base = bot.slug.replace(/-v\d+$/, "");
  const overrides: Record<string, BotSubject> = botSubjectOverrides;
  const subject = overrides[base] || overrides[base.replace(/^community-/, "")] || overrides[`community-${base}`];
  if (subject) return subject;
  const name = normalize(bot.display_name);
  if (/\b(?:book writer|story writer|interactive time machine|game design|3d design|3d print concept|3d printer pro)\b/.test(name)) return "Creative & Design";
  const named = RULES.find(([pattern]) => pattern.test(name));
  if (named) return named[1];
  const description = normalize(bot.tagline || "");
  return RULES.find(([pattern]) => pattern.test(description))?.[1] || "General & Productivity";
}
export function searchStudioBots<T extends SubjectBot>(bots: T[], query: string): T[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return bots;
  return bots.filter((bot) => {
    const metadata = getOffGridBotMetadata(bot.slug);
    const hay = normalize(`${bot.display_name} ${bot.tagline || ""} ${getBotCategory(bot)} ${metadata?.tags.join(" ") || ""}`);
    return words.every((word) => hay.includes(word));
  }).sort((a, b) => Number(normalize(b.display_name) === normalize(query)) - Number(normalize(a.display_name) === normalize(query)) || a.display_name.localeCompare(b.display_name));
}