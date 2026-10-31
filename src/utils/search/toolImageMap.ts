/**
 * Lazy title -> hero image lookup for search dropdowns.
 * The tools module is already loaded by the search engine, so this is cache-cheap.
 */
let cache: Map<string, string> | null = null;
let pending: Promise<Map<string, string>> | null = null;
const listeners = new Set<(map: Map<string, string>) => void>();

const isUsable = (url?: string) => typeof url === "string" && url.length > 0;
const isDisplayable = (url?: string) => isUsable(url) && (!url?.startsWith("/src/") || import.meta.env?.DEV);

const getYouTubeThumbnail = (videoUrl?: string): string | undefined => {
  if (!videoUrl) return undefined;
  const videoId = videoUrl.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/,
  )?.[1];
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined;
};

const getMediaImage = (tool: { imageUrl?: string; videoUrl?: string }): string | undefined =>
  (isDisplayable(tool.imageUrl) ? tool.imageUrl : undefined) ??
  getYouTubeThumbnail(tool.videoUrl);

export const getToolImageMapSync = () => cache;

const buildMap = (tools: Array<{ title?: string; imageUrl?: string; videoUrl?: string }>) => {
  const map = new Map<string, string>();
  for (const tool of tools) {
    if (!tool?.title) continue;
    const key = tool.title.trim().toLowerCase();
    const candidate = getMediaImage(tool);
    const current = map.get(key);
    // Duplicate records are common. Preserve the first real media asset and
    // never force the same branded placeholder onto unrelated tools.
    if (!current && candidate) map.set(key, candidate);
  }
  return map;
};

/** Called by the search engine once the full tools module is loaded. */
export const primeToolImageMap = (tools: unknown) => {
  if (cache || !Array.isArray(tools) || tools.length === 0) return;
  cache = buildMap(tools as Array<{ title?: string; imageUrl?: string; videoUrl?: string }>);
  listeners.forEach((fn) => fn(cache as Map<string, string>));
  listeners.clear();
};

/**
 * Some entries store hero images as raw "/src/assets/..." strings, which only work in dev.
 * Swap them for real bundled URLs once the (lazy) asset map is available.
 */
let assetsResolved = false;
const resolveRawAssetPaths = () => {
  if (assetsResolved || !cache) return;
  assetsResolved = true;
  // Dev serves "/src/assets/..." straight from Vite; importing the eager glob
  // map here would fire thousands of module requests and stall the page.
  if (import.meta.env.DEV) return;
  import("./toolAssetUrls")
    .then(({ assetUrlByPath }) => {
      if (!cache) return;
      let changed = false;
      cache.forEach((url, key) => {
        if (!url.startsWith("/src/")) return;
        const resolved = assetUrlByPath[url];
        if (resolved) {
          cache!.set(key, resolved);
          changed = true;
        } else {
          cache!.delete(key);
          changed = true;
        }
      });
      if (changed) {
        const snapshot = new Map(cache);
        cache = snapshot;
        readyListeners.forEach((fn) => fn(snapshot));
      }
    })
    .catch(() => {});
};

const readyListeners = new Set<(map: Map<string, string>) => void>();

export const onToolImageMapReady = (fn: (map: Map<string, string>) => void) => {
  readyListeners.add(fn);
  if (cache) {
    fn(cache);
    return () => readyListeners.delete(fn);
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    readyListeners.delete(fn);
  };
};

export const loadToolImageMap = (): Promise<Map<string, string>> => {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;

  pending = import("@/data/toolsData")
    .then(({ allTools }) => {
      primeToolImageMap(allTools);
      return cache ?? new Map<string, string>();
    })
    .catch(() => new Map<string, string>());

  return pending;
};

export const getToolImage = (
  tool: { title?: string; imageUrl?: string; videoUrl?: string } | null | undefined,
  map: Map<string, string> | null,
): string | undefined => {
  if (!tool) return undefined;
  const fromMap = map && tool.title ? map.get(tool.title.trim().toLowerCase()) : undefined;
  if (isDisplayable(tool.imageUrl)) return tool.imageUrl;
  return fromMap ?? getMediaImage(tool);
};
