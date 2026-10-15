import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { unzipSync } from "fflate";
import originals from "./official-instructions.json";
import provenance from "./instruction-provenance.json";
import seeds from "../seed-gpt-apps/apps.json";
import { resolveOperationalInstructions, appendInstructionFidelity } from "./instruction-fidelity";

const root = new URL("../../../", import.meta.url);
const archives = new Map<string, ReturnType<typeof unzipSync>>();
const decode = (s: string) => s.replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
function documentText(data: Uint8Array): string {
  const xml = new TextDecoder().decode(unzipSync(data)["word/document.xml"]);
  return [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map(([paragraph]) =>
    [...paragraph.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:(tab|br|cr)\b[^>]*\/>/g)]
      .map((match) => match[2] ? match[2] === "tab" ? "\t" : "\n" : decode(match[1])).join("")
  ).join("\n");
}
type Source = { source?: string; archive?: string; entry?: string; sha256: string; chars: number };
for (const [slug, text] of Object.entries(originals)) {
  test(`${slug}: complete matching source reaches the model verbatim`, () => {
    const source: Source = provenance[slug as keyof typeof provenance];
    let expected: string;
    if (source.archive && source.entry) {
      let archive = archives.get(source.archive);
      if (!archive) { archive = unzipSync(readFileSync(new URL(source.archive, root))); archives.set(source.archive, archive); }
      const data = archive[source.entry];
      if (!data) throw new Error(`Missing archived original for ${slug}`);
      expected = documentText(data);
    } else if (source.source?.endsWith(".docx")) {
      expected = documentText(readFileSync(new URL(source.source, root)));
    } else {
      const seed = seeds.find((bot) => bot.slug === slug);
      if (!seed) throw new Error(`Missing seed for ${slug}`);
      expected = seed.system_prompt;
    }
    expect(text).toBe(expected);
    expect(createHash("sha256").update(text).digest("hex")).toBe(source.sha256);
    const brain = resolveOperationalInstructions("Short legacy summary", slug);
    expect(brain).toBe(expected);
    expect(appendInstructionFidelity(brain, slug, slug).slice(0, expected.length)).toBe(expected);
  });
}
test("every ordinary official bot has full source coverage; oversized book is explicitly excluded, never silently truncated", () => {
  expect(Object.keys(originals)).toHaveLength(418);
  const missing = seeds.filter((bot) => !(bot.slug in originals)).map((bot) => bot.slug);
  expect(missing).toEqual(["gospel-of-deployment-full-book"]);
  expect(() => resolveOperationalInstructions("truncated book", "gospel-of-deployment-full-book")).toThrow("truncated summary cannot be used");
});