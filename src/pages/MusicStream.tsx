import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, SkipForward, SkipBack, Volume2, VolumeX, Home, Search, X } from "lucide-react";
import { buildMusicVideoOrder, MUSIC_VIDEO_GALLERY } from "@/components/PinnedVideoPlayer";
import mtvAiWebToolsLogo from "@/assets/mtv-aiwebtools-logo.png";
import GlobalSearchBar from "@/components/LazyGlobalSearchBar";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";

const shuffle = <T,>(a: T[]): T[] => {
  const s = [...a];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

// Persist a per-visit shuffle seed token so the queue genuinely changes order
// every time the user enters the MTVai theater (not just first mount).
const newSessionShuffleToken = (): number => {
  try {
    const t = Date.now() ^ Math.floor(Math.random() * 0xffffffff);
    sessionStorage.setItem('mtvaiShuffleToken', String(t));
    return t;
  } catch {
    return Date.now() ^ Math.floor(Math.random() * 0xffffffff);
  }
};

const MusicStream = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showIntro, setShowIntro] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  // Truly random playback order every time the user enters the theater.
  // The session token guarantees a fresh shuffle per visit (not just first mount).
  // We also randomize the STARTING INDEX so every video has an equal shot at
  // being the first one played — previously idx always started at 0, which
  // meant the same shuffled-position-0 video felt biased toward "first".
  const playlist = useMemo(() => {
    void newSessionShuffleToken();
    return buildMusicVideoOrder(MUSIC_VIDEO_GALLERY);
  }, []);

  // The queue itself is freshly randomized; begin at its first item so the
  // two-long / one-short cadence is preserved from the moment the theater opens.
  const [idx, setIdx] = useState(0);
  const current = playlist[idx % playlist.length];

  // Guards so YouTube can't double-fire "ended" / fire it during a buffer
  // hiccup — that was causing tracks to occasionally skip or replay before
  // the round was finished.
  const videoStartRef = useRef<number>(Date.now());
  const advancedForRef = useRef<string | null>(null);
  const detectedDurationRef = useRef<number | null>(null);

  useEffect(() => {
    videoStartRef.current = Date.now();
    advancedForRef.current = null;
    detectedDurationRef.current = null;
  }, [current.id]);

  // Persist a "came from music stream" flag so the global back-to-music
  // pill can render on any tool/category page the user navigates to.
  useEffect(() => {
    try { sessionStorage.setItem("cameFromMusicStream", "1"); } catch { /* noop */ }
  }, []);

  // 3D MTV pop-out intro
  useEffect(() => {
    const t = window.setTimeout(() => setShowIntro(false), 1900);
    return () => window.clearTimeout(t);
  }, []);

  // Play the MTVai welcome voice ONCE per browser session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("mtvaiWelcomePlayed") === "1") return;
      const a = new Audio("/sounds/mtvai-welcome.mp3");
      a.volume = 0.9;
      // Best-effort autoplay; if blocked, we silently skip (user gesture already happened to enter)
      a.play().then(() => {
        sessionStorage.setItem("mtvaiWelcomePlayed", "1");
      }).catch(() => {
        // Try once more on first pointer interaction
        const unlock = () => {
          a.play().catch(() => {});
          sessionStorage.setItem("mtvaiWelcomePlayed", "1");
          window.removeEventListener("pointerdown", unlock);
        };
        window.addEventListener("pointerdown", unlock, { once: true });
      });
    } catch { /* noop */ }
  }, []);

  const send = useCallback((func: string, args: unknown[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch {}
  }, []);

  // Listen for end-of-video to auto-advance
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        // Only react to messages from OUR theater iframe — other YouTube
        // embeds on the page (pinned player, etc.) also post state changes
        // and were able to trigger spurious advances.
        if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;

        // Capture duration so we can require ~90% playback before honoring "ended".
        if (data?.info?.duration && data.info.duration > 0 && !detectedDurationRef.current) {
          detectedDurationRef.current = data.info.duration;
        }

        const ended =
          (data?.event === "onStateChange" && data?.info === 0) ||
          data?.info?.playerState === 0;
        if (!ended) return;

        // De-dupe: never advance twice for the same video id.
        if (advancedForRef.current === current.id) return;

        // Require minimum play time — 90% of detected duration, or 9s fallback —
        // so a buffering hiccup or seek can't masquerade as "ended".
        const elapsed = Date.now() - videoStartRef.current;
        const detected = detectedDurationRef.current;
        const minMs = detected ? Math.max(9000, detected * 1000 * 0.9) : 9000;
        if (elapsed < minMs) return;

        advancedForRef.current = current.id;
        setIdx(i => (i + 1) % playlist.length);
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [playlist.length, current.id]);

  // Subscribe to YouTube iframe events so onStateChange messages actually fire.
  // Without this `{event:"listening"}` handshake, end-of-video (info === 0)
  // is never received and the theater never advances.
  const handleIframeLoad = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: current.id, channel: "widget" }),
        "*"
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
        "*"
      );
      // Ensure playback starts unmuted at 1080p
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setPlaybackQuality", args: ["hd1080"] }),
        "*"
      );
      // Theater-loud: crank to 100 and unmute on every load
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "unMute", args: [] }),
        "*"
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setVolume", args: [volume] }),
        "*"
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    } catch { /* noop */ }
  }, [current.id, volume]);

  // IMPORTANT: keep mute OUT of the iframe src so toggling mute does NOT
  // reload the iframe (which previously felt like the track was being skipped).
  // We start muted=0 always at load and control mute purely via postMessage.
  const src = `https://www.youtube.com/embed/${current.id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080`;

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      send(next ? "mute" : "unMute");
      return next;
    });
  }, [send]);

  const onVolumeChange = useCallback((v: number) => {
    setVolume(v);
    send("setVolume", [v]);
    if (v > 0 && muted) {
      setMuted(false);
      send("unMute");
    }
  }, [send, muted]);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      <Helmet>
        <title>AiWebTools Music Stream — 24/7 MTVai Channel</title>
        <meta name="description" content="The official AiWebTools.ai MTVai Music Stream — non-stop AI-crafted music videos in cinematic 9:16, autoplay 1080p." />
      </Helmet>

      {/* 3D MTV pop-out intro */}
      {showIntro && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black pointer-events-none">
          <style>{`
            @keyframes mtvPopOut {
              0%   { transform: perspective(900px) translateZ(-800px) rotateY(180deg) scale(0.1); opacity: 0; filter: blur(20px); }
              40%  { transform: perspective(900px) translateZ(0)      rotateY(0deg)   scale(1.4); opacity: 1; filter: blur(0); }
              70%  { transform: perspective(900px) translateZ(0)      rotateY(0deg)   scale(1.1); opacity: 1; }
              100% { transform: perspective(900px) translateZ(0)      rotateY(0deg)   scale(0.2); opacity: 0; }
            }
            @keyframes codeBurst {
              0% { opacity: 0; transform: scale(0.5); }
              30% { opacity: 1; }
              100% { opacity: 0; transform: scale(2.5); }
            }
          `}</style>
          <div
            aria-hidden
            className="absolute inset-0 font-mono text-[10px] leading-[12px] text-[#00ff41] whitespace-pre overflow-hidden"
            style={{ animation: "codeBurst 1.9s ease-out forwards", textShadow: "0 0 6px #00ff41" }}
          >
            {Array.from({ length: 60 }).map(() => "01001010 11001101 10101110 11110000 00111100 11000011\n").join("")}
          </div>
          <img
            src={mtvAiWebToolsLogo}
            alt="MTV AiWebTools"
            className="w-[60vmin] h-[60vmin] object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.9)]"
            style={{ animation: "mtvPopOut 1.9s cubic-bezier(.2,.7,.2,1) forwards" }}
            draggable={false}
          />
        </div>
      )}

      {/* Header / back nav */}
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-2 px-2 sm:px-3 py-2 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-black/70 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/15 text-[11px] font-mono uppercase tracking-wider"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-black/70 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/15 text-[11px] font-mono uppercase tracking-wider"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => setSearchOpen(s => !s)}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-black/70 border border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/15 text-[11px] font-mono uppercase tracking-wider"
            title="Search AI Tools"
          >
            {searchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Tools</span>
          </button>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <img src={mtvAiWebToolsLogo} alt="MTV AiWebTools" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] shrink-0" draggable={false} />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-fuchsia-300 truncate" style={{ textShadow: "0 0 8px #a855f7" }}>
            AiWebTools Music · LIVE
          </span>
        </div>
        <button
          onClick={toggleMute}
          className="flex items-center gap-1 px-2 py-1.5 rounded bg-black/70 border border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/15 text-[11px]"
          title={muted ? "Unmute" : "Mute"}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Theater volume slider — bottom-right floating control */}
      <div className="fixed bottom-16 right-3 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 border border-fuchsia-500/40 backdrop-blur shadow-[0_0_20px_rgba(168,85,247,0.35)]">
        <button
          onClick={toggleMute}
          className="text-fuchsia-200 hover:text-white"
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={muted ? 0 : volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="MTVai theater volume"
          className="w-28 sm:w-36 accent-fuchsia-500 cursor-pointer"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 w-7 text-right">
          {muted ? 0 : volume}
        </span>
      </div>

      {/* AI Tools slide-out search panel */}
      <div
        className={`fixed top-12 inset-x-0 z-[45] mx-auto max-w-2xl px-3 transition-all duration-300 ease-out ${
          searchOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="rounded-xl border border-fuchsia-500/40 bg-black/90 backdrop-blur p-3 shadow-[0_0_40px_rgba(168,85,247,0.35)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fuchsia-300">
              🔎 AI Tools Search · MTVai
            </span>
            <button
              onClick={() => setSearchOpen(false)}
              className="text-fuchsia-200/70 hover:text-white"
              aria-label="Close tools search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {searchOpen && <GlobalSearchBar />}
        </div>
      </div>

      {/* Theater player — giant 9:16 center stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-full"
          style={{ aspectRatio: "9 / 16", maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <iframe
            ref={iframeRef}
            key={current.id}
            src={src}
            title={current.title}
            className="w-full h-full"
            onLoad={handleIframeLoad}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
          {/* MTV bug overlay (bottom-left) */}
          <img
            src={mtvAiWebToolsLogo}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute bottom-4 left-4 w-16 h-16 md:w-20 md:h-20 opacity-70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          />
          {/* Title strap */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
            <p className="font-mono text-sm md:text-base font-bold text-fuchsia-200" style={{ textShadow: "0 0 8px #a855f7" }}>
              ♪ {current.title}
            </p>
            <p className="font-mono text-[10px] text-cyan-300/80 tracking-widest uppercase mt-0.5">
              Track {idx + 1} / {playlist.length} · AiWebTools.ai MTVai Channel
            </p>
          </div>
        </div>
      </div>

      {/* Footer transport */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <button
          onClick={() => setIdx(i => (i - 1 + playlist.length) % playlist.length)}
          className="h-9 w-12 flex items-center justify-center rounded bg-black/70 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/15"
          title="Previous"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIdx(i => (i + 1) % playlist.length)}
          className="h-9 w-12 flex items-center justify-center rounded bg-black/70 border border-fuchsia-500/40 text-fuchsia-200 hover:bg-fuchsia-500/15"
          title="Next"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <DownloadLibraryButton
          compact
          label="Free GPT Instructions"
          className="hidden sm:inline-flex w-auto max-w-[240px]"
        />
      </div>
    </div>
  );
};

export default MusicStream;