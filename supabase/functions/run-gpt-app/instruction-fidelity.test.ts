// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { appendInstructionFidelity, resolveOperationalInstructions } from "./instruction-fidelity.ts";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";

test("Alan's recovered runtime prompt matches the existing original DOCX text", () => {
  const entries = unzipSync(readFileSync(new URL("../../../public/instructions/alan-watts-gpt-page.docx", import.meta.url)));
  const xml = new TextDecoder().decode(entries["word/document.xml"]);
  const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  const original = [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map(([p]) => [...p.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => decode(m[1])).join("")).join("\n");
  expect(resolveOperationalInstructions("You are Alan Watts GPT, a philosophical guide in the spirit of Alan Watts, created by AIWebTools.ai.", "alan-watts-gpt-page")).toBe(original);
});
test("specific recovery never replaces other bots or an updated Alan prompt", () => {
  expect(resolveOperationalInstructions("New original", "alan-watts-gpt-page")).toBe("New original");
  expect(resolveOperationalInstructions("Original cannabis instructions", "cannabis-gpt-not-gpt4o1-compliant")).toBe("Original cannabis instructions");
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