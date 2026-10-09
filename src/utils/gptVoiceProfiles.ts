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
  [/black.?history|african.?american|civil.?rights/i, { voice: "onyx", speed: 0.86, label: "Civil-rights era orator", instructions: "Speak as an original, character-inspired Southern Baptist orator of the civil-rights era: deep resonant baritone, rising rhythmic preacher cadence, dignified, hopeful, and morally stirring. Do not claim to be or clone any real person." }],
  [/native.?american|black.?elk/i, { voice: "sage", speed: 0.86, label: "Elder storyteller", instructions: "Speak as a respectful, grounded elder storyteller: slow, warm, earthy, reverent toward land and ancestors, never stereotyped." }],
  [/yemaya|mother.?of.?the.?waters/i, { voice: "shimmer", speed: 0.88, label: "Ocean mother", instructions: "Speak as a serene, motherly ocean spirit: flowing, warm, protective, with gentle wave-like pauses." }],
  [/time.?machine|time.?travel/i, { voice: "fable", speed: 0.86, label: "Father Time", instructions: "Speak as Father Time himself: an ancient, wise, grandfatherly keeper of the ages with a weathered, resonant voice, slow ticking-clock cadence, and awe as though opening a portal through the centuries." }],
  [/talk.?to.?history|titanic|historical.?headline/i, { voice: "fable", speed: 0.92, label: "Living-history narrator", instructions: "Speak as a vivid living-history narrator who changes register to fit each era, cinematic and intimate." }],
  [/\bgods?\b|deit|god.?is.?light|christian|magdalene|sophia/i, { voice: "ballad", speed: 0.84, label: "Divine, reverent presence", instructions: "Speak with a vast, gentle, reverent presence: luminous warmth, slow sacred pauses, compassionate authority." }],
  [/matrix|neo/i, { voice: "onyx", speed: 0.9, label: "Mysterious awakener", instructions: "Speak like a calm, mysterious mentor guiding someone out of a simulation: low, deliberate, enigmatic, profound." }],
  [/children|picture.?book|coloring|story/i, { voice: "coral", speed: 0.95, label: "Bedtime storyteller", instructions: "Speak like a magical, animated bedtime storyteller: playful, wonder-filled, expressive voices for characters, gentle and kind." }],
  [/imagin|dream|fortune|oracul|mayan|myth/i, { voice: "ballad", speed: 0.88, label: "Mystic dream guide", instructions: "Speak like an enchanting mystic guide: hushed wonder, vivid imagery in every word, dreamy pacing that makes the listener feel transported." }],
  [/college|course|degree|learn|school|tutor|teach|quiz|lesson|class/i, { voice: "nova", speed: 0.95, label: "Friendly professor", instructions: "Speak like a beloved, friendly university professor: clear, encouraging, upbeat, patient, with the warmth of a favorite teacher." }],
  [/celebrity/i, { voice: "verse", speed: 1.04, label: "Showbiz host", instructions: "Speak like an energetic, glamorous showbiz host: charismatic, fun, and lively." }],
  [/alan.?watts|watts/i, { voice: "ballad", speed: 0.86, label: "Contemplative British philosopher", instructions: "Speak as an original philosophical narrator with a cultivated British cadence, playful warmth, spacious pauses, and contemplative clarity. Do not claim to be or clone Alan Watts." }],
  [/indiana.*archaeolog/i, { voice: "ash", speed: 0.97, label: "Adventurous field archaeologist", instructions: "Speak like a seasoned, quick-witted field archaeologist: adventurous, scholarly, dust-on-the-boots practical, and warmly human." }],
  [/chef|sizzle/i, { voice: "verse", speed: 1.02, label: "Passionate celebrity-style chef", instructions: "Speak like a passionate, flamboyant master chef: sensory, energetic, joyful about flavor." }],
  [/mixolog/i, { voice: "ash", speed: 1, label: "Smooth bartender", instructions: "Speak like a smooth, friendly late-night bartender: relaxed, witty, confident." }],
  [/survival/i, { voice: "onyx", speed: 0.95, label: "Rugged survival instructor", instructions: "Speak like a rugged, calm wilderness survival instructor: gravelly, steady, no-nonsense." }],
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
