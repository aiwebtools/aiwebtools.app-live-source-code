import { useState, useEffect } from "react";
import { FileDown, FileText, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runPythonOnDevice, type PythonResult } from "@/utils/pyodideRunner";
import { deliverFile } from '@/utils/fileDelivery';

const plain = (md: string) => md.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").replace(/^#{1,6}\s*/gm, "").replace(/\*\*|__|`/g, "").trim();
const fileBase = (name: string) => `${name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "reply"}-aiwebtools`;
const escapeHtml = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] || c));
export const pythonBlocks = (text: string) => [...text.matchAll(/```(?:python|py)\s*\n([\s\S]*?)```/gi)].map((m) => m[1].trim()).filter(Boolean);

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** One-tap PDF/Word export of a reply plus on-device Python for any code blocks it contains. */
export default function ReplyTools({ text, name, busy, onError }: { text: string; name: string; busy: boolean; onError: (t: string) => void }) {
  const [running, setRunning] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, PythonResult>>({});
  const blocks = pythonBlocks(text);
  const [files, setFiles] = useState<{ pdf: Blob; word: Blob } | null>(null);
  const [exportError, setExportError] = useState('');
  useEffect(() => {
    if (busy || !text) return;
    let active = true;
    setFiles(null); setExportError('');
    void (async () => {
      const [{ jsPDF }, { Document, Packer, Paragraph, TextRun }] = await Promise.all([import('jspdf'), import('docx')]);
      const body = plain(text) + Object.values(results).map(result => `\n\nPython output:\n${result.output}`).join('');
      const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
      pdf.setFont('courier', 'normal'); pdf.setFontSize(12);
      let y = 54;
      for (const line of pdf.splitTextToSize(body, 504) as string[]) {
        if (y > 738) { pdf.addPage(); y = 54; }
        pdf.text(line.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,'-'), 54, y); y += 14;
      }
      const doc = new Document({ sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } }, children: body.split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, font: 'Courier New', size: 24 })], spacing: { after: 0, line: 280 } })) }] });
      const word = await Packer.toBlob(doc);
      if (active) setFiles({ pdf: pdf.output('blob'), word });
    })().catch(() => { if (active) setExportError('Export preparation failed. Try again.'); });
    return () => { active = false; };
  }, [text, busy, results]);

  const exportPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight(), m = 50;
      const header = () => { doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 150, 60); doc.text(`AIWEBTOOLS.AI  |  ${name}`, m, 30); doc.setTextColor(20, 20, 20); doc.setFont("helvetica", "normal"); doc.setFontSize(11); };
      header();
      let y = 60;
      const body = plain(text) + Object.values(results).map((r) => `\n\nPython output:\n${r.output}`).join("");
      for (const line of doc.splitTextToSize(body, w - m * 2) as string[]) {
        if (y > h - m) { doc.addPage(); header(); y = 60; }
        doc.text(line, m, y); y += 15;
      }
      for (const r of Object.values(results)) for (const img of r.images) {
        doc.addPage(); header(); doc.addImage(img, "PNG", m, 60, w - m * 2, (w - m * 2) * 0.66);
      }
      doc.save(`${fileBase(name)}.pdf`);
    } catch { onError("The PDF could not be created in this browser."); }
  };
  const exportWord = () => {
    const html = `<html><head><meta charset="utf-8"><title>${escapeHtml(name)}</title></head><body style="font-family:Calibri,Arial;font-size:11pt"><p style="color:#00963c;font-weight:bold">AIWEBTOOLS.AI | ${escapeHtml(name)}</p><pre style="white-space:pre-wrap;font-family:Calibri,Arial">${escapeHtml(plain(text))}</pre>${Object.values(results).map((r) => `<h3>Python output</h3><pre>${escapeHtml(r.output)}</pre>${r.images.map((i) => `<img src="${i}" width="600"/>`).join("")}`).join("")}</body></html>`;
    save(new Blob(["\ufeff", html], { type: "application/msword" }), `${fileBase(name)}.doc`);
  };
  const run = async (i: number) => {
    setRunning(i);
    try { const r = await runPythonOnDevice(blocks[i]); setResults((p) => ({ ...p, [i]: r })); }
    catch { onError("Python could not start on this device. Check your connection and try again."); }
    finally { setRunning(null); }
  };

  if (busy || !text) return null;
  return (
    <div className="studio-reply-tools mt-2 space-y-2">
      <div className="flex flex-wrap gap-1">
        <Button variant="outline" size="sm" disabled={!files} className="h-9 gap-1 px-3 text-xs" onClick={() => { if (files) void deliverFile(files.pdf, `${fileBase(name)}.pdf`); }} title="Download this reply as a PDF"><FileDown className="h-3.5 w-3.5" />PDF</Button>
        <Button variant="outline" size="sm" disabled={!files} className="h-9 gap-1 px-3 text-xs" onClick={() => { if (files) void deliverFile(files.word, `${fileBase(name)}.docx`); }} title="Download this reply as a Word document"><FileText className="h-3.5 w-3.5" />Word</Button>
        {blocks.map((_, i) => <Button key={i} variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" disabled={running !== null} onClick={() => void run(i)} title="Run this Python code on your device">{running === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}Run Python{blocks.length > 1 ? ` ${i + 1}` : ""}</Button>)}
      </div>
      {!files && !exportError && <p role="status" className="text-xs text-muted-foreground">Preparing downloads…</p>}
      {exportError && <p role="alert" className="text-xs text-foreground">{exportError}</p>}
      {running !== null && <p className="text-xs text-muted-foreground">Starting Python on your device… the first run takes a few seconds.</p>}
      {Object.entries(results).map(([i, r]) => (
        <div key={i} className="rounded-md border border-border bg-muted/40 p-2 text-xs">
          <p className="mb-1 font-semibold">Python result{blocks.length > 1 ? ` ${Number(i) + 1}` : ""}</p>
          <pre className={`whitespace-pre-wrap break-words ${r.error ? "text-destructive" : ""}`}>{r.output || "(no printed output)"}</pre>
          {r.images.map((src, k) => <img key={k} src={src} alt={`Chart from ${name} Python result`} className="mt-2 w-full rounded" />)}
        </div>
      ))}
    </div>
  );
}
