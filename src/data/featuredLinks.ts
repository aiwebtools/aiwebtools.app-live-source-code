/** Owner-verified destinations (Nov 20, 2026). Use these exact URLs; never invent alternates. */
export const MTVAI_YOUTUBE_URL = "https://www.youtube.com/@AIWEBTOOLS-MTVai/shorts";

export const FEATURED_LINKS = [
  { label: "Live site · aiwebtools.app", url: "https://aiwebtools.app", external: true },
  { label: "Movie Script Writer GPT · Feature story", url: "/feature/movie-script-writer-gpt", external: false },
  { label: "Movie Script Writer GPT · Run it on-site", url: "/movie-script-writer-gpt", external: false },
  { label: "Movie Script Writer GPT · Official version", url: "https://moviescriptwritergpt.lovable.app/?via=aiwebtools", external: true },
  { label: "Branford River Spa", url: "https://branfordspa.com", external: true },
  { label: "Book at Branford River Spa", url: "https://branfordspa.com/book", external: true },
  { label: "MTVai on YouTube", url: MTVAI_YOUTUBE_URL, external: true },
] as const;
