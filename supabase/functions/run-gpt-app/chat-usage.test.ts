import { expect, test } from "bun:test";
import { readTokenUsage } from "../_shared/chat-usage";
test("provider-reported tokens include input, output and total without estimates", () => {
  expect(readTokenUsage({ prompt_tokens: 120, completion_tokens: 45, total_tokens: 165 })).toEqual({ inputTokens: 120, outputTokens: 45, totalTokens: 165 });
  expect(readTokenUsage({ inputTokens: 10, outputTokens: 5 })).toEqual({ inputTokens: 10, outputTokens: 5, totalTokens: 15 });
});
test("missing or invalid usage never becomes a fabricated zero token count", () => {
  expect(readTokenUsage(undefined)).toBeNull();
  expect(readTokenUsage({ prompt_tokens: -1, completion_tokens: 5 })).toBeNull();
  expect(readTokenUsage({ total_tokens: 50 })).toBeNull();
});