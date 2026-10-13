import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';

interface DeferredMountProps {
  children: ReactNode;
  delay?: number; // ms to wait after first paint
  fallback?: ReactNode;
  mountOnVisible?: boolean;
}

/* ------------------------------------------------------------------ *
 * Global scroll-aware mount scheduler
 * ------------------------------------------------------------------ *
 * Mounting several heavy below-the-fold sections at once blocks the main
 * thread and freezes scrolling. So we:
 *   1. queue every deferred mount,
 *   2. never flush while the user is actively scrolling,
 *   3. flush at most ONE section per idle slot so each React commit stays
 *      small enough to keep the frame budget.
 * ------------------------------------------------------------------ */
const queue: Array<() => void> = [];
const queuedAt = new WeakMap<() => void, number>();
// Never let a queued section wait longer than this, even mid-scroll — an empty
// black gap is far worse than one extra commit during momentum scrolling.
const MAX_WAIT_MS = 200;
let flushing = false;
let lastScrollAt = 0;
let scrollBound = false;
let interactionBound = false;

const markScroll = () => {
  lastScrollAt = performance.now();
};

const markInteraction = () => {
  lastScrollAt = performance.now();
};

const bindScroll = () => {
  if (scrollBound || typeof window === 'undefined') return;
  scrollBound = true;
  window.addEventListener('scroll', markScroll, { passive: true });
  window.addEventListener('touchmove', markScroll, { passive: true });
  if (!interactionBound) {
    interactionBound = true;
    window.addEventListener('pointerdown', markInteraction, { passive: true, capture: true });
    window.addEventListener('touchstart', markInteraction, { passive: true, capture: true });
    window.addEventListener('wheel', markInteraction, { passive: true, capture: true });
  }
};

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0);

/**
 * Urgent mount: the placeholder is at/near the real viewport, so the user is
 * looking at an empty gap. Jump it to the front of the queue and flush on the
 * next frame instead of waiting for a long scroll-quiet window.
 */
const enqueueUrgent = (mount: () => void) => {
  bindScroll();
  const existing = queue.indexOf(mount);
  if (existing >= 0) queue.splice(existing, 1);
  queuedAt.set(mount, performance.now() - MAX_WAIT_MS);
  queue.unshift(mount);
  scheduleFlush();
};

function scheduleFlush() {
  if (flushing) return;
  flushing = true;

  // Touch scrolling fires events continuously through momentum, so a long
  // quiet window meant sections never mounted while the user scrolled — the
  // page looked empty and "slow". Touch gets a much shorter window.
  const quietWindow = isTouchDevice() ? 60 : 250;

  const run = () => {
    const head = queue[0];
    const waited = head ? performance.now() - (queuedAt.get(head) ?? performance.now()) : 0;
    if (performance.now() - lastScrollAt < quietWindow && waited < MAX_WAIT_MS) {
      window.setTimeout(run, 32);
      return;
    }

    const next = queue.shift();
    next?.();

    if (queue.length > 0) {
      const ric = window.requestIdleCallback;
      if (ric) ric(run, { timeout: 50 });
      else window.setTimeout(run, 32);
    } else {
      flushing = false;
    }
  };

  const ric = window.requestIdleCallback;
  if (ric) ric(run, { timeout: 50 });
  else window.setTimeout(run, 16);
}

const enqueueMount = (mount: () => void) => {
  bindScroll();
  queuedAt.set(mount, performance.now());
  queue.push(mount);
  scheduleFlush();
};

/**
 * Defers mounting of heavy components until after first paint.
 * Mounts as soon as the placeholder nears the viewport (so scrolling never
 * reveals an empty gap), otherwise after `delay` — always through the
 * scroll-aware scheduler above, so the page never freezes mid-scroll.
 */
const DeferredMount = ({ children, delay = 100, fallback = null, mountOnVisible = true }: DeferredMountProps) => {
  const [shouldMount, setShouldMount] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let queued = false;
    const mount = () => {
      if (mounted) setShouldMount(true);
    };

    const request = () => {
      if (queued || !mounted) return;
      queued = true;
      enqueueMount(mount);
    };

    // Near-viewport mounting still goes through the global queue. Several
    // deferred placeholders can share the same collapsed Y position, so an
    // observer may flag all of them in one frame. Mounting them directly here
    // caused the exact "first scroll does not move" freeze we are preventing.
    let observer: IntersectionObserver | null = null;
    let urgentObserver: IntersectionObserver | null = null;
    if (mountOnVisible && placeholderRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            request();
          }
        },
        { rootMargin: '600px 0px' }
      );
      observer.observe(placeholderRef.current);

      // Second, tighter observer: if the gap actually reaches the screen we
      // stop being polite and mount right away.
      urgentObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            urgentObserver?.disconnect();
            observer?.disconnect();
            if (mounted) {
              queued = true;
              enqueueUrgent(mount);
            }
          }
        },
        { rootMargin: '400px 0px' }
      );
      urgentObserver.observe(placeholderRef.current);
    }

    const timerId = window.setTimeout(request, delay);

    return () => {
      mounted = false;
      const pending = queue.indexOf(mount);
      if (pending >= 0) queue.splice(pending, 1);
      observer?.disconnect();
      urgentObserver?.disconnect();
      window.clearTimeout(timerId);
    };
  }, [delay, mountOnVisible]);

  if (!shouldMount) {
    return (
      <div ref={placeholderRef} style={{ minHeight: 1 }}>
        {fallback}
      </div>
    );
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default DeferredMount;
