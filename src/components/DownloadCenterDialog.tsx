import { useEffect, useState } from "react";
import { Download, Code2, FolderArchive } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  OPEN_DOWNLOAD_CENTER_EVENT,
  OPERATIONAL_INSTRUCTIONS_PARTS,
  SOURCE_CODE_DOWNLOAD,
  downloadEverything,
  triggerPublicDownload,
} from "@/utils/downloads";

const TOTAL = OPERATIONAL_INSTRUCTIONS_PARTS.reduce((n, p) => n + p.count, 0);

const DownloadCenterDialog = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_DOWNLOAD_CENTER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DOWNLOAD_CENTER_EVENT, onOpen);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto border-primary/40 bg-background">
        <DialogHeader>
          <DialogTitle className="text-primary font-mono">AIWebTools Open Library</DialogTitle>
          <DialogDescription>
            {TOTAL.toLocaleString()} original operational instructions and app plans, sorted A to Z, plus the full site code. Free to download.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={downloadEverything}
          className="op-gold-btn w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold uppercase tracking-wide"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Download everything
        </button>
        <p className="text-xs text-muted-foreground text-center -mt-1">Your browser may ask to allow multiple downloads — tap Allow.</p>

        <ul className="space-y-2">
          {OPERATIONAL_INSTRUCTIONS_PARTS.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                onClick={() => triggerPublicDownload(p.path, p.name)}
                className="w-full flex items-center gap-3 rounded-lg border border-primary/30 bg-card px-3 py-2 text-left hover:border-primary transition-colors"
              >
                <FolderArchive className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span className="flex-1 text-sm text-foreground">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.count} files</span>
                <Download className="h-4 w-4 text-primary" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => triggerPublicDownload(SOURCE_CODE_DOWNLOAD.path, SOURCE_CODE_DOWNLOAD.name)}
              className="w-full flex items-center gap-3 rounded-lg border border-primary/60 bg-card px-3 py-2 text-left hover:border-primary transition-colors"
            >
              <Code2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <span className="flex-1 text-sm text-foreground">Website Source Code (always latest)</span>
              <Download className="h-4 w-4 text-primary" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadCenterDialog;
