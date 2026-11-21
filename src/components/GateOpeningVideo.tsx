import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { LayoutGrid, Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MTV_CHANNEL_PATH, gateOpeningEventAction, selectGateShort, type GateClip } from "@/utils/gateOpening";
import { navigateInApp } from "@/utils/inAppNavigate";
import { commercialPlayerEvent } from "@/utils/botCommercials";
import { TOTAL_TOOLS } from "@/data/generated/toolCount";
import pandoraPanel from "@/assets/pandora-gate-panel.jpg";
import MtvaiBrand from "@/components/MtvaiBrand";
import { startYouTubeWithSound, youtubePlaybackUrl, VIDEO_QUALITY } from "@/utils/videoPlayback";
import "@/styles/angel-gate.css";

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

export default function GateOpeningVideo({ onFinish }: { onFinish: () => void }) {
  const [clip, setClip] = useState<GateClip | null>(null);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const playing = useRef(false);
  const qualityRequested = useRef(false);
  const watchdog = useRef<number | null>(null);
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
    command("addEventListener", ["onReady"]);
  }, [command]);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (watchdog.current !== null) { window.clearTimeout(watchdog.current); watchdog.current = null; }
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
      if (watchdog.current !== null) { window.clearTimeout(watchdog.current); watchdog.current = null; }
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
      if (event.source === frame.current?.contentWindow && event.origin === PLAYER_ORIGIN) {
        try {
          const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          if (data?.event === "onAutoplayBlocked") { setAutoplayBlocked(true); setStarted(true); }
          if (data?.event === "onReady") startWithSound();
          if (data?.info?.playerState === 1 && (data.info.muted === true || data.info.volume === 0)) setAutoplayBlocked(true);
        } catch { /* ignore unrelated messages */ }
      }
      const action = gateOpeningEventAction(result);
      if (action === "play" && !playing.current) {
        setAutoplayBlocked(false);
        playing.current = true;
        setStarted(true);
        if (!qualityRequested.current) { command("setPlaybackQuality", [VIDEO_QUALITY]); qualityRequested.current = true; }
        startWithSound();
        // Safety net: if YouTube's ended notice is ever missed, close after the clip's
        // known length (plus buffer) so the opening never replays or lingers.
        if (watchdog.current === null) {
          const secs = typeof clip.durationSeconds === "number" && clip.durationSeconds > 0 ? Math.min(clip.durationSeconds, 120) : 75;
          watchdog.current = window.setTimeout(finish, secs * 1000 + 6000);
        }
      }
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

  return <div role="dialog" aria-modal="true" aria-label="MTVAI opening" data-leaving={leaving} className="mtv-opening fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-3 overflow-y-auto bg-background px-4 py-4 text-foreground">
    <div aria-hidden="true" className="mtv-burst pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <span className="mtv-burst-flash" />
      <span className="mtv-burst-ring" />
      <span className="mtv-burst-ring mtv-burst-ring-2" />
      {Array.from({ length: 14 }, (_, i) => <span key={i} className="mtv-burst-ray" style={{ transform: `rotate(${i * (360 / 14)}deg)` }} />)}
      <span className="mtv-burst-word font-mono">MTVAI</span>
    </div>
    <div className="mtv-rise flex flex-col items-center gap-0.5 text-center" style={{ animationDelay: "0s" }}>
      <span className="font-mono text-sm tracking-[0.28em] text-primary">MTVAI.live</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">PRESENTED BY AIWEBTOOLS.APP · {TOTAL_TOOLS.toLocaleString("en-US")}+ AI TOOLS</span>
    </div>
    <p style={{ animationDelay: "0s" }} className="mtv-rise w-full max-w-sm text-center text-sm leading-relaxed text-foreground">This music video was made by a rogue AI music video agent all by itself.....sorta...</p>
    <div style={{ animationDelay: "0s" }} className="mtv-rise mtv-opening-frame relative shrink-0 overflow-hidden rounded-xl border border-primary/25 bg-muted shadow-[0_0_45px_hsl(var(--primary)/.18)]">
      {!started && <div role="status" aria-label="Loading MTVAI opening" className="pointer-events-none absolute inset-0 z-10 grid place-items-center"><div className="flex flex-col items-center gap-4"><img src={pandoraPanel} alt="Pandora opening box" width={200} height={112} className="w-40 rounded border border-primary/40" /><Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none text-primary" /></div></div>}
      {clip && <iframe
        ref={frame}
        title={clip.title}
        onLoad={() => { subscribe(); startWithSound(); setStarted(true); }}
        src={youtubePlaybackUrl(`${PLAYER_ORIGIN}/embed/${clip.id}?controls=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`)}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />}
      {autoplayBlocked && <Button onClick={() => { setAutoplayBlocked(false); startYouTubeWithSound(frame.current); }} className="absolute inset-x-2 top-1/2 z-20 h-auto min-h-10 gap-2 whitespace-normal px-2 text-xs"><Play className="h-4 w-4 shrink-0" />Play with sound</Button>}
      <div aria-hidden="true" className="mtv-opening-brand pointer-events-none absolute bottom-2 right-2 z-10 rounded bg-background/60 px-1 py-0.5"><MtvaiBrand compact /></div>
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
      <Button
        onClick={finish}
        aria-label="View all AI tools"
        className="h-12 w-full max-w-xs gap-2 rounded-full text-base font-bold tracking-wide shadow-[0_0_30px_hsl(var(--primary)/.35)]"
      >
        <LayoutGrid className="h-5 w-5" aria-hidden="true" />
        VIEW ALL AI TOOLS
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
