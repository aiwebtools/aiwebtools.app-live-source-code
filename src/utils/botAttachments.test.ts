// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { analyzeDataText, MAX_DATA_FILE_BYTES, validateDataFile } from "./botAttachments";

test("accepts a 3 megabyte data file", () => {
  expect(() => validateDataFile("data.csv", 3 * 1024 * 1024)).not.toThrow();
});
test("10 MB ceiling is enforced", () => {
  expect(() => validateDataFile("data.csv", MAX_DATA_FILE_BYTES)).not.toThrow();
  expect(() => validateDataFile("data.csv", MAX_DATA_FILE_BYTES + 1)).toThrow();
});
test("summarizes every CSV row, including data after the old 8000 character cutoff", () => {
  const data = "label,value\n" + "sample,1\n".repeat(350000) + "final,99\n";
  const result = analyzeDataText("data.csv", new TextEncoder().encode(data).length, data);
  expect(result.context).toContain("ALL 350001 data rows");
  expect(result.context).toContain("sum=350099");
  expect(result.context).toContain("max=99");
  expect(result.context).toContain("final,99");
  expect(result.context.length).toBeLessThanOrEqual(24000);
});
test("quoted CSV cells and embedded newlines do not miscount records", () => {
  const data = 'name,value\n"hello, world",3\n"two\nlines",7';
  expect(analyzeDataText("data.csv", data.length, data).context).toContain("ALL 2 data rows");
  expect(analyzeDataText("data.csv", data.length, data).context).toContain("sum=10");
});
test("invalid JSON and binary formats are rejected", () => {
  expect(() => analyzeDataText("data.json", 10, "{bad}")).toThrow();
  expect(() => validateDataFile("data.xlsx", 3000000)).toThrow();
});