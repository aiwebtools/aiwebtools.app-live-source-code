import legacyVideos from "./mtvaiLegacyCatalog.json";
import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { buildMtvaiMusicOrder } from "./mtvaiMusicOrder";

// Union of the two existing catalogs: first metadata wins, no video is removed.
export const MTVAI_CATALOG = buildMtvaiMusicOrder([...RECENT_MTVAI_UPLOADS, ...legacyVideos]);
export const MTVAI_TRACK_COUNT = MTVAI_CATALOG.length;