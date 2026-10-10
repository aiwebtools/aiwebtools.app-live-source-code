// Cheapest available chat model is the default for every bot to keep chat near-free.
export const CHEAPEST_MODEL = "google/gemini-3.1-flash-lite";
export const SELECTABLE_MODELS = ["google/gemini-3.1-flash-lite", "google/gemini-3-flash-preview"];
export function selectBotModel(_original: string, requested: unknown): string | null {
  if (requested === undefined || requested === "default") return CHEAPEST_MODEL;
  return typeof requested === "string" && SELECTABLE_MODELS.includes(requested) ? requested : null;
}
