import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Loader2, Play, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MTV_CHANNEL_PATH, gateOpeningEventAction, selectGateShort, type GateClip } from "@/utils/gateOpening";
import { navigateInApp } from "@/utils/inAppNavigate";
import { commercialPlayerEvent } from "@/utils/botCommercials";
import "@/styles/angel-gate.css";

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

export default function GateOpeningVideo({ onFinish }: { onFinish: () => void }) {
  const [clip, setClip] = useState<GateClip | null>(null);
  const [needsSound, setNeedsSound] = useState(false);
  const [started, setStarted] = useState(false);
  const [intro, setIntro] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const playing = useRef(false);
  const command = useCallback((func: string, args: unknown[] = []) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), PLAYER_ORIGIN);
  }, []);
  const subscribe = useCallback(() => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "angel-opening", channel: "widget" }), PLAYER_ORIGIN);
    command("addEventListener", ["onStateChange"]);
    command("addEventListener", ["onError"]);
    command("addEventListener", ["onAutoplayBlocked"]);
  }, [command]);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    command("mute");
    command("stopVideo");
    setLeaving(true);
    window.setTimeout(onFinish, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350);
  }, [command, onFinish]);

  const openChannel = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateInApp(MTV_CHANNEL_PATH);
    finish();
  }, [finish]);

  useEffect(() => {
    let alive = true;
    close.current?.focus();
    const introTimer = window.setTimeout(() => setIntro(false), 1900);
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
      clearTimeout(introTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", escape);
      command("mute"); command("stopVideo");
    };
  }, [command, finish]);

  useEffect(() => {
    if (!clip) return;
    const onMessage = (event: MessageEvent) => {
      const backgroundFrame = Array.from(document.querySelectorAll<HTMLIFrameElement>('[inert] iframe')).find(item => item.contentWindow === event.source);
      if (backgroundFrame) {
        const backgroundEvent = commercialPlayerEvent(event, backgroundFrame.contentWindow);
        if (backgroundEvent?.state === 1) backgroundFrame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), event.origin);
        return;
      }
      const result = commercialPlayerEvent(event, frame.current?.contentWindow ?? null);
      const action = gateOpeningEventAction(result);
      if (action === "play") { playing.current = true; setStarted(true); }
      if (action === "finish") finish();
    };
    window.addEventListener("message", onMessage);
    subscribe();
    const interval = window.setInterval(subscribe, 500);
    // Sound-on autoplay is attempted first. Restricted browsers can still show moving footage.
    const fallback = window.setTimeout(() => {
      if (!playing.current) { command("mute"); command("playVideo"); setNeedsSound(true); }
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(fallback); window.removeEventListener("message", onMessage); };
  }, [clip, command, finish, subscribe]);

  return <div role="dialog" aria-modal="true" aria-label="MTVAI opening" data-leaving={leaving} className="mtv-opening fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-3 bg-background px-4 py-4 text-foreground">
    {intro && <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 grid place-items-center"><span className="mtv-logo-fly mtv-logo-text font-mono text-6xl font-black tracking-[0.12em] sm:text-7xl">MTVAI</span></div>}
    <span className="mtv-rise font-mono text-sm tracking-[0.28em] text-primary" style={{ animationDelay: "1.1s" }}>MTVAI.live</span>
    <p style={{ animationDelay: "1.25s" }} className="mtv-rise w-full max-w-sm text-center text-sm leading-relaxed text-foreground">This music video was made by a rogue AI music video agent all by itself.....sorta.</p>
    <div style={{ animationDelay: "1.35s" }} className="mtv-rise relative aspect-[9/16] max-h-[calc(100dvh-17rem)] w-full max-w-sm overflow-hidden rounded-xl border border-primary/25 bg-muted shadow-[0_0_45px_hsl(var(--primary)/.18)]">
      {!started && <div role="status" aria-label="Loading MTVAI opening" className="pointer-events-none absolute inset-0 z-10 grid place-items-center"><Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none text-primary" /></div>}
      {clip && <iframe
        ref={frame}
        title={clip.title}
        onLoad={subscribe}
        src={`${PLAYER_ORIGIN}/embed/${clip.id}?autoplay=1&mute=0&playsinline=1&controls=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />}
    </div>
    {needsSound && <Button variant="outline" onClick={() => { command("unMute"); command("playVideo"); setNeedsSound(false); }}><Volume2 className="h-4 w-4" />Play with sound</Button>}
    <div style={{ animationDelay: "1.5s" }} className="mtv-rise flex w-full max-w-sm flex-col items-center gap-2">
      <Button
        ref={close}
        variant="outline"
        onClick={finish}
        aria-label="Skip opening video"
        title="Skip opening video"
        className="gate-skip-button h-14 w-full max-w-xs gap-2.5 rounded-full border-primary/55 bg-background/85 px-7 text-base font-semibold shadow-[0_0_30px_hsl(var(--primary)/.25)] backdrop-blur-sm transition hover:border-primary hover:bg-primary/10"
      >
        <X className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
        Skip
      </Button>
      <a
        href={MTV_CHANNEL_PATH}
        onClick={openChannel}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:text-primary"
      >
        <Play className="h-3.5 w-3.5" aria-hidden="true" />
        View the full MTV AI channel
      </a>
    </div>
  </div>;
}
