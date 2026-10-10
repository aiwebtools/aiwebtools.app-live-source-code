import { expect, test } from "bun:test";
import { selectBotModel } from "./model-selection";
test("every bot defaults to the cheapest model", () => {
  expect(selectBotModel("openai/gpt-6-astra", undefined)).toBe("google/gemini-3.1-flash-lite");
  expect(selectBotModel("google/gemini-3.7-flash", "default")).toBe("google/gemini-3.1-flash-lite");
});
test("only the two budget models are selectable, never premium ones", () => {
  expect(selectBotModel("x", "google/gemini-3-flash-preview")).toBe("google/gemini-3-flash-preview");
  expect(selectBotModel("x", "openai/gpt-6-astra")).toBeNull();
  expect(selectBotModel("x", "fake/model")).toBeNull();
});
