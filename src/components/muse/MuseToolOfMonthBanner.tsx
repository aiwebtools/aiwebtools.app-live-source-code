import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Copy } from "lucide-react";
import MuseCodeCopy from "@/components/muse/MuseCodeCopy";
import { MUSE_CODE, MUSE_JOIN_URL, copyMuseCode } from "@/components/muse/museOffer";
import { createTimePortalEffect } from "@/utils/timeEffects";
import offerVoice from "@/assets/audio/muse-offer.mp3.asset.json";
import presenterVideo from "@/assets/videos/muse_code_presenter.mp4.asset.json";
import brandVideo from "@/assets/videos/aiwebtools_awakening_brand.mp4.asset.json";
import presenterPoster from "@/assets/muse-presenter-poster.jpg";

/** "AI Tool of the Month" banner: copies the Muse code, plays the recorded offer and opens the presenter video. */
const MuseToolOfMonthBanner = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopAll = () => {
    voiceRef.current?.pause();
    videoRef.current?.pause();
  };

  useEffect(() => () => stopAll(), []);

  // Keep floating players from covering the popup and silence them while it speaks.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("awt-promo-open");
    window.dispatchEvent(new CustomEvent("toolVideoPlaying"));
    return () => document.body.classList.remove("awt-promo-open");
  }, [open]);

  const activate = () => {
    void copyMuseCode().then((ok) => setCopied(ok));
    // Play the cached recording inside the click gesture so phones allow sound.
    if (!voiceRef.current) voiceRef.current = new Audio(offerVoice.url);
    const voice = voiceRef.current;
    voice.currentTime = 0;
    voice.onended = () => {
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.muted = false; void v.play().catch(() => {}); }
    };
    void voice.play().catch(() => {});
    setOpen(true);
  };

  const close = () => { stopAll(); setOpen(false); };

  return (
    <section aria-label="AI Tool of the Month: Muse" className="container mx-auto px-4 py-6">
      <button
        type="button"
        onClick={activate}
        className="group relative block w-full overflow-hidden rounded-2xl border-2 border-primary/60 text-left shadow-2xl shadow-primary/20 touch-manipulation"
      >
        <video
          src={brandVideo.url}
          autoPlay muted loop playsInline preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <span className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <span className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              <Trophy className="h-3.5 w-3.5" /> AI Tool of the Month
            </span>
            <span className="mt-2 block text-xl font-extrabold text-foreground sm:text-3xl">
              Muse AI Agent — 1 Billion Free Tokens
            </span>
            <span className="mt-1 block text-sm text-muted-foreground sm:text-base">
              Limited codes. Tap to copy our code and hear the offer.
            </span>
          </span>
          <span className="flex shrink-0 items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary bg-background/80 px-4 py-2">
            <span className="font-mono text-2xl font-bold tracking-widest text-primary">{MUSE_CODE}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Copy className="h-4 w-4" />{copied ? "Copied!" : "Tap to copy"}
            </span>
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent className="max-h-[92dvh] w-[95vw] max-w-md overflow-y-auto border border-primary/40 bg-background p-0">
          <video
            ref={videoRef}
            src={presenterVideo.url}
            poster={presenterPoster}
            autoPlay muted playsInline controls
            className="mx-auto block max-h-[55dvh] w-full bg-background object-contain"
            aria-label={`AIWebTools representative presenting Muse code ${MUSE_CODE}`}
          />
          <div className="px-5 pb-5 pt-3">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground sm:text-2xl">1 Billion Muse Tokens On Us</DialogTitle>
              <DialogDescription className="pt-1 text-muted-foreground">
                {copied ? "Code copied! " : ""}Join Muse, then paste this code in <b className="text-foreground">Settings</b> within 48 hours of joining.
              </DialogDescription>
            </DialogHeader>
            <MuseCodeCopy className="mt-4" />
            <p className="mt-2 text-xs text-muted-foreground">Limited codes. Offer eligibility and availability are set by Muse.</p>
            <Button
              onClick={() => { void copyMuseCode(); close(); createTimePortalEffect(MUSE_JOIN_URL, "Muse"); }}
              className="mt-4 h-auto min-h-10 w-full whitespace-normal font-semibold"
            >
              Copy Code &amp; Join Muse <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={close} variant="ghost" className="mt-1 w-full text-muted-foreground">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MuseToolOfMonthBanner;
