/**
 * Shared image resolution and fallback logic to prevent 404s
 */

export const isExpiredHost = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return (
    url.includes("discordapp.net") || 
    url.includes("cdn.discordapp.com") ||
    url.includes("fbcdn.net") ||
    url.includes("scontent.f")
  );
};

export const getYouTubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoUrl?: string): string | undefined => {
  const id = getYouTubeId(videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
};

export const getResolvedAssetUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("/src/assets/")) {
    // ES module image imports have this URL in Vite development. Rewriting
    // them relative to /src/utils points at /assets and breaks valid images.
    if (import.meta.env?.DEV) return url;
    const filename = url.replace("/src/assets/", "");
    // This handles Vite asset resolution in most cases where relative paths are expected
    try {
      return new URL(`../../assets/${filename}`, import.meta.url).href;
    } catch (e) {
      return url;
    }
  }
  return url;
};

/**
 * Real brand logo for tools that ship no hero image or video.
 *
 * Instead of showing a bare emoji tile, the card displays the tool's OWN
 * site icon (fetched from Google's public favicon service, cached on their
 * edge, no key, no cost). This gives every single card in the directory a
 * genuine visual preview of the tool it links to.
 */
export const getBrandLogo = (
  directUrl: string | null | undefined,
  size: 32 | 64 | 128 | 256 = 128,
): string | undefined => {
  if (!directUrl) return undefined;
  try {
    const host = new URL(directUrl.trim()).hostname.replace(/^www\./i, "");
    if (!host || !host.includes(".")) return undefined;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
  } catch {
    return undefined;
  }
};
