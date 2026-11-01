import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { commercialEmbed, commercialPlayerEvent, getBotCommercial, hasSeenCommercial, markCommercialSeen } from "@/utils/botCommercials";
import { playBotIntro, stopBotIntro } from "@/utils/botIntroVoice";

/** Once per bot per device: its own video commercial (sound on, auto-closes at the end), then its spoken welcome. */

// Survives the BotStudio remount caused by the /app/:slug -> /app/:slug/chat/:threadId key change,
// so a replayed mount restores the same video instead of dropping it.
const liveShow: { slug: string | null; embed: string | null } = { slug: null, embed: null };

export default function BotCommercial({ slug, name, toolTitle, userId, voice, custom }: { slug: string; name: string; toolTitle: string | null; userId?: string; voice: string; custom?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const done = useRef(false);
  const started = useRef<string | null>(null);
  const shown = useRef(false);
  const command = useCallback((func: string, args: unknown[] = []) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube-nocookie.com"), []);
  const stopVideo = useCallback(() => { command("mute"); command("stopVideo"); }, [command]);

  useEffect(() => {
    const cancel = () => {
      done.current = true;
      stopVideo();
      liveShow.slug = null; liveShow.embed = null;
      setOpen(false); setSrc(null);
      stopBotIntro();
    };
    window.addEventListener("awt-response-voice", cancel);
    return () => { window.removeEventListener("awt-response-voice", cancel); stopVideo(); stopBotIntro(); };
  }, [slug, stopVideo]);

  const finish = useCallback(() => {
    if (done.current) return; done.current = true;
    stopVideo();
    liveShow.slug = null; liveShow.embed = null;
    setOpen(false); setSrc(null);
    void playBotIntro({ slug, name, voice, userId, custom });
  }, [slug, name, voice, userId, custom, stopVideo]);

  useEffect(() => {
    // StrictMode remounts and async session changes re-run this effect for the same bot;
    // never reset or re-trigger a commercial that is already (or about to be) showing.
    if (started.current === slug && shown.current) return;
    const firstForSlug = started.current !== slug;
    started.current = slug;
    if (firstForSlug) { done.current = false; shown.current = false; setOpen(false); setSrc(null); setNeedsTap(false); }
    // A remounted instance for the same bot resumes the commercial that was already playing.
    if (liveShow.slug === slug && liveShow.embed) { shown.current = true; setSrc(liveShow.embed); setOpen(true); return; }
    if (hasSeenCommercial(slug, userId)) { void playBotIntro({ slug, name, voice, userId, custom }); return; }
    let alive = true;
    const run = custom ? Promise.resolve(null) : getBotCommercial(toolTitle, name);
    void run.then((url) => {
      if (!alive || done.current) return;
      const embed = url ? commercialEmbed(url) : null;
      markCommercialSeen(slug, userId);
      if (!embed) { finish(); return; }
      shown.current = true;
      liveShow.slug = slug; liveShow.embed = embed;
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
      const event = commercialPlayerEvent(e, frame.current?.contentWindow || null);
      if (!event) return;
      if (event.state === 1) { playing = true; setNeedsTap(false); }
      if (event.state === 0 || event.error) finish();
    };
    window.addEventListener("message", onMsg);
    const listen = window.setInterval(() => {
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: slug }), "https://www.youtube-nocookie.com");
      command("addEventListener", ["onStateChange"]); command("addEventListener", ["onError"]);
    }, 500);
    const blocked = window.setTimeout(() => { if (!playing) setNeedsTap(true); }, 2500);
    // A failed embed must never trap a visitor behind an empty commercial.
    const unavailable = window.setTimeout(() => { if (!playing) finish(); }, 15000);
    return () => { window.removeEventListener("message", onMsg); clearInterval(listen); clearTimeout(blocked); clearTimeout(unavailable); };
  }, [open, finish, slug, command]);

  return <Dialog open={open} onOpenChange={(value) => { if (!value) finish(); }}>
    <DialogContent overlayClassName="z-[200] bg-background/80" className="z-[210] w-[calc(100%-1.5rem)] max-w-3xl max-h-[90dvh] overflow-hidden border-primary/40 bg-background p-0 pt-12">
      <DialogTitle className="sr-only">{name} commercial</DialogTitle>
      <DialogDescription className="sr-only">Introduction video for {name}</DialogDescription>
      {open && src && <div className="relative">
        <iframe ref={frame} title={`${name} commercial`} src={src} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video max-h-[75dvh] w-full border-0" />
        {needsTap && <Button onClick={() => { command("unMute"); command("playVideo"); setNeedsTap(false); }} className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2"><Volume2 className="h-4 w-4" />Tap to play with sound</Button>}
      </div>}
    </DialogContent>
  </Dialog>;
}
