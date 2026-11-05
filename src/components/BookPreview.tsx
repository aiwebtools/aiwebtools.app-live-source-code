import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";

export const BOOK_TITLE = "The Gospel of Deployable Robots";
const BOOK_PDF = "/instructions/gospel-of-deployment-full-book.pdf";

// Render actual PDF pages rather than relying on Drive's third-party viewer.
export default function BookPreview() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const pdf = useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  useEffect(() => {
    let active = true;
    let task: import("pdfjs-dist").PDFDocumentLoadingTask | undefined;
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const { default: worker } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker;
        task = pdfjs.getDocument({ url: BOOK_PDF, isEvalSupported: false });
        const document = await task.promise;
        if (active) { pdf.current = document; setPages(document.numPages); }
      } catch (e) { if (active) { setError(e instanceof Error ? e.message : "The book could not open. Download the PDF below."); setBusy(false); } }
    })();
    return () => { active = false; pdf.current = null; void task?.destroy(); };
  }, []);
  useEffect(() => {
    if (!pages || !pdf.current) return;
    let cancelled = false;
    let render: import("pdfjs-dist").RenderTask | undefined;
    setBusy(true);
    void (async () => {
      try {
        const document = pdf.current;
        if (!document) return;
        const p = await document.getPage(page);
        const el = canvas.current;
        const context = el?.getContext("2d");
        if (cancelled || !el || !context) return;
        const viewport = p.getViewport({ scale: 1.5 });
        el.width = viewport.width; el.height = viewport.height;
        render = p.render({ canvasContext: context, viewport });
        await render.promise;
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : "This page could not render."); }
      finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; render?.cancel(); };
  }, [page, pages]);
  return <div className="min-h-0 flex-1 flex flex-col gap-3">
    <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
      <Button variant="outline" size="icon" aria-label="Previous book page" disabled={page === 1 || busy} onClick={() => setPage(p => p - 1)}><ChevronLeft /></Button>
      <span className="text-sm text-foreground">Page {page} / {pages || "…"}</span>
      <Button variant="outline" size="icon" aria-label="Next book page" disabled={page >= pages || busy} onClick={() => setPage(p => p + 1)}><ChevronRight /></Button>
      <Button asChild variant="outline" size="sm"><a href={BOOK_PDF} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-2" />Open PDF</a></Button>
    </div>
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
    <div className="min-h-0 flex-1 overflow-auto overscroll-contain rounded border border-border">
      {busy && <div role="status" className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
      <canvas ref={canvas} aria-label={`${BOOK_TITLE}, page ${page}`} className="block w-full h-auto" />
    </div>
  </div>;
}