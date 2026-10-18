import metadata from "@/data/offGridBotMetadata.json";
const bots: Record<string, { name: string; voice: string; starters: string[]; tags: string[]; personality?: string }> = metadata;
export const getOffGridBotMetadata = (slug: string) => bots[slug];