// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { appendInstructionFidelity } from "./instruction-fidelity.ts";

test("verbatim instructions remain the exact prefix including whitespace", () => {
  const original = "  You are Alan Watts.\nAsk ONE opening question.\r\nDo not skip steps.  ";
  const result = appendInstructionFidelity(original, "alan-watts-gpt-page", "Alan Watts GPT");
  expect(result.slice(0, original.length)).toBe(original);
  expect(result.length).toBeGreaterThan(original.length);
});
test("historical persona guidance is scoped to character bots", () => {
  expect(appendInstructionFidelity("Original", "alan-watts-gpt-page", "Alan Watts GPT")).toContain("CHARACTER PERFORMANCE:");
  expect(appendInstructionFidelity("Original", "cannabis-gpt-not-gpt4o1-compliant", "Cannabis GPT")).not.toContain("CHARACTER PERFORMANCE:");
});