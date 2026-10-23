import { getOffGridBotMetadata } from "@/utils/offGridBots";
import type { StudioBot } from "./botCatalog";
import { botSubjectOverrides } from "./botSubjectOverrides";
import { getSurvivalDraft } from "@/utils/survivalDrafts";

export const BOT_SUBJECTS = ["Off Grid Living", "Apocalypse Survival & Nature", "History & Time Travel", "Health & Wellness", "Legal & Government", "Business & Finance", "Science & Research", "Spiritual & Philosophy", "Engineering & Planning", "Creative & Design", "Film, Music & Media", "Education & Learning", "Farming, Food & Outdoors", "Trades & Home", "Security & Safety", "General & Productivity"] as const;
export type BotSubject = typeof BOT_SUBJECTS[number];
type SubjectBot = Pick<StudioBot, "slug" | "display_name" | "tagline"> & { subject?: string | null };
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
  // A creator-chosen category saved at publish time always wins.
  if (bot.subject && (BOT_SUBJECTS as readonly string[]).includes(bot.subject)) return bot.subject as BotSubject;
  if (getSurvivalDraft(bot.slug)) return "Apocalypse Survival & Nature";
  if (getOffGridBotMetadata(bot.slug)) return "Off Grid Living";
  const name = normalize(bot.display_name);
  if (/\b(?:survivalist|survival|emergency preparedness|nuclear event preparedness|fallout shelter|geiger counter|disable that robot|rouge robot disabler|robot identifier.*disabler|foraging|naturalist|birdwatching|fungus|mushroom specialist)\b/.test(name)) return "Apocalypse Survival & Nature";
  const base = bot.slug.replace(/-v\d+$/, "");
  const overrides: Record<string, BotSubject> = botSubjectOverrides;
  const subject = overrides[base] || overrides[base.replace(/^community-/, "")] || overrides[`community-${base}`];
  if (subject) return subject;
  if (/\b(?:book writer|story writer|interactive time machine|game design|3d design|3d print concept|3d printer pro)\b/.test(name)) return "Creative & Design";
  const named = RULES.find(([pattern]) => pattern.test(name));
  if (named) return named[1];
  const description = normalize(bot.tagline || "");
  return RULES.find(([pattern]) => pattern.test(description))?.[1] || "General & Productivity";
}
const STOP = new Set("a an the i im i'm me my we our you your to for of on in at by with and or is are be it this that how what can do does want need help please some get make find about from into like".split(" "));
// Everyday task words → words that appear in bot names, descriptions and categories.
const TASK_WORDS: Record<string, string> = {
  sick: "doctor medical health medicus", ill: "doctor medical health", pain: "doctor health medical", symptom: "doctor medical health", symptoms: "doctor medical health",
  medicine: "pharmaceutical doctor medical", pet: "veterinarian petcare", dog: "veterinarian petcare", cat: "veterinarian petcare",
  car: "automobile automotive mechanic repair", truck: "automobile automotive", engine: "automobile mechanic engineering", fix: "repair renovator troubleshoot",
  house: "home renovator property", lawyer: "legal law defender", sue: "legal law", arrested: "public defender legal", court: "legal defender",
  money: "finance trader taxes budget", stocks: "trader trading invest", taxes: "tax", tax: "taxes", job: "resume job finder", hired: "resume job",
  resume: "resume job", company: "business startup", idea: "startup validator brainstorm", invention: "inventor tesla engineering", sell: "marketing sales business",
  song: "music melodies lyric", songs: "music lyric", movie: "film script scene", script: "screenplay script writer", story: "book writer story",
  write: "writer writing", essay: "writer article clarity", picture: "image graphic design", draw: "sketch artist image", logo: "graphic design logo",
  study: "learn course education tutor", homework: "learn course tutor education", class: "course college learn", teach: "course education homeschool",
  cook: "chef recipe food", dinner: "chef recipe food", drink: "mixologist cocktail", cocktail: "mixologist", grow: "farming garden agronomus plant",
  fishing: "fisherman fish", mushrooms: "fungus mushroom", travel: "travel advisor trip", vacation: "travel advisor", trip: "travel advisor",
  past: "history time machine", ancient: "history archaeology", future: "prediction fortune probability", predict: "prediction illuminous fortune",
  god: "spiritual gods", pray: "spiritual", meaning: "philosophy spiritual", dream: "dream interpreter", sad: "mental wellness", anxiety: "mental wellness",
  marriage: "marriage mender relationship", wife: "marriage mender", husband: "marriage mender", hack: "cyber security", virus: "cyber security",
  off: "off grid", grid: "off grid", solar: "solar off grid", survive: "survival survivalist", prepper: "survival", fire: "firefighter",
  space: "stellaris space", ship: "stellaris space", math: "algebraic mathematics", app: "saas microsaas coding", code: "coding developer", website: "coding saas",
  presentation: "ppt powerpoint", slides: "ppt powerpoint", podcast: "podcast", game: "game design", tattoo: "tattoo", antique: "appraisal antique", worth: "appraisal valuation",
  fact: "fact checker", true: "fact checker probability", news: "headlines fact", prompt: "prompt engine", video: "video sora movie",
};
const stem = (w: string) => w.length > 4 ? w.replace(/(ing|ers|er|es|s)$/, "") : w;
export function searchStudioBots<T extends SubjectBot>(bots: T[], query: string): T[] {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return bots;
  const core = words.filter((w) => !STOP.has(w));
  const terms = core.length ? core : words;
  const expanded = [...new Set(terms.flatMap((w) => (TASK_WORDS[w] || "").split(" ").filter(Boolean)))].filter((w) => !terms.includes(w));
  const taskCategories = new Set(RULES.filter(([re]) => re.test(q)).map(([, s]) => s));
  const scored = bots.map((bot) => {
    const name = normalize(bot.display_name);
    const category = getBotCategory(bot);
    const rest = normalize(`${bot.tagline || ""} ${category} ${getOffGridBotMetadata(bot.slug)?.tags.join(" ") || ""}`);
    let score = name === q ? 1000 : name.includes(q) ? 300 : 0;
    let hits = 0;
    for (const w of terms) {
      const s = stem(w);
      if (name.includes(s)) { score += 40; hits++; } else if (rest.includes(s)) { score += 12; hits++; }
    }
    if (hits === terms.length) score += 60;
    for (const w of expanded) { if (name.includes(w)) score += 18; else if (rest.includes(w)) score += 5; }
    if (score > 0 && taskCategories.has(category)) score += 8;
    else if (score === 0 && taskCategories.has(category)) score = 3;
    return { bot, score };
  }).filter((r) => r.score > 0);
  return scored.sort((a, b) => b.score - a.score || a.bot.display_name.localeCompare(b.bot.display_name)).map((r) => r.bot);
}