import { analyzeDataText, validateChatFile, type BotAttachment } from "./botAttachments";

export async function prepareVisualAttachment(file: File): Promise<BotAttachment | null> {
  validateChatFile(file.name, file.size);
  if (/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
    const bitmap = await createImageBitmap(file).catch(() => { throw new Error("This photo could not be opened. Try a JPG or PNG copy."); });
    try {
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return { name: file.name, size: file.size, context: `User photo: ${file.name}. Resized preview ${canvas.width}×${canvas.height}; GIFs use the first frame.`, imageUrl: canvas.toDataURL("image/jpeg", .8) };
    } finally { bitmap.close(); }
  }
  if (/\.pdf$/i.test(file.name)) {
    const pdfjs = await import("pdfjs-dist");
    const { default: workerUrl } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false });
    try {
      const pdf = await task.promise;
      let excerpt = "";
      const pageLimit = Math.min(pdf.numPages, 100);
      for (let page = 1; page <= pageLimit && excerpt.length < 40000; page++) {
        const content = await (await pdf.getPage(page)).getTextContent();
        excerpt += `\nPage ${page}: ` + content.items.map((item) => "str" in item ? item.str : "").join(" ");
      }
      if (!excerpt.replace(/Page \d+:/g, "").trim()) throw new Error("This PDF is scanned or has no readable text. Attach a photo of the page for visual analysis, or use a text-searchable PDF.");
      const result = analyzeDataText(`${file.name}.txt`, file.size, `PDF has ${pdf.numPages} pages. Text extraction is bounded to the first 100 pages / 40,000 characters; images and page layout are not analyzed.\n${excerpt}`);
      return { ...result, name: file.name };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Could not read this PDF. Check that it is not password protected.");
    } finally { await task.destroy(); }
  }
  return null;
}