import { Tool } from "@/types/tools";

// Simplified search for better performance
export const performOptimizedSearch = (tools: Tool[], searchTerm: string): Tool[] => {
  if (!searchTerm.trim() || searchTerm.length < 1) {
    return [];
  }

  // Performance optimization - prevent overly long queries
  const trimmed = searchTerm.trim();
  if (trimmed.length > 50) {
    return [];
  }

  const lowerSearchTerm = trimmed.toLowerCase();
  const searchWords = lowerSearchTerm.split(/\s+/).filter(word => word.length > 1);
  
  const scored: { tool: Tool; score: number }[] = [];

  for (const tool of tools) {
    if (!tool.title) continue;
    
    const lowerTitle = tool.title.toLowerCase();
    // Normalize special characters for better matching (e.g., Míngjiào -> mingjiao)
    const normalizedTitle = lowerTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lowerDescription = (tool.description || "").toLowerCase();
    const normalizedDescription = lowerDescription.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lowerCategory = (tool.category || "").toLowerCase();
    const lowerTags = (tool.tags || []).map(tag => tag.toLowerCase()).join(" ");
    
    let score = 0;

    // Exact title match (highest priority)
    if (lowerTitle === lowerSearchTerm || normalizedTitle === lowerSearchTerm) {
      score += 10000;
    }
    // Title starts with search term
    else if (lowerTitle.startsWith(lowerSearchTerm) || normalizedTitle.startsWith(lowerSearchTerm)) {
      score += 8000;
    }
    // Title contains search term
    else if (lowerTitle.includes(lowerSearchTerm) || normalizedTitle.includes(lowerSearchTerm)) {
      score += 6000;
    }

    // Tags match (high priority for exact tag matches)
    if (lowerTags.includes(lowerSearchTerm)) {
      score += 5000;
    }

    // Description contains search term
    if (lowerDescription.includes(lowerSearchTerm) || normalizedDescription.includes(lowerSearchTerm)) {
      score += 3000;
    }

    // Category match
    if (lowerCategory.includes(lowerSearchTerm)) {
      score += 2000;
    }

    // Individual word matches (only for reasonable queries)
    if (searchWords.length <= 3) {
      for (const word of searchWords) {
        if (word.length >= 2) {
          if (lowerTitle.includes(word) || normalizedTitle.includes(word)) {
            score += 1000;
          }
          if (lowerTags.includes(word)) {
            score += 800;
          }
          if (lowerDescription.includes(word)) {
            score += 500;
          }
        }
      }
    }

    if (score > 0) {
      scored.push({ tool, score });
    }
  }

  // Sort by score and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .map(item => item.tool)
    .slice(0, 500); // Limit results for performance
};