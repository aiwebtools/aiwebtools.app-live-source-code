/* AIWebTools global search worker — v3 (intelligent matching + diagnostics) */
const keys = ["title", "category", "tags", "directUrl", "imageUrl", "videoUrl", "emoji", "color", "rating", "totalVotes", "isFree", "description"];
let indexPromise;
let indexReady = false;
let indexSize = 0;
let indexLoadMs = 0;

const normalize = (value) => String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// Words that carry no discriminating power in natural-language queries
const STOP_WORDS = new Set(["a","an","the","i","im","i'm","me","my","we","you","your","to","for","of","on","in","at","is","are","be","can","do","does","how","what","which","with","and","or","want","need","looking","look","find","best","top","good","great","today","now","please","help","some","any","that","this","it","make","get","using","use","app","apps","tool","tools","ai","site","website","online"]);

// Synonym / intent expansion — keeps the directory "intelligent" for phrases like
// "i want to write a book today" -> book writer, author, novel, manuscript.
const SYNONYMS = {
  book: ["book", "writer", "author", "novel", "manuscript", "ebook", "publishing", "story"],
  write: ["write", "writer", "writing", "author", "copywriting", "content"],
  writing: ["write", "writer", "writing", "author", "copywriting"],
  survival: ["survival", "survivalist", "prepper", "wilderness", "bushcraft", "offline"],
  survivalist: ["survivalist", "survival", "prepper", "wilderness", "bushcraft"],
  picture: ["picture", "image", "photo", "art", "graphic"],
  image: ["image", "picture", "photo", "art", "graphic", "design"],
  photo: ["photo", "image", "picture", "camera", "editing"],
  video: ["video", "film", "movie", "clip", "footage", "reels"],
  movie: ["movie", "film", "cinema", "video", "screenplay", "script"],
  music: ["music", "song", "audio", "track", "beat", "melody"],
  song: ["song", "music", "lyrics", "audio", "track"],
  voice: ["voice", "speech", "tts", "audio", "narration", "clone"],
  code: ["code", "coding", "developer", "programming", "ide", "engineer"],
  coding: ["code", "coding", "developer", "programming", "software"],
  agent: ["agent", "agents", "autonomous", "assistant", "workflow", "automation"],
  bot: ["bot", "bots", "chatbot", "assistant", "agent"],
  chat: ["chat", "chatbot", "assistant", "conversation", "gpt"],
  resume: ["resume", "cv", "job", "career", "hiring"],
  job: ["job", "career", "resume", "hiring", "employment"],
  logo: ["logo", "brand", "branding", "design", "graphic"],
  legal: ["legal", "law", "lawyer", "attorney", "contract", "court"],
  doctor: ["doctor", "medical", "health", "physician", "medicus"],
  health: ["health", "medical", "wellness", "doctor", "fitness"],
  money: ["money", "finance", "trading", "investing", "budget", "income"],
  trading: ["trading", "trader", "stocks", "crypto", "finance", "market"],
  school: ["school", "education", "learning", "course", "study", "teacher"],
  learn: ["learn", "learning", "course", "education", "tutor", "study"],
  teacher: ["teacher", "tutor", "education", "school", "learning"],
  presentation: ["presentation", "slides", "powerpoint", "pptx", "deck"],
  spreadsheet: ["spreadsheet", "excel", "sheets", "data", "table"],
  seo: ["seo", "marketing", "keywords", "ranking", "traffic"],
  marketing: ["marketing", "ads", "advertising", "seo", "campaign", "social"],
  game: ["game", "gaming", "gamedev", "unity", "unreal", "design"],
  free: ["free", "opensource", "open", "source", "nocost"],
  gpt: ["gpt", "chatgpt", "assistant", "custom"],
};

const expandWord = (word) => SYNONYMS[word] || [word];

const distance = (a, b) => {
  if (a === b) return 0;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = saved;
    }
  }
  return row[b.length];
};

const loadIndex = () => {
  if (!indexPromise) {
    const started = Date.now();
    indexPromise = fetch("/search-catalog.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Search catalog HTTP ${response.status}`);
        return response.json();
      })
      .then((rows) => {
        const built = rows.map((row, order) => {
          const tool = Object.fromEntries(keys.map((key, i) => [key, row[i]]).filter(([, value]) => value !== null && value !== undefined));
          const title = normalize(tool.title);
          const category = normalize(tool.category);
          const tags = normalize((tool.tags || []).join(" "));
          const description = normalize(tool.description);
          return {
            tool,
            order,
            title,
            compact: title.replace(/\s+/g, ""),
            words: title.split(" ").filter(Boolean),
            category,
            tags,
            description,
            searchable: `${title} ${category} ${tags} ${description}`,
          };
        });
        indexReady = true;
        indexSize = built.length;
        indexLoadMs = Date.now() - started;
        self.postMessage({ type: "status", ready: true, size: indexSize, loadMs: indexLoadMs });
        return built;
      })
      .catch((error) => {
        indexPromise = null;
        self.postMessage({ type: "status", ready: false, size: 0, error: String(error) });
        throw error;
      });
  }
  return indexPromise;
};

const score = (entry, query, terms) => {
  let value = 0;
  const compact = query.replace(/\s+/g, "");
  if (entry.title === query) value += 1000000;
  else if (entry.compact === compact) value += 950000;
  else if (entry.title.startsWith(query)) value += 500000 + Math.round(180000 * (query.length / Math.max(query.length, entry.title.length)));
  else if (entry.title.includes(query)) value += 300000;
  else if (entry.compact.includes(compact)) value += 220000;
  else if (entry.searchable.includes(query)) value += 90000;

  let matches = 0;
  for (const group of terms) {
    let best = 0;
    for (let g = 0; g < group.length; g += 1) {
      const word = group[g];
      // Primary term scores full weight; synonyms score a fraction.
      const weight = g === 0 ? 1 : 0.45;
      let hit = 0;
      if (entry.words.includes(word)) hit = 45000;
      else if (entry.words.some((candidate) => candidate.startsWith(word) || word.startsWith(candidate))) hit = 26000;
      else if (word.length >= 4 && entry.title.includes(word)) hit = 20000;
      else if (entry.tags.includes(word)) hit = 10000;
      else if (entry.category.includes(word)) hit = 8000;
      else if (word.length >= 4 && entry.description.includes(word)) hit = 4200;
      else if (word.length >= 4 && entry.words.some((candidate) => Math.abs(candidate.length - word.length) <= 2 && distance(candidate, word) <= (word.length >= 5 ? 2 : 1))) hit = 14000;
      const scaled = hit * weight;
      if (scaled > best) best = scaled;
    }
    if (best > 0) { value += best; matches += 1; }
  }

  if (terms.length > 1 && matches === terms.length) value += 80000;
  if (!matches && !value) return 0;
  // AIWebTools' own GPTs always take priority over lookalike entries.
  if (entry.tags.includes("aiwebtools") || entry.tags.includes("custom gpt")) value += 60000;
  // Prefer concise, on-the-nose titles over long ones that merely contain the query.
  value += Math.max(0, 12000 - entry.title.length * 120);
  return value + Math.min(1000, Number(entry.tool.rating || 0) * 100);
};

self.onmessage = async ({ data }) => {
  const { id, query: rawQuery, type } = data || {};

  if (type === "ping") {
    void loadIndex().catch(() => {});
    self.postMessage({ type: "status", ready: indexReady, size: indexSize, loadMs: indexLoadMs });
    return;
  }

  const startedAt = Date.now();
  try {
    const query = normalize(rawQuery);
    const rawWords = query.split(" ").filter(Boolean);
    // Strip filler words for long natural-language queries, keep everything for short ones.
    const meaningful = rawWords.length > 2 ? rawWords.filter((w) => !STOP_WORDS.has(w)) : rawWords;
    const base = meaningful.length > 0 ? meaningful : rawWords;
    const terms = base.map(expandWord);

    const index = await loadIndex();
    const results = index.map((entry) => ({ entry, score: score(entry, query, terms) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.order - b.entry.order)
      .map((item) => item.entry.tool);
    self.postMessage({
      id,
      query: rawQuery,
      results,
      meta: { indexSize, elapsedMs: Date.now() - startedAt, terms: base, matched: results.length },
    });
  } catch (error) {
    self.postMessage({ id, query: rawQuery, results: [], error: String(error), meta: { indexSize, elapsedMs: Date.now() - startedAt } });
  }
};

loadIndex();
