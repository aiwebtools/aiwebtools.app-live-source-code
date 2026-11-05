import { lazy, Suspense, useState } from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Collection = lazy(() => import("./MtvaiAudiobookCollection"));

export default function MtvaiAudiobooksButton({ className = "", onOpenChange }: { className?: string; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const changeOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next) window.dispatchEvent(new CustomEvent("mtvai-audiobooks-open"));
  };
  return <Dialog open={open} onOpenChange={changeOpen}>
    <Button variant="outline" size="sm" onClick={() => changeOpen(true)} className={`btn-flat border-primary/40 bg-background text-primary hover:bg-accent hover:text-accent-foreground ${className}`} title="Open MTVAI audiobooks"><Headphones />Audiobooks</Button>
    <DialogContent overlayClassName="z-[2147483647] bg-background/80" className="z-[2147483647] flex h-[min(88dvh,900px)] w-[calc(100%-1rem)] max-w-2xl flex-col overflow-hidden rounded-lg border-primary/40 p-4 sm:p-6">
      <DialogHeader className="shrink-0 pr-10 text-left">
        <DialogTitle className="text-primary tracking-normal">Audiobooks</DialogTitle>
        <DialogDescription>MTVAI.live · Presented by aiwebtools.app</DialogDescription>
      </DialogHeader>
      {open && <Suspense fallback={<p className="text-sm text-muted-foreground">Loading audiobooks…</p>}><Collection /></Suspense>}
    </DialogContent>
  </Dialog>;
}