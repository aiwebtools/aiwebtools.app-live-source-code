import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight, Gamepad2 } from "lucide-react";
import { createTimePortalEffect } from "@/utils/timeEffects";
import museBanner from "@/assets/tools/muse-ai-agent-hero.jpg";
import { schedulePromotion, PROMOTION_INTERVAL_MS } from "@/utils/promotionalPopups";

export const MUSE_JOIN_URL = "https://muse.ai/join?via=aiwebtools";
export const MUSE_CODE = "PI0DS6";
const GEARZERO_URL = "https://gearzero.ai/?via=aiwebtools";
const STORAGE_KEY = "museTokensShown";

/** Once-per-session offer: 1 billion free Muse tokens with a tap-to-copy code. */
const MuseTokensPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const dismiss = useRef<() => void>(() => {});
  const close = () => { dismiss.current(); setIsOpen(false); };

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const promotion = schedulePromotion(() => {
      setIsOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, PROMOTION_INTERVAL_MS);
    dismiss.current = promotion.dismiss;
    return promotion.cancel;
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(MUSE_CODE);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  const open = (url: string, label: string) => { close(); createTimePortalEffect(url, label); };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[92dvh] overflow-y-auto bg-background border border-primary/40 z-[9999] p-0">
        <img src={museBanner} alt="Muse personal AI agent – 1 billion free tokens via AIWebTools.ai" width={1920} height={1088} loading="lazy" className="w-full h-auto block" />
        <div className="px-5 pb-5 pt-3">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">Get 1 Billion Free Muse Tokens</DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              Join Muse, your personal AI agent, then redeem this code in <b className="text-foreground">Settings</b> within 48 hours of joining.
            </DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            onClick={copyCode}
            aria-label={`Copy code ${MUSE_CODE}`}
            className="mt-4 h-auto w-full flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary bg-primary/10 px-4 py-3 font-mono text-2xl text-primary hover:bg-primary/20 transition-colors"
          >
            {MUSE_CODE}
            <span className="flex items-center gap-1 text-xs font-sans tracking-normal">
              {copied ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Tap to copy</>}
            </span>
          </Button>
          {copyFailed && <p role="status" className="mt-2 text-sm text-muted-foreground">Copy unavailable. Your code is {MUSE_CODE}.</p>}
          <p className="mt-2 text-xs text-muted-foreground">Offer eligibility and availability are determined by Muse. Both members receive tokens for an eligible referral.</p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => { void copyCode(); open(MUSE_JOIN_URL, "Muse"); }} className="h-auto min-h-10 w-full whitespace-normal font-semibold">
              Copy Code &amp; Join Muse <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => open(GEARZERO_URL, "GearZero")} variant="outline" className="h-auto min-h-10 w-full whitespace-normal">
              <Gamepad2 className="w-4 h-4 mr-2 shrink-0" /> Also try GearZero – AI video game maker
            </Button>
            <Button onClick={close} variant="ghost" className="w-full text-muted-foreground">Not now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MuseTokensPopup;
