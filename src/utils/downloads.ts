/**
 * Centralized download helpers.
 *
 * The Lovable id-preview sandbox (id-preview--*.lovable.app) gates ALL static
 * file requests behind a Lovable login. To prevent download buttons from
 * redirecting users to a Lovable login screen during preview, we always
 * resolve static download paths against the public published origin.
 *
 * On the published site, custom domains, or any non-preview origin, the
 * relative path is used as-is.
 */
const PUBLIC_ORIGIN = "https://aiwebtools.lovable.app";

const isPreviewSandbox = (): boolean => {
  if (typeof window === "undefined") return false;
  return /(^|\.)id-preview--.*\.lovable\.app$/i.test(window.location.hostname);
};

/**
 * Resolve a /downloads/* (or any absolute-rooted) path to a fully-qualified
 * URL that is guaranteed to be publicly accessible — bypassing the
 * preview-sandbox auth gate when needed.
 */
export const resolvePublicAssetUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (isPreviewSandbox()) return `${PUBLIC_ORIGIN}${normalized}`;
  return normalized;
};

/**
 * Trigger a browser download for a public static asset, always pointing at
 * the published origin when invoked from the preview sandbox so the user is
 * never redirected to a Lovable login screen.
 */
export const triggerPublicDownload = (path: string, filename: string): void => {
  const href = resolvePublicAssetUrl(path);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  // Some browsers ignore `download` for cross-origin URLs; opening in a new
  // tab still serves the file directly without an auth wall.
  if (href.startsWith("http") && typeof window !== "undefined" && href.indexOf(window.location.origin) !== 0) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
/**
 * Master library, stored inside the site's own code (public/downloads),
 * split alphabetically so every file stays under the hosting size limit.
 * 2,969 unique operational instructions + 267 development app plans.
 * Only byte-for-byte identical copies were removed; every variation is kept.
 */
const OI = "/downloads/operational-instructions/";
export const OPERATIONAL_INSTRUCTIONS_PARTS: ReadonlyArray<{ path: string; name: string; label: string; count: number }> = [
  { label: "0–9 to Co", count: 658, name: "AIWebTools-Operational-Instructions-0-9-to-Co.zip" },
  { label: "Co to Go", count: 541, name: "AIWebTools-Operational-Instructions-Co-to-Go.zip" },
  { label: "Go to Gp", count: 27, name: "AIWebTools-Operational-Instructions-Go-to-Gp.zip" },
  { label: "Gp to Hi", count: 76, name: "AIWebTools-Operational-Instructions-Gp-to-Hi.zip" },
  { label: "Hi to In", count: 149, name: "AIWebTools-Operational-Instructions-Hi-to-In.zip" },
  { label: "In to Pe", count: 614, name: "AIWebTools-Operational-Instructions-In-to-Pe.zip" },
  { label: "Pe to St", count: 451, name: "AIWebTools-Operational-Instructions-Pe-to-St.zip" },
  { label: "St to Ti", count: 233, name: "AIWebTools-Operational-Instructions-St-to-Ti.zip" },
  { label: "Ti to Z", count: 220, name: "AIWebTools-Operational-Instructions-Ti-to-Z.zip" },
  { label: "Development App Plans", count: 267, name: "AIWebTools-Development-App-Plans.zip" },
].map((p) => ({ ...p, path: OI + p.name }));

/** Always-fresh open-source code copy, rebuilt on every publish. */
export const SOURCE_CODE_DOWNLOAD = { path: "/downloads/AIWebTools-Source-Code.zip", name: "AIWebTools-Source-Code.zip" };

export const OPEN_DOWNLOAD_CENTER_EVENT = "awt:open-download-center";

/** Opens the Download Center popup listing every archive + source code. */
export const downloadAllOperationalInstructions = (): void => {
  window.dispatchEvent(new Event(OPEN_DOWNLOAD_CENTER_EVENT));
};

/** Downloads every archive one after another (plus the source code). */
export const downloadEverything = (): void => {
  [...OPERATIONAL_INSTRUCTIONS_PARTS, SOURCE_CODE_DOWNLOAD].forEach((part, index) => {
    window.setTimeout(() => triggerPublicDownload(part.path, part.name), index * 700);
  });
};
