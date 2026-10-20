// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { appendInstructionFidelity, isStellarisSpaceBot, isTimeMachineStoryBot, resolveOperationalInstructions } from "./instruction-fidelity.ts";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import decoded from "./decoded-archive-instructions.json";

test("Alan's recovered runtime prompt matches the existing original DOCX text", () => {
  const entries = unzipSync(readFileSync(new URL("../../../public/instructions/alan-watts-gpt-page.docx", import.meta.url)));
  const xml = new TextDecoder().decode(entries["word/document.xml"]);
  const decode = (s: string) => s.replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  const original = [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map(([p]) => [...p.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => decode(m[1])).join("")).join("\n");
  expect(resolveOperationalInstructions("You are Alan Watts GPT, a philosophical guide in the spirit of Alan Watts, created by AIWebTools.ai.", "alan-watts-gpt-page")).toBe(original);
});
test("community, device and unknown bots retain their own complete authored instructions", () => {
  for (const slug of ["community-my-guide", "custom-my-guide", "unregistered-bot"]) {
    expect(resolveOperationalInstructions("My full original\n  with spacing", slug)).toBe("My full original\n  with spacing");
  }
});

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

test("generated reports receive the actual server date after the unchanged original", () => {
  const result = appendInstructionFidelity("Original", "community-analytic-mastermind-gpt", "Analytic Mastermind GPT", "2026-10-16");
  expect(result.startsWith("Original")).toBe(true);
  expect(result).toContain("Current UTC date: 2026-10-16.");
});

test("binary Gemini archives use their complete decoded instruction field", () => {
  expect(Object.keys(decoded)).toHaveLength(4);
  for (const [slug, original] of Object.entries(decoded)) {
    expect(resolveOperationalInstructions("binary container", slug)).toBe(original);
    expect(original.length).toBeGreaterThan(6000);
  }
});

test("imaginative delivery applies to Time Machine and its existing variants only", () => {
  for (const slug of ["time-machine-gpt", "time-machine-gpt-v2", "time-machine-of-unwritten-history-gpt", "nativeamerican-timemachine"]) {
    expect(isTimeMachineStoryBot(slug, "TIME MACHINE GPT")).toBe(true);
  }
  for (const name of ["Medicus", "Trader GPT", "Historical Headlines GPT", "Automobile GPT"]) {
    expect(isTimeMachineStoryBot("other-bot", name)).toBe(false);
  }
});

test("Time Machine execution guidance preserves the complete authored brain", () => {
  const original = resolveOperationalInstructions("Original time travel instructions\n  Keep these.", "time-machine-gpt");
  const result = appendInstructionFidelity(original, "time-machine-gpt", "TIME MACHINE GPT");
  expect(result.slice(0, original.length)).toBe(original);
  expect(result).toContain("TIME MACHINE STORYTELLING:");
  expect(appendInstructionFidelity("Original", "medicus", "Medicus")).not.toContain("TIME MACHINE STORYTELLING:");
});
test("Stellaris frontier guidance applies only to Stellaris and keeps the authored brain first", () => {
  for (const slug of ["stellaris", "community-stellaris", "community-stellaris-space-explorer-v2"]) expect(isStellarisSpaceBot(slug, "Stellaris")).toBe(true);
  expect(isStellarisSpaceBot("time-machine-gpt", "TIME MACHINE GPT")).toBe(false);
  const result = appendInstructionFidelity("Original Stellaris directions", "stellaris", "Stellaris: AI Space Explorer");
  expect(result.startsWith("Original Stellaris directions")).toBe(true);
  expect(result).toContain("STELLARIS FRONTIER OPERATIONS:");
  expect(appendInstructionFidelity("Original", "medicus", "Medicus")).not.toContain("STELLARIS FRONTIER OPERATIONS:");
});
