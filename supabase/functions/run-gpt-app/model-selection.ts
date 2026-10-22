import { BIONIC_GLM_MODEL, BIONIC_DEEPSEEK_MODEL } from "./bionic-provider.ts";
// Master-selected economy default; legacy manual picks remain available, never automatic fallbacks.
export const CHEAPEST_MODEL = BIONIC_GLM_MODEL;
export const SELECTABLE_MODELS = [CHEAPEST_MODEL, BIONIC_DEEPSEEK_MODEL, "openai/gpt-6-luna", "google/gemini-3.1-flash-lite", "google/gemini-3-flash-preview"];
export function selectBotModel(_original: string, requested: unknown): string | null {
  if (requested === undefined || requested === "default") return CHEAPEST_MODEL;
  return typeof requested === "string" && SELECTABLE_MODELS.includes(requested) ? requested : null;
}

export function selectTurnModel(original: string, requested: unknown, message: string, instructions: string, personalModel?: string): string | null {
  if (personalModel) return personalModel;
  const selected = selectBotModel(original, requested);
  if (!selected || (requested !== undefined && requested !== "default")) return selected;
  const demandingRequest = /\b(debug|refactor|implement|write (?:the |a |an )?(?:code|function|script|program)|coding|programming|algorithm|prove|proof|derive|regression|statistical analysis|multi[- ]step|advanced reasoning|complex (?:math|analysis|reasoning)|optimi[sz]e (?:code|query|algorithm))\b/i;
  const specialist = /\b(?:software engineer|coding assistant|programming assistant|mathematician|advanced mathematics)\b/i;
  return demandingRequest.test(message) || (specialist.test(instructions) && message.trim().length > 25)
    ? BIONIC_DEEPSEEK_MODEL : BIONIC_GLM_MODEL;
}
