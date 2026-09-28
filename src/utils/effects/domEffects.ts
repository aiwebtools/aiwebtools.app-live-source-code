import { sanitizeExternalUrl } from '@/utils/links/linkSafety';

// Dynamic mobile detection - check at runtime, not module load
const checkIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export const createEffectsContainer = (): HTMLElement => {
  const effectsContainer = document.createElement('div');
  effectsContainer.id = 'time-warp-effects-container';
  effectsContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99999;
    overflow: visible;
  `;
  document.body.appendChild(effectsContainer);
  return effectsContainer;
};

export const applyTimeWarpFilter = () => {
  // FULL EPIC EFFECT ON ALL DEVICES - no more simplified mobile version
  
  // Create INTENSE screen-wide color explosion
  const colorExplosion = document.createElement('div');
  colorExplosion.id = 'color-explosion';
  colorExplosion.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99990;
    pointer-events: none;
    animation: intense-color-explosion 1s ease-out forwards;
    background: radial-gradient(circle at center, 
      rgba(0,255,255,0.9) 0%, 
      rgba(255,0,255,0.8) 15%, 
      rgba(255,255,0,0.7) 30%, 
      rgba(0,255,128,0.6) 45%, 
      rgba(255,64,128,0.5) 60%, 
      transparent 80%);
  `;
  document.body.appendChild(colorExplosion);

  // Create a more controlled centered portal overlay
  const portalOverlay = document.createElement('div');
  portalOverlay.id = 'portal-overlay';
  portalOverlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,255,255,0.9) 20%, rgba(255,0,255,0.8) 40%, rgba(255,255,0,0.6) 60%, transparent 80%);
    z-index: 99995;
    pointer-events: none;
    animation: mega-portal-spin 1s ease-out forwards;
    box-shadow: 
      0 0 60px rgba(0,255,255,0.9), 
      0 0 120px rgba(255,0,255,0.8),
      0 0 180px rgba(255,255,0,0.6),
      0 0 240px rgba(0,255,128,0.4);
  `;
  
  document.body.appendChild(portalOverlay);
  
  // Add rainbow scan lines for extra intensity
  const scanLines = document.createElement('div');
  scanLines.id = 'scan-lines';
  scanLines.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99985;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,255,0,0.15) 2px,
      rgba(0,255,0,0.15) 4px
    );
    animation: scan-lines-move 0.2s linear infinite;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(scanLines);
  
  // Add the mega portal spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mega-portal-spin {
      0% {
        width: 80px;
        height: 80px;
        opacity: 1;
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
        background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,255,255,0.9) 20%, rgba(255,0,255,0.8) 40%, rgba(255,255,0,0.6) 60%, transparent 80%);
        box-shadow: 
          0 0 100px rgba(0,255,255,1), 
          0 0 200px rgba(255,0,255,0.9),
          0 0 300px rgba(255,255,0,0.7);
        filter: brightness(3) saturate(2);
      }
      15% {
        width: 200px;
        height: 200px;
        opacity: 1;
        transform: translate(-50%, -50%) rotate(180deg) scale(1.3);
        background: radial-gradient(circle, rgba(255,0,255,1) 0%, rgba(0,255,255,0.9) 25%, rgba(255,255,0,0.8) 50%, rgba(0,255,128,0.6) 75%, transparent 90%);
        box-shadow: 
          0 0 150px rgba(255,0,255,1), 
          0 0 250px rgba(0,255,255,0.9);
        filter: brightness(4) saturate(3);
      }
      35% {
        width: 400px;
        height: 400px;
        opacity: 1;
        transform: translate(-50%, -50%) rotate(450deg) scale(1.5);
        background: radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,0,255,0.9) 20%, rgba(0,255,255,0.8) 40%, rgba(255,128,0,0.6) 65%, transparent 85%);
        box-shadow: 
          0 0 200px rgba(255,255,0,1), 
          0 0 350px rgba(255,0,255,0.8);
        filter: brightness(5) saturate(4);
      }
      60% {
        width: 600px;
        height: 600px;
        opacity: 0.9;
        transform: translate(-50%, -50%) rotate(720deg) scale(1.8);
        background: radial-gradient(circle, rgba(0,255,128,1) 0%, rgba(255,255,0,0.9) 20%, rgba(255,0,255,0.7) 45%, rgba(0,255,255,0.5) 70%, transparent 90%);
        box-shadow: 
          0 0 250px rgba(0,255,128,1), 
          0 0 400px rgba(255,255,255,0.8);
        filter: brightness(6) saturate(5);
      }
      85% {
        width: 800px;
        height: 800px;
        opacity: 0.5;
        transform: translate(-50%, -50%) rotate(1080deg) scale(2);
        filter: brightness(7) saturate(6);
      }
      100% {
        width: 1000px;
        height: 1000px;
        opacity: 0;
        transform: translate(-50%, -50%) rotate(1440deg) scale(2.5);
        background: radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 40%);
        box-shadow: 0 0 300px rgba(255,255,255,1);
        filter: brightness(10) saturate(8);
      }
    }
    
    @keyframes intense-color-explosion {
      0% {
        opacity: 0;
        filter: brightness(1) saturate(1);
      }
      10% {
        opacity: 1;
        background: radial-gradient(circle at center, 
          rgba(255,255,255,0.95) 0%, 
          rgba(0,255,255,0.9) 10%, 
          rgba(255,0,255,0.85) 25%, 
          rgba(255,255,0,0.7) 40%, 
          rgba(0,255,128,0.5) 60%, 
          transparent 85%);
        filter: brightness(3) saturate(4);
      }
      25% {
        opacity: 0.9;
        background: radial-gradient(circle at center, 
          rgba(255,0,255,0.9) 0%, 
          rgba(255,255,0,0.85) 15%, 
          rgba(0,255,255,0.8) 35%, 
          rgba(255,64,128,0.6) 55%, 
          transparent 80%);
        filter: brightness(4) saturate(5);
      }
      50% {
        opacity: 0.7;
        background: radial-gradient(circle at center, 
          rgba(255,255,0,0.8) 0%, 
          rgba(0,255,128,0.75) 20%, 
          rgba(255,0,255,0.6) 45%, 
          transparent 75%);
        filter: brightness(3) saturate(4);
      }
      100% {
        opacity: 0;
        filter: brightness(1) saturate(1);
      }
    }
    
    @keyframes scan-lines-move {
      0% { transform: translateY(0); }
      100% { transform: translateY(4px); }
    }
  `;
  document.head.appendChild(style);
};

export const cleanupEffects = (effectsContainer: HTMLElement) => {
  // AGGRESSIVE cleanup - remove ALL portal and matrix effects immediately
  
  // Remove all known portal/matrix element IDs
  const elementIds = [
    'portal-overlay',
    'color-explosion', 
    'scan-lines',
    'crt-scanlines',
    'matrix-backdrop',
    'time-warp-effects-container'
  ];
  
  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  
  // Remove ALL Matrix explosion elements by class - comprehensive list
  const classSelectors = [
    '.matrix-code-stream',
    '.matrix-explosion-char', 
    '.matrix-waterfall',
    '.matrix-waterfall-wave2',
    '.matrix-binary-ring',
    '.matrix-orb',
    '.code-tunnel-layer',
    '.matrix-confetti-streamer',
    '.time-warp-ephemeral'
  ];
  
  document.querySelectorAll(classSelectors.join(', ')).forEach(el => el.remove());
  
  // Remove ALL portal/matrix animation styles from head
  document.querySelectorAll('style').forEach(style => {
    if (style.textContent?.includes('@keyframes mega-portal-spin') || 
        style.textContent?.includes('@keyframes intense-color-explosion') ||
        style.textContent?.includes('@keyframes scan-lines-move') ||
        style.textContent?.includes('@keyframes code-stream-explode') ||
        style.textContent?.includes('@keyframes char-mega-explode') ||
        style.textContent?.includes('@keyframes backdrop-pulse') ||
        style.id === 'matrix-explosion-style' ||
        style.id === 'matrix-code-style') {
      style.remove();
    }
  });
  
  // Remove container if still exists
  try {
    effectsContainer.remove();
  } catch (e) {}
};

/**
 * Robust external link opener with retry + timeout + same-tab fallback.
 *
 * Strategy (in order, each guarded):
 *   1. Synthetic <a target="_blank"> click — survives COOP/CSP/sandbox restrictions
 *      that break window.open (ERR_BLOCKED_BY_RESPONSE on chatgpt.com etc).
 *   2. window.open() — detects popup blockers (returns null).
 *   3. Up to 2 retries with short backoff on hard failures.
 *   4. Hard timeout fallback (1.2s): if nothing handled the navigation,
 *      navigate same-tab so the user is NEVER stuck on a portal/loading screen.
 *   5. Toast notification if even same-tab nav fails.
 */
const showLinkErrorToast = (url: string) => {
  try {
    // Lazy-import sonner so this util stays framework-light
    import('sonner').then(({ toast }) => {
      toast.error('Could not open link', {
        description: url.length > 60 ? url.slice(0, 60) + '…' : url,
        action: { label: 'Open', onClick: () => { window.location.href = url; } },
      });
    }).catch(() => {});
  } catch {}
};

// IMPORTANT: some destinations (notably chatgpt.com custom GPT pages) refuse
// the request with ERR_BLOCKED_BY_RESPONSE when the Referer header is missing
// or the opener chain is fully severed. We therefore use `noopener` only
// (which still prevents the new tab from touching window.opener) and NEVER
// `noreferrer`, so the destination sees a valid https://aiwebtools.* referrer.
const tryAnchorClick = (url: string): boolean => {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener'; // keep referrer so chatgpt.com etc. don't block
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { a.remove(); } catch {} }, 0);
    return true;
  } catch {
    return false;
  }
};

const tryWindowOpen = (url: string): boolean => {
  try {
    // Don't pass 'noopener' as a feature: per spec that makes window.open
    // return null even on success, which triggered the same-tab fallback.
    const win = window.open(url, '_blank');
    if (!win) return false; // popup blocked
    try { win.opener = null; } catch { /* cross-origin safe */ }
    return true;
  } catch {
    return false;
  }
};

const isConstrainedInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const isTouchDevice = window.innerWidth < 768 || window.navigator.maxTouchPoints > 0;
  return isTouchDevice && /FBAN|FBAV|FBIOS|FB_IAB|Instagram|Line|TikTok|Twitter|Snapchat/i.test(ua);
};

export const openDestinationUrl = (destinationUrl: string): void => {
  if (!destinationUrl || !destinationUrl.trim()) {
    console.warn('[openDestinationUrl] No destination URL provided');
    return;
  }

  // Strip affiliate params for destinations that reject them
  // (v0.dev returns ERR_BLOCKED_BY_RESPONSE on ?via=aiwebtools).
  const url = sanitizeExternalUrl(destinationUrl.trim());

  // Facebook/Instagram/TikTok in-app browsers often block or stall target=_blank.
  // Navigate same-tab immediately so menu/tool taps never appear frozen.
  if (isConstrainedInAppBrowser()) {
    try {
      window.location.assign(url);
    } catch {
      showLinkErrorToast(url);
    }
    return;
  }

  const HARD_TIMEOUT_MS = 800;
  let resolved = false;

  // Hard-timeout safety net: if no strategy succeeded, navigate same-tab so
  // the user is never stuck on a portal/loading overlay.
  const safetyTimer = window.setTimeout(() => {
    if (resolved) return;
    resolved = true;
    console.warn('[openDestinationUrl] Hard timeout reached — using same-tab fallback for', url);
    try {
      window.location.href = url;
    } catch {
      showLinkErrorToast(url);
    }
  }, HARD_TIMEOUT_MS);

  const markResolved = () => {
    if (resolved) return;
    resolved = true;
    clearTimeout(safetyTimer);
  };

  // Heuristic: if the page loses focus / becomes hidden shortly after we
  // try to open the URL, a new tab/window successfully took focus.
  const onBlurOrHidden = () => {
    markResolved();
    window.removeEventListener('blur', onBlurOrHidden);
    document.removeEventListener('visibilitychange', onVisChange);
  };
  const onVisChange = () => { if (document.hidden) onBlurOrHidden(); };
  window.addEventListener('blur', onBlurOrHidden, { once: true });
  document.addEventListener('visibilitychange', onVisChange);

  // CRITICAL: use ONE open strategy per click, not two — running both
  // anchor.click() and window.open() sequentially was spawning a phantom
  // second tab (the classic about:blank window users were seeing).
  //
  // window.open() is authoritative: it returns null when the popup was
  // blocked, giving us a clean signal to fall back to an anchor click
  // (which some browsers permit even when popups are blocked). Only if
  // BOTH fail do we navigate same-tab.
  const winOk = tryWindowOpen(url);
  if (winOk) {
    // A real window handle came back — the new tab is open. Never also
    // navigate this tab (that made visitors lose their place on the site).
    markResolved();
    window.removeEventListener('blur', onBlurOrHidden);
    document.removeEventListener('visibilitychange', onVisChange);
    return;
  }
  if (!winOk) {
    const anchorOk = tryAnchorClick(url);
    if (!anchorOk) {
      markResolved();
      try { window.location.href = url; } catch { showLinkErrorToast(url); }
      return;
    }
  }

  // Otherwise rely on blur/visibility detection (or the safety timer) to
  // confirm/recover. User will never be stuck on a portal/loading overlay.
};
