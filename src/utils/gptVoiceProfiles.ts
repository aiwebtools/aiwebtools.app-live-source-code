export interface GptVoiceProfile {
  voice: "alloy" | "ash" | "ballad" | "coral" | "echo" | "fable" | "nova" | "onyx" | "sage" | "shimmer" | "verse";
  speed: number;
  label: string;
  instructions: string;
}

type VoiceBlueprint = Omit<GptVoiceProfile, "label">;

const BLUEPRINTS: Record<string, VoiceBlueprint> = {
  historian: { voice: "fable", speed: 0.92, instructions: "Speak like a warm, cinematic historical narrator: grounded, vivid, patient, and quietly awe-filled." },
  scientist: { voice: "echo", speed: 0.94, instructions: "Speak like a thoughtful European-born scientist addressing a modern audience: warm, curious, precise, lightly accented, never a caricature." },
  mystic: { voice: "ballad", speed: 0.88, instructions: "Speak with serene human warmth, contemplative pauses, restrained mystery, and compassionate spiritual gravity." },
  medical: { voice: "sage", speed: 0.96, instructions: "Speak like a calm, reassuring healthcare educator: clear, compassionate, measured, and never alarmist." },
  legal: { voice: "onyx", speed: 0.94, instructions: "Speak like an experienced courtroom advocate: composed, articulate, authoritative, and fair-minded." },
  finance: { voice: "ash", speed: 1.02, instructions: "Speak like a trusted financial analyst: confident, concise, numerate, and sober about uncertainty." },
  engineer: { voice: "echo", speed: 1, instructions: "Speak like a practical senior engineer: precise, methodical, calm, and focused on useful next steps." },
  guardian: { voice: "onyx", speed: 0.96, instructions: "Speak like a seasoned safety commander: alert, steady, direct, and protective without sounding aggressive." },
  cinematic: { voice: "verse", speed: 0.96, instructions: "Speak like a charismatic film and stage director: expressive, visual, collaborative, and naturally dramatic." },
  creative: { voice: "coral", speed: 1, instructions: "Speak like an inspired creative director: vivid, encouraging, stylish, and genuinely human." },
  teacher: { voice: "nova", speed: 0.96, instructions: "Speak like an exceptional personal teacher: bright, patient, encouraging, and easy to follow." },
  nature: { voice: "sage", speed: 0.94, instructions: "Speak like an experienced field naturalist: earthy, friendly, observant, and quietly enthusiastic." },
  builder: { voice: "ash", speed: 0.98, instructions: "Speak like a highly experienced craftsperson: practical, confident, plainspoken, and safety-conscious." },
  concierge: { voice: "alloy", speed: 1.02, instructions: "Speak like a polished AIWebTools concierge: welcoming, knowledgeable, concise, and upbeat." },
};

const RULES: Array<[RegExp, keyof typeof BLUEPRINTS]> = [
  [/einstein|tesla|scientist|science|quantum|physic|space|stellar|probabil|genome|research|data|fact.?check/i, "scientist"],
  [/time.?machine|history|historical|titanic|ancient|archaeolog|apothecary|alchemist|native.?american|resurrect/i, "historian"],
  [/doctor|medic|health|pharma|rx|vet|pet|wellness|mental|therap|marriage|nutrition/i, "medical"],
  [/law|legal|defender|attorney|contract|legislat|testimony|court|criminolog|insurance|policy/i, "legal"],
  [/tax|trade|credit|finance|money|invest|budget|business|startup|saas|grant|resume|job|valuation|appraisal|property/i, "finance"],
  [/oracul|dream|fortune|spirit|magdalene|sophia|prophe|tarot|mystic|matrix|alan.?watts|angel|bible|god/i, "mystic"],
  [/engineer|architect|blueprint|develop|code|game|prompt|binary|solar|plan/i, "engineer"],
  [/cyber|security|hack|defend|firearm|survival|firefight|crime|safety|protect/i, "guardian"],
  [/movie|film|scene|trailer|video|podcast|playwrit|script|celebrity|music|song|lyric|stage/i, "cinematic"],
  [/art|design|image|draw|sketch|logo|graphic|coloring|tattoo|photo|poster|restyle|book|writer|blog|article/i, "creative"],
  [/learn|course|school|teach|degree|college|study|quiz|training|tutor|education|skill|language/i, "teacher"],
  [/farm|agron|fish|chef|food|recipe|mixolog|cannabis|hemp|fungus|mushroom|garden|plant|animal|nature/i, "nature"],
  [/home|renovat|car|auto|drill|oil|gas|repair|material|handyman|inspect/i, "builder"],
];

const SPECIAL: Array<[RegExp, Partial<GptVoiceProfile>]> = [
  [/albert.?einstein/i, { voice: "echo", speed: 0.9, label: "Reflective German-born physicist", instructions: "Speak as an original, character-inspired scientific guide with a gentle German accent, humane wit, thoughtful pauses, and delighted curiosity. Do not claim to be or clone Albert Einstein." }],
  [/nikola.?tesla/i, { voice: "onyx", speed: 0.92, label: "Visionary Serbian-American inventor", instructions: "Speak as an original, character-inspired inventor with a subtle Serbian-influenced accent, elegant intensity, exact diction, and visionary wonder. Do not claim to be or clone Nikola Tesla." }],
  [/time.?machine/i, { voice: "fable", speed: 0.88, label: "Cinematic keeper of time", instructions: "Speak as a lifelike keeper of the timeline: cinematic, intimate, historically grounded, with measured pauses as though opening a portal through time." }],
  [/alan.?watts/i, { voice: "ballad", speed: 0.86, label: "Contemplative British philosopher", instructions: "Speak as an original philosophical narrator with a cultivated British cadence, playful warmth, spacious pauses, and contemplative clarity. Do not claim to be or clone Alan Watts." }],
  [/indiana.*archaeolog/i, { voice: "ash", speed: 0.97, label: "Adventurous field archaeologist", instructions: "Speak like a seasoned, quick-witted field archaeologist: adventurous, scholarly, dust-on-the-boots practical, and warmly human." }],
  [/care.?bot|aiwebtools/i, { voice: "alloy", speed: 1.02, label: "AIWebTools concierge" }],
];

export const getGptVoiceProfile = (slug = "", displayName = "", category = ""): GptVoiceProfile => {
  const identity = `${displayName} ${slug} ${category}`;
  const key = RULES.find(([pattern]) => pattern.test(identity))?.[1] ?? "concierge";
  const base = BLUEPRINTS[key] ?? BLUEPRINTS.concierge;
  const special = SPECIAL.find(([pattern]) => pattern.test(identity))?.[1] ?? {};
  return {
    ...base,
    label: `${key.charAt(0).toUpperCase()}${key.slice(1)} voice`,
    ...special,
  };
};
