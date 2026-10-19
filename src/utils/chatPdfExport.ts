type ExportMessage = { role: string; content: string; attachments?: { name: string; context?: string }[] };

const IMAGE_MD = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

/** jsPDF core fonts only cover Latin-1; map common typography and drop the rest. */
function clean(text: string) {
  return text
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...").replace(/\u2022/g, "-")
    .replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s*/gm, "").replace(/^_(.+)_$/gm, "$1")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

async function toJpeg(url: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const bitmap = await createImageBitmap(await res.blob());
    const scale = Math.min(1, 1400 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return { data: canvas.toDataURL("image/jpeg", 0.88), w: canvas.width, h: canvas.height };
  } catch { return null; }
}

/** Builds a PDF of the conversation with generated images embedded where they appeared. */
export async function exportChatPdf(botName: string, slug: string, messages: ExportMessage[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 54, width = doc.internal.pageSize.getWidth() - margin * 2, bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;
  const ensure = (h: number) => { if (y + h > bottom) { doc.addPage(); y = margin; } };
  const write = (text: string, size = 10.5, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size);
    for (const line of doc.splitTextToSize(clean(text), width) as string[]) { ensure(size * 1.4); doc.text(line, margin, y); y += size * 1.4; }
  };
  write(botName, 18, true);
  write(`Conversation saved ${new Date().toLocaleString()} - AIWEBTOOLS.AI`, 9);
  y += 10;
  for (const message of messages) {
    y += 8; write(message.role === "user" ? "You" : botName, 12, true);
    let last = 0;
    for (const match of message.content.matchAll(IMAGE_MD)) {
      write(message.content.slice(last, match.index));
      const img = await toJpeg(match[2]);
      if (img) {
        const w = Math.min(width, img.w), h = (img.h / img.w) * w;
        ensure(h + 8); doc.addImage(img.data, "JPEG", margin, y, w, h); y += h + 10;
      } else write(`[Image could not be saved: ${match[1] || "generated image"}]`, 9);
      last = (match.index ?? 0) + match[0].length;
    }
    write(message.content.slice(last));
    for (const file of message.attachments || []) { write(`Attachment: ${file.name}`, 10, true); if (file.context) write(file.context, 9); }
  }
  doc.save(`${slug}-conversation.pdf`);
}
