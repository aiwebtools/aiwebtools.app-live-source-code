import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { commercialEmbed, getBotCommercial, hasSeenCommercial, markCommercialSeen } from "@/utils/botCommercials";
import { schedulePromotion } from "@/utils/promotionalPopups";

export default function BotCommercial({ slug, name, toolTitle, userId }: { slug: string; name: string; toolTitle: string | null; userId?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const release = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (hasSeenCommercial(slug, userId)) return;
    let alive = true;
    let promotion: ReturnType<typeof schedulePromotion> | undefined;
    void getBotCommercial(toolTitle, name).then((url) => {
      if (!alive || !url) return;
      const embed = commercialEmbed(url); if (!embed) return;
      setSrc(embed);
      promotion = schedulePromotion(() => {
        if (!alive || hasSeenCommercial(slug, userId)) { promotion?.dismiss(); return; }
        markCommercialSeen(slug, userId); setOpen(true);
      }, 0);
      release.current = promotion.dismiss;
    }).catch(() => {});
    return () => { alive = false; promotion?.cancel(); release.current = null; };
  }, [slug, name, toolTitle, userId]);
  return <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) release.current?.(); }}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-2xl overflow-hidden border-primary/40 p-0 pt-12">
      <DialogTitle className="sr-only">{name} commercial</DialogTitle>
      <DialogDescription className="sr-only">Muted introduction video</DialogDescription>
      {open && src && <iframe title={`${name} commercial`} src={src} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="aspect-video max-h-[75dvh] w-full border-0" />}
    </DialogContent>
  </Dialog>;
}
