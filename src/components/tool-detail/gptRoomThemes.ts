/**
 * One deterministic visual identity system for every hosted GPT room.
 * The archetype supplies the fitting environment; the slug supplies a unique
 * pair of colours, panel pattern, call sign, and console number.
 */
import { getOffGridBotMetadata } from "@/utils/offGridBots";
export interface GptRoomTheme {
  key: string;
  accent: string;
  accent2: string;
  soft: string;
  deep: string;
  emblem: string;
  roomLabel: string;
  placeholder: string;
  mottoText: string;
  signature: string;
  consoleNumber: string;
  pattern: "grid" | "radar" | "circuit" | "wave" | "stars" | "rings";
}

type RoomBlueprint = Omit<GptRoomTheme, "accent" | "accent2" | "soft" | "deep" | "signature" | "consoleNumber"> & {
  hue: number;
};

const ROOMS: Record<string, RoomBlueprint> = {
  "off-grid": { key: "off-grid", hue: 142, emblem: "⌁", roomLabel: "OFF GRID LIVING", placeholder: "Share your goal, measurements and local constraints…", mottoText: "LOVE · TRUTH · LIFE · WORK WITH THE EARTH", pattern: "grid" },
  matrix: { key: "matrix", hue: 142, emblem: "⟨⟩", roomLabel: "LIVE CONSOLE", placeholder: "Type your request here…", mottoText: "ENTER THE MATRIX", pattern: "circuit" },
  "time-machine": { key: "time-machine", hue: 38, emblem: "🕰️", roomLabel: "TIME MACHINE · PAST · PRESENT · FUTURE", placeholder: "WHERE WOULD YOU LIKE TO GO?", mottoText: "THE TIMELINE AWAITS", pattern: "rings" },
  clinic: { key: "clinic", hue: 173, emblem: "⚕", roomLabel: "CONSULTATION ROOM", placeholder: "Describe the symptoms, history and what worries you…", mottoText: "INFORMATION ONLY — NOT A REPLACEMENT FOR YOUR DOCTOR", pattern: "wave" },
  chambers: { key: "chambers", hue: 221, emblem: "⚖", roomLabel: "THE CHAMBERS", placeholder: "State the matter, the parties and the outcome you need…", mottoText: "EVERY SIDE DESERVES A VOICE", pattern: "grid" },
  ledger: { key: "ledger", hue: 145, emblem: "↗", roomLabel: "THE TRADING FLOOR", placeholder: "Share the numbers, goal and timeline…", mottoText: "NUMBERS NEVER LIE", pattern: "wave" },
  observatory: { key: "observatory", hue: 199, emblem: "⌾", roomLabel: "THE OBSERVATORY", placeholder: "Pose the question and we will test it…", mottoText: "QUESTION EVERYTHING", pattern: "stars" },
  oracle: { key: "oracle", hue: 48, emblem: "◉", roomLabel: "THE INNER TEMPLE", placeholder: "Ask what you truly wish to know…", mottoText: "SEEK AND IT SHALL BE REVEALED", pattern: "rings" },
  blueprint: { key: "blueprint", hue: 190, emblem: "⌑", roomLabel: "DRAFTING TABLE", placeholder: "Describe the project and I will draw it up…", mottoText: "FROM IDEA TO BLUEPRINT", pattern: "grid" },
  studio: { key: "studio", hue: 326, emblem: "✦", roomLabel: "CREATIVE STUDIO", placeholder: "Tell me what you want to create…", mottoText: "IMAGINATION, RENDERED", pattern: "radar" },
  soundstage: { key: "soundstage", hue: 345, emblem: "▶", roomLabel: "THE SOUNDSTAGE", placeholder: "Set the scene, sound and mood…", mottoText: "ROLLING — TAKE ONE", pattern: "wave" },
  academy: { key: "academy", hue: 205, emblem: "⌘", roomLabel: "THE LEARNING HALL", placeholder: "Name the subject and how deep you want to go…", mottoText: "EDUCATION SHOULD BE FREE FOR ALL", pattern: "grid" },
  field: { key: "field", hue: 96, emblem: "⌁", roomLabel: "THE FIELD STATION", placeholder: "Tell me what you are growing, catching or cooking…", mottoText: "WORK WITH THE EARTH, NOT AGAINST IT", pattern: "radar" },
  forge: { key: "forge", hue: 20, emblem: "⚒", roomLabel: "THE FIELD UNIT", placeholder: "Describe the job, site and gear you have…", mottoText: "MEASURE TWICE, CUT ONCE", pattern: "circuit" },
  sentinel: { key: "sentinel", hue: 0, emblem: "⬡", roomLabel: "THE WATCHTOWER", placeholder: "Describe the threat, system and what is at stake…", mottoText: "VIGILANCE IS THE PRICE OF SAFETY", pattern: "radar" },
};

const SLUG_RULES: Array<[RegExp, keyof typeof ROOMS]> = [
  [/doctor|medic|health|pharma|rx|vet|pet-care|dental|nurse|therap|wellness|mental|medicus|nutrition|genome|marriage/, "clinic"],
  [/law|legal|defender|attorney|contract|legislat|testimony|court|criminolog|insurance|policy|politic/, "chambers"],
  [/tax|trade|credit|finance|money|invest|budget|business|startup|saas|grant|resume|job|valuation|appraisal|property|real-estate/, "ledger"],
  [/time-machine|history|historical|titanic|resurrect|ancient|apothecary|alchem|native-american|archaeolog|antique|interpretis/, "time-machine"],
  [/space|stellar|astro|tesla|einstein|physic|probabil|science|scientist|quantum|data|research|analysis|fact-check/, "observatory"],
  [/oracul|god|dream|fortune|spirit|magdalene|sophia|prophe|tarot|mystic|matrix|alan-watts|angel|bible|meditat/, "oracle"],
  [/engineer|architect|blueprint|construct|develop|code|game|prompt|binary|solar|micro-saas|plan/, "blueprint"],
  [/cyber|security|hack|defend|firearm|survival|firefight|crime|safety|protect/, "sentinel"],
  [/movie|film|scene|trailer|video|podcast|playwrit|script|story|celebrity|music|melod|song|lyric/, "soundstage"],
  [/art|design|image|draw|sketch|logo|graphic|coloring|tattoo|photo|poster|restyle|book|writer|blog|article|menu/, "studio"],
  [/learn|course|school|teach|degree|college|study|quiz|training|tutor|education|skill|language/, "academy"],
  [/farm|agron|fish|chef|food|recipe|mixolog|cannabis|hemp|fungus|mushroom|garden|plant|animal|nature/, "field"],
  [/home|renovat|car|auto|automobile|drill|oil|gas|repair|tool|material|handyman|inspect/, "forge"],
];

const CATEGORY_RULES: Array<[RegExp, keyof typeof ROOMS]> = [
  [/health|medic|wellness|fitness/, "clinic"], [/legal|law|government|politic/, "chambers"],
  [/business|finance|market|sales|productiv/, "ledger"], [/time|history/, "time-machine"],
  [/science|research|data|analytic/, "observatory"], [/spiritual|religion|mind/, "oracle"],
  [/develop|engineer|code|product/, "blueprint"], [/security|cyber/, "sentinel"],
  [/video|music|audio|film/, "soundstage"], [/art|design|image|writ|creative/, "studio"],
  [/education|learn|course/, "academy"], [/food|agricultur|nature|environment/, "field"],
  [/home|automotive|industr|construct/, "forge"],
];

const hash = (value: string): number => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const initials = (value: string): string => value
  .replace(/\bgpt\b/gi, "")
  .split(/[^a-z0-9]+/i)
  .filter(Boolean)
  .slice(0, 3)
  .map((part) => part[0]?.toUpperCase() ?? "")
  .join("") || "AI";

export const getGptRoomTheme = (
  slug = "",
  category = "",
  displayName = "",
): GptRoomTheme => {
  const normalizedSlug = slug.toLowerCase();
  const normalizedCategory = category.toLowerCase();
  const key = (getOffGridBotMetadata(slug) ? "off-grid" : undefined) ?? SLUG_RULES.find(([pattern]) => pattern.test(normalizedSlug))?.[1]
    ?? CATEGORY_RULES.find(([pattern]) => pattern.test(normalizedCategory))?.[1]
    ?? "matrix";
  const blueprint = ROOMS[key] ?? ROOMS.matrix;
  const identityHash = hash(slug || displayName || "aiwebtools");
  const hueShift = (identityHash % 29) - 14;
  const accentHue = (blueprint.hue + hueShift + 360) % 360;
  const secondaryHue = (accentHue + 32 + (identityHash % 47)) % 360;

  return {
    ...blueprint,
    accent: `${accentHue} 82% 58%`,
    accent2: `${secondaryHue} 86% 62%`,
    soft: `${accentHue} 58% 13%`,
    deep: `${(accentHue + 350) % 360} 55% 5%`,
    signature: initials(displayName || slug),
    consoleNumber: String((identityHash % 900) + 100),
    pattern: (["grid", "radar", "circuit", "wave", "stars", "rings"] as const)[identityHash % 6],
  };
};

export const getRoomMotto = (theme: GptRoomTheme): string => `◈ ${theme.mottoText} ◈`;
