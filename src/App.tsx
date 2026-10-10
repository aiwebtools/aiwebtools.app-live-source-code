
import * as React from 'react'
import { Suspense } from 'react';
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { FavoritesProvider } from "@/hooks/useFavorites";
import { VideoManagerProvider } from "@/hooks/useGlobalVideoManager";
import { useCrossBrowserOptimization } from "@/hooks/useCrossBrowserOptimization";
import { useChromebookOptimization } from "@/hooks/useChromebookOptimization";
import { usePrefetchRoutes } from "@/hooks/usePrefetch";
import ErrorBoundary from "@/components/ErrorBoundary";
import MatrixCursorEffect from "@/components/effects/MatrixCursorEffect";
import "@/styles/loading-cube.css";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import {
  canPlayWeeklyWelcomeAudio,
  getConsentAccepted,
  markWeeklyWelcomeAudioPlayed,
} from "@/utils/consent";
import { lazyWithRetry } from "@/utils/lazyWithRetry";
import disclaimerWelcomeAudio from "@/assets/audio/disclaimer-welcome-2026.mp3.asset.json";
import ConfirmSubscriptionHandler from "@/components/ConfirmSubscriptionHandler";
import DownloadCenterDialog from "@/components/DownloadCenterDialog";
import { GlobalEmailSignupHost } from "@/components/JoinEmailListButton";

// Eager load only the disclaimer gate; lazy-load heavy app routes to avoid black-screen startup
import DisclaimerGate from "./pages/DisclaimerGate";

// Generic retry wrapper for non-component dynamic imports (e.g., side-effect modules).
// Prevents "Failed to fetch dynamically imported module" from breaking the app.
async function importWithRetry<T>(
  factory: () => Promise<T>,
  retries = 3,
  delayMs = 500,
): Promise<T | null> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await factory();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  console.warn('[importWithRetry] giving up after retries', lastErr);
  return null;
}

// Lazy load - secondary pages for faster initial load
const Index = lazyWithRetry(() => import("./pages/Index"));
// ToolDetail pulls in the complete tool index. Keeping it eager made every
// visitor download/compile that database before React could mount at all.
// The route already has an instant content fallback and retry protection, so
// isolate it from the opening bundle while preserving reliable deep links.
const ToolDetail = lazyWithRetry(() => import("./pages/ToolDetail"));
const CategoryPage = lazyWithRetry(() => import("./pages/CategoryPage"));
const MainCategoryPage = lazyWithRetry(() => import("./pages/MainCategoryPage"));
const SimilarToolsPage = lazyWithRetry(() => import("./pages/SimilarTools"));
const FavoritesPage = lazyWithRetry(() => import("./pages/FavoritesPage"));
const ToolSubmission = lazyWithRetry(() => import("./pages/ToolSubmission"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const DisclaimersPage = lazyWithRetry(() => import("./pages/DisclaimersPage"));
const OurStoryPage = lazyWithRetry(() => import("./pages/OurStoryPage"));
const AIToolsHub = lazyWithRetry(() => import("./pages/AIToolsHub"));
const AIAgentsDirectory = lazyWithRetry(() => import("./pages/AIAgentsDirectory"));
const ChatGPTAlternatives = lazyWithRetry(() => import("./pages/ChatGPTAlternatives"));
const BlogPage = lazyWithRetry(() => import("./pages/BlogPage"));
const BlogPostPage = lazyWithRetry(() => import("./pages/BlogPostPage"));
const SpotlightsPage = lazyWithRetry(() => import("./pages/SpotlightsPage"));
const RankingsPage = lazyWithRetry(() => import("./pages/RankingsPage"));
const JoinPage = lazyWithRetry(() => import("./pages/JoinPage"));
const AccountPage = lazyWithRetry(() => import("./pages/AccountPage"));
const GptAppPage = lazyWithRetry(() => import("./pages/GptAppPage"));
const DigestPage = lazyWithRetry(() => import("./pages/DigestPage"));
const SpotlightPage = lazyWithRetry(() => import("./pages/SpotlightPage"));
const FeaturesPage = lazyWithRetry(() => import("./pages/FeaturesPage"));
const FeaturePage = lazyWithRetry(() => import("./pages/FeaturePage"));
const GamingEntertainmentPage = lazyWithRetry(() => import("./pages/GamingEntertainmentPage"));
const FAQPage = lazyWithRetry(() => import("./pages/FAQPage"));
const AIToolsPage = lazyWithRetry(() => import("./pages/AIToolsPage"));
const BestAIToolsPage = lazyWithRetry(() => import("./pages/BestAIToolsPage"));
const FreeAIToolsPage = lazyWithRetry(() => import("./pages/FreeAIToolsPage"));
const AIWritingToolsPage = lazyWithRetry(() => import("./pages/AIWritingToolsPage"));
const AIWebToolsPage = lazyWithRetry(() => import("./pages/AIWebToolsPage"));
const AdminAnalytics = lazyWithRetry(() => import("./pages/AdminAnalytics"));
const AdminChatQuality = lazyWithRetry(() => import("./pages/AdminChatQuality"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const MusicStream = lazyWithRetry(() => import("./pages/MusicStream"));
const UserSubmittedToolsPage = lazyWithRetry(() => import("./pages/UserSubmittedToolsPage"));
const UserSubmittedToolDetail = lazyWithRetry(() => import("./pages/UserSubmittedToolDetail"));
const AllToolsFastPage = lazyWithRetry(() => import("./pages/AllToolsFastPage"));

// Lazy load non-critical components — wrapped in retry to prevent black screen
const FloatingCloneButton = lazyWithRetry(() => import("./components/FloatingCloneButton"));
const PinnedVideoPlayer = lazyWithRetry(() => import("./components/PinnedVideoPlayer"));
const CareBotWidget = lazyWithRetry(() => import("./components/CareBotWidget"));
const BackToMusicPill = lazyWithRetry(() => import("./components/BackToMusicPill"));

// Welcome Neo voice - plays when user lands on main site after accepting disclaimer
const WelcomeNeoVoice = () => {
  const location = useLocation();
  const hasPlayedRef = React.useRef(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const hasAccepted = getConsentAccepted();

    // Skip entirely if the disclaimer welcome audio just played — they share
    // overlapping content and stacking two <audio> elements during the route
    // transition was a real source of perceived "stutter / second loader".
    let disclaimerPlayedAt = 0;
    try {
      disclaimerPlayedAt = Number(sessionStorage.getItem('aiwt:disclaimer-audio-at') || '0');
    } catch { /* storage may be unavailable */ }
    const recentlyPlayedDisclaimerAudio =
      disclaimerPlayedAt > 0 && Date.now() - disclaimerPlayedAt < 15000;

    // Only play on the main page after consent, never more than once per week,
    // and not when the disclaimer audio just fired.
    if (
      location.pathname === '/' &&
      hasAccepted &&
      !hasPlayedRef.current &&
      !recentlyPlayedDisclaimerAudio &&
      canPlayWeeklyWelcomeAudio()
    ) {
      hasPlayedRef.current = true;
      (window as any).__aiwtBootTrace?.('welcome-neo-scheduled');

      timeoutRef.current = window.setTimeout(() => {
        try {
          // Re-check after the delay in case another welcome source played.
          if (!canPlayWeeklyWelcomeAudio()) return;
          markWeeklyWelcomeAudioPlayed();
          const audio = new Audio(disclaimerWelcomeAudio.url);
          audio.volume = 0.7;
          audio.preload = 'none';
          void audio.play().catch(() => {
            // Browser autoplay rules can block this; never let audio affect boot.
          });
        } catch {
          // Audio must never block rendering.
        }
      }, 2000);
    } else if (recentlyPlayedDisclaimerAudio) {
      (window as any).__aiwtBootTrace?.('welcome-neo-skipped-disclaimer-audio');
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname]);

  return null;
};

// NOTE: precomputed category cache is initialized AFTER disclaimer acceptance
// to keep the /welcome disclaimer gate load instant.

// Keep a real React fallback mounted behind the HTML cube. If a lazy route or
// HMR handoff stalls, removing the HTML cube reveals this instead of a blank
// dark screen.
const PageLoader = () => {
  return (
    // Instant, silent fallback with real height so route transitions never show
    // a dead black screen if a lazy chunk is a few frames late.
    <div
      data-aiwt-route-fallback="true"
      role="status"
      aria-live="polite"
      className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4"
    ><span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" aria-hidden="true" /><p className="font-mono text-primary">Opening the Matrix…</p></div>
  );
};

// Titleize a slug like "chat-gpt-4-turbo" -> "Chat GPT 4 Turbo" so the
// shell still shows something readable when the click happens from a link
// with no navigation state (direct URL, back/forward, external landing).
const prettifySlug = (slug: string): string =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const InstantToolFallback = ({ tool }: { tool?: any }) => {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/(tool\/)?/, '').split('/')[0] || '';
  const displayTitle = tool?.title || (slug ? prettifySlug(decodeURIComponent(slug)) : 'Loading tool…');
  return (
    <div className="min-h-screen bg-black px-4 pt-28 text-cyan-100">
      <div className="mx-auto max-w-4xl rounded-lg border border-cyan-500/30 bg-gray-900/80 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-matrix-green">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-matrix-green" />
          Loading tool details
        </div>
        <h1 className="text-2xl font-bold text-cyan-100">{displayTitle}</h1>
        {tool?.category ? <p className="mt-2 text-sm text-cyan-300/80">{tool.category}</p> : null}
        {tool?.description ? (
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-cyan-100/75">{tool.description}</p>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="h-3 w-11/12 animate-pulse rounded bg-cyan-500/10" />
            <div className="h-3 w-10/12 animate-pulse rounded bg-cyan-500/10" />
            <div className="h-3 w-8/12 animate-pulse rounded bg-cyan-500/10" />
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-md border border-cyan-500/10 bg-cyan-500/5" />
          ))}
        </div>
      </div>
    </div>
  );
};

const InstantCategoryFallback = () => {
  const location = useLocation();
  const fromState = (location.state as any)?.instantCategory?.name;
  const fromPath = location.pathname.startsWith('/main-category/')
    ? decodeURIComponent(location.pathname.replace('/main-category/', ''))
    : '';
  const displayName = fromState || fromPath || 'AI Tools';

  return (
    <div className="min-h-screen bg-black px-4 pt-28 text-cyan-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-matrix-green">Loading category</div>
          <h1 className="text-3xl font-black text-cyan-100">{displayName}</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border border-cyan-500/20 bg-cyan-500/5" />
          ))}
        </div>
      </div>
    </div>
  );
};

const RouteReadySignal = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  React.useEffect(() => {
    (window as any).__aiwtBootTrace?.('route-component-mounted', location.pathname);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          document.body.setAttribute('data-aiwt-route-ready', 'true');
          (window as any).__aiwtRouteReady = true;
          (window as any).__aiwtBootTrace?.('route-ready-dispatch', location.pathname);
          window.dispatchEvent(new Event('aiwt:route-ready'));
          // Perf telemetry: how long did the lazy chunk + first paint take?
          import('@/utils/perfTelemetry').then((m) => m.markRouteReady()).catch(() => {});
        } catch { /* loader signal must never break the app */ }
      });
    });
  }, [location.pathname]);

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Legacy/plural category links (/categories/:name) map to the canonical
// /main-category/:name path so deep links never dead-end on the 404 page.
const LegacyCategoryRedirect = () => {
  const { mainCategoryName } = useParams<{ mainCategoryName: string }>();
  return (
    <Navigate
      to={`/main-category/${encodeURIComponent(decodeURIComponent(mainCategoryName || "ALL AI TOOLS"))}`}
      replace
    />
  );
};

// Routes wrapper - eager pages render instantly, lazy pages show loader

const AnimatedRoutes = () => {
  const location = useLocation();

  // Mark route-start once per pathname so perf telemetry can measure ready time.
  const routeMarkedRef = React.useRef<string>("");
  if (routeMarkedRef.current !== location.pathname) {
    routeMarkedRef.current = location.pathname;
    import('@/utils/perfTelemetry').then((m) => m.markRouteStart(location.pathname)).catch(() => {});
  }

  // Critical paths keep the animated cube visible while lazy chunks reconnect.
  if (location.pathname === '/' || location.pathname === '/welcome') {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/welcome" element={<RouteReadySignal><DisclaimerGate /></RouteReadySignal>} />
          <Route path="/" element={<RouteReadySignal><Index /></RouteReadySignal>} />
        </Routes>
      </Suspense>
    );
  }
  
  // Secondary pages use Suspense for lazy loading
  const instantTool = (location.state as any)?.instantTool;
  const toolFallback = <InstantToolFallback tool={instantTool} />;
  const categoryFallback = <InstantCategoryFallback />;

  const isAllToolsRoute = decodeURIComponent(location.pathname) === "/main-category/ALL AI TOOLS";

  if (isAllToolsRoute) {
    return (
      <Suspense fallback={categoryFallback}>
        <Routes location={location}>
          <Route path="/main-category/:mainCategoryName" element={<RouteReadySignal><AllToolsFastPage /></RouteReadySignal>} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location}>
        <Route path="/category/:categoryName" element={<RouteReadySignal><CategoryPage /></RouteReadySignal>} />
        {/* Canonical category path is /main-category/:name — keep legacy/plural links alive. */}
        <Route path="/categories" element={<Navigate to="/main-category/ALL%20AI%20TOOLS" replace />} />
        <Route path="/categories/:mainCategoryName" element={<LegacyCategoryRedirect />} />

        <Route path="/main-category/:mainCategoryName" element={<Suspense fallback={categoryFallback}><RouteReadySignal><MainCategoryPage /></RouteReadySignal></Suspense>} />
        <Route path="/tool/:toolId" element={<RouteReadySignal><ToolDetail /></RouteReadySignal>} />
        <Route path="/:toolSlug" element={<RouteReadySignal><ToolDetail /></RouteReadySignal>} />
        <Route path="/privacy-policy" element={<RouteReadySignal><PrivacyPolicy /></RouteReadySignal>} />
        <Route path="/similar-tools/:toolId" element={<RouteReadySignal><SimilarToolsPage /></RouteReadySignal>} />
        <Route path="/ai-tools-hub" element={<RouteReadySignal><AIToolsHub /></RouteReadySignal>} />
        <Route path="/ai-agents-directory" element={<RouteReadySignal><AIAgentsDirectory /></RouteReadySignal>} />
        <Route path="/chatgpt-alternatives" element={<RouteReadySignal><ChatGPTAlternatives /></RouteReadySignal>} />
        <Route path="/blog" element={<RouteReadySignal><BlogPage /></RouteReadySignal>} />
        <Route path="/blog/:slug" element={<RouteReadySignal><BlogPostPage /></RouteReadySignal>} />
        <Route path="/spotlights" element={<RouteReadySignal><SpotlightsPage /></RouteReadySignal>} />
        <Route path="/rankings" element={<RouteReadySignal><RankingsPage /></RouteReadySignal>} />
        <Route path="/join" element={<RouteReadySignal><JoinPage /></RouteReadySignal>} />
        <Route path="/account" element={<RouteReadySignal><AccountPage /></RouteReadySignal>} />
        <Route path="/app/:slug" element={<RouteReadySignal><GptAppPage /></RouteReadySignal>} />
        <Route path="/app/:slug/chat/:threadId" element={<RouteReadySignal><GptAppPage /></RouteReadySignal>} />
        <Route path="/digest" element={<RouteReadySignal><DigestPage /></RouteReadySignal>} />
        <Route path="/digest/:date" element={<RouteReadySignal><DigestPage /></RouteReadySignal>} />
        <Route path="/spotlight/:slug" element={<RouteReadySignal><SpotlightPage /></RouteReadySignal>} />
        <Route path="/features" element={<RouteReadySignal><FeaturesPage /></RouteReadySignal>} />
        <Route path="/feature/:slug" element={<RouteReadySignal><FeaturePage /></RouteReadySignal>} />
        <Route path="/gaming-entertainment" element={<RouteReadySignal><GamingEntertainmentPage /></RouteReadySignal>} />
        <Route path="/faq" element={<RouteReadySignal><FAQPage /></RouteReadySignal>} />
        <Route path="/ai-tools" element={<RouteReadySignal><AIToolsPage /></RouteReadySignal>} />
        <Route path="/best-ai-tools" element={<RouteReadySignal><BestAIToolsPage /></RouteReadySignal>} />
        <Route path="/free-ai-tools" element={<RouteReadySignal><FreeAIToolsPage /></RouteReadySignal>} />
        <Route path="/ai-writing-tools" element={<RouteReadySignal><AIWritingToolsPage /></RouteReadySignal>} />
        <Route path="/ai-web-tools" element={<RouteReadySignal><AIWebToolsPage /></RouteReadySignal>} />
        <Route path="/aiwebtools" element={<RouteReadySignal><AIWebToolsPage /></RouteReadySignal>} />
        <Route path="/favorites" element={<RouteReadySignal><FavoritesPage /></RouteReadySignal>} />
        <Route path="/disclaimers" element={<RouteReadySignal><DisclaimersPage /></RouteReadySignal>} />
        <Route path="/our-story" element={<RouteReadySignal><OurStoryPage /></RouteReadySignal>} />
        <Route path="/submit-tool" element={<RouteReadySignal><ToolSubmission /></RouteReadySignal>} />
        <Route path="/admin/analytics" element={<RouteReadySignal><AdminAnalytics /></RouteReadySignal>} />
        <Route path="/admin/chat-quality" element={<RouteReadySignal><AdminChatQuality /></RouteReadySignal>} />
        <Route path="/music-stream" element={<Suspense fallback={null}><RouteReadySignal><MusicStream /></RouteReadySignal></Suspense>} />
        <Route path="/user-submitted" element={<RouteReadySignal><UserSubmittedToolsPage /></RouteReadySignal>} />
        <Route path="/user-submitted/:slug" element={<RouteReadySignal><UserSubmittedToolDetail /></RouteReadySignal>} />
        <Route path="/category/user-submitted" element={<Navigate to="/user-submitted" replace />} />
        <Route path="*" element={<RouteReadySignal><NotFound /></RouteReadySignal>} />
      </Routes>
    </Suspense>
  );
};

// Global route guard: instant redirect new visitors to /welcome disclaimer gate
const RouteGuard: React.FC = () => {
  const location = useLocation();
  const hasAccepted = getConsentAccepted();
  
  // Instant redirect using React Router (no page reload)
  if (!hasAccepted && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace state={{ returnTo: `${location.pathname}${location.search}${location.hash}` }} />;
  }
  
  return <AnimatedRoutes />;
};

/**
 * Zero prefetching while the Matrix boot overlay is still on screen.
 * Resolves as soon as #aiwt-loader-overlay is gone (or immediately if it
 * never existed), so warmup work can never compete with the opening frames.
 */
const afterLoaderGone = (run: () => void): (() => void) => {
  const loaderGone = () => !document.getElementById("aiwt-loader-overlay");
  if (loaderGone()) {
    run();
    return () => {};
  }
  const id = window.setInterval(() => {
    if (!loaderGone()) return;
    window.clearInterval(id);
    run();
  }, 400);
  return () => window.clearInterval(id);
};

const PostAcceptBoot: React.FC = () => {
  const location = useLocation();
  const hasAccepted = getConsentAccepted();

  // Never run heavy boot work on disclaimer gate
  const enabled = hasAccepted && location.pathname !== "/welcome";

  // Keep route prefetching outside the first interaction window. Eight eager
  // document prefetches previously competed with the homepage on first load.
  React.useEffect(() => {
    if (!enabled) return;
    
    // Prefetch priority routes after disclaimer accepted
    const PRIORITY_ROUTES = [
      '/main-category/ALL%20AI%20TOOLS',
      '/main-category/AI%20AGENTS',
      '/main-category/IMAGE%20%26%20DESIGN',
      '/main-category/VIDEO%20%26%20MULTIMEDIA',
      '/main-category/WRITING%20%26%20CONTENT',
      '/main-category/CODING%20%26%20DEVELOPMENT',
      '/ai-tools-hub',
      '/favorites',
    ];
    
    let cancelWait = () => {};
    const prefetchId = window.setTimeout(() => {
      cancelWait = afterLoaderGone(() => {
      PRIORITY_ROUTES.forEach(route => {
        if (document.querySelector(`link[href="${route}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        document.head.appendChild(link);
      });
      });
    }, 20000);

    return () => { window.clearTimeout(prefetchId); cancelWait(); };
  }, [enabled]);

  React.useEffect(() => {
    if (!enabled) return;

    const warmCriticalRoutes = () => {
      const isTouchPhone =
        typeof window !== 'undefined' &&
        (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));

      // Do not warm the heavy generic category chunk on phones/in-app browsers.
      // It can collide with the user's first category tap and strand them on
      // the loading skeleton. The ALL AI TOOLS path now has its own light shell.
      void Promise.allSettled(
        isTouchPhone
          ? [import("./pages/AllToolsFastPage")]
          : [import("./pages/MainCategoryPage")]
      );

      // Warm the tool-detail route + tool index so the first tool a visitor
      // opens renders instantly instead of waiting on a cold chunk fetch.
      import("@/utils/toolPrefetcher")
        .then((m) => m.warmToolDetailModules())
        .catch(() => {});
    };

    let cancelWait = () => {};
    const id = window.setTimeout(() => {
      cancelWait = afterLoaderGone(() => {
        const ric = (window as any).requestIdleCallback;
        if (ric) ric(warmCriticalRoutes, { timeout: 6000 });
        else warmCriticalRoutes();
      });
    }, 20000);

    return () => { window.clearTimeout(id); cancelWait(); };
  }, [enabled]);

  React.useEffect(() => {
    if (!enabled) return;

    // Defer category cache work until well after the Matrix handoff. It imports
    // the full tool DB and detector modules, so running it during opening can
    // freeze the route before the homepage paints.
    const warmCache = () => {
      importWithRetry(() => import("@/utils/categoryUtils/precomputedCache"))
        .then((mod) => mod?.initializeCategoryCache?.())
        .catch(() => {});
    };

    // Keep the database/cache import out of the first-scroll window. An idle
    // callback with a short timeout can legally fire while a user is scrolling.
    const cacheWarmDelay = typeof window !== 'undefined' && window.innerWidth < 768 ? 20000 : 15000;

    let cancelWait = () => {};
    const id = window.setTimeout(() => {
      cancelWait = afterLoaderGone(() => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(warmCache, { timeout: 6000 });
        } else {
          setTimeout(warmCache, 1200);
        }
      });
    }, cacheWarmDelay);

    return () => {
      clearTimeout(id);
      cancelWait();
    };
  }, [enabled]);

  return null;
};

const GlobalOverlays: React.FC = () => {
  const location = useLocation();
  const hasAccepted = getConsentAccepted();
  const show = hasAccepted && location.pathname !== "/welcome";
  const [overlaysReady, setOverlaysReady] = React.useState(false);
  const [heavyOverlaysReady, setHeavyOverlaysReady] = React.useState(false);
  const isTouchPhone =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));
  const isInAppBrowser =
    typeof window !== 'undefined' &&
    /FBAN|FBAV|FBIOS|FB_IAB|Instagram|Line|TikTok|Twitter|Snapchat/i.test(window.navigator.userAgent);

  React.useEffect(() => {
    if (!show) {
      setOverlaysReady(false);
      setHeavyOverlaysReady(false);
      return;
    }

    let lightTimeoutId: number | null = null;
    let heavyTimeoutId: number | null = null;
    let lightIdleId: number | null = null;
    let heavyIdleId: number | null = null;
    let cancelled = false;

    const scheduleIdle = (callback: () => void, timeout: number) => {
      const ric = (window as any).requestIdleCallback;
      if (ric) {
        return ric(() => {
          if (!cancelled) callback();
        }, { timeout });
      }

      requestAnimationFrame(() => {
        if (!cancelled) callback();
      });
      return null;
    };

    const enable = () => {
      // Never mount heavy overlays on the first phone tap/scroll. Social in-app
      // browsers can freeze when pinned video + bot chunks import during clicks.
      const lightDelay = isTouchPhone ? 2500 : 1200;
      // Pinned media and the care bot import substantial code. Never mount
      // them in the desktop opening/first-scroll window.
      const heavyDelay = isInAppBrowser ? 45000 : isTouchPhone ? 18000 : 10000;

      lightTimeoutId = window.setTimeout(() => {
        lightIdleId = scheduleIdle(() => setOverlaysReady(true), isTouchPhone ? 2500 : 1200);
      }, lightDelay);

      heavyTimeoutId = window.setTimeout(() => {
        heavyIdleId = scheduleIdle(() => setHeavyOverlaysReady(true), isTouchPhone ? 5000 : 1500);
      }, heavyDelay);
    };

    if ((window as any).__aiwtRouteReady) {
      enable();
    } else {
      window.addEventListener('aiwt:route-ready', enable, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('aiwt:route-ready', enable);
      if (lightTimeoutId !== null) window.clearTimeout(lightTimeoutId);
      if (heavyTimeoutId !== null) window.clearTimeout(heavyTimeoutId);
      if (lightIdleId !== null && 'cancelIdleCallback' in window) (window as any).cancelIdleCallback(lightIdleId);
      if (heavyIdleId !== null && 'cancelIdleCallback' in window) (window as any).cancelIdleCallback(heavyIdleId);
    };
  }, [show, location.pathname, isTouchPhone, isInAppBrowser]);

  return (
    <>
      {overlaysReady ? <ScrollProgressIndicator /> : null}
      {overlaysReady && !isTouchPhone ? <MatrixCursorEffect /> : null}
      {/* Welcome Neo voice - only plays after disclaimer accepted */}
      <WelcomeNeoVoice />
      {/* Tiny floating clone button - hides on scroll */}
      {overlaysReady && !isTouchPhone ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <FloatingCloneButton />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {/* Pinned rotating video player - lower left corner */}
      {heavyOverlaysReady ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <PinnedVideoPlayer />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {/* AIWebTools Care Bot — answers any question about our tools */}
      {heavyOverlaysReady ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <CareBotWidget />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {/* Back-to-Music floating pill — appears after visiting Music Stream */}
      {overlaysReady ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <BackToMusicPill />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </>
  );
};

function App() {
  // Initialize cross-browser optimizations
  useCrossBrowserOptimization();

  // Initialize Chromebook-specific optimizations
  useChromebookOptimization();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <FavoritesProvider>
            <VideoManagerProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <RouteGuard />
                  <PostAcceptBoot />
                  <GlobalOverlays />
                  <ConfirmSubscriptionHandler />
                  <DownloadCenterDialog />
                  <GlobalEmailSignupHost />
                </BrowserRouter>
              </TooltipProvider>
            </VideoManagerProvider>
          </FavoritesProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
