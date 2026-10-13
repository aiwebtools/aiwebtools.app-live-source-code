import Papa from "papaparse";

export const MAX_DATA_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENT_CONTEXT = 24000;
export interface BotAttachment { name: string; size: number; context: string }

export function validateDataFile(name: string, size: number) {
  if (size > MAX_DATA_FILE_BYTES) throw new Error("Choose a data file up to 10 MB.");
  if (!/\.(txt|md|csv|tsv|json)$/i.test(name)) throw new Error("Choose a TXT, Markdown, CSV, TSV or JSON file.");
  if (!size) throw new Error("This file is empty.");
}

export function analyzeDataText(name: string, size: number, text: string): BotAttachment {
  validateDataFile(name, size);
  if (text.includes("\0")) throw new Error("This is not a supported text data file.");
  let summary = "";
  if (/\.(csv|tsv)$/i.test(name)) {
    let headers: string[] = [];
    let rows = 0;
    let malformed = 0;
    const stats: { count: number; missing: number; sum: number; min: number; max: number }[] = [];
    const samples: string[][] = [];
    let last: string[] = [];
    Papa.parse<string[]>(text, {
      delimiter: /\.tsv$/i.test(name) ? "\t" : "",
      skipEmptyLines: "greedy",
      step(result) {
        const row = result.data;
        if (!headers.length) {
          headers = row;
          for (const _ of headers) stats.push({ count: 0, missing: 0, sum: 0, min: Infinity, max: -Infinity });
          return;
        }
        rows++;
        if (row.length !== headers.length || result.errors.length) malformed++;
        if (samples.length < 5) samples.push(row);
        last = row;
        stats.forEach((stat, i) => {
          const cell = (row[i] || "").trim();
          if (!cell) { stat.missing++; return; }
          if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(cell)) {
            const value = Number(cell);
            if (Number.isFinite(value)) { stat.count++; stat.sum += value; stat.min = Math.min(stat.min, value); stat.max = Math.max(stat.max, value); }
          }
        });
      },
    });
    summary = `CSV/TSV analysis across ALL ${rows} data rows; ${headers.length} columns; ${malformed} rows with parsing/column warnings. First row treated as headers.\n`;
    summary += headers.slice(0, 80).map((header, i) => {
      const s = stats[i];
      return `${header.slice(0, 100)}: missing=${s.missing}, numeric_count=${s.count}${s.count ? `, sum=${s.sum}, mean=${s.sum / s.count}, min=${s.min}, max=${s.max}` : ""}`;
    }).join("\n");
    summary += `\nSample rows (first 5 and last, NOT the entire dataset):\n${Papa.unparse([headers, ...samples, ...(rows > 5 ? [last] : [])]).slice(0, 10000)}`;
  } else if (/\.json$/i.test(name)) {
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { throw new Error("This JSON file is invalid. Correct it and attach again."); }
    summary = Array.isArray(parsed)
      ? `Valid JSON array containing ${parsed.length} items. Sample items:\n${JSON.stringify(parsed.slice(0, 5)).slice(0, 10000)}`
      : `Valid JSON ${parsed === null ? "null" : typeof parsed}. Top-level keys: ${parsed && typeof parsed === "object" ? Object.keys(parsed).slice(0, 80).join(", ") : "none"}.`;
  }
  const remaining = MAX_ATTACHMENT_CONTEXT - summary.length - 600;
  const excerpt = text.length <= remaining ? text : `${text.slice(0, Math.floor(remaining * .65))}\n[Middle omitted; excerpt only]\n${text.slice(-Math.floor(remaining * .35))}`;
  return { name, size, context: `File: ${name} (${size} bytes, ${text.length} characters).\n${summary}\n${text.length <= remaining ? "Complete file text" : "Bounded beginning/end excerpt; do not claim to have read every record beyond the computed CSV statistics"}:\n${excerpt}`.slice(0, MAX_ATTACHMENT_CONTEXT) };
}