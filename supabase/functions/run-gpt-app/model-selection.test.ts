import { expect, test } from "bun:test";
import { selectBotModel } from "./model-selection";
test("model selection preserves the programmed original unless explicitly selected", () => {
  expect(selectBotModel("google/gemini-3.7-flash", undefined)).toBe("google/gemini-3.7-flash");
  expect(selectBotModel("google/gemini-3.7-flash", "default")).toBe("google/gemini-3.7-flash");
  expect(selectBotModel("google/gemini-3.7-flash", "google/gemini-3-flash-preview")).toBe("google/gemini-3-flash-preview");
  expect(selectBotModel("google/gemini-3.7-flash", "fake/model")).toBeNull();
});
test("the free picker accepts only the two configured budget alternatives, not premium models", () => {
  expect(selectBotModel("google/gemini-3.7-flash", "google/gemini-3.1-flash-lite")).toBe("google/gemini-3.1-flash-lite");
  expect(selectBotModel("google/gemini-3.7-flash", "openai/gpt-6-astra")).toBeNull();
  expect(selectBotModel("google/gemini-3.7-flash", "anthropic/claude-opus-5-5")).toBeNull();
});