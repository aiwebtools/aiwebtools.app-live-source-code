import type { Tool } from "@/types/tools";

/**
 * Digital resurrection = an AI that lets you talk with someone who once lived
 * (gurus, philosophers, saints, prophets, scientists, historical figures, lost
 * loved ones) or with mythological/divine personas. Tagging is data-driven so
 * every search bar, filter and helper AI can recognise these tools.
 */
export const RESURRECTION_TAG = "Digital Resurrection";

// Real people who have died, plus mythological/divine figures people "talk to".
const FIGURES = [
  "alan watts", "einstein", "tesla", "socrates", "plato", "aristotle", "confucius", "lao tzu", "laozi",
  "buddha", "siddhartha", "jesus", "yeshua", "yeshaya", "christ", "mary magdalene", "moses", "muhammad", "rumi",
  "hildegard", "paracelsus", "da vinci", "leonardo", "shakespeare", "nietzsche", "marcus aurelius", "seneca",
  "epictetus", "pythagoras", "hermes trismegistus", "thoth", "gandhi", "martin luther king", "mlk", "lincoln",
  "napoleon", "cleopatra", "julius caesar", "newton", "galileo", "copernicus", "darwin", "edison", "kepler",
  "carl jung", "freud", "spinoza", "descartes", "kant", "krishnamurti", "yogananda", "osho", "ram dass",
  "vivekananda", "ramana", "terence mckenna", "manly p. hall", "manly hall", "edgar cayce", "blavatsky",
  "nostradamus", "john dee", "isaac", "geronimo", "sitting bull", "crazy horse", "tutankhamun", "pharaoh",
  "mani", "zoroaster", "zarathustra", "arius", "origen", "augustine", "aquinas", "francis of assisi",
  "joan of arc", "teresa of avila", "meister eckhart", "rasputin", "bruce lee", "elvis", "tupac", "biggie",
  "bob marley", "john lennon", "jimi hendrix", "michael jackson", "kurt cobain", "frida kahlo", "van gogh",
  "picasso", "mozart", "beethoven", "bach", "sun tzu", "genghis khan", "alexander the great", "hypatia",
  "carl sagan", "stephen hawking", "feynman", "walt whitman", "thoreau", "emerson", "mark twain", "edgar allan poe",
  "abraham", "solomon", "king david", "enoch", "elijah", "titanic", "founding fathers", "ben franklin",
  "franklin", "jefferson", "washington", "churchill", "malcolm x", "harriet tubman", "frederick douglass",
  "god", "gods", "goddess", "deity", "deities", "zeus", "odin", "thor", "isis", "osiris", "ra ", "anubis",
  "athena", "apollo", "shiva", "vishnu", "krishna", "kali", "ganesh", "quetzalcoatl", "mythology", "mythological",
];

// Phrases that describe bringing someone back to talk with.
const PHRASES = [
  "resurrect", "resurrection", "ressurection", "talk to history", "historical figure", "historical figures",
  "talk to the gods", "loved ones who have passed", "passed away", "deceased", "departed", "past voices",
  "speak with the dead", "talk to the dead", "afterlife", "ancestor", "digital clone", "digital twin",
  "immortalize", "legacy", "in the persona of", "embodies", "embody", "first person as", "inspired by the visionary",
  "ai embodiment", "reincarnat", "bring back", "come alive", "brings the voices",
];

const HISTORY_WORDS = /\b(history|historical|histories|ancient|era|medieval|renaissance|archae|archeolog|antique|titanic|time machine|time travel|empire|civilization|founding fathers)\w*/i;

const wordRe = (w: string) => new RegExp(`(^|[^a-z])${w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i");
const FIGURE_RES = FIGURES.map(wordRe);

// General chat platforms, robots and coding tools that merely mention personas.
const NOT_RESURRECTION = /character\.ai|^poe\b|chattycat|cody|optimus|humanoid robot|god mode|g-mode|bill donahue|apothecary/i;

export function isDigitalResurrectionTool(tool: Pick<Tool, "title" | "description">): boolean {
  const title = tool.title || "";
  if (NOT_RESURRECTION.test(title)) return false;
  const text = `${title} ${tool.description || ""}`.toLowerCase();
  // Must be a conversational persona product, not e.g. "Tesla" cars.
  const persona = /\b(gpt|chat|bot|talk|conversation|speak|persona|simulat|companion|oracle)\b/i.test(text);
  if (!persona) return false;
  if (PHRASES.some(p => text.includes(p)) && /gpt|talk|chat|speak|conversation/i.test(text)) return true;
  return FIGURE_RES.some(re => re.test(title));
}

export function isHistoryTool(tool: Pick<Tool, "title" | "description" | "category">): boolean {
  return HISTORY_WORDS.test(`${tool.title} ${tool.description || ""} ${tool.category || ""}`);
}

export const RESURRECTION_TAGS = [RESURRECTION_TAG, "Resurrection", "Historical Figure", "Talk to the Past", "Persona Simulation"];

export function applyResurrectionAndHistoryTags(tools: Tool[]): Tool[] {
  return tools.map(tool => {
    const tags = [...(tool.tags || [])];
    const add = (t: string) => { if (!tags.includes(t)) tags.push(t); };
    if (isDigitalResurrectionTool(tool)) {
      RESURRECTION_TAGS.forEach(add);
      add("Simulation");
    }
    if (isHistoryTool(tool)) add("History");
    return tags.length === (tool.tags || []).length ? tool : { ...tool, tags };
  });
}
