import { useState } from "react";
import { Download, Maximize2, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function StudioImageActions({ content, name, busy, onPrompt, onError }: { content: string; name: string; busy: boolean; onPrompt: (text: string) => void; onError: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const images = [...content.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g)];
  if (!images.length) return null;
  return <>{images.map(([markup, caption, url], index) => <div className="studio-image-actions" key={url}>
    <Button variant="ghost" size="sm" disabled={downloading} onClick={async () => {
      setDownloading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("The image could not download. Please open it and save it instead.");
        const blob = await response.blob();
        if (!blob.type.startsWith("image/")) throw new Error("This image is unavailable. Please create a fresh image.");
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href; link.download = `${name.replace(/[^a-z0-9]+/gi, "-")}-${index + 1}.${blob.type.includes("png") ? "png" : "jpg"}`;
        link.click(); setTimeout(() => URL.revokeObjectURL(href), 10000);
      } catch (error) { onError(error instanceof Error ? error.message : "Image download unavailable."); }
      finally { setDownloading(false); }
    }} title="Download image"><Download className="h-4 w-4" />Download</Button>
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)} title="Open image"><Maximize2 className="h-4 w-4" />View</Button>
    <Button variant="ghost" size="sm" disabled={busy} onClick={() => onPrompt(`Create a new variation of the most recent image, preserving the characters, setting and story. Original description: ${caption || content.replace(markup, "").slice(-1000)}`)} title="Regenerate image"><RefreshCw className="h-4 w-4" />Regenerate</Button>
    <Button variant="ghost" size="sm" disabled={busy} onClick={() => onPrompt("Create a revised version of the last image, keeping the same characters and setting. Change: ")} title="Revise image"><Pencil className="h-4 w-4" />Revise</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-5xl"><DialogTitle>{caption || `${name} image`}</DialogTitle><DialogDescription className="sr-only">Generated image from this conversation</DialogDescription><img src={url} alt={caption || "Generated image"} className="max-h-[75dvh] w-full object-contain" /></DialogContent></Dialog>
  </div>)}</>;
}