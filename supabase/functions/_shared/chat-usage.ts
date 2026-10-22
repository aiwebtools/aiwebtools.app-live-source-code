export interface ChatUsage { model: string; inputTokens: number; outputTokens: number; totalTokens: number; complete: boolean }
const count = (n: unknown): number | null => typeof n === "number" && Number.isSafeInteger(n) && n >= 0 ? n : null;
export function readTokenUsage(value: unknown): Omit<ChatUsage, "model" | "complete"> | null {
  if (!value || typeof value !== "object") return null;
  const u = value as Record<string, unknown>;
  const inputTokens = count(u.prompt_tokens ?? u.input_tokens ?? u.inputTokens);
  const outputTokens = count(u.completion_tokens ?? u.output_tokens ?? u.outputTokens);
  if (inputTokens === null || outputTokens === null) return null;
  return { inputTokens, outputTokens, totalTokens: count(u.total_tokens ?? u.totalTokens) ?? inputTokens + outputTokens };
}