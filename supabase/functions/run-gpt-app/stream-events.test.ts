import { expect, test } from "bun:test";
import { readChatStreamEvent } from "./stream-events";

test("streamed provider errors remain visible instead of becoming empty replies", () => {
  expect(() => readChatStreamEvent('{"error":{"message":"Not enough credits"}}')).toThrow("Not enough credits");
  expect(() => readChatStreamEvent('{"error":"The assistant could not finish this reply."}')).toThrow("The assistant could not finish this reply.");
});

test("text and tool deltas are preserved while metadata is ignored", () => {
  expect(readChatStreamEvent('{"choices":[{"delta":{"content":"Hello, Mira"}}]}').content).toBe("Hello, Mira");
  expect(readChatStreamEvent('{"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"name":"web_search"}}]}}]}').tool_calls[0].function.name).toBe("web_search");
  expect(readChatStreamEvent('{"usage":{"total_tokens":120}}')).toBeUndefined();
});