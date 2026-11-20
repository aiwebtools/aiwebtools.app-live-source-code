import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MTV_CHANNEL_PATH, gateOpeningEventAction, selectGateShort, type GateClip } from "@/utils/gateOpening";
import { navigateInApp } from "@/utils/inAppNavigate";
import { commercialPlayerEvent } from "@/utils/botCommercials";
import MtvaiBrand from "@/components/MtvaiBrand";
import "@/styles/angel-gate.css";

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

export default function GateOpeningVideo({ onFinish }: { onFinish: () => void }) {
  const [clip, setClip] = useState<GateClip | null>(null);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const playing = useRef(false);
  const command = useCallback((func: string, args: unknown[] = []) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), PLAYER_ORIGIN);
  }, []);
  const startWithSound = useCallback(() => {
    if (finished.current) return;
    command("unMute");
    command("setVolume", [100]);
    if (!playing.current) command("playVideo");
  }, [command]);
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
    const onMessage = (event: MessageEvent) => {
      const backgroundFrame = Array.from(document.querySelectorAll<HTMLIFrameElement>('[inert] iframe')).find(item => item.contentWindow === event.source);
      if (backgroundFrame) {
        const backgroundEvent = commercialPlayerEvent(event, backgroundFrame.contentWindow);
        if (backgroundEvent?.state === 1) backgroundFrame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), event.origin);
        return;
      }
      const result = commercialPlayerEvent(event, frame.current?.contentWindow ?? null);
      const action = gateOpeningEventAction(result);
      if (action === "play" && !playing.current) { playing.current = true; setStarted(true); startWithSound(); }
      if (action === "finish") finish();
    };
    window.addEventListener("message", onMessage);
    subscribe();
    // Only retry during startup. Never force muted playback or fight user playback controls.
    let attempts = 0;
    const interval = window.setInterval(() => {
      if (playing.current || finished.current || attempts++ >= 20) { clearInterval(interval); return; }
      subscribe();
      startWithSound();
    }, 500);
    return () => { clearInterval(interval); window.removeEventListener("message", onMessage); };
  }, [clip, command, finish, subscribe, startWithSound]);

  return <div role="dialog" aria-modal="true" aria-label="MTVAI opening" data-leaving={leaving} className="mtv-opening fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-3 bg-background px-4 py-4 text-foreground">
    <span className="mtv-rise font-mono text-sm tracking-[0.28em] text-primary" style={{ animationDelay: "0s" }}>MTVAI.live</span>
    <p style={{ animationDelay: "0s" }} className="mtv-rise w-full max-w-sm text-center text-sm leading-relaxed text-foreground">This music video was made by a rogue AI music video agent all by itself.....sorta.</p>
    <div style={{ animationDelay: "0s" }} className="mtv-rise relative aspect-[9/16] max-h-[calc(100dvh-17rem)] w-full max-w-sm overflow-hidden rounded-xl border border-primary/25 bg-muted shadow-[0_0_45px_hsl(var(--primary)/.18)]">
      {!started && <div role="status" aria-label="Loading MTVAI opening" className="pointer-events-none absolute inset-0 z-10 grid place-items-center"><Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none text-primary" /></div>}
      {clip && <iframe
        ref={frame}
        title={clip.title}
        onLoad={() => { subscribe(); startWithSound(); setStarted(true); }}
        src={`${PLAYER_ORIGIN}/embed/${clip.id}?autoplay=1&mute=0&playsinline=1&controls=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-28 right-2 z-10 rounded-md bg-background/75 px-1.5 py-1 backdrop-blur-sm"><MtvaiBrand compact className="w-[92px]" /></div>
    </div>
    <div style={{ animationDelay: "0s" }} className="mtv-rise flex w-full max-w-sm flex-col items-center gap-2">
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
