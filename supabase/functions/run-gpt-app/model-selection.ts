import { BIONIC_GLM_MODEL, BIONIC_DEEPSEEK_MODEL } from "./bionic-provider.ts";
// Master-selected economy default; legacy manual picks remain available, never automatic fallbacks.
export const CHEAPEST_MODEL = BIONIC_GLM_MODEL;
export const SELECTABLE_MODELS = [CHEAPEST_MODEL, BIONIC_DEEPSEEK_MODEL, "openai/gpt-6-luna", "google/gemini-3.1-flash-lite", "google/gemini-3-flash-preview"];
export function selectBotModel(_original: string, requested: unknown): string | null {
  if (requested === undefined || requested === "default") return CHEAPEST_MODEL;
  return typeof requested === "string" && SELECTABLE_MODELS.includes(requested) ? requested : null;
}

export function selectTurnModel(original: string, requested: unknown, message: string, _instructions: string, personalModel?: string): string | null {
  if (personalModel) return personalModel;
  const selected = selectBotModel(original, requested);
  if (!selected || (requested !== undefined && requested !== "default")) return selected;
  const codeTask = /\b(?:debug|refactor)\b|\b(?:write|implement|optimi[sz]e|fix|review)\b[^\n.!?]{0,65}\b(?:code|function|script|program|algorithm|sql|typescript|javascript|python|query)\b|\b(?:coding|programming)\b|```(?:python|py|js|javascript|ts|typescript|sql|cpp|rust)\b/i;
  const advancedTask = /\b(?:advanced reasoning|complex (?:math|analysis|reasoning)|statistical analysis|regression analysis|prove (?:the |a |this )?(?:theorem|lemma|identity)|(?:mathematical|formal) proof|derive (?:the |a |this )?(?:equation|formula|expression))\b/i;
  return codeTask.test(message) || advancedTask.test(message) ? BIONIC_DEEPSEEK_MODEL : BIONIC_GLM_MODEL;
}
