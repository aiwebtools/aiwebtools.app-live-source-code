import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { commercialEmbed, getBotCommercial, hasSeenCommercial, markCommercialSeen } from "@/utils/botCommercials";
import { playBotIntro } from "@/utils/botIntroVoice";

/** Once per bot per device: its own video commercial (sound on, auto-closes at the end), then its spoken welcome. */
export default function BotCommercial({ slug, name, toolTitle, userId, voice, custom }: { slug: string; name: string; toolTitle: string | null; userId?: string; voice: string; custom?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return; done.current = true;
    setOpen(false);
    void playBotIntro({ slug, name, voice, userId, custom });
  }, [slug, name, voice, userId, custom]);

  useEffect(() => {
    done.current = false; setOpen(false); setSrc(null); setNeedsTap(false);
    if (hasSeenCommercial(slug, userId)) { void playBotIntro({ slug, name, voice, userId, custom }); return; }
    let alive = true;
    const run = custom ? Promise.resolve(null) : getBotCommercial(toolTitle, name);
    void run.then((url) => {
      if (!alive) return;
      const embed = url ? commercialEmbed(url) : null;
      markCommercialSeen(slug, userId);
      if (!embed) { finish(); return; }
      setSrc(embed); setOpen(true);
    }).catch(() => { if (alive) finish(); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, userId]);

  // YouTube player events: auto-close on end; offer "tap for sound" when the browser blocks sound-on autoplay.
  useEffect(() => {
    if (!open) return;
    let playing = false;
    const onMsg = (e: MessageEvent) => {
      if (!/youtube/.test(e.origin) || typeof e.data !== "string") return;
      try {
        const d = JSON.parse(e.data);
        const state = d.event === "onStateChange" ? d.info : d.info?.playerState;
        if (state === 1) { playing = true; setNeedsTap(false); }
        if (state === 0) finish();
      } catch { /* not a player message */ }
    };
    window.addEventListener("message", onMsg);
    const listen = window.setInterval(() => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: slug }), "*"), 500);
    const blocked = window.setTimeout(() => { if (!playing) { command("mute"); command("playVideo"); setNeedsTap(true); } }, 2500);
    return () => { window.removeEventListener("message", onMsg); clearInterval(listen); clearTimeout(blocked); };
  }, [open, finish, slug]);

  const command = (func: string) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

  return <Dialog open={open} onOpenChange={(value) => { if (!value) finish(); }}>
    <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden border-primary/40 p-0 pt-12">
      <DialogTitle className="sr-only">{name} commercial</DialogTitle>
      <DialogDescription className="sr-only">Introduction video for {name}</DialogDescription>
      {open && src && <div className="relative">
        <iframe ref={frame} title={`${name} commercial`} src={src} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video max-h-[75dvh] w-full border-0" />
        {needsTap && <Button onClick={() => { command("unMute"); command("playVideo"); setNeedsTap(false); }} className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2"><Volume2 className="h-4 w-4" />Tap to play with sound</Button>}
      </div>}
    </DialogContent>
  </Dialog>;
}
