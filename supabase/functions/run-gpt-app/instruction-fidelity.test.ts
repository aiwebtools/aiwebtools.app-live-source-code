// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { appendInstructionFidelity, isStellarisSpaceBot, isTimeMachineStoryBot, resolveOperationalInstructions } from "./instruction-fidelity.ts";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import decoded from "./decoded-archive-instructions.json" with { type: "json" };
import { BOT_ENHANCEMENTS } from "./instruction-fidelity.ts";

test("reviewed bot enhancements match real slugs without changing authored prefixes", () => {
  const cases = [
    ["community-3d-print-concept-prototype-designer", "3D CONCEPT PROGRESSION"],
    ["survivalist-gpt-public-open-source-for-local-deployment-by-aiwebtools", "SURVIVAL PHOTO TRIAGE"],
    ["1995-illuminati-card-game-gpt", "CARD GAME TURN CONTINUITY"],
    ["stellaris-space-explorer", "STELLARIS DIAGNOSTIC EVIDENCE"],
    ["community-stellaris", "STELLARIS DIAGNOSTIC EVIDENCE"],
  ];
  const original = "  Authored opening\r\nKeep all required steps.  ";
  for (const [slug, marker] of cases) {
    const result = appendInstructionFidelity(original, slug, "Assistant");
    expect(result.slice(0, original.length)).toBe(original);
    expect(BOT_ENHANCEMENTS.filter((e) => e.pattern.test(slug) && e.guidance.startsWith(marker))).toHaveLength(1);
    expect(result).toContain(marker);
    expect(appendInstructionFidelity(original, "medicus", "Medicus")).not.toContain(marker);
  }
});

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
test("theory delivery supplement applies across bots without rewriting any original", () => {
  const original = "  Original instructions\r\nRequired opening and workflow.  ";
  for (const slug of ["aether-guide", "community-mind-exploration", "custom-theory-guide", "time-machine-gpt"]) {
    const result = appendInstructionFidelity(original, slug, "Guide");
    expect(result.slice(0, original.length)).toBe(original);
    expect(result).toContain("IMMERSIVE THEORY AND STORY DELIVERY:");
    expect(result).toContain("Keep factual claims accurate");
  }
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

test("review enhancements apply only to their bots", () => {
  const robot = appendInstructionFidelity("ORIG", "disable-that-robot-gpt", "Disable That Robot GPT");
  if (!robot.startsWith("ORIG") || !robot.includes("ROBOT DISABLEMENT MISSION MODE")) throw new Error("robot");
  if (!appendInstructionFidelity("O", "indiana-archeologist-gpt", "Indiana Archeologist GPT").includes("FIELD EXPEDITION DELIVERY")) throw new Error("indy");
  if (!appendInstructionFidelity("O", "marriage-mender-gpt", "Marriage Mender GPT").includes("MEDIATION FLOW")) throw new Error("mm");
  const other = appendInstructionFidelity("O", "fact-checker-gpt", "Fact Checker GPT");
  if (/MISSION MODE|EXPEDITION DELIVERY|MEDIATION FLOW/.test(other)) throw new Error("leak");
});
