// Lightweight first-party visit tracker: page views, every button/link click,
// bot opens and campaign tags (utm_*). Events are queued and sent in small
// batches so tracking never slows a click.
const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Ev = {
  session_id: string; event_type: "page_view" | "click" | "bot_open" | "error";
  path: string; label?: string | null; target?: string | null; bot_slug?: string | null;
  utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null;
  referrer?: string | null; device: string;
};

const clip = (s: string | null | undefined, n: number) => (s ? s.replace(/\s+/g, " ").trim().slice(0, n) : null);

const sessionId = (() => {
  try {
    let id = sessionStorage.getItem("aiwt_sid");
    if (!id) { id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; sessionStorage.setItem("aiwt_sid", id); }
    return id;
  } catch { return `anon-${Math.random().toString(36).slice(2, 10)}`; }
})();

const utm = (() => {
  const read = () => {
    try {
      const p = new URLSearchParams(location.search);
      const fresh = { s: p.get("utm_source"), m: p.get("utm_medium"), c: p.get("utm_campaign") };
      if (fresh.s) sessionStorage.setItem("aiwt_utm", JSON.stringify(fresh));
      return fresh.s ? fresh : JSON.parse(sessionStorage.getItem("aiwt_utm") || "null") || {};
    } catch { return {}; }
  };
  return read() as { s?: string | null; m?: string | null; c?: string | null };
})();

const device = () => (innerWidth < 768 ? "phone" : innerWidth < 1100 ? "tablet" : "desktop");
export const botSlugFromPath = (path: string) => path.match(/^\/app\/([^/?#]+)/)?.[1] ?? null;

let queue: Ev[] = [];
let timer: number | undefined;

const send = (batch: Ev[], keepalive = false) => {
  if (!batch.length || !URL_BASE || !KEY) return;
  fetch(`${URL_BASE}/rest/v1/site_events`, {
    method: "POST", keepalive,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  }).catch(() => {});
};

const flush = (keepalive = false) => { window.clearTimeout(timer); timer = undefined; const b = queue; queue = []; send(b, keepalive); };

export const track = (e: Omit<Ev, "session_id" | "device" | "utm_source" | "utm_medium" | "utm_campaign" | "path"> & { path?: string }) => {
  const path = clip(e.path ?? location.pathname, 500) || "/";
  queue.push({ ...e, path, session_id: sessionId, device: device(), utm_source: clip(utm.s, 100), utm_medium: clip(utm.m, 100), utm_campaign: clip(utm.c, 100) });
  if (queue.length >= 20) flush();
  else if (!timer) timer = window.setTimeout(() => flush(), 4000);
};

let lastPath = "";
const pageView = () => {
  const path = location.pathname;
  if (path === lastPath) return;
  lastPath = path;
  track({ event_type: "page_view", path, referrer: clip(document.referrer, 500) });
  const slug = botSlugFromPath(path);
  if (slug) track({ event_type: "bot_open", path, bot_slug: slug });
};

export const installSiteTracker = () => {
  if (typeof window === "undefined" || (window as any).__aiwtTracker) return;
  if (/bot|crawl|spider|headless/i.test(navigator.userAgent)) return;
  (window as any).__aiwtTracker = true;
  pageView();
  for (const m of ["pushState", "replaceState"] as const) {
    const orig = history[m];
    history[m] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const r = orig.apply(this, args); queueMicrotask(pageView); return r;
    } as History["pushState"];
  }
  addEventListener("popstate", pageView);
  addEventListener("click", (ev) => {
    const el = (ev.target as Element | null)?.closest?.("button, a, [role=button], [role=menuitem], [role=tab]") as HTMLElement | null;
    if (!el) return;
    const label = clip(el.getAttribute("aria-label") || el.innerText || el.getAttribute("title"), 200) || el.tagName.toLowerCase();
    const href = el instanceof HTMLAnchorElement ? el.href : null;
    track({ event_type: "click", label, target: clip(href, 500), bot_slug: botSlugFromPath(location.pathname) });
  }, { capture: true, passive: true });
  addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
};
