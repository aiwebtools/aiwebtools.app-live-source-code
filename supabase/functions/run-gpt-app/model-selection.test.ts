import { expect, test } from "bun:test";
import { selectBotModel, selectTurnModel } from "./model-selection";
test("ordinary in-house chats default to Master's GLM Bionic model", () => {
  expect(selectBotModel("openai/gpt-6-astra", undefined)).toBe("bionic/glm-5.3-flash");
  expect(selectTurnModel("google/gemini-3.7-flash", "default", "Take me to Rome in 100 CE", "Time traveler")).toBe("bionic/glm-5.3-flash");
});
test("advanced reasoning and coding use Master's DeepSeek Bionic model", () => {
  expect(selectTurnModel("x", "default", "Debug this TypeScript function", "Assistant")).toBe("bionic/deepseek-v4.1-flash");
  expect(selectTurnModel("x", undefined, "Prove the theorem step by step", "Assistant")).toBe("bionic/deepseek-v4.1-flash");
});
test("personal providers and manual picks cannot be overridden by auto routing", () => {
  expect(selectTurnModel("x", "default", "Debug my code", "Assistant", "gemini-2.5-flash")).toBe("gemini-2.5-flash");
  expect(selectTurnModel("x", "bionic/glm-5.3-flash", "Debug my code", "Assistant")).toBe("bionic/glm-5.3-flash");
});
test("ordinary tasks stay GLM even in specialist bot brains", () => {
  for (const message of ["Hello, tell me what you can do for me today", "Write a multi-step plan for growing tomatoes", "Implement a daily exercise routine", "I need proof of address", "Tell me about the history of algorithms"]) {
    expect(selectTurnModel("x", "default", message, "Software engineer, coding assistant, mathematician")).toBe("bionic/glm-5.3-flash");
  }
});
test("real coding and advanced analysis tasks benefit from DeepSeek", () => {
  for (const message of ["Write a Python script to sort my CSV", "Implement a function to parse dates", "Derive the equation for orbital velocity", "Run regression analysis on this dataset"]) {
    expect(selectTurnModel("x", "default", message, "Assistant")).toBe("bionic/deepseek-v4.1-flash");
  }
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
