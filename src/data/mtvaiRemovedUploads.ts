// Uploads Master removed from YouTube (oEmbed 404 on November 16, 2026).
// Kept as a record but hidden from every music and audiobook lineup.
export const REMOVED_MTVAI_UPLOAD_IDS = new Set([
  "-nrZhBBNChE",
  "1lto24uXMIU",
  "1paVZJmXL3w",
  "1rPWae9L_W8",
  "4Wwhn5YweQ4",
  "5W5pFFUqvSk",
  "RSzEebIzlt0",
  "eMf5XG054XU",
  "mxFKRIWF2Ok",
  "n9IEIcv2gEk",
]);

type Upload = { id?: string; title: string; kind?: string };

// These promotional uploads have brand-only titles, rather than explicit tool/ad labels.
// Keep their original records/media intact; exclude them only from listening queues.
const PROMOTIONAL_UPLOAD_IDS = new Set([
  "k_tp3d_jq9E", "7U_QmnDQIyE", "FZr-zifwMw4", "HNEnKpYnFFw",
  "vJz1HOGtV0I", "NWhi0O8OrNA", "TRGOvFg87f8", "KBjodVWvUdU",
  "tyZxna_K6fQ", "aKJR_7bRrQk", "zyjmLIzP0vQ", "Coi0C7MBzP4",
  "Zwsf8g4ilM0", "z9p9saWxthM", "_1qcKvXwPbE", "4ysPr5IUhoQ",
  "lPZVKMfUcrs", "CNDGOkEIx3k", "6JAGh_ItU7w", "qJf3gsrZy08",
  "8aPpUPiDBJ4", "Zdthelofv_E", "9fpWIE20z7s", "JXLqPMfw49Y",
  "jwjNOKP5mf4", "hB_fKF_5GOI", "LHaPL2oBUmY", "9DR-wgghKAE",
]);
const MUSIC_TITLE = /music|lyric|\bsong\b|\banthem\b|\bmv\b|#aimusic|#artmusic/i;
const PROMOTION_TITLE = /\bgpts?\b|\bgemini\b|\bgenerator\b|\bai tools?\b|\bcommercial\b|commericial|commerical|\badvertisement\b|\bpodcast\b|\btutorial\b|\bcomprehensive.*(?:class|course)\b|\bhow to\b.*(?:\bai\b|generat)|\bcalculator\b|\bai assistant\b|clone.*(?:website|database)|(?:website|database).*clon|\bweb\s?3\b.*domain|domain.*\bweb\s?3\b|\bai tools university\b|\bai tool company\b|revolutionize your workflow/i;
export const isMtvaiPromotion = (video: Upload) =>
  video.kind === "promotion" || video.kind === "advertisement" ||
  (video.id !== undefined && PROMOTIONAL_UPLOAD_IDS.has(video.id)) ||
  /\bcommercial\b|commericial|commerical|\badvertisement\b|\bai tool demo\b/.test(video.title.toLowerCase()) ||
  (!MUSIC_TITLE.test(video.title) && PROMOTION_TITLE.test(video.title));

const AUDIOBOOK_TITLE = /audio\s?book|read[\s-]aloud|lost diary|resurrection diary|picture book|storybook|time machine: the first thousand doors/i;
export const isMtvaiAudiobook = (video: Upload) =>
  !isMtvaiPromotion(video) && (video.kind === "audiobook" || AUDIOBOOK_TITLE.test(video.title));
