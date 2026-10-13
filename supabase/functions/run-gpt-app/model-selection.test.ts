import { expect, test } from "bun:test";
import { selectBotModel } from "./model-selection";
test("every bot defaults to the cheapest model", () => {
  expect(selectBotModel("openai/gpt-6-astra", undefined)).toBe("openai/gpt-6-luna");
  expect(selectBotModel("google/gemini-3.7-flash", "default")).toBe("openai/gpt-6-luna");
});
test("only budget models are selectable, never premium ones", () => {
  expect(selectBotModel("x", "openai/gpt-6-luna")).toBe("openai/gpt-6-luna");
  expect(selectBotModel("x", "google/gemini-3-flash-preview")).toBe("google/gemini-3-flash-preview");
  expect(selectBotModel("x", "openai/gpt-6-astra")).toBeNull();
  expect(selectBotModel("x", "fake/model")).toBeNull();
});
test("guest 10-message and member daily caps are removed from the request handler", async () => {
  const source = await Bun.file(new URL("./index.ts", import.meta.url)).text();
  expect(source).not.toContain("GUEST_DAILY_LIMIT");
  expect(source).not.toContain("DAILY_LIMIT");
  expect(source).not.toContain("used >= limit");
});
