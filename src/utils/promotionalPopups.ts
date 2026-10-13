export const PROMOTION_INTERVAL_MS = 15 * 60 * 1000;
const START_KEY = "awt-promotions-started";
const LAST_KEY = "awt-promotions-last";
let activePromotion: symbol | undefined;

export function promotionDelay(now: number, started: number, last: number): number {
  return Math.max(0, Math.max(started, last) + PROMOTION_INTERVAL_MS - now);
}

/** One session-wide cooldown shared by all automatic promotions. */
export function schedulePromotion(show: () => void, earliestDelay = PROMOTION_INTERVAL_MS) {
  const owner = Symbol("promotion");
  const now = Date.now();
  const started = Number(sessionStorage.getItem(START_KEY)) || now;
  sessionStorage.setItem(START_KEY, String(started));
  const earliest = now + earliestDelay;
  let timer: ReturnType<typeof setTimeout>;
  const attempt = () => {
    const current = Date.now();
    const last = Number(sessionStorage.getItem(LAST_KEY)) || 0;
    const wait = Math.max(earliest - current, promotionDelay(current, started, last));
    if (wait > 0 || activePromotion || document.querySelector('[role="dialog"]')) {
      timer = setTimeout(attempt, Math.max(wait, 1000));
      return;
    }
    activePromotion = owner;
    sessionStorage.setItem(LAST_KEY, String(current));
    show();
  };
  timer = setTimeout(attempt, Math.max(earliestDelay, promotionDelay(now, started, Number(sessionStorage.getItem(LAST_KEY)) || 0)));
  const dismiss = () => {
    if (activePromotion !== owner) return;
    activePromotion = undefined;
    sessionStorage.setItem(LAST_KEY, String(Date.now()));
  };
  return { dismiss, cancel: () => { clearTimeout(timer); dismiss(); } };
}