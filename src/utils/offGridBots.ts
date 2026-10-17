import metadata from "@/data/offGridBotMetadata.json";
const bots: Record<string, { name: string; voice: string; starters: string[]; tags: string[] }> = metadata;
export const getOffGridBotMetadata = (slug: string) => bots[slug];