import { expect, test } from "bun:test";
import { selectBotModel } from "./model-selection";
test("model selection preserves the programmed original unless explicitly selected", () => {
  expect(selectBotModel("google/gemini-3.7-flash", undefined)).toBe("google/gemini-3.7-flash");
  expect(selectBotModel("google/gemini-3.7-flash", "default")).toBe("google/gemini-3.7-flash");
  expect(selectBotModel("google/gemini-3.7-flash", "google/gemini-3-flash-preview")).toBe("google/gemini-3-flash-preview");
  expect(selectBotModel("google/gemini-3.7-flash", "fake/model")).toBeNull();
});