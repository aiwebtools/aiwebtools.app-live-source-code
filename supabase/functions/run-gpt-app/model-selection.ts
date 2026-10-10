export const SELECTABLE_MODELS = ["google/gemini-3-flash-preview", "google/gemini-3.1-flash-lite"];
export function selectBotModel(original: string, requested: unknown): string | null {
  if (requested === undefined || requested === "default") return original;
  return typeof requested === "string" && SELECTABLE_MODELS.includes(requested) ? requested : null;
}