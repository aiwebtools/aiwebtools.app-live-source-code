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

const AUDIOBOOK_TITLE = /audio\s?book|read-aloud|read aloud|lost diary|picture book|storybook/i;
export const isMtvaiAudiobook = (video: { title: string; kind?: string }) =>
  video.kind === "audiobook" || AUDIOBOOK_TITLE.test(video.title);
