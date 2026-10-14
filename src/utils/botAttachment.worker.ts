import Papa from "papaparse";
import { analyzeDataText, validateChatFile } from "./botAttachments";

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    const file = event.data;
    validateChatFile(file.name, file.size);
    let text: string;
    let parseName = file.name;
    if (/\.docx$/i.test(file.name)) {
      const mammoth = await import("mammoth");
      text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
      if (!text.trim()) throw new Error("This Word document has no readable text. Embedded pictures are not analyzed.");
      text = "DOCX extracted text only; pictures and layout are not analyzed.\n" + text;
      parseName += ".txt";
    } else if (/\.xlsx$/i.test(file.name)) {
      const { default: readWorkbook } = await import("read-excel-file/web-worker");
      const sheets = await readWorkbook(await file.arrayBuffer());
      const summaries = sheets.map((sheet) => {
        const csv = Papa.unparse(sheet.data.map((row) => row.map((value) => value instanceof Date ? value.toISOString() : value ?? "")));
        return `Sheet: ${sheet.sheet}\n${analyzeDataText("sheet.csv", Math.max(1, Math.min(file.size, 10 * 1024 * 1024)), csv).context}`;
      });
      if (!summaries.length) throw new Error("This spreadsheet has no worksheets.");
      self.postMessage({ attachment: { name: file.name, size: file.size, context: `Workbook: ${sheets.length} sheets. Cell values only; charts/macros are not executed. Bounded sheet summaries follow.\n${summaries.join("\n\n")}`.slice(0, 24000) } });
      return;
    } else text = await file.text();
    self.postMessage({ attachment: { ...analyzeDataText(parseName, file.size, text), name: file.name } });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "The file could not be read." });
  }
};