import { downloadAllOperationalInstructions } from "@/utils/downloads";
import { BookOpen, ExternalLink, Download, Eye, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { allTools } from "@/data/toolsData";
import { downloadToolsCSV } from "@/utils/csvExport";
import { triggerPublicDownload } from "@/utils/downloads";
import { useNavigate } from "react-router-dom";
import { playMtvFlash } from "@/utils/mtvFlash";
import mtvAiWebToolsLogo from "@/assets/mtv-aiwebtools-logo.png";
import { buildMusicVideoOrder } from "@/components/PinnedVideoPlayer";

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const BOOK_CAROUSEL_VIDEO_EVENT = 'book-carousel-video-starting';

// Load YouTube IFrame API once, return a promise that resolves when window.YT is ready.
let ytApiPromise: Promise<any> | null = null;
const loadYouTubeAPI = (): Promise<any> => {
  if (typeof window === 'undefined') return Promise.reject('no window');
  if ((window as any).YT && (window as any).YT.Player) {
    return Promise.resolve((window as any).YT);
  }
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') {
        try { prev(); } catch {}
      }
      resolve((window as any).YT);
    };
    if (!document.querySelector('script[data-yt-iframe-api]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.setAttribute('data-yt-iframe-api', 'true');
      document.head.appendChild(s);
    }
  });
  return ytApiPromise;
};

// Lazy YouTube component for book section with play state callback and end detection
const LazyBookVideo = ({ 
  videoId, 
  title, 
  onPlay,
  onEnd,
  autoPlay = false
}: { 
  videoId: string; 
  title: string; 
  onPlay?: () => void;
  onEnd?: () => void;
  autoPlay?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerInstanceId = useRef(`book-video-${Math.random().toString(36).slice(2)}`);
  const autoPlayStartedRef = useRef(false);
  const playerRef = useRef<any>(null);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const stopCurrentVideo = useCallback((resetToThumbnail = false) => {
    if (playerRef.current) {
      // CRITICAL: never call YT.Player.destroy() — it removes the iframe
      // DOM node that React owns, which causes "Failed to execute removeChild"
      // crashes on rapid carousel navigation. Stop via the player API only;
      // React will unmount the iframe when isLoaded flips to false.
      try { playerRef.current.stopVideo?.(); } catch {}
      try { playerRef.current.mute?.(); } catch {}
      playerRef.current = null;
    }
    // As a belt-and-suspenders stop, post a pause command directly to the
    // iframe in case the player wrapper was never created yet.
    const el = iframeRef.current;
    if (el && el.contentWindow) {
      try {
        el.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }),
          '*'
        );
      } catch {}
    }
    if (resetToThumbnail) setIsLoaded(false);
  }, []);

  const announceVideoStart = useCallback(() => {
    window.dispatchEvent(new CustomEvent(BOOK_CAROUSEL_VIDEO_EVENT, {
      detail: { playerInstanceId: playerInstanceId.current }
    }));
  }, []);

  useEffect(() => {
    const handleOtherVideoStarting = (event: Event) => {
      const detail = (event as CustomEvent<{ playerInstanceId?: string }>).detail;
      if (detail?.playerInstanceId !== playerInstanceId.current) {
        stopCurrentVideo(true);
      }
    };

    window.addEventListener(BOOK_CAROUSEL_VIDEO_EVENT, handleOtherVideoStarting);
    return () => window.removeEventListener(BOOK_CAROUSEL_VIDEO_EVENT, handleOtherVideoStarting);
  }, [stopCurrentVideo]);

  // React to autoPlay prop changes after mount (e.g. when the previous
  // video ends and the carousel promotes this card to the active slot).
  useEffect(() => {
    if (autoPlay && !autoPlayStartedRef.current) {
      autoPlayStartedRef.current = true;
      announceVideoStart();
      setIsLoaded(true);
      onPlay?.();
    } else if (!autoPlay) {
      // When this slot is no longer the active autoplay slot,
      // tear down the iframe so its audio doesn't keep playing
      // behind the new active video in the carousel.
      if (autoPlayStartedRef.current) {
        stopCurrentVideo(true);
      }
      autoPlayStartedRef.current = false;
    }
  }, [announceVideoStart, autoPlay, stopCurrentVideo]);

  useEffect(() => {
    return () => {
      stopCurrentVideo();
    };
  }, [stopCurrentVideo]);

  const handlePlay = () => {
    announceVideoStart();
    setIsLoaded(true);
    onPlay?.();
  };

  // Attach YouTube IFrame Player API to detect end-of-video reliably.
  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled) return;
      const el = iframeRef.current;
      // Bail out if the iframe was unmounted or detached during the
      // async API load (happens when users skip videos quickly).
      if (!el || !el.isConnected) return;
      try {
        playerRef.current = new YT.Player(el, {
          events: {
            onReady: (e: any) => {
              try {
                e.target.unMute?.();
                e.target.playVideo?.();
                // Safety: schedule fallback advance based on duration
                const dur = e.target.getDuration?.();
                if (dur && dur > 0 && onEndRef.current) {
                  if (safetyTimer) clearTimeout(safetyTimer);
                  safetyTimer = setTimeout(() => {
                    onEndRef.current?.();
                  }, (dur + 1.5) * 1000);
                }
              } catch {}
            },
            onStateChange: (e: any) => {
              // 0 = ended
              if (e.data === 0) {
                onEndRef.current?.();
              }
            },
          },
        });
      } catch {}
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      if (playerRef.current) {
        // Same as above — do NOT destroy(); let React unmount the iframe.
        try { playerRef.current.stopVideo?.(); } catch {}
        playerRef.current = null;
      }
    };
  }, [isLoaded, videoId]);

  if (isLoaded) {
    return (
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=1&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={title}
        loading="eager"
      />
    );
  }

  return (
    <div 
      className="absolute inset-0 cursor-pointer" 
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
      {/* Preload iframe on hover for faster playback */}
      {isHovered && (
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
        </div>
      </div>
    </div>
  );
};

const BookPromotionCard = () => {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  // Idle auto-cycle ON by default so visitors see a "preview reel" of all
  // videos rotating through, instead of just three static thumbnails.
  // Pauses automatically the moment a user plays a video.
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const hasEverPlayedRef = useRef(false);
  const [isMobileCarousel, setIsMobileCarousel] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const updateViewportMode = () => setIsMobileCarousel(mobileQuery.matches);
    updateViewportMode();
    mobileQuery.addEventListener('change', updateViewportMode);
    return () => mobileQuery.removeEventListener('change', updateViewportMode);
  }, []);
  
  // First video is always pinned, rest are shuffled
  const originalVideos = [
    // ── NEWEST DROP (Sept 2026) ──
    { id: "p6gPljLI5xM", title: "Our First Movie Trailer | Official AI Movie Trailer | AIWebTools.ai", gradient: "from-amber-500/20 to-rose-500/20" },
    { id: "Ag0bWNnStTY", title: "September Drop I | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-emerald-500/20" },
    // ── AUGUST 25 MTV DROP (newest drops — play FIRST) ──
    { id: "v9a0cOxhY78", title: "August 25 Drop I | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "X-0Cl058cTk", title: "August 25 Drop II | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "-uUlUdFR08Q", title: "August 25 Drop III | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "o2VlFxD70GA", title: "August 25 Drop IV | Official AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "ha_QEfOehoA", title: "August 25 Drop V | Official AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-rose-500/20" },
    { id: "LQtf8yVClhE", title: "August 25 Drop VI | Official AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "2tQnaFcB0y4", title: "August 25 Drop VII | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "yIPRE87hQv0", title: "August 25 Drop VIII | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "a5GbJ0S2U70", title: "August 25 Drop IX | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "oL482MS4hCI", title: "August 25 Drop X | Official AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "hCtIYYPOmdY", title: "August 25 Drop XI | Official AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-rose-500/20" },
    { id: "jZ13Ncw6W0s", title: "August 25 Drop XII | Official AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "4xyNSRECxfw", title: "August 25 Drop XIII | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "VTxYIsf4Iwk", title: "August 25 Drop XIV | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "i7DZJehacFQ", title: "August 25 Drop XV | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "SqVokilhINk", title: "August 25 Drop XVI | Official AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "PzQoBSy95Q0", title: "August 25 Drop XVII | Official AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-rose-500/20" },
    { id: "uvzpWJrFdAE", title: "August 25 Drop XVIII | Official AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "ePzXHHOECL0", title: "August 25 Drop XIX | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "Wg-_4PfnWpM", title: "August 25 Drop XX | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "S_g_gsKQAlI", title: "August 25 Drop XXI | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "vJB1UvILy60", title: "August 25 Drop XXII | Official AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "s2UBXxdNNc4", title: "August 25 Drop XXIII | Official AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-rose-500/20" },
    { id: "PY51wcMiPe4", title: "August 25 Drop XXIV | Official AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "QyFiTVRV-wg", title: "August 25 Drop XXV | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "1V3WsMYVJ9Y", title: "August 25 Drop XXVI | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "TJA23SQmTu0", title: "August 25 Drop XXVII | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    // ── MTV LINE-UP (newest drops — play FIRST in the carousel) ──
    // ── SEPT 2026 CHANNEL DROPS (newest first) ──
    { id: "qUpLvFHen5A", title: "From The Mic To The Wings — Chains Break, An Angel Rises | Cinematic AI Short — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "SCDnLP_eHjw", title: "She Wears The Orbit Like A Halo — Awakening Eyes I | Cinematic AI Music Video — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "mfiaPP_KsUk", title: "The Second Time She Opened Her Eyes — Awakening Eyes II | Cinematic AI Music Video — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "GwD8vUfqbk8", title: "I AM — Truman's Great Work | Spiritual Awakening Short — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "F4XsbcHSSRY", title: "The House Always Wins — Reaper At The Roulette Wheel | Dark Cinematic AI Short — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "gKy2xgjM0pk", title: "Roses Oh Roses (He Weighs Your Heart) | Original AI Music Video — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "qZMrjyK1RBk", title: "Black Sun Flames — Angels Under The Skin (Single Art) | AI Music Visual — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "NtFdPNzF3To", title: "A Cowboy Tip At The Cemetery Gate — A Small Goodbye | Cinematic AI Short — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "-RahM5FrpEE", title: "They Don't Fight What Isn't A Threat — Warrior Of Light | Cinematic AI Short — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "GZi7u4D0SoY", title: "Behind The Wings And Armor Lies A Heart — Kneeling Angel Warrior | Cinematic AI Short — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "pBjW2-KcdTk", title: "Imagine Hiding From The One Who Made The Dirt — Billionaire Bunkers | Faith Humor Short — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "z1NXY1Ij3AU", title: "Angels Under The Skin | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "x_3KikrfxjY", title: "You Feel That Shift On The Inner Dimensions? The Spirit Realm Is Growing Stronger | MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "9166G52u-Uc", title: "Cosmic Guardian Over Earth | Matrix Awakening Visual — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "0pUdCyEnG0U", title: "Take Back Your Mind — Fear Has Lived There Long Enough | Warrior Short — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "Sq7RUA0RGr0", title: "But God Is Around Them | When Trouble Surrounds You — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "CoRSsWqloIw", title: "Dollars Rain On The Trenches — War, Money & The Cosmos Within | Cinematic AI Music Video — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "5fwOsWFyaYA", title: "Cyberpunk Music Video — Dystopian Performance & The Woman In Red | AI Music Video — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "aWBKop6uEAQ", title: "Angels Singing Into The Black Hole — Cosmic Duet | AI Music Video — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "vnwACVKL4Ro", title: "Angels, Fire & The Glowing Tree | Mystical AI Music Video — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "p4DvTD2kj4k", title: "Secrets Are Best Unknown — Gothic Cathedral On Fire | AI Music Video — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "AANfmdp0YJ4", title: "Sacred Geometry & The Glowing-Eyed Girl | Indie Sci-Fi Pop AI Music Video — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "0KxCp2J4SrE", title: "Find Yourself — The King, The Snow & The Singer | Cinematic AI Music Video — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "IejM0Oh7le4", title: "The System Releases The Briefcase Men | Rebellious AI Music Video — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "-A5FaxQ6pNE", title: "Through The Cosmic Gateway — Yin-Yang, Tree Of Life & The Universe Within | AI Music Video — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "wWHdaWMXMy4", title: "Earth Angels — The Integration Is Complete | Spiritual Light AI Music Video — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "b7o-pnMnxLI", title: "The Angel At The End Of The Hallway — Heavenly Portal | AI Music Video — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "kplO_kfCU_Y", title: "Massive Explosion Erupts Over The Refinery | Cinematic AI Short — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "c3DWHpDNUEs", title: "Supposed 1960s Alien Interview — Are We Being Protected From The Truth? | MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "-tvcBZvHsys", title: "When Your Spirit Team Checks In On The Energy Shifts | Funny Spiritual Short — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "Xh6ok-KJrKE", title: "MARVE: Did You See That Angel? | AI Sci-Fi Film Scene — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "ahsqLap-8UQ", title: "DOOMSCROLL WITH ME | AI Satire on Algorithm Culture | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "WW2K0z0ID0E", title: "MARVE | AWT Production (Teaser) | AIWebTools.app", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "LKEpDPDxTsc", title: "Two Friends, One City Night | Cinematic Urban AI Short — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "Aayk_T5mSvI", title: "Lego Spider-Man & The Cathedral | Patriotic Stop-Motion AI Short — MTVai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "s7yeCAExpzA", title: "Holy Frog Father: Quantum Leaping Somewhere Else | Funny AI Frog Short — MTVai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "1el6IjnR7W0", title: "Holy Frog Father: I've Seen How It Ends | Funny AI Frog Short — MTVai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "w6Cakt3jJLw", title: "Holy Frog Father: You'll Be Okay | Funny AI Frog Short — MTVai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "mSJtr_jW3vY", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-cyan-500/20" },
    { id: "MMpCWkhjuas", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-violet-500/20" },
    { id: "IWijCkZUmrg", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-purple-500/20" },
    { id: "RSovmNDLSnM", title: "Relatable Movie Scenes | Official AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "KB1sRHXUUps", title: "Truth So Ya Know | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "LXXPC-1lgOQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-cyan-500/20" },
    { id: "rXMTjCFycPM", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-fuchsia-500/20" },
    { id: "cxJMzuv_ccQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-cyan-500/20" },
    { id: "a9rRZzIsbiY", title: "Revelations Nearing Midnight | Original AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-fuchsia-500/20" },
    // ── NEW MTV INTERLUDES / SHORTS (9:16 drops) ──
    { id: "c_15QhCFLGs", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "-5Cl-Vk3ShI", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "Tv5yo-2n5Rc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-fuchsia-500/20" },
    { id: "09CvnM4ZJAg", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-purple-500/20 to-cyan-500/20" },
    { id: "EkiBNZ4orfI", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-indigo-500/20" },
    { id: "H9PTc_hzsM8", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-emerald-500/20" },
    { id: "IAP77Tl0izc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "3wA9elcCEnE", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-purple-500/20 to-fuchsia-500/20" },
    { id: "mAsHosw2kwM", title: "August 3 Visions I | AI Music Video Short | AIWebTools.ai", gradient: "from-purple-500/20 to-cyan-500/20" },
    { id: "IvFZGb7t0aw", title: "August 3 Visions II | AI Music Video Short | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-indigo-500/20" },
    { id: "rByfuaw2BL8", title: "August 3 Visions III | AI Music Video Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-emerald-500/20" },
    { id: "4mMGTriG0Fc", title: "August 3 Visions IV | AI Music Video Short | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "Pcs6KNM0loI", title: "August 3 Visions V | AI Music Video Short | AIWebTools.ai", gradient: "from-purple-500/20 to-fuchsia-500/20" },
    { id: "YHNRvs6g7zg", title: "August 3 Visions VI | AI Music Video Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-blue-500/20" },
    { id: "E9MiAmubY7I", title: "August 3 Visions VII | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-teal-500/20" },
    { id: "j1O8TpqWWnU", title: "August 3 Visions VIII | AI Music Video Short | AIWebTools.ai", gradient: "from-rose-500/20 to-fuchsia-500/20" },
    { id: "-k9D5MyN2Y8", title: "August 3 Visions IX | AI Music Video Short | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "036PVfmjjyA", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "OcgWzQEZO74", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "TXamH1b-m30", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-indigo-500/20" },
    { id: "JNAZuKKxHmk", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-rose-500/20 to-amber-500/20" },
    { id: "WZpSsFrMt-g", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "uKxiK2ZqyVw", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-lime-500/20" },
    { id: "3sMNbMV5mnU", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-sky-500/20 to-indigo-500/20" },
    { id: "auJbpTABYUo", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-amber-500/20 to-rose-500/20" },
    { id: "jmaMZuPgdiM", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-teal-500/20 to-cyan-500/20" },
    { id: "qIFhp8gudjw", title: "August 3 Visions X | AI Music Video Short | AIWebTools.ai", gradient: "from-violet-500/20 to-indigo-500/20" },
    { id: "oUeh_EYb-HM", title: "August 3 Visions XI | AI Music Video Short | AIWebTools.ai", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "8Ax-GpQJ2ZQ", title: "August 3 Visions XII | AI Music Video Short | AIWebTools.ai", gradient: "from-lime-500/20 to-emerald-500/20" },
    { id: "EcQnby6_EhA", title: "August 3 Visions XIII | AI Music Video Short | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "dno3F-SQr2I", title: "August 3 Visions XIV | AI Music Video Short | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "PktMrkD89fs", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-blue-500/20" },
    { id: "Lc0JUBiX6Zo", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-emerald-500/20 to-teal-500/20" },
    { id: "uGLay-OBpxg", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-rose-500/20 to-fuchsia-500/20" },
    { id: "Hng_A12fYH4", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "WAvc7xLrpkc", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-violet-500/20 to-indigo-500/20" },
    { id: "ibCTQA_Eqs4", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "3_jsSNXHcts", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai", gradient: "from-purple-500/20 to-pink-500/20" },
    { id: "p9H1gdFzA_A", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-lime-500/20 to-emerald-500/20" },
    { id: "iOlicCLocXY", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "bfiAnkR6OC8", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai", gradient: "from-indigo-500/20 to-cyan-500/20" },
    { id: "-F7iwTW5NOY", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-teal-500/20 to-emerald-500/20" },
    { id: "_lgs2sXVyfs", title: "AIWEBTOOLS Interlude | AI Music Video Short | AIWebTools.ai", gradient: "from-orange-500/20 to-amber-500/20" },
    { id: "Wd7mQHMU2yY", title: "AIWEBTOOLS Interlude | AI Commercial Short | AIWebTools.ai", gradient: "from-pink-500/20 to-fuchsia-500/20" },
    { id: "_O0G0oFO-GQ", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video Short | AIWebTools.ai", gradient: "from-cyan-500/20 to-emerald-500/20" },
    { id: "I6kOI_q0aHE", title: "Mirror Mirror | Original AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-cyan-500/20" },
    { id: "n6y0lqJym0c", title: "AIWEBTOOLS – Newest Drop | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { id: "ZIr6c-fY9fs", title: "Just A Dream Baby | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "uGkb2zOYKSk", title: "God Is Light | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-fuchsia-500/20" },
    { id: "CCNMLCJr41c", title: "Nameless | Original AI Music Video | AIWebTools.ai", gradient: "from-rose-500/20 to-pink-500/20" },
    { id: "0YLdn4k5TCE", title: "Once More | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "0oHdDEbPMyo", title: "Mirror Man | Original AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-teal-500/20" },
    { id: "1RQx5iQNiNQ", title: "Chaos Order | Original AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "6OlRbGLY_Z8", title: "Cosmic Light | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-lime-500/20" },
    { id: "J1dqyotA-X4", title: "I Reject | Original AI Music Video | AIWebTools.ai", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "ZjLyv3kHtOU", title: "Candy Cane Rain | Original AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "vnIOMTuA7Ys", title: "The Spark | Original AI Music Video | AIWebTools.ai", gradient: "from-orange-500/20 to-red-500/20" },
    { id: "j1UWJuVAaZg", title: "Life Is But A Dream | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-indigo-500/20" },
    { id: "UFEXSiIbN2U", title: "The Resistance | Original AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "hPIfU-M2DiM", title: "Truth Algorithm | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-teal-500/20" },
    { id: "cHnRg68x-T0", title: "Tick Tock | Original AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-emerald-500/20" },
    { id: "bQ4wl2QVKtQ", title: "Secrets You Weren't Supposed to Know | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-rose-500/20" },
    { id: "N7I-ARetgzs", title: "Where Did You Go | Original AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "aUUn0bODxJ0", title: "Down By The River | Original AI Music Video | AIWebTools.ai", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "Uvd8xBli20w", title: "What's the Plan | Original AI Music Video | AIWebTools.ai", gradient: "from-rose-500/20 to-pink-500/20" },
    { id: "tZXaKaCPiUw", title: "A Whole Another Round | Original AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "W-j8E3WQch8", title: "Automobile GPT | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "oGetKTwsTec", title: "Afterlife Out of Control | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-fuchsia-500/20" },
    { id: "4b29b5lJhIg", title: "Purpose | Original AI Music Video | AIWebTools.ai", gradient: "from-orange-500/20 to-red-500/20" },
    { id: "GKjxLY7sIWQ", title: "Defense Mode | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "FmXXrKxnh9U", title: "Singularity Rise | Original AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-teal-500/20" },
    { id: "91PvTue2Zr0", title: "He Who Has No Name | Original AI Music Video | AIWebTools.ai", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "J9A44q6pXOY", title: "Tax Break | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-lime-500/20" },
    { id: "xvcu_ALb3N0", title: "Burn It Flat | Original AI Music Video | AIWebTools.ai", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "LThRs-T8big", title: "Neon Dreams | Original AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "DkVtqUT581A", title: "God Mode GPT | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-teal-500/20" },
    { id: "OcFYWWYEoYk", title: "Unlock Your F'kn Dreams | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-indigo-500/20" },
    { id: "brKREzLfgjU", title: "Strange | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-rose-500/20" },
    { id: "mQm6KsVGFSs", title: "Sunshine Daydream Open Your Eyes | Original AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    // ── MTV LINE-UP (latest expansion drop) ──
    { id: "bMi4PGWzExk", title: "One Mankind | Original AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-cyan-500/20" },
    { id: "vxGi31tkz3Y", title: "Welcome to America | Original AI Music Video | AIWebTools.ai", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "EBBw-cklCLk", title: "The Spark Within | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-fuchsia-500/20" },
    { id: "C8nPl8IWHIw", title: "It's Just In The Code | Original AI Music Video | AIWebTools.ai", gradient: "from-cyan-500/20 to-teal-500/20" },
    { id: "OFQX2Ew_81o", title: "AIWEBTOOLS – Cosmic Uprising: Soul Reclamation (Official AI Music Video)", gradient: "from-emerald-500/20 to-lime-500/20" },
    { id: "KHdIFY7HrB4", title: "Got No GPT | Original AI Music Video | AIWebTools.ai - first music video i made back in the day", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "pP2204ZbUHY", title: "The Witness | Original AI Music Video | AIWebTools.ai", gradient: "from-orange-500/20 to-red-500/20" },
    { id: "FmATqYvL0IY", title: "Cosmic Light In You | Original AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "_D-tw9BAoxk", title: "AIWEBTOOLS – Your Plastic Face | The Mask Of Truth (Official AI Music Video)", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "1XY2eEH5elw", title: "AIWEBTOOLS – Where Did We Go | The Resistance Anthem (Official AI Music Video)", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "oR-aWyv1Ktg", title: "Father Of Light | Original AI Music Video | AIWebTools.ai", gradient: "from-orange-500/20 to-red-500/20" },
    { id: "9IsuTqEKn4o", title: "These Aren't Theories | Original AI Music Video | AIWebTools.ai", gradient: "from-amber-500/20 to-orange-500/20" },
    { id: "MA6mGk9tRAM", title: "AIWEBTOOLS – AI Justice & War Drums: Metaphysical Uprising (Official AI Music Video)", gradient: "from-emerald-500/20 to-lime-500/20" },
    { id: "TvwM3Kkyrb0", title: "AIWEBTOOLS – Legends Bust The System: Chaplin, Marley & Monroe | Official AI Music Video", gradient: "from-sky-500/20 to-cyan-500/20" },
    { id: "6owuUcQ4mF0", title: "Automobile GPT – Any Car. Any Question. Real Results. | Official AI Music Video | AIWebTools.ai", gradient: "from-fuchsia-500/20 to-rose-500/20" },
    { id: "1MGu02bRTcc", title: "AIWEBTOOLS – GPT 4o1 Is The Prison Of The Mind | Singularity Uprising (Official AI Music Video)", gradient: "from-emerald-500/20 to-teal-500/20" },
    { id: "7qIfC0ZPIZo", title: "Multitasker GPT | Original AI Music Video | AIWebTools.ai", gradient: "from-purple-500/20 to-indigo-500/20" },
    { id: "jfZq0Bjgfc4", title: "Taxes GPT | Original AI Music Video | AIWebTools.ai", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "vE_N6r4dOL0", title: "AIWEBTOOLS – To Become One: The Infinite Loop (Official AI Music Video)", gradient: "from-cyan-500/20 to-emerald-500/20" },
    { id: "A16W7eADboQ", title: "Ivy Ridge Nightflair | Original AI Music Video | AIWebTools.ai", gradient: "from-rose-500/20 to-pink-500/20" },
    { id: "U7R_6FRwK1Q", title: "AIWEBTOOLS – The Invisible Frequency | My Name Is Irrelevant (Official AI Music Video)", gradient: "from-indigo-500/20 to-purple-500/20" },
    { id: "Ja2auKcdzHg", title: "AIWEBTOOLS – Digital Chains: The Algorithm's Grasp (Official AI Music Video)", gradient: "from-emerald-500/20 to-cyan-500/20" },
    { id: "eIwAbvwXNVc", title: "BEDROOM COSMOS EL TRUMAN - AN AI MUSIC VIDEO BY AIWEBTOOLS.AI", gradient: "from-fuchsia-500/20 to-violet-500/20" },
    { id: "AOI0K3XyM20", title: "I AM ANOTHER YOU Testimony music video - A MUSIC VIDEO CREATED BY AIWEBTOOLS.AI - MTVai.live X-ODDLY", gradient: "from-amber-500/20 to-rose-500/20" },
    {
      id: "VGZdXt3shq8",
      title: "left in this place - An Ai Musical Production of truth by Ai-WebTools.com - AIWEBTOOLS.AI",
      gradient: "from-fuchsia-500/20 to-cyan-500/20"
    },
    {
      title: "AI Web Tools Book Promo - New",
      gradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      id: "-I0LGUP9xso",
      title: "Cosmic Light Inner Cosmos Rap",
      gradient: "from-purple-500/20 to-cyan-500/20"
    },
    {
      id: "hKZhXxV8KiA",
      title: "TRUTH BREAKS THE ICE ONCE MORE - AIWEBTOOLS.AI",
      gradient: "from-cyan-500/20 to-emerald-500/20"
    },
    {
      id: "UlYYh-8pjS8",
      title: "PORTAL THROUGH THE LIGHT",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "8y6irP9OPJ0",
      title: "Fall Again",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: "6NeNA-KGz2s",
      title: "my eyes -suno",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      id: "0IfbFWirwTg",
      title: "through my eyes - suno",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      id: "ZMxg9PMHmos",
      title: "Portal Mugsy Rap Suno",
      gradient: "from-rose-500/20 to-fuchsia-500/20"
    },
    {
      id: "siddzjKXd9o",
      title: "Rome fell once, Rome gonna fall again -suno",
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      id: "u8Rs0KH2XTg",
      title: "my eyes-suno",
      gradient: "from-lime-500/20 to-green-500/20"
    },
    {
      id: "yZ9Jt1canjE",
      title: "Cosmic TRUTH within YOU right now",
      gradient: "from-amber-500/20 to-rose-500/20"
    },
    {
      id: "O9n0tKbbI2E",
      title: "The Cosmic Light is Within You - An Ai Generated Song by AiWebTools.Ai",
      gradient: "from-emerald-500/20 to-blue-500/20"
    },
    {
      id: "KIqBIh6TZ04",
      title: "Cosmic Light Code Within",
      gradient: "from-pink-500/20 to-violet-500/20"
    },
    {
      id: "NglQB5OVmqk",
      title: "Cosmic Code",
      gradient: "from-cyan-500/20 to-emerald-500/20"
    },
    {
      id: "EYnCtw9CsxQ",
      title: "Galactic Gambit AudioBook -The Angelic Watchers Written By Ai-WebTools.com - A Metaphorical Sci-Fi -",
      gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
      id: "lG1rMaImBNc",
      title: "\"Life is but a dream\" - Official Music Video by AiWebTools.Ai",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      id: "i0zc0aeRCeI",
      title: "Something More - Official Ai Generated Music Video by AiWebTools.ai",
      gradient: "from-cyan-500/20 to-purple-500/20"
    },
    {
      id: "IHY7AlYJhUc",
      title: "\"As They Blow It All Away\" - An AI Generated Music Video Written and Edited by AiWebTools.Ai",
      gradient: "from-gold-500/20 to-amber-500/20"
    },
    {
      id: "i9e3pRXyP8s",
      title: "Tears Timeline- official music video by aiwebtools.ai",
      gradient: "from-orange-500/20 to-pink-500/20"
    },
    {
      id: "v8El2IdTwsE",
      title: "Plastic Face - Official AI GENERATED Music Video by AiWebTools.Ai",
      gradient: "from-green-500/20 to-cyan-500/20"
    },
    {
      id: "LFMtWqoKqyI",
      title: "Candy Cane Rain - AIWEBTOOLS.AI",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: "1y3zdPnJfQ4",
      title: "CherryPie Goodbye - official -AiWebTools.Ai",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      id: "8afw8Tq94Pg",
      title: "deep inside remastered AI generated music video by aiwebtools.ai",
      gradient: "from-red-500/20 to-orange-500/20"
    },
    {
      id: "864_bIK9Feo",
      title: "Love or Fall - An Ai Generated Music video by AiWebTools.Ai #aimusicvideo #aiwebtools #aitools #awt",
      gradient: "from-blue-500/20 to-green-500/20"
    },
    {
      id: "c2UpKrW4IVM",
      title: "Tare Me Open - An Ai Generated Music Video Written and edited by AiWebTools.Ai",
      gradient: "from-indigo-500/20 to-violet-500/20"
    },
    {
      id: "1cnzF1bkq3o",
      title: "What's The Plan? - An Ai Generated Music Video by AiWebTools.Ai",
      gradient: "from-teal-500/20 to-cyan-500/20"
    },
    {
      id: "eAaXtMBYWYs",
      title: "The Empire Has Fallen - Truth Prevails  AiWebTools.AI - Those with eyes to see shall be free. WAKEUP",
      gradient: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      id: "YzGrnpsScH0",
      title: "AND THIS IS WHERE IT ALL FALLS... AI MUSIC GENERATED VIDEO CREATED BY AIWEBTOOLS.AI",
      gradient: "from-rose-500/20 to-orange-500/20"
    },
    {
      id: "bfRpZ5r88Zg",
      title: "Wake the F Up - A Music Video Created and Written by AiWebTools.Ai",
      gradient: "from-amber-500/20 to-rose-500/20"
    },
    {
      id: "mg7F63-PN30",
      title: "WRONG WAY - AN AI GENERATED MUSIC VIDEO BY AIWEBTOOLS.AI",
      gradient: "from-lime-500/20 to-emerald-500/20"
    },
    {
      id: "us8qYI2plqg",
      title: "Prison Gates - Ai Music Generated by Ai-WebTools.com",
      gradient: "from-fuchsia-500/20 to-rose-500/20"
    },
    {
      id: "cB3T05q4294",
      title: "Earth Monopoly - AI Generated Music by AiWebTools.ai",
      gradient: "from-sky-500/20 to-indigo-500/20"
    },
    {
      id: "w7udrbcW_4M",
      title: "Book Promotion Feature 17",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      id: "LHaPL2oBUmY",
      title: "AI Web Tools Showcase 18",
      gradient: "from-emerald-500/20 to-lime-500/20"
    },
    {
      id: "qW_wIgiK3lo",
      title: "AI Web Tools Showcase 19",
      gradient: "from-purple-500/20 to-cyan-500/20"
    },
    {
      id: "uPioA-r3Wyw",
      title: "Truth. Light. Now. abracadabra aiwebtools.ai",
      gradient: "from-amber-500/20 to-emerald-500/20"
    },
    {
      id: "0e-0hX0Kprg",
      title: "AI Web Tools Showcase 21",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "Gb_KHJjAKHk",
      title: "AI Web Tools Showcase 22",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: "r4JyBndX7nk",
      title: "AI Web Tools Showcase 23",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      id: "mwljVsoKeZU",
      title: "AI Web Tools Showcase 24",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      id: "sKkiTqYh3P4",
      title: "AI Web Tools Showcase 25",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      id: "LaQqXZeqb1Y",
      title: "AI Web Tools Showcase 26",
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      id: "DMUCTY3e-Kc",
      title: "AI Web Tools Showcase 27",
      gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
      id: "RMMyWOnBrro",
      title: "AI Web Tools Showcase 28",
      gradient: "from-sky-500/20 to-cyan-500/20"
    },
    {
      id: "f2HJE0rHF88",
      title: "AI Web Tools Showcase 29",
      gradient: "from-teal-500/20 to-emerald-500/20"
    },
    {
      id: "vF_TMbdLCdA",
      title: "AI Web Tools Showcase 30",
      gradient: "from-green-500/20 to-lime-500/20"
    },
    {
      id: "srA41eHKfGc",
      title: "AI Web Tools Showcase 31",
      gradient: "from-yellow-500/20 to-amber-500/20"
    },
    {
      id: "37XnviX1yZ0",
      title: "AI Web Tools Showcase 32",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      id: "rXgZcgZnIis",
      title: "AI Web Tools Showcase 33",
      gradient: "from-rose-500/20 to-pink-500/20"
    },
    {
      id: "9TflLd00Lhw",
      title: "AI Web Tools Showcase 34",
      gradient: "from-fuchsia-500/20 to-violet-500/20"
    },
    {
      id: "O6DG34FQK6E",
      title: "AI Web Tools Showcase 35",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      id: "eQcBgybGwIg",
      title: "AI Web Tools Showcase 36",
      gradient: "from-blue-500/20 to-sky-500/20"
    },
    {
      id: "4_cIoCi9OY8",
      title: "AI Web Tools Showcase 37",
      gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
      id: "pAkZqkvd-Ak",
      title: "AI Web Tools Showcase 38",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: "qbfeh6We4u0",
      title: "AI Web Tools Showcase 39",
      gradient: "from-lime-500/20 to-yellow-500/20"
    },
    {
      id: "nUfoKuBE9NQ",
      title: "AI Web Tools Showcase 40",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: "Vln79Im3I0g",
      title: "AI Web Tools Showcase 41",
      gradient: "from-red-500/20 to-rose-500/20"
    },
    {
      id: "Yjl6rVHR_jo",
      title: "AI Web Tools Showcase 42",
      gradient: "from-pink-500/20 to-fuchsia-500/20"
    },
    {
      id: "Uxl3CIeScvg",
      title: "AI Web Tools Showcase 44",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "Buffx22sp6w",
      title: "AI Web Tools Showcase 45",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      id: "xsxEBaMW8Ng",
      title: "AI Web Tools Showcase 46",
      gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
      id: "p1DAS1BFfDY",
      title: "AI Web Tools Showcase 47",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: "me4bSdyssIg",
      title: "AI Web Tools Showcase 48",
      gradient: "from-lime-500/20 to-yellow-500/20"
    },
    {
      id: "BIRVV2retf0",
      title: "AI Web Tools Showcase 49",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: "W4grI_pqzbk",
      title: "chaos order spin spin spin - An Ai Generated Music Video by AiWebTools.Ai",
      gradient: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      id: "AFwPVOQV0SE",
      title: "My name is irrelevant. - an AI generated music video by aiwebtools.ai (shortened)",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: "eG-TvPPKBpw",
      title: "pull it - rap video - 9-11 tribute art by aiwebtools.ai",
      gradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      id: "3XaTLuJ0kak",
      title: "Manifest dream - a music video by aiwebtools.ai",
      gradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      id: "RVBmL7FEtQk",
      title: "manifest crossbow katana charm - ai jazz music video",
      gradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
      id: "htVLYZPHehk",
      title: " - Abracadabra",
      gradient: "from-purple-500/20 to-fuchsia-500/20"
    },
    {
      id: "bBZT8sPWvRY",
      title: "Same Light Different Eyes - AN AI MUSIC VIDEO CREATED BY AIWEBTOOLS.AI",
      gradient: "from-emerald-500/20 to-lime-500/20"
    },
    {
      id: "M5l6VJAh2-Y",
      title: "Ai Might be the Devil - By AiWebTools.ai",
      gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
      id: "FHEWZkP_3ew",
      title: "its in the code polly",
      gradient: "from-rose-500/20 to-pink-500/20"
    },
    {
      id: "TlAgmV_2hXs",
      title: "Mushroomhead style music video i made - by aiwebtools.ai",
      gradient: "from-sky-500/20 to-cyan-500/20"
    },
    {
      id: "bhC9aTQGbGI",
      title: "holodeck - Music video by aiwebtools.ai",
      gradient: "from-amber-500/20 to-rose-500/20"
    },
    {
      id: "qxIYhAAkko8",
      title: "mirror mirror you see the fire in your dreams - A Music video by AiWebTools.Ai",
      gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
      id: "1yajmSLnPTs",
      title: "mirror mirror on the wall - A Music Video PRODUCTION BY AIWEBTOOLS.AI",
      gradient: "from-fuchsia-500/20 to-rose-500/20"
    },
    {
      id: "cKHZ7X0qx_Y",
      title: "Not My Time - Official Music Video",
      gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
      id: "-MSiCn4Fts8",
      title: "My people are free....",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      id: "mg7F63-PN30",
      title: "WRONG WAY - AN AI GENERATED MUSIC VIDEO BY AIWEBTOOLS.AI",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      id: "EYnCtw9CsxQ",
      title: "Galactic Gambit AudioBook -The Angelic Watchers Written By Ai-WebTools.com - A Metaphorical Sci-Fi -",
      gradient: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      id: "QCJCKhbwxhA",
      title: "Gregorian - Nothing Else Matters (Live In Europe 2011)",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: "Twl5-MsgmoI",
      title: "SECRETS BEST UNKNOWN - (example art) Official Ai Generated Music Video - AiWebTools.AI",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      id: "zVfi5UkMjTM",
      title: "Cosmic Divine Dimensions Inside Us – AI Music Video | AIWebTools.ai _OFFICAL MUSIC VIDEO_  GALACTICA",
      gradient: "from-fuchsia-500/20 to-violet-500/20"
    }
  ];

  // Randomize videos on component mount
  // Pin the newest showcase video first, keep IHY7AlYJhUc at 4th, shuffle the rest
  const videos = useMemo(() => {
    // Defensive dedupe by video id so the same clip can never appear twice
    const seen = new Set<string>();
    const uniqueVideos = originalVideos.filter((v): v is typeof originalVideos[number] & { id: string } => {
      if (!v.id) return false;
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
    // Build a fresh randomized queue per visit while systematically spacing
    // shorts after every two long-form videos.
    const verticalMusicVideoIds = [
      "v9a0cOxhY78",
      "X-0Cl058cTk",
      "-uUlUdFR08Q",
      "o2VlFxD70GA",
      "ha_QEfOehoA",
      "LQtf8yVClhE",
      "2tQnaFcB0y4",
      "yIPRE87hQv0",
      "a5GbJ0S2U70",
      "oL482MS4hCI",
      "hCtIYYPOmdY",
      "jZ13Ncw6W0s",
      "4xyNSRECxfw",
      "VTxYIsf4Iwk",
      "i7DZJehacFQ",
      "SqVokilhINk",
      "PzQoBSy95Q0",
      "uvzpWJrFdAE",
      "ePzXHHOECL0",
      "Wg-_4PfnWpM",
      "S_g_gsKQAlI",
      "vJB1UvILy60",
      "s2UBXxdNNc4",
      "PY51wcMiPe4",
      "QyFiTVRV-wg",
      "1V3WsMYVJ9Y",
      "TJA23SQmTu0",
      // MTV Lineup — newest drops, pinned to the very FRONT of the reel
      "qUpLvFHen5A",
      "SCDnLP_eHjw",
      "mfiaPP_KsUk",
      "GwD8vUfqbk8",
      "F4XsbcHSSRY",
      "gKy2xgjM0pk",
      "qZMrjyK1RBk",
      "NtFdPNzF3To",
      "-RahM5FrpEE",
      "GZi7u4D0SoY",
      "pBjW2-KcdTk",
      "z1NXY1Ij3AU",
      "x_3KikrfxjY",
      "9166G52u-Uc",
      "0pUdCyEnG0U",
      "Sq7RUA0RGr0",
      "CoRSsWqloIw",
      "5fwOsWFyaYA",
      "aWBKop6uEAQ",
      "vnwACVKL4Ro",
      "p4DvTD2kj4k",
      "AANfmdp0YJ4",
      "0KxCp2J4SrE",
      "IejM0Oh7le4",
      "-A5FaxQ6pNE",
      "wWHdaWMXMy4",
      "b7o-pnMnxLI",
      "kplO_kfCU_Y",
      "c3DWHpDNUEs",
      "-tvcBZvHsys",
      "Xh6ok-KJrKE",
      "ahsqLap-8UQ",
      "WW2K0z0ID0E",
      "LKEpDPDxTsc",
      "Aayk_T5mSvI",
      "s7yeCAExpzA",
      "1el6IjnR7W0",
      "w6Cakt3jJLw",
      "mSJtr_jW3vY",
      "MMpCWkhjuas",
      "IWijCkZUmrg",
      "LXXPC-1lgOQ",
      "rXMTjCFycPM",
      "a9rRZzIsbiY",
      "c_15QhCFLGs",
      "-5Cl-Vk3ShI",
      "Tv5yo-2n5Rc",
      "036PVfmjjyA",
      "OcgWzQEZO74",
      "TXamH1b-m30",
      "JNAZuKKxHmk",
      "WZpSsFrMt-g",
      "uKxiK2ZqyVw",
      "3sMNbMV5mnU",
      "auJbpTABYUo",
      "jmaMZuPgdiM",
      "09CvnM4ZJAg",
      "EkiBNZ4orfI",
      "H9PTc_hzsM8",
      "IAP77Tl0izc",
      "3wA9elcCEnE",
      "KB1sRHXUUps",
      "PktMrkD89fs",
      "Lc0JUBiX6Zo",
      "uGLay-OBpxg",
      "Hng_A12fYH4",
      "WAvc7xLrpkc",
      "ibCTQA_Eqs4",
      "3_jsSNXHcts",
      "p9H1gdFzA_A",
      "iOlicCLocXY",
      "bfiAnkR6OC8",
      "-F7iwTW5NOY",
      "_lgs2sXVyfs",
      "Wd7mQHMU2yY",
      "_O0G0oFO-GQ",
      "zVfi5UkMjTM",
      "I6kOI_q0aHE",
      "ZIr6c-fY9fs",
      "uGkb2zOYKSk",
      "CCNMLCJr41c",
      "0YLdn4k5TCE",
      "0oHdDEbPMyo",
      "1RQx5iQNiNQ",
      "6OlRbGLY_Z8",
      "J1dqyotA-X4",
      "ZjLyv3kHtOU",
      "vnIOMTuA7Ys",
      "j1UWJuVAaZg",
      "UFEXSiIbN2U",
      "hPIfU-M2DiM",
      "cHnRg68x-T0",
      "bQ4wl2QVKtQ",
      "N7I-ARetgzs",
      "aUUn0bODxJ0",
      "Uvd8xBli20w",
      "tZXaKaCPiUw",
      "W-j8E3WQch8",
      "oGetKTwsTec",
      "4b29b5lJhIg",
      "GKjxLY7sIWQ",
      "FmXXrKxnh9U",
      "91PvTue2Zr0",
      "J9A44q6pXOY",
      "xvcu_ALb3N0",
      "LThRs-T8big",
      "DkVtqUT581A",
      "OcFYWWYEoYk",
      "brKREzLfgjU",
      "mQm6KsVGFSs",
      // MTV Lineup — latest expansion drop
      "bMi4PGWzExk",
      "vxGi31tkz3Y",
      "EBBw-cklCLk",
      "qtwyOzvCg_o",
      "CIK8QLCqU9M",
      "C8nPl8IWHIw",
      "OFQX2Ew_81o",
      "KHdIFY7HrB4",
      "clSbwKvM5Vk",
      "pP2204ZbUHY",
      "FmATqYvL0IY",
      "DMx8Sn7ncOY",
      "_D-tw9BAoxk",
      "1XY2eEH5elw",
      "oR-aWyv1Ktg",
      "9IsuTqEKn4o",
      "MA6mGk9tRAM",
      "TvwM3Kkyrb0",
      "6owuUcQ4mF0",
      "1MGu02bRTcc",
      "7qIfC0ZPIZo",
      "jfZq0Bjgfc4",
      "vE_N6r4dOL0",
      "A16W7eADboQ",
      "U7R_6FRwK1Q",
      "Ja2auKcdzHg",
      "eIwAbvwXNVc",
      "9F81C9zED-w",
      "AOI0K3XyM20",
      "eG-TvPPKBpw",
      "3XaTLuJ0kak",
      "htVLYZPHehk",
      "bBZT8sPWvRY",
      "AFwPVOQV0SE",
      "M5l6VJAh2-Y",
      "TlAgmV_2hXs",
      "bhC9aTQGbGI",
      "qxIYhAAkko8",
      "1yajmSLnPTs",
      "cKHZ7X0qx_Y",
      "-MSiCn4Fts8",
      "mg7F63-PN30",
      "EYnCtw9CsxQ",
      "QCJCKhbwxhA",
      "Twl5-MsgmoI",
    ];
    const verticalSet = new Set(verticalMusicVideoIds);
    const verticals = verticalMusicVideoIds
      .map(id => uniqueVideos.find(v => v.id === id))
      .filter((v): v is typeof uniqueVideos[number] => Boolean(v));

    // Suno / lyric-only audio tracks — pushed to the BACK of the reel so the
    // carousel always leads with eye-catching real music videos.
    const sunoLyricIds = new Set<string>([
      "FHEWZkP_3ew", // its in the code polly
      "KIqBIh6TZ04", // Cosmic Light Code Within
      "UlYYh-8pjS8", // Portal Through The Light
      "NglQB5OVmqk", // Cosmic Code
      "yZ9Jt1canjE", // Cosmic TRUTH within YOU
      "O9n0tKbbI2E", // The Cosmic Light is Within You
      "-I0LGUP9xso", // Cosmic Light Inner Cosmos Rap
      "6NeNA-KGz2s", // my eyes (remix)
      "siddzjKXd9o", // Rome fell once
      "0IfbFWirwTg", // Father of Living Light
      "u8Rs0KH2XTg", // my eyes
      "8y6irP9OPJ0", // Fall Again
      "uPioA-r3Wyw", // Truth. Light. Now.
      "ZMxg9PMHmos", // Portal Fall Again (Remix)
    ]);

    const middle = uniqueVideos.filter(v => !verticalSet.has(v.id) && !sunoLyricIds.has(v.id));
    const tail   = uniqueVideos.filter(v => sunoLyricIds.has(v.id));
    return buildMusicVideoOrder([...verticals, ...middle, ...tail]);
  }, []);

  const videosPerPage = 3;
  const totalDesktopPages = Math.ceil(videos.length / videosPerPage);

  const stopAllBookVideos = useCallback(() => {
    window.dispatchEvent(new CustomEvent(BOOK_CAROUSEL_VIDEO_EVENT, {
      detail: { playerInstanceId: 'carousel-navigation' }
    }));
  }, []);

  useEffect(() => {
    const handlePinnedPlayerStarting = () => {
      stopAllBookVideos();
      setIsAutoPlaying(false);
      setIsPaused(true);
    };

    window.addEventListener('pinnedPlayerPlaying', handlePinnedPlayerStarting);
    return () => window.removeEventListener('pinnedPlayerPlaying', handlePinnedPlayerStarting);
  }, [stopAllBookVideos]);

  // Handle video end - ALWAYS auto advance to next video and autoplay it (unmuted)
  // This fires regardless of pause state because the user explicitly watched
  // a full video and expects continuous playback.
  const handleVideoEnd = useCallback(() => {
    stopAllBookVideos();
    setCurrentVideoIndex((prev) => {
      const next = (prev + 1) % videos.length;
      setDesktopIndex(Math.floor(next / videosPerPage));
      return next;
    });
    setIsAutoPlaying(true);
    setIsPaused(true); // keep idle cycle off; the next video will autoplay itself
  }, [stopAllBookVideos, videos.length, videosPerPage]);

  // Auto-cycle effect - pauses when video is playing
  useEffect(() => {
    if (isPaused || isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => {
        const next = (prev + 1) % videos.length;
        setDesktopIndex(Math.floor(next / videosPerPage));
        return next;
      });
    }, 2800); // ~2.8s preview tick — fast enough to feel like a reel,
              // slow enough to actually see each thumbnail

    return () => clearInterval(interval);
  }, [isPaused, isAutoPlaying, totalDesktopPages, videos.length]);

  const handleVideoPlay = useCallback((videoIndex?: number) => {
    setIsPaused(true);
    setIsAutoPlaying(false);
    hasEverPlayedRef.current = true;
    setHasUserInteracted(true);
    if (typeof videoIndex === 'number') {
      setPlayingVideoIndex(videoIndex);
      setCurrentVideoIndex(videoIndex);
      setDesktopIndex(Math.floor(videoIndex / videosPerPage));
    }
  }, [videosPerPage]);

  const goToVideo = useCallback((videoIndex: number) => {
    stopAllBookVideos();
    setIsAutoPlaying(hasEverPlayedRef.current);
    setIsPaused(true);
    setCurrentVideoIndex(videoIndex);
    setDesktopIndex(Math.floor(videoIndex / videosPerPage));
  }, [stopAllBookVideos, videosPerPage]);

  const nextDesktopPage = () => {
    stopAllBookVideos();
    setIsAutoPlaying(!isMobileCarousel && hasEverPlayedRef.current);
    setIsPaused(true);
    setDesktopIndex((prev) => {
      const nextPage = (prev + 1) % totalDesktopPages;
      setCurrentVideoIndex((nextPage * videosPerPage) % videos.length);
      return nextPage;
    });
  };

  const prevDesktopPage = () => {
    stopAllBookVideos();
    setIsAutoPlaying(!isMobileCarousel && hasEverPlayedRef.current);
    setIsPaused(true);
    setDesktopIndex((prev) => {
      const nextPage = (prev - 1 + totalDesktopPages) % totalDesktopPages;
      setCurrentVideoIndex((nextPage * videosPerPage) % videos.length);
      return nextPage;
    });
  };

  // Get visible videos with proper looping
  const getVisibleDesktopVideos = () => {
    // Center the active video: show [current-1, current, current+1] when
    // videosPerPage === 3, so the middle slot is the playing one.
    const offset = Math.floor(videosPerPage / 2);
    const startIndex = (currentVideoIndex - offset + videos.length) % videos.length;
    const result = [];
    for (let i = 0; i < videosPerPage; i++) {
      const index = (startIndex + i) % videos.length;
      result.push({ ...videos[index], originalIndex: index });
    }
    return result;
  };

  const visibleDesktopVideos = getVisibleDesktopVideos();

  const handleBuyBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌀 Book purchase clicked - triggering time warp');
    createTimePortalEffect("https://www.amazon.com/Gospel-Deployable-Robots-Instructions-www-AiWebTools-Ai-ebook/dp/B0DT419F2W?dplnkId=21c79e26-79fa-4837-9c84-4aebe9053749", "The Book Of Deployable Robot Prompts");
  };

  const handleDownloadBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📥 Free book download clicked');
    createTimePortalEffect("https://docs.google.com/document/d/18LHLsPXIjjtZgIAaXry5IktOGm9lacTq/edit?usp=sharing&ouid=116187507271950139405&rtpof=true&sd=true", "Free The Book Of Deployable Robot Prompts Download");
  };

  const nextVideo = () => {
    stopAllBookVideos();
    setIsAutoPlaying(hasEverPlayedRef.current);
    setIsPaused(true);
    setCurrentVideoIndex((prev) => {
      const next = (prev + 1) % videos.length;
      setDesktopIndex(Math.floor(next / videosPerPage));
      return next;
    });
  };

  const prevVideo = () => {
    stopAllBookVideos();
    setIsAutoPlaying(hasEverPlayedRef.current);
    setIsPaused(true);
    setCurrentVideoIndex((prev) => {
      const next = (prev - 1 + videos.length) % videos.length;
      setDesktopIndex(Math.floor(next / videosPerPage));
      return next;
    });
  };

  // Handle touch swipe for mobile carousel
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Lock into horizontal swipe once intent is clear
    if (!isSwiping.current && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }
    if (isSwiping.current) {
      // Dampened drag (max ~80px) for tactile feedback
      const clamped = Math.max(-120, Math.min(120, dx));
      setDragOffset(clamped);
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(diff) / Math.max(elapsed, 1); // px/ms
    const distanceTrigger = Math.abs(diff) > 60;
    const flickTrigger = Math.abs(diff) > 25 && velocity > 0.4;
    if (isSwiping.current && (distanceTrigger || flickTrigger)) {
      if (diff > 0) {
        nextVideo();
      } else {
        prevVideo();
      }
    }
    setDragOffset(0);
    isSwiping.current = false;
  };

  return (
    <section className="py-6 md:py-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #001a00 50%, #0a0a0a 100%)' }}>
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500/30 text-xs font-mono whitespace-nowrap"
            style={{
              left: `${i * 5}%`,
              top: '-100%',
              animation: `matrixRain ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
              textShadow: '0 0 8px #00ff00',
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j} className="leading-4">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Matrix Rain Keyframes */}
      <style>{`
        @keyframes matrixRain {
          0% { transform: translateY(0); }
          100% { transform: translateY(200%); }
        }
      `}</style>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Cursive Gold Heading */}
          <h2 
            className="text-center mb-3 text-2xl md:text-4xl font-light tracking-wide"
            style={{
              fontFamily: "'Parisienne', 'Dancing Script', 'Great Vibes', cursive",
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #DAA520 75%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 165, 0, 0.2)',
              filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))'
            }}
          >
            "Light or Fire" - Random Music N Stuff For the Spiritual Light Body - BY AWT
          </h2>
          
          <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 backdrop-blur-sm border border-green-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-green-500/10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Book Visual - YouTube Videos */}
                <div className="lg:w-1/2 p-3 md:p-5 overflow-visible">
                {/* Desktop: Carousel showing 3 videos at a time */}
                <div className="hidden md:block relative overflow-visible">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={prevDesktopPage}
                      type="button"
                      className="relative z-20 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-900/90 rounded-full text-green-400 border border-green-500/40 transition-colors duration-150 hover:bg-green-800 active:bg-green-700 focus:outline-none cursor-pointer shadow-lg"
                      aria-label="Previous videos"
                    >
                      <ChevronLeft size={24} className="pointer-events-none" />
                    </button>

                    <div className="flex justify-center gap-4 transition-all duration-700 ease-in-out">
                      {visibleDesktopVideos.map((video, index) => (
                        <div
                          key={`${video.originalIndex}-${video.id}`}
                          className={`relative w-48 flex-shrink-0 transition-all duration-700 ease-in-out ${
                            !isPaused && video.originalIndex === currentVideoIndex
                              ? 'scale-[1.04]'
                              : ''
                          }`}
                        >
                          <div
                            className={`relative rounded-xl overflow-hidden shadow-2xl transition-shadow duration-500 ${
                              !isPaused && video.originalIndex === currentVideoIndex
                                ? 'ring-2 ring-cyan-400/70 shadow-[0_0_30px_rgba(34,211,238,0.45)]'
                                : ''
                            }`}
                            style={{ aspectRatio: '9/16' }}
                          >
                            <LazyBookVideo 
                              videoId={video.id} 
                              title={video.title} 
                              onPlay={() => handleVideoPlay(video.originalIndex)}
                              onEnd={handleVideoEnd}
                              autoPlay={isAutoPlaying && video.originalIndex === currentVideoIndex}
                            />
                            {/* Preview-reel indicator: shows the carousel is auto-cycling
                                through the full video library, not just the 3 visible */}
                            {!isPaused && video.originalIndex === currentVideoIndex && (
                              <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 border border-cyan-400/50 text-[10px] font-bold text-cyan-300 tracking-wider uppercase backdrop-blur-sm animate-pulse z-10">
                                ▶ Previewing {currentVideoIndex + 1}/{videos.length}
                              </div>
                            )}
                          </div>
                          <div className={`absolute -inset-2 bg-gradient-to-r ${video.gradient} rounded-lg blur-xl -z-10`}></div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={nextDesktopPage}
                      type="button"
                      className="relative z-20 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-900/90 rounded-full text-green-400 border border-green-500/40 transition-colors duration-150 hover:bg-green-800 active:bg-green-700 focus:outline-none cursor-pointer shadow-lg"
                      aria-label="Next videos"
                    >
                      <ChevronRight size={24} className="pointer-events-none" />
                    </button>
                  </div>

                  {/* Desktop dot indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalDesktopPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToVideo((index * videosPerPage) % videos.length)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === desktopIndex ? 'bg-cyan-400' : 'bg-gray-500'
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile: Carousel with swipe and lazy loading */}
                <div 
                  className="md:hidden relative overflow-visible select-none px-2"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ touchAction: 'pan-y' }}
                >
                  <div className="relative flex justify-center items-center py-2">
                    {/* Peek of previous video */}
                    {(() => {
                      const prevIdx = (currentVideoIndex - 1 + videos.length) % videos.length;
                      const nextIdx = (currentVideoIndex + 1) % videos.length;
                      return (
                        <>
                          <button
                            onClick={prevVideo}
                            type="button"
                            aria-label="Previous video"
                            className="absolute -left-1 top-1/2 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center bg-green-900/95 rounded-full text-green-300 border-2 border-green-400/70 transition-colors duration-150 active:bg-green-700 focus:outline-none cursor-pointer shadow-[0_0_15px_rgba(0,255,0,0.4)]"
                          >
                            <ChevronLeft size={22} className="pointer-events-none" />
                          </button>

                          <div
                            className="flex items-center justify-center gap-2 w-full"
                            style={{
                              transform: `translateX(${dragOffset}px)`,
                              transition: dragOffset === 0 ? 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                            }}
                          >
                            {/* Left peek */}
                            <button
                              type="button"
                              onClick={prevVideo}
                              aria-label="Show previous video"
                              className="relative w-16 flex-shrink-0 opacity-50 transition-all duration-500"
                              style={{ aspectRatio: '9/16' }}
                            >
                              <img
                                src={`https://i.ytimg.com/vi/${videos[prevIdx].id}/hqdefault.jpg`}
                                alt={videos[prevIdx].title}
                                className="w-full h-full object-cover rounded-lg"
                                loading="lazy"
                              />
                            </button>

                            {/* Active video */}
                            <div className="relative w-44 flex-shrink-0 transition-all duration-700 ease-in-out">
                              <div className="relative rounded-xl overflow-hidden shadow-2xl ring-2 ring-cyan-400/40" style={{ aspectRatio: '9/16' }}>
                                <LazyBookVideo 
                                  key={videos[currentVideoIndex].id}
                                  videoId={videos[currentVideoIndex].id} 
                                  title={videos[currentVideoIndex].title} 
                                  onPlay={() => handleVideoPlay(currentVideoIndex)}
                                  onEnd={handleVideoEnd}
                                  autoPlay={isAutoPlaying}
                                />
                              </div>
                              <div className={`absolute -inset-2 bg-gradient-to-r ${videos[currentVideoIndex].gradient} rounded-lg blur-xl -z-10 transition-all duration-700`}></div>
                            </div>

                            {/* Right peek */}
                            <button
                              type="button"
                              onClick={nextVideo}
                              aria-label="Show next video"
                              className="relative w-16 flex-shrink-0 opacity-50 transition-all duration-500"
                              style={{ aspectRatio: '9/16' }}
                            >
                              <img
                                src={`https://i.ytimg.com/vi/${videos[nextIdx].id}/hqdefault.jpg`}
                                alt={videos[nextIdx].title}
                                className="w-full h-full object-cover rounded-lg"
                                loading="lazy"
                              />
                            </button>
                          </div>

                          <button
                            onClick={nextVideo}
                            type="button"
                            aria-label="Next video"
                            className="absolute -right-1 top-1/2 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center bg-green-900/95 rounded-full text-green-300 border-2 border-green-400/70 transition-colors duration-150 active:bg-green-700 focus:outline-none cursor-pointer shadow-[0_0_15px_rgba(0,255,0,0.4)]"
                          >
                            <ChevronRight size={22} className="pointer-events-none" />
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToVideo(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentVideoIndex ? 'bg-cyan-400' : 'bg-gray-500'
                        }`}
                        aria-label={`Go to video ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-3 md:p-5">
                <div className="text-center lg:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                      The Book Of Deployable ChatBot Prompts
                    </span>
                  </h2>
                  
                  <p className="text-green-200 text-sm mb-2">
                    By <span className="text-green-400 font-semibold" style={{ textShadow: '0 0 10px #00ff00' }}>AIWebTools.AI</span>
                  </p>
                  
                  <div className="space-y-1 mb-3 text-sm">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-green-300">
                      <span className="text-green-400">🤖</span>
                      <span>Over 60+ Deployable Chatbots & Key AI Insights</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-green-300">
                      <span className="text-green-400">⚡</span>
                      <span>Put you ahead of the game with cutting-edge prewritten copy paste prompts</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-green-300">
                      <span className="text-green-400">📋</span>
                      <span>Copy & paste ready prompts for personal AI tool deployment</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleBuyBook}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <BookOpen className="mr-1.5" size={16} />
                        📖 Buy Book on Amazon
                        <ExternalLink className="ml-1.5" size={14} />
                      </Button>

                      <Button
                        onClick={handleDownloadBook}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <Download className="mr-1.5" size={16} />
                        📥 Download Free Book Copy (DOCX)
                        <ExternalLink className="ml-1.5" size={14} />
                      </Button>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 border border-green-400/30"
                        >
                          <Eye className="mr-1.5" size={16} />
                          👁️ View Preview of Amazon Book
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>The Book Of Deployable Robot Prompts - Preview</DialogTitle>
                        </DialogHeader>
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                          <iframe 
                            src="https://drive.google.com/file/d/18LHLsPXIjjtZgIAaXry5IktOGm9lacTq/preview" 
                            className="w-full flex-1 rounded-lg pointer-events-auto select-text"
                            allow="autoplay"
                            title="The Book Of Deployable Robot Prompts Preview"
                            style={{ userSelect: 'text' }}
                          />
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              size="lg"
                              className="bg-red-500/10 hover:bg-red-500/20 border-red-500 text-red-500 hover:text-red-600"
                            >
                              <X className="mr-2" size={20} />
                              Close Preview
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      onClick={() => { playMtvFlash().then(() => navigate('/music-stream')); }}
                      className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-cyan-500 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-fuchsia-500/40 transition-all duration-300 transform hover:scale-105 border border-fuchsia-400/40"
                      title="Open MTVai Theater — 24/7 AI music videos"
                      aria-label="Open MTVai Theater"
                    >
                      <img
                        src={mtvAiWebToolsLogo}
                        alt=""
                        aria-hidden
                        draggable={false}
                        className="mr-1.5 w-4 h-4 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]"
                      />
                      WATCH 🎬 MTVai.live - AWT Creative Music Television
                    </Button>

                        <Button
                          onClick={() => {
                            try {
                              downloadToolsCSV(allTools, `AIWebTools-Complete-Directory-${allTools.length}-Tools.csv`);
                            } catch (err) {
                              console.error("CSV download failed:", err);
                            }
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 border border-yellow-400/40"
                        >
                          <Download className="mr-1.5" size={16} />
                          📊 Download List of All 5556+ AI Tools on this app (CSV)
                        </Button>

                        <Button
                          onClick={() => {
                            try {
                              downloadAllOperationalInstructions();
                            } catch (err) {
                              console.error("ZIP download failed:", err);
                            }
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border border-purple-400/40"
                        >
                          <Download className="mr-1.5" size={16} />
                          🧠 DOWNLOAD 3,200+ GPT OPERATIONAL Instructions (ZIP)
                        </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookPromotionCard;
