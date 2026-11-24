import legacyVideos from "./mtvaiLegacyCatalog.json";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { buildMtvaiMusicOrder } from "./mtvaiMusicOrder";
import { REMOVED_MTVAI_UPLOAD_IDS, isMtvaiAudiobook, isMtvaiPromotion } from "./mtvaiRemovedUploads";
import { MTVAI_AUDIOBOOKS } from "./mtvaiAudiobooks";

// Music-only union of the existing catalogs: first metadata wins, no repeats.
// Audiobooks play only from the Audiobooks collection; uploads removed from YouTube stay hidden.
const AUDIOBOOK_IDS = new Set(MTVAI_AUDIOBOOKS.map(v => v.id));
export const MTVAI_CATALOG = buildMtvaiMusicOrder([...RECENT_MTVAI_UPLOADS, ...legacyVideos])
  .filter(v => !REMOVED_MTVAI_UPLOAD_IDS.has(v.id) && !AUDIOBOOK_IDS.has(v.id) && !isMtvaiAudiobook(v) && !isMtvaiPromotion(v));
export const MTVAI_TRACK_COUNT = MTVAI_CATALOG.length;
