import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectGateShort, type GateClip } from "@/utils/gateOpening";
import { commercialPlayerEvent } from "@/utils/botCommercials";

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

export default function GateOpeningVideo({ onFinish }: { onFinish: () => void }) {
  const [clip, setClip] = useState<GateClip | null>(null);
  const [needsSound, setNeedsSound] = useState(false);
  const [started, setStarted] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const playing = useRef(false);
  const command = useCallback((func: string, args: unknown[] = []) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), PLAYER_ORIGIN);
  }, []);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    command("mute");
    command("stopVideo");
    onFinish();
  }, [command, onFinish]);

  useEffect(() => {
    let alive = true;
    close.current?.focus();
    // Neither the catalog download nor the iframe blocks mounting the actual page.
    void import("@/data/mtvaiCatalog").then(({ MTVAI_CATALOG }) => {
      if (!alive) return;
      const selected = selectGateShort(MTVAI_CATALOG);
      if (selected) setClip(selected); else finish();
    }).catch(() => { if (alive) finish(); });
    const unavailable = window.setTimeout(() => { if (!playing.current) finish(); }, 15000);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("keydown", escape);
    return () => {
      alive = false;
      clearTimeout(unavailable);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", escape);
      command("mute"); command("stopVideo");
    };
  }, [command, finish]);

  useEffect(() => {
    if (!clip) return;
    const listen = () => {
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "angel-opening" }), PLAYER_ORIGIN);
      command("addEventListener", ["onStateChange"]);
      command("addEventListener", ["onError"]);
      command("addEventListener", ["onAutoplayBlocked"]);
    };
    const onMessage = (event: MessageEvent) => {
      const backgroundFrame = Array.from(document.querySelectorAll<HTMLIFrameElement>('[inert] iframe')).find(item => item.contentWindow === event.source);
      if (backgroundFrame) {
        const backgroundEvent = commercialPlayerEvent(event, backgroundFrame.contentWindow);
        if (backgroundEvent?.state === 1) backgroundFrame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), event.origin);
        return;
      }
      const result = commercialPlayerEvent(event, frame.current?.contentWindow ?? null);
      if (!result) return;
      if (result.state === 1) { playing.current = true; setStarted(true); }
      if ((result.state === 0 && playing.current) || result.error) finish();
    };
    window.addEventListener("message", onMessage);
    const interval = window.setInterval(listen, 500);
    // Sound-on autoplay is attempted first. Restricted browsers can still show moving footage.
    const fallback = window.setTimeout(() => {
      if (!playing.current) { command("mute"); command("playVideo"); setNeedsSound(true); }
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(fallback); window.removeEventListener("message", onMessage); };
  }, [clip, command, finish]);

  return <div role="dialog" aria-modal="true" aria-label="MTVAI opening" className="fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-3 bg-background px-3 py-4 text-foreground">
    <div className="flex w-full max-w-sm items-center justify-between gap-3">
      <span className="font-mono text-sm text-primary">MTVAI.live</span>
      <Button ref={close} variant="outline" size="icon" onClick={finish} aria-label="Skip opening video" title="Skip opening video"><X className="h-5 w-5" /></Button>
    </div>
    <div className="relative aspect-[9/16] max-h-[calc(100dvh-10rem)] w-full max-w-sm overflow-hidden bg-muted">
      {!started && <div role="status" aria-label="Loading MTVAI opening" className="pointer-events-none absolute inset-0 z-10 grid place-items-center"><Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none text-primary" /></div>}
      {clip && <iframe
        ref={frame}
        title={clip.title}
        src={`${PLAYER_ORIGIN}/embed/${clip.id}?autoplay=1&mute=0&playsinline=1&controls=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />}
    </div>
    {needsSound && <Button variant="outline" onClick={() => { command("unMute"); command("playVideo"); setNeedsSound(false); }}><Volume2 className="h-4 w-4" />Play with sound</Button>}
  </div>;
}