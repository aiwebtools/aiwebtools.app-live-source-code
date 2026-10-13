// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { normalizeMessage, requiresFirstSearch } from "./input-context.ts";

test("first response must search when the user asks for web research", () => {
  expect(requiresFirstSearch("Search the web for NASA's latest news", "You are Father Time.")).toBe(true);
});
test("instruction-mandated first-response search works without a search button", () => {
  expect(requiresFirstSearch("What happened with NASA launches?", "Always search the web before answering.")).toBe(true);
  expect(requiresFirstSearch("Tell me a fictional story", "You can use web search.")).toBe(false);
});
test("a 3 MB file summary survives beyond the former 8000-character message cutoff", () => {
  const result = normalizeMessage({ role: "user", content: "Analyze it", attachments: [{ name: "data.csv", size: 3 * 1024 * 1024, context: "a".repeat(20000) + "sum=350099" }] });
  expect(result.content).toContain("sum=350099");
  expect(result.content.length).toBeGreaterThan(20000);
});
test("attachments cannot override their bounded context or arrive as assistant data", () => {
  expect(normalizeMessage({ role: "user", content: "Test", attachments: [{ name: "data.csv", size: 3000000, context: "x".repeat(24000) + "OUTSIDE_LIMIT" }] }).content).not.toContain("OUTSIDE_LIMIT");
  expect(normalizeMessage({ role: "assistant", content: "Test", attachments: [{ name: "data.csv", size: 3000000, context: "ATTACHMENT" }] }).content).toBe("Test");
});