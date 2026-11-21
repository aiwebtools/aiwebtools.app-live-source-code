/**
 * FLAGSHIP FEATURE WRITE-UPS ("back pages")
 * -----------------------------------------------------------------------------
 * Long-form, magazine-style features on the twelve flagship custom GPTs built
 * by AIWebTools.ai. Each page carries real editorial content, a quick-answer
 * block, key facts, an FAQ — and a live, working in-site chat window for the
 * tool itself, so a visitor can try it without leaving the article.
 *
 * Everything here is written from the real tool records in our database.
 * Nothing is invented: no ratings, no testimonials, no fabricated statistics.
 */

export interface FeatureSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface FeatureFact {
  label: string;
  value: string;
}

export interface FlagshipFeature {
  /** URL slug under /feature/ */
  slug: string;
  /** Exact tool title in the directory — used to load the live chat room. */
  toolTitle: string;
  /** Tool page slug in the directory. */
  toolSlug: string;
  category: string;
  emoji: string;
  kicker: string;
  headline: string;
  deck: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** One-sentence extractable answer for search and answer engines. */
  answer: string;
  quickFacts: FeatureFact[];
  sections: FeatureSection[];
  faq: Array<{ q: string; a: string }>;
  publishDate: string;
  readTime: string;
}

const FREE = `Free to use — no install or account needed`;

export const flagshipFeatures: FlagshipFeature[] = [
  {
    slug: "time-machine-gpt",
    toolTitle: "TIME MACHINE GPT",
    toolSlug: "time-machine-gpt",
    category: "Education & Research Tools",
    emoji: "⏳",
    kicker: "Flagship feature",
    headline: "TIME MACHINE GPT — Has AI broken the time barrier?",
    deck:
      "At least in our imaginations it has. The maker of this tool believes history is best learned by standing inside it, so we built a machine that drops you into the room and lets the era answer back.",
    metaTitle: "TIME MACHINE GPT — Travel Through History With AI (Free, In-Browser)",
    metaDescription:
      "TIME MACHINE GPT drops you into any era of history and lets it answer back — key moments, notable figures and alternate outcomes. Try the live chat free on AI Web Tools.",
    keywords: [
      "time machine gpt",
      "ai time travel",
      "history ai chatbot",
      "learn history with ai",
      "interactive history simulator",
      "free history ai tool",
    ],
    answer:
      "TIME MACHINE GPT is a free AI history tool from AIWebTools.ai that simulates travel to any moment in history, letting you explore key events, speak with notable figures and test alternative outcomes in an interactive chat.",
    quickFacts: [
      { label: "Best for", value: "Students, teachers, writers and history enthusiasts" },
      { label: "What it does", value: "Simulated journeys to any era, with period-accurate detail" },
      { label: "Pictures", value: "Yes — it can draw the scene around you" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "What the machine actually does",
        body: [
          "Ask most chat assistants about the fall of Constantinople and you get a tidy encyclopaedia paragraph. Ask TIME MACHINE GPT and you arrive at the walls: the weather, the noise, who is arguing with whom, what an ordinary person can see from where they are standing. The tool is built for immersion first and summary second, because detail is what makes a date stick in memory.",
          "Underneath the theatre it is disciplined. The machine keeps the era's facts straight, names the sources of disagreement when historians disagree, and separates what is documented from what is reconstruction. You can travel, then step back out and ask it to explain plainly what is known and what is not.",
        ],
        bullets: [
          "Land in any year, anywhere, and look around in plain language.",
          "Speak with figures of the period in their own frame of reference.",
          "Run the 'what if' — and see the reasoning behind the branch.",
          "Ask for a picture of the surroundings once the scene is set.",
        ],
      },
      {
        heading: "Why immersion beats a summary",
        body: [
          "Learning research has long favoured active recall over passive reading, and a conversation is active by nature. Every question you ask forces you to decide what you actually want to know, and the answer arrives attached to a scene rather than a bullet list.",
          "That is the wager behind this tool: a student who has argued with a Roman tax collector about grain prices remembers the grain economy. A reader who has walked a 1912 boat deck remembers why the lifeboat maths mattered.",
        ],
      },
      {
        heading: "How to get the most out of it",
        body: [
          "Start with a place and a date rather than a topic — 'Take me to Alexandria, 48 BC' works far better than 'tell me about ancient Egypt'. Then narrow: who is in the room, what do they want, what do they fear.",
          "When the scene is established, ask for an image of the surroundings. The tool can draw what it has just described, which turns an exchange of text into something you can put in a lesson plan, a slide or a story bible.",
        ],
        bullets: [
          "Anchor with a place and a date.",
          "Ask what an ordinary person would see, not just what the leaders decided.",
          "Request the sources or the historical uncertainty when accuracy matters.",
          "Finish with a picture of the scene for notes, lessons or storyboards.",
        ],
      },
      {
        heading: "Where it fits in the wider toolkit",
        body: [
          "TIME MACHINE GPT is the doorway; the rest of the history shelf goes deeper. TALK TO HISTORY GPT is built for sustained, personal conversation with a single figure, and the spotlight write-ups across the directory cover the specialist editions built for particular eras.",
          "All of them live in the same free directory of AI tools, so you can move from the immersive walk-through to the focused interview without setting up an account anywhere.",
        ],
      },
    ],
    faq: [
      {
        q: "Is TIME MACHINE GPT free?",
        a: FREE,
      },
      {
        q: "Is the history accurate?",
        a: "The tool is built to stay period-accurate and to flag the difference between documented record and reconstruction. It is an educational simulation, not a citation-grade academic source — verify anything you intend to publish.",
      },
      {
        q: "Can it generate images?",
        a: "Yes. Once a scene is described, you can ask for a picture of the surroundings and the tool will draw it inside the chat.",
      },
      {
        q: "Do I need an account?",
        a: `No account needed. ${FREE}. Chats are stored only on your device.`,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "6 min",
  },
  {
    slug: "public-defender-gpt",
    toolTitle: "Public Defender GPT",
    toolSlug: "public-defender-gpt",
    category: "Legal & Government",
    emoji: "⚖️",
    kicker: "Flagship feature",
    headline: "PUBLIC DEFENDER GPT — What if everyone had a legal researcher?",
    deck:
      "Legal help is rationed by cost. This tool does not replace a lawyer, but it does hand an ordinary person the research, the vocabulary and the questions worth asking.",
    metaTitle: "Public Defender GPT — Free AI Legal Research Assistant | AI Web Tools",
    metaDescription:
      "Public Defender GPT helps you research legal questions, understand documents and prepare for conversations with your lawyer. Free live chat on AI Web Tools.",
    keywords: [
      "public defender gpt",
      "ai legal assistant",
      "free legal research ai",
      "ai legal document help",
      "legal ai chatbot",
    ],
    answer:
      "Public Defender GPT is a free AI legal research assistant from AIWebTools.ai that helps you understand legal documents, research relevant law and prepare questions for a qualified lawyer.",
    quickFacts: [
      { label: "Best for", value: "Anyone facing a legal process without a full legal budget" },
      { label: "What it does", value: "Legal research, document explanation, preparation support" },
      { label: "Not for", value: "Replacing a licensed attorney or filing advice" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "The gap this tool was built for",
        body: [
          "Most people meet the legal system unprepared. The documents use a vocabulary they were never taught, the deadlines are unforgiving, and the hour of professional time they can afford gets spent on explanation rather than strategy.",
          "Public Defender GPT is designed to close that preparation gap. It reads a document with you, tells you what each clause is doing, and turns a vague worry into a specific question you can put to your lawyer.",
        ],
      },
      {
        heading: "What it does well",
        body: [
          "Ask it to explain a notice, a contract clause or a court form and it will do so in plain language, then point out what is missing, what is unusual and what typically matters most.",
          "It also helps you organise: a timeline of events, a list of documents to gather, the questions to ask, and a summary of the arguments you believe support your position.",
        ],
        bullets: [
          "Plain-language explanation of legal documents and terms.",
          "Research support on the law relevant to your situation.",
          "A structured timeline and evidence list you can hand to counsel.",
          "Prepared questions so paid legal time goes further.",
        ],
      },
      {
        heading: "Where the line is drawn",
        body: [
          "This is a research and preparation assistant, not a lawyer. It does not know your jurisdiction's current practice, your judge or the procedural traps that a local practitioner knows by instinct, and it cannot represent you.",
          "Use it to arrive informed. Every consequential decision belongs with a qualified attorney licensed where your matter is being heard.",
        ],
      },
    ],
    faq: [
      {
        q: "Is Public Defender GPT legal advice?",
        a: "No. It is an educational research and preparation tool. It does not create an attorney-client relationship and should not replace advice from a licensed attorney in your jurisdiction.",
      },
      {
        q: "What is it genuinely useful for?",
        a: "Understanding documents, researching background law, organising a timeline and evidence list, and preparing precise questions before a paid consultation.",
      },
      {
        q: "Does it cost anything?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "survivalist-gpt",
    toolTitle: "Survivalist GPT",
    toolSlug: "survivalist-gpt",
    category: "Industry Specific AI Tools",
    emoji: "🧭",
    kicker: "Flagship feature",
    headline: "SURVIVALIST GPT — A survival expert that fits in a pocket",
    deck:
      "Water, shelter, fire, navigation, first response. Knowledge that used to live in a stack of manuals, answered step by step in the order you actually need it.",
    metaTitle: "Survivalist GPT — Free AI Survival & Preparedness Guide | AI Web Tools",
    metaDescription:
      "Survivalist GPT gives step-by-step survival guidance: water, shelter, fire, navigation, first response and preparedness planning. Free live chat on AI Web Tools.",
    keywords: [
      "survivalist gpt",
      "ai survival guide",
      "wilderness survival ai",
      "emergency preparedness ai",
      "bushcraft ai assistant",
    ],
    answer:
      "Survivalist GPT is a free AI survival assistant from AIWebTools.ai that gives step-by-step guidance on water, shelter, fire, navigation, first response and emergency preparedness.",
    quickFacts: [
      { label: "Best for", value: "Hikers, campers, preppers and emergency planners" },
      { label: "What it does", value: "Ordered, practical survival and preparedness instruction" },
      { label: "Strength", value: "Prioritisation — what to do first, and why" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Knowledge in the right order",
        body: [
          "Survival information is abundant and badly sequenced. A search returns forty techniques; none of them tell you which one matters in the next hour. This tool leads with triage: shelter before fire in a cold wind, water before food, signalling before walking out.",
          "Ask it about a scenario and it answers in order of consequence, with the reasoning attached so you can adapt when your situation does not match the textbook.",
        ],
        bullets: [
          "Water sourcing, filtration and purification without specialist gear.",
          "Shelter selection for terrain, temperature and available material.",
          "Fire, signalling and navigation fundamentals.",
          "Kit planning for a day hike, a vehicle or a household.",
        ],
      },
      {
        heading: "Planning before the emergency",
        body: [
          "The most valuable conversations with this tool happen long before anything goes wrong. Describe where you live, the climate, who is in the household and what you already own, and it will build a preparedness list that is proportionate rather than alarmist.",
          "It will also tell you what you can skip. A great deal of preparedness advice is marketing; a tool with no product to sell can simply say so.",
        ],
      },
      {
        heading: "Use it as training, not as a lifeline",
        body: [
          "This is an educational resource. In a genuine emergency, contact the emergency services and follow professional instruction — a phone may have no signal, and a wet phone has no opinion at all.",
          "The right use is training: learn the sequences now, practise them in safe conditions, and carry the knowledge rather than the device.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I rely on Survivalist GPT in a real emergency?",
        a: "No. It is an educational preparedness tool. In a real emergency contact the emergency services and follow professional instruction.",
      },
      {
        q: "What does it cover?",
        a: "Water, shelter, fire, navigation, signalling, first-response basics, food procurement and household or vehicle preparedness planning.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "college-degree-gpt",
    toolTitle: "COLLEGE DEGREE GPT",
    toolSlug: "college-degree-gpt",
    category: "Education & Learning",
    emoji: "🎓",
    kicker: "Flagship feature",
    headline: "COLLEGE DEGREE GPT — The whole degree, minus the tuition",
    deck:
      "It cannot award you a credential. It can teach you every class in the programme, in the order a university would teach them, for nothing.",
    metaTitle: "College Degree GPT — Learn a Full Degree Curriculum Free | AI Web Tools",
    metaDescription:
      "College Degree GPT teaches the full curriculum of any degree, course by course, structured like a real programme. Free live chat on AI Web Tools.",
    keywords: [
      "college degree gpt",
      "free ai university course",
      "learn a degree with ai",
      "ai tutor curriculum",
      "self taught degree ai",
    ],
    answer:
      "College Degree GPT is a free AI tutor from AIWebTools.ai that teaches the full curriculum of any degree programme course by course, mirroring how a university would structure it — without granting an accredited credential.",
    quickFacts: [
      { label: "Best for", value: "Self-taught learners, career changers, curious minds" },
      { label: "What it does", value: "Full degree curricula taught class by class" },
      { label: "Important", value: "Educational only — it does not award an accredited degree" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Education as a right, not a purchase",
        body: [
          "The conviction behind this tool is simple: knowledge should not be rationed by tuition. What a university sells is a curriculum, a sequence and an assessment. Two of those three can be given away.",
          "Name a degree and the tool lays out the programme — year by year, course by course — then teaches any class in it on demand, at whatever depth you ask for.",
        ],
      },
      {
        heading: "How a session works",
        body: [
          "Start by asking for the curriculum map. You will get the structure: foundations, core courses, electives, capstone. Pick a class and it becomes a teaching session with explanations, worked examples and questions back at you.",
          "Because it is a conversation, you can stop and say the words you cannot say in a lecture hall: I did not follow that. It will re-teach the same idea a different way for as long as it takes.",
        ],
        bullets: [
          "A realistic course map for the degree you name.",
          "Class-by-class teaching with worked examples.",
          "Unlimited re-explanation without embarrassment.",
          "Reading suggestions and self-check questions as you go.",
        ],
      },
      {
        heading: "What it is not",
        body: [
          "It is not accredited and it does not issue a qualification. Anyone who needs a licence, a registered professional status or an employer-recognised credential still needs the institution.",
          "What it offers is the learning itself — useful preparation before enrolling, support alongside a real programme, or a route for someone who will never be able to enrol at all.",
        ],
      },
    ],
    faq: [
      {
        q: "Does College Degree GPT grant a real degree?",
        a: "No. It teaches the curriculum but awards no accredited credential. It is an educational tool.",
      },
      {
        q: "Which subjects does it cover?",
        a: "Any degree programme you name — it builds the course map and teaches each class in sequence.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "book-writer-gpt",
    toolTitle: "BOOK WRITER GPT",
    toolSlug: "book-writer-gpt",
    category: "Writing & Text Generation",
    emoji: "📖",
    kicker: "Flagship feature",
    headline: "BOOK WRITER GPT — The manuscript that remembers itself",
    deck:
      "Most AI writing falls apart at chapter four, when the assistant forgets who the characters are. This one is built around continuity.",
    metaTitle: "AI Book Writer Tool — Book Writer GPT, Write a Full Book Free | AI Web Tools",
    metaDescription:
      "Book Writer GPT is a free AI book writer tool that plans, drafts and continues full-length books with page-to-page continuity, structured chapters and consistent voice. Free live chat on AI Web Tools.",
    keywords: [
      "ai book writer tool",
      "ai book generator",
      "book writer gpt",
      "ai book writing tool",
      "write a novel with ai",
      "ai manuscript assistant",
      "free ai writing tool",
    ],
    answer:
      "Book Writer GPT is a free AI writing assistant from AIWebTools.ai that plans and drafts full-length books chapter by chapter, keeping characters, plot and voice consistent across the manuscript.",
    quickFacts: [
      { label: "Best for", value: "Novelists, non-fiction authors and self-publishers" },
      { label: "What it does", value: "Outlining, chapter drafting and continuity management" },
      { label: "Strength", value: "Page-to-page continuity across a long manuscript" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Continuity is the whole problem",
        body: [
          "Anyone who has tried to write a book with a general chat assistant knows the failure mode: the prose is fine, and then the protagonist's sister changes name, the timeline slips, and the voice drifts into corporate neutral.",
          "Book Writer GPT is structured to hold the book in mind — the premise, the cast, the arc, the decisions already made — so chapter nine still belongs to the same novel as chapter one.",
        ],
      },
      {
        heading: "From premise to finished chapters",
        body: [
          "Begin with the idea in one sentence. The tool will interrogate it: genre, audience, length, point of view, the shape of the arc. Out of that comes a chapter outline you can argue with and revise.",
          "Then it drafts. You can take a chapter at a time, ask for a different register, rewrite a scene from another character's eyes, or have it summarise what has happened so far before continuing.",
        ],
        bullets: [
          "Premise interrogation and structural outline.",
          "Chapter-by-chapter drafting in a consistent voice.",
          "Character and timeline continuity across the manuscript.",
          "Rewrites by tone, point of view or pacing on request.",
        ],
      },
      {
        heading: "Keep your hand on the wheel",
        body: [
          "The best manuscripts produced this way are collaborations, not deliveries. Write the passages that matter to you, use the tool for the connective tissue, the stuck scenes and the second draft.",
          "For book covers and marketing artwork, the directory's Graphic & Cover Design GPT picks up where this one stops.",
        ],
      },
    ],
    faq: [
      {
        q: "Can Book Writer GPT write a whole book?",
        a: "It can draft a complete manuscript chapter by chapter with consistent characters and plot, but the strongest results come from authors who edit, direct and rewrite alongside it.",
      },
      {
        q: "Who owns what it writes?",
        a: "You direct the work and keep your manuscript. Review any AI-assisted text carefully before publishing, and check the policies of your publishing platform.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "movie-script-writer-gpt",
    toolTitle: "Movie Script Writer GPT",
    toolSlug: "movie-script-writer-gpt",
    category: "Writing & Text Generation",
    emoji: "🎬",
    kicker: "Flagship feature",
    headline: "MOVIE SCRIPT WRITER GPT — Industry format, from the first line",
    deck:
      "Screenwriting punishes amateurs on formatting alone. This tool gets the shape right so you can spend your attention on the story.",
    metaTitle: "Movie Script Generator — Movie Script Writer GPT, Free AI Screenwriting | AI Web Tools",
    metaDescription:
      "Movie Script Writer GPT is a free movie script generator that drafts scenes in professional screenplay format with sharp dialogue, clear action lines and scene-by-scene structure. Free live chat on AI Web Tools.",
    keywords: [
      "movie script generator",
      "ai script generator",
      "movie script writer gpt",
      "ai screenwriting tool",
      "screenplay format ai",
      "write a film script with ai",
      "free scriptwriting ai",
    ],
    answer:
      "Movie Script Writer GPT is a free AI screenwriting assistant from AIWebTools.ai that drafts scenes in professional screenplay format, with structured action lines, sluglines and dialogue.",
    quickFacts: [
      { label: "Best for", value: "Screenwriters, filmmakers and film students" },
      { label: "What it does", value: "Scene and script drafting in industry format" },
      { label: "Strength", value: "Formatting discipline plus scene-level craft" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Format is a gatekeeper",
        body: [
          "A reader can tell within a page whether a script was written by someone who knows the conventions. Sluglines, action density, how dialogue sits on the page — these are the first filter, long before the story gets a hearing.",
          "This tool writes in that format by default, so a first-time writer's pages look like the industry expects while the ideas are still forming.",
        ],
      },
      {
        heading: "Working scene by scene",
        body: [
          "Give it a logline and it will propose a structure. Give it a scene brief — who wants what, what stands in the way, how the scene must end — and it drafts the scene with descriptions tight and dialogue doing the work.",
          "You can ask for the same scene at a different length, in a different tone, or from a different character's vantage; the comparison alone teaches craft.",
        ],
        bullets: [
          "Professional slugline, action and dialogue formatting.",
          "Structure passes: beats, act turns, sequence mapping.",
          "Character voice differentiation across the cast.",
          "Alternate takes on any scene for comparison.",
        ],
      },
      {
        heading: "Part of the studio shelf",
        body: [
          "The directory carries the rest of the production chain: Movie Scene Maker for visual planning, Movie Maker Studio for the wider production suite, and Playwriter GPT for the stage.",
          "They all live in the same free catalogue, so a project can move from script to scene planning without a new subscription at each step.",
        ],
      },
    ],
    faq: [
      {
        q: "Does it write in correct screenplay format?",
        a: "Yes — sluglines, action lines, character cues and dialogue follow standard screenplay conventions.",
      },
      {
        q: "Can it write a full feature?",
        a: "It drafts scene by scene and can carry a full script, but treat the output as a strong draft to shape rather than a finished shooting script.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "fact-checker-gpt",
    toolTitle: "FACT CHECKER GPT",
    toolSlug: "fact-checker-gpt",
    category: "AI Research Tools",
    emoji: "🔍",
    kicker: "Flagship feature",
    headline: "FACT CHECKER GPT — Misinformation meets its match",
    deck:
      "Claims travel faster than corrections. This tool slows the claim down: what is asserted, what supports it, who benefits, and how confident anyone should be.",
    metaTitle: "Fact Checker GPT — Free AI Misinformation & Bias Checker | AI Web Tools",
    metaDescription:
      "Fact Checker GPT analyses claims, articles and sources for accuracy, bias and reliability, cross-referencing evidence and explaining its reasoning. Free live chat on AI Web Tools.",
    keywords: [
      "fact checker gpt",
      "ai fact checking tool",
      "misinformation detector ai",
      "source bias analysis ai",
      "free fact check ai",
    ],
    answer:
      "Fact Checker GPT is a free AI verification assistant from AIWebTools.ai that breaks claims and articles down, weighs the supporting evidence, flags bias and explains how confident a reader should be.",
    quickFacts: [
      { label: "Best for", value: "Journalists, researchers, students and careful readers" },
      { label: "What it does", value: "Claim analysis, source evaluation and bias detection" },
      { label: "Strength", value: "Showing its reasoning rather than issuing a verdict" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Separating the claim from the noise",
        body: [
          "Paste an article and the tool does something most readers never do: it isolates the individual factual claims from the framing, the adjectives and the implication. Half of misinformation is not a false statement at all — it is a true statement arranged to suggest something else.",
          "Each claim is then assessed for what would have to be true for it to hold, what evidence exists either way, and how much of the disagreement is factual rather than political.",
        ],
        bullets: [
          "Claim-by-claim breakdown of an article or post.",
          "Source reliability and funding or interest analysis.",
          "Loaded language and framing detection.",
          "A clear statement of confidence and what would change it.",
        ],
      },
      {
        heading: "Teaching the method, not just the verdict",
        body: [
          "A verdict you cannot check is just another authority to trust. This tool is built to show the reasoning, so that after a few sessions you are performing the same checks yourself.",
          "That is the real return: a reader who asks who is making this claim, what would change their mind, and what the strongest counter-argument is.",
        ],
      },
      {
        heading: "Know the limits",
        body: [
          "No AI system has perfect or fully current knowledge, and anything breaking will be thinly evidenced by definition. Treat the output as a structured research assistant, not a final arbiter.",
          "For anything consequential, follow the primary sources it points you towards and read them yourself.",
        ],
      },
    ],
    faq: [
      {
        q: "Can Fact Checker GPT be wrong?",
        a: "Yes. It is a research assistant that shows its reasoning, not an infallible arbiter. Verify important conclusions against primary sources.",
      },
      {
        q: "What can I give it?",
        a: "A single claim, a full article, a social post or a link description — it will separate the claims and assess each one.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "trader-gpt",
    toolTitle: "Trader GPT",
    toolSlug: "trader-gpt",
    category: "Business & Finance",
    emoji: "📈",
    kicker: "Flagship feature",
    headline: "TRADER GPT — A simulation for learning the market, not beating it",
    deck:
      "Technical analysis explained in the open: what an indicator measures, what it misses, and why the confident chart on social media is usually selling something.",
    metaTitle: "Trader GPT — Free AI Market Analysis & Trading Education | AI Web Tools",
    metaDescription:
      "Trader GPT explains technical analysis, chart patterns and risk management as an educational simulation. Not financial advice. Free live chat on AI Web Tools.",
    keywords: [
      "trader gpt",
      "ai trading assistant",
      "technical analysis ai",
      "learn trading with ai",
      "market analysis chatbot",
    ],
    answer:
      "Trader GPT is a free educational AI from AIWebTools.ai that explains technical analysis, chart patterns and risk management as a simulation — it is not financial advice and must not be used to make real trading decisions.",
    quickFacts: [
      { label: "Best for", value: "Learning market mechanics and technical vocabulary" },
      { label: "What it does", value: "Explains indicators, patterns and risk management" },
      { label: "Important", value: "Educational simulation only — not financial advice" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "Why this one leads with the disclaimer",
        body: [
          "Every other flagship on this list can be used freely. This one carries a warning because money is involved and because the internet is full of tools implying they can predict a market. This one does not claim that, and neither should anything else.",
          "What it can do is teach. The vocabulary of trading is a barrier that keeps beginners dependent on whoever sounds most confident, and that dependency is where most losses begin.",
        ],
      },
      {
        heading: "What it teaches",
        body: [
          "Ask what an RSI actually measures, why a moving-average crossover lags, what a candlestick pattern does and does not imply, and how position sizing changes the arithmetic of a losing streak.",
          "It will also walk through risk management in the unglamorous detail that most content skips: expectancy, drawdown, and why a strategy with a high win rate can still be ruinous.",
        ],
        bullets: [
          "Indicator mechanics explained from first principles.",
          "Chart pattern literacy, with the caveats attached.",
          "Risk, position sizing and drawdown arithmetic.",
          "Scenario walk-throughs as practice, never as recommendation.",
        ],
      },
      {
        heading: "The line that does not move",
        body: [
          "Trader GPT is a simulation for informational and research purposes. It does not know your finances, your obligations or your jurisdiction, and it must not be relied upon for real trading decisions.",
          "Speak to a licensed financial professional before risking capital.",
        ],
      },
    ],
    faq: [
      {
        q: "Is Trader GPT financial advice?",
        a: "No. It is an educational simulation for informational and research purposes only. Consult a licensed financial professional before making any investment decision.",
      },
      {
        q: "Can it predict prices?",
        a: "No. No tool can. It explains how analysis techniques work and what they can and cannot tell you.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "talk-to-history-gpt",
    toolTitle: "TALK TO HISTORY GPT",
    toolSlug: "talk-to-history-gpt",
    category: "Time & History",
    emoji: "🏛️",
    kicker: "Flagship feature",
    headline: "TALK TO HISTORY GPT — Ask the source directly",
    deck:
      "Where the Time Machine shows you the room, this one sits you across the table from the person in it, for as long as the conversation holds.",
    metaTitle: "Talk to History GPT — Converse With Historical Figures Free | AI Web Tools",
    metaDescription:
      "Talk to History GPT lets you hold sustained, in-character conversations with historical figures, grounded in the record of their period. Free live chat on AI Web Tools.",
    keywords: [
      "talk to history gpt",
      "chat with historical figures ai",
      "history ai conversation",
      "educational history chatbot",
      "ai historical simulation",
    ],
    answer:
      "Talk to History GPT is a free educational AI from AIWebTools.ai that simulates sustained, in-character conversations with historical figures, grounded in the documented record of their period.",
    quickFacts: [
      { label: "Best for", value: "Students, teachers, writers and researchers" },
      { label: "What it does", value: "Long-form in-character conversation with historical figures" },
      { label: "Important", value: "Educational simulation, not a factual quotation source" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "A different kind of primary source",
        body: [
          "Reading a speech tells you what someone said. Questioning them tells you what they assumed. This tool simulates the second experience: a figure answering from inside their own worldview, with the limits of their era intact.",
          "That constraint is the point. A simulated 1789 revolutionary who talks like a modern commentator teaches nothing; one who cannot see past their own assumptions teaches a great deal.",
        ],
      },
      {
        heading: "Ways to use it",
        body: [
          "For teaching, run an interview and have students spot the anachronisms. For writing, interrogate a character's period logic before you put words in their mouth. For research, use it as a rehearsal space for questions you will then take to the actual archive.",
          "It holds a long conversation, so the exchange can develop the way an interview does rather than resetting every few messages.",
        ],
        bullets: [
          "Sustained in-character dialogue with any documented figure.",
          "Period-consistent worldview, vocabulary and blind spots.",
          "Classroom-ready interview exercises.",
          "Research rehearsal before you reach the archive.",
        ],
      },
      {
        heading: "What it is not",
        body: [
          "The words are a simulation, not a quotation. Nothing produced here should be cited as something a historical person actually said.",
          "Treat it as a thinking tool and verify anything you intend to publish against the documented record.",
        ],
      },
    ],
    faq: [
      {
        q: "Are the responses real historical quotes?",
        a: "No. They are simulated in-character responses grounded in the record of the period. Never cite them as genuine quotations.",
      },
      {
        q: "How is this different from Time Machine GPT?",
        a: "Time Machine GPT immerses you in an era and its events; Talk to History GPT is built for sustained one-to-one conversation with a single figure.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "perfect-prompt-engine",
    toolTitle: "PERFECT PROMPT ENGINE",
    toolSlug: "perfect-prompt-engine",
    category: "Writing & Text Generation",
    emoji: "✨",
    kicker: "Flagship feature",
    headline: "PERFECT PROMPT ENGINE — The tool that makes every other tool better",
    deck:
      "Most disappointing AI output is a prompting problem. This is a prompt engineer you can keep in your pocket, and it will run the improved prompt for you.",
    metaTitle: "Perfect Prompt Engine — Free AI Prompt Optimizer | AI Web Tools",
    metaDescription:
      "Perfect Prompt Engine rewrites vague requests into precise, high-performing prompts — and can execute them for you. Free live chat on AI Web Tools.",
    keywords: [
      "perfect prompt engine",
      "ai prompt optimizer",
      "prompt engineering tool",
      "improve chatgpt prompts",
      "free prompt generator",
    ],
    answer:
      "Perfect Prompt Engine is a free AI prompt optimiser from AIWebTools.ai that rewrites vague requests into precise, well-structured prompts and can run the improved prompt for you.",
    quickFacts: [
      { label: "Best for", value: "Anyone who uses AI tools daily" },
      { label: "What it does", value: "Rewrites and strengthens prompts, then executes them" },
      { label: "Strength", value: "Explains why each change improves the result" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "The skill nobody was taught",
        body: [
          "The gap between a mediocre AI result and an excellent one is rarely the model. It is the instruction: missing context, undefined audience, no format, no constraints, no examples.",
          "This tool takes what you typed and returns the version a professional would have written — role, context, task, format, constraints and success criteria, each in its place.",
        ],
        bullets: [
          "Rewrites a rough request into a structured prompt.",
          "Explains each change so the skill transfers to you.",
          "Adapts the prompt for writing, code, analysis or images.",
          "Runs the improved prompt and returns the result.",
        ],
      },
      {
        heading: "A multiplier across the directory",
        body: [
          "Because prompting is universal, this is the one tool that improves your results everywhere else — in the other GPTs on this site, and in whatever assistant you use elsewhere.",
          "Users who spend a week routing their requests through it generally stop needing to: the patterns become habit.",
        ],
      },
      {
        heading: "Getting the best from it",
        body: [
          "Be honest about the messy version. Paste exactly what you would have typed, along with what disappointed you about the answer you got, and it can diagnose the cause rather than guess.",
          "For image work, ask it to target the specific generator you are using — the phrasing that helps one model can actively hurt another.",
        ],
      },
    ],
    faq: [
      {
        q: "Does it work for prompts used in other AI tools?",
        a: "Yes. The improved prompts are portable — use them in any assistant or image generator you like.",
      },
      {
        q: "Will it run the prompt too?",
        a: "Yes. It can execute the optimised prompt and return the result in the same conversation.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "customizable-gpt-maker",
    toolTitle: "Customizable GPT Maker",
    toolSlug: "customizable-gpt-maker",
    category: "AI Development & Platforms",
    emoji: "🛠️",
    kicker: "Flagship feature",
    headline: "CUSTOM GPT MAKER — Build the assistant you wish existed",
    deck:
      "Every tool in this directory started as somebody's unmet need. This is the workbench where you meet your own.",
    metaTitle: "Custom GPT Maker — Build Your Own AI Assistant Free | AI Web Tools",
    metaDescription:
      "Custom GPT Maker turns an idea into a working AI assistant: role, instructions, boundaries and starter prompts, written for you. Free live chat on AI Web Tools.",
    keywords: [
      "custom gpt maker",
      "build your own ai assistant",
      "create a custom gpt",
      "ai agent builder",
      "free gpt builder tool",
    ],
    answer:
      "Custom GPT Maker is a free AI builder from AIWebTools.ai that turns a described need into a working custom assistant, writing the role, instructions, boundaries and starter prompts for you.",
    quickFacts: [
      { label: "Best for", value: "Builders, teams and anyone with a repeating task" },
      { label: "What it does", value: "Designs and writes complete custom GPT configurations" },
      { label: "Output", value: "Role, instructions, boundaries, starter prompts" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "From an idea to an instruction set",
        body: [
          "Most people describing a custom assistant describe an outcome — 'something that handles my invoices'. The gap between that and a working configuration is specification work, and specification work is exactly what this tool does.",
          "It interrogates the idea: who uses it, what inputs arrive, what good output looks like, what must never happen. Then it writes the full instruction set, ready to paste into whichever platform you build on.",
        ],
        bullets: [
          "Requirement interview that surfaces what you left unsaid.",
          "Complete system instructions with clear boundaries.",
          "Starter prompts that demonstrate the intended use.",
          "Refinement passes once you have tested the first version.",
        ],
      },
      {
        heading: "The part builders skip",
        body: [
          "Boundaries. A custom assistant without explicit limits drifts into answering things it has no business answering, which is how a friendly helper turns into a liability.",
          "This tool writes the guardrails alongside the capability, in the same voice, so the finished assistant behaves consistently under pressure.",
        ],
      },
      {
        heading: "Then keep going",
        body: [
          "Build, test with real inputs, bring the failures back and ask for a revision. Two or three rounds usually turn a decent assistant into a reliable one.",
          "If you want ideas rather than a build, the directory also carries the Custom GPT Ideas & Brainstorming Assistant.",
        ],
      },
    ],
    faq: [
      {
        q: "What do I get out of it?",
        a: "A complete configuration — role definition, system instructions, boundaries and starter prompts — that you can use on the platform of your choice.",
      },
      {
        q: "Do I need technical skill?",
        a: "No. You describe the need in plain language and it handles the specification work.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
  {
    slug: "learn-any-course-gpt",
    toolTitle: "LEARN ANY COURSE GPT",
    toolSlug: "learn-any-course-gpt",
    category: "Education & Research Tools",
    emoji: "📚",
    kicker: "Flagship feature",
    headline: "LEARN ANY COURSE GPT — A tutor with infinite patience",
    deck:
      "Any subject, any level, taught step by step — and it will explain the same idea a fourth time without a hint of impatience.",
    metaTitle: "Learn Any Course GPT — Free AI Tutor For Any Subject | AI Web Tools",
    metaDescription:
      "Learn Any Course GPT builds a structured course on any subject and teaches it lesson by lesson with examples, visuals and self-checks. Free live chat on AI Web Tools.",
    keywords: [
      "learn any course gpt",
      "free ai tutor",
      "ai course generator",
      "personalised learning ai",
      "study with ai",
    ],
    answer:
      "Learn Any Course GPT is a free AI tutor from AIWebTools.ai that builds a structured course on any subject and teaches it lesson by lesson with explanations, examples and self-check questions.",
    quickFacts: [
      { label: "Best for", value: "Students of any age, self-learners and teachers" },
      { label: "What it does", value: "Builds and teaches a full course on any subject" },
      { label: "Strength", value: "Unlimited re-explanation at your pace" },
      { label: "Price", value: FREE },
      { label: "Built by", value: "AIWebTools.ai" },
    ],
    sections: [
      {
        heading: "The classroom problem it solves",
        body: [
          "A class moves at one speed for thirty people. Some are lost by minute ten and stay lost, not because the material is beyond them but because nobody could stop and take the idea apart again.",
          "A tutor that never tires changes that arithmetic. Ask for the same concept explained with a different analogy, at a slower pace, with a worked example, as many times as it takes.",
        ],
      },
      {
        heading: "How a course is built",
        body: [
          "Name the subject and the level. The tool produces a module structure, then teaches each lesson in turn with explanation, examples and questions back at you to check that the idea landed.",
          "It supplements the text with suggested videos and visual references where a diagram beats a paragraph, and adjusts depth as soon as you say it is too fast or too shallow.",
        ],
        bullets: [
          "A module map for any subject at any level.",
          "Lesson-by-lesson teaching with worked examples.",
          "Self-check questions and correction as you go.",
          "Suggested videos and visuals for difficult concepts.",
        ],
      },
      {
        heading: "Education without a gate",
        body: [
          "This tool exists for the same reason as College Degree GPT: because access to learning should not depend on postcode or budget.",
          "Where College Degree GPT mirrors a full university programme, Learn Any Course GPT is for a single subject or skill, from GCSE algebra to advanced statistics.",
        ],
      },
    ],
    faq: [
      {
        q: "What subjects can it teach?",
        a: "Any subject you name, at the level you name — school, university or professional.",
      },
      {
        q: "How is it different from College Degree GPT?",
        a: "College Degree GPT mirrors the structure of a full degree programme. Learn Any Course GPT focuses on one subject or skill at a time.",
      },
      {
        q: "Is it free?",
        a: FREE,
      },
    ],
    publishDate: "2026-09-19",
    readTime: "5 min",
  },
];

export const getFlagshipFeatures = (): FlagshipFeature[] => flagshipFeatures;

export const getFlagshipFeatureBySlug = (slug: string): FlagshipFeature | undefined =>
  flagshipFeatures.find((f) => f.slug === slug);

export const getFlagshipFeatureByToolTitle = (title: string): FlagshipFeature | undefined => {
  const key = (title || "").trim().toLowerCase();
  return flagshipFeatures.find((f) => f.toolTitle.toLowerCase() === key);
};
