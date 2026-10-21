import { Tool } from "@/types/tools";
import { mainCategories } from "@/utils/mainCategoryMapping";
import { isSimilarCategory } from "./normalization";
import { isVideoRelatedTool } from "./videoDetection";
import { isVideoMultimediaTool, getVideoMultimediaTools } from "./videoMultimediaDetection";
import { isHealthAndWellnessTool, isCreativeAndEntertainmentTool } from "./healthDetection";
import { 
  getDataAnalyticsTools, 
  getMarketingSalesTools, 
  getCommunicationCollaborationTools,
  getAutomationPlatformsTools,
  getImageAndDesignTools
} from "./categoryMatching";
import { CategoryCounts, MainCategoryCounts } from "./types";
import { buildToolsCache, buildSingleCategoryTools, getToolsCacheByMainCategory, isCacheBuilt } from "./cacheManager";
import { isAIWebToolsGPT, isEducationRelatedTool } from "./specializedDetection";
import { applyAIWebToolsPrioritization, getAIWebToolsPriorityScore } from "@/utils/aiWebToolsPrioritization";
import { filterBusinessTools } from "./businessCategoryFiltering";
import { isGamingEntertainmentTool } from "./gamingEntertainmentDetection";
import { isSecurityPrivacyTool } from "./securityPrivacyDetection";
import { isIndustrySpecificTool } from "./industryDetection";
import { isSpiritualityTool } from "./spiritualityDetection";
import { isThreeDVisualizationTool, getThreeDVisualizationTools } from "./threeDVisualizationDetection";
import { isAudioMusicTool, getAudioMusicTools } from "./audioMusicDetection";
import { isImageDesignTool, getEnhancedImageDesignTools } from "./imageDesignDetection";
import { isWritingContentTool } from "./writingContentDetection";
import { isCodingDevelopmentTool, getCodingDevelopmentTools } from "./codingDevelopmentDetection";
import { isMarketingSalesTool, getMarketingSalesTools as getMarketingSalesToolsDirect } from "./marketingSalesDetection";
import { isSoundEffectsTool, getSoundEffectsTools } from "./soundEffectsDetection";

export const getCategoriesWithCounts = (tools: Tool[]): CategoryCounts => {
  const categoryCounts: CategoryCounts = {};
  
  tools.forEach(tool => {
    const category = tool.category;
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });
  
  return categoryCounts;
};

export const getToolsByCategory = (tools: Tool[], categoryName: string): Tool[] => {
  let categoryRelevantTools: Tool[] = [];
  let otherTools: Tool[] = [];
  
  // First, separate tools into category-relevant and others
  const allFilteredTools = (() => {
    // 🚀 ENHANCED: Apply proper business filtering for Business Operations & Productivity category
    if (categoryName === "BUSINESS OPERATIONS & PRODUCTIVITY") {
      const businessCandidates = tools.filter(tool => tool.category && isSimilarCategory(tool.category, categoryName));
      return filterBusinessTools(businessCandidates);
    }
    
    // Special handling for AI Web Tools Originals category
    else if (categoryName === "AI WEB TOOLS ORIGINALS" || 
             categoryName === "AI Web Tools Originals" || 
             categoryName === "AIWebTools GPTs Collection" ||
             categoryName === "ai-originals") {
      return tools.filter(tool => isAIWebToolsGPT(tool));
    }
    
    // FIXED: Unified handling for Image & Design category - use ONLY ONE standardized name
    else if (categoryName === "IMAGE & DESIGN AI TOOLS" || 
        categoryName === "Image & Design" || 
        categoryName === "Image & Design Tools" ||
        categoryName === "Image & Design AI Tools") {
      return getImageAndDesignTools(tools, categoryName);
    }
    
    // Special handling for Data & Analytics category
    else if (categoryName === "DATA & ANALYTICS AI TOOLS" || categoryName === "Data & Analytics Tools") {
      return getDataAnalyticsTools(tools, categoryName);
    }
    
    // Special handling for Marketing & Sales category
    else if (categoryName === "MARKETING & SALES AI TOOLS" || categoryName === "Marketing & Analytics" || categoryName === "E-commerce & Marketing Tools" || categoryName === "Business & Sales Tools") {
      return getMarketingSalesTools(tools, categoryName);
    }
    
    // Enhanced handling for Communication & Collaboration category
    else if (categoryName === "COMMUNICATION & COLLABORATION AI TOOLS" || categoryName === "Communication & Entertainment" || categoryName === "Communication Tools") {
      return getCommunicationCollaborationTools(tools, categoryName);
    }
    
    // Special handling for Automation Platforms category
    else if (categoryName === "AUTOMATION PLATFORMS" || categoryName === "Automation Platforms" || categoryName === "Automation & Workflows") {
      return getAutomationPlatformsTools(tools, categoryName);
    }
    
    // Enhanced handling for Health, Wellness & Personal Lifestyle category
    else if (categoryName === "HEALTH, WELLNESS & PERSONAL LIFESTYLE") {
      return tools.filter(tool => isHealthAndWellnessTool(tool));
    }
    
    // Enhanced handling for Creative & Entertainment category - FIXED LOGIC
    else if (categoryName === "CREATIVE & ENTERTAINMENT") {
      return tools.filter(tool => isCreativeAndEntertainmentTool(tool));
    }
    
    // Regular category filtering with enhanced similarity matching
    else {
      return tools.filter(tool => tool.category && isSimilarCategory(tool.category, categoryName));
    }
  })();

  // Separate strictly relevant tools from loosely related ones
  allFilteredTools.forEach(tool => {
    const isStrictlyRelevant = tool.category && isSimilarCategory(tool.category, categoryName);
    if (isStrictlyRelevant) {
      categoryRelevantTools.push(tool);
    } else {
      otherTools.push(tool);
    }
  });

  // Add some randomization to prevent same ordering while preserving priorities
  const addRandomization = (toolsArray: Tool[]) => {
    return toolsArray.sort((a, b) => {
      // First by priority scores (existing logic)
      const aPriority = getAIWebToolsPriorityScore(a);
      const bPriority = getAIWebToolsPriorityScore(b);
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // Then by rating
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      
      // Add subtle randomization factor (keeps similar tools somewhat randomized)
      const randomFactor = (Math.sin(a.title.length + b.title.length + Date.now()) * 0.1);
      
      // Finally by title with randomization
      return a.title.localeCompare(b.title) + randomFactor;
    });
  };

  // Apply prioritization and randomization to both groups
  const prioritizedCategoryTools = applyAIWebToolsPrioritization(addRandomization([...categoryRelevantTools]));
  const prioritizedOtherTools = applyAIWebToolsPrioritization(addRandomization([...otherTools]));
  
  // Combine: category-relevant tools first, then others
  const finalResult = [...prioritizedCategoryTools, ...prioritizedOtherTools];
  
  if (import.meta.env.DEV) console.log(`🎯 Category "${categoryName}": ${finalResult.length} total tools`);
  if (import.meta.env.DEV) console.log(`   📂 Category-relevant: ${prioritizedCategoryTools.length} tools`);
  if (import.meta.env.DEV) console.log(`   🔗 Related/other: ${prioritizedOtherTools.length} tools`);
  
  return finalResult;
};

// Cache for main category counts to avoid recomputation
let cachedMainCategoryCounts: MainCategoryCounts | null = null;
let cachedMainCategoryCountsToolsLength: number = 0;

const COUNTS_STORAGE_KEY = "awt:main-category-counts:v1";

/** Instant counts from memory or a previous visit (same tool total), else null. */
export const peekMainCategoryCounts = (tools: Tool[]): MainCategoryCounts | null => {
  if (cachedMainCategoryCounts && cachedMainCategoryCountsToolsLength === tools.length) {
    return cachedMainCategoryCounts;
  }
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(COUNTS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as { n: number; counts: MainCategoryCounts };
      if (parsed?.n === tools.length && parsed.counts) {
        cachedMainCategoryCounts = parsed.counts;
        cachedMainCategoryCountsToolsLength = tools.length;
        return parsed.counts;
      }
    }
  } catch { /* storage unavailable */ }
  return null;
};

const storeCounts = (tools: Tool[], counts: MainCategoryCounts) => {
  cachedMainCategoryCounts = counts;
  cachedMainCategoryCountsToolsLength = tools.length;
  try { localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify({ n: tools.length, counts })); } catch { /* ignore */ }
};

/**
 * Same counts as getMainCategoriesWithCounts, but yields to the browser
 * between categories so scrolling and taps never freeze while counting.
 */
export const getMainCategoriesWithCountsAsync = async (tools: Tool[]): Promise<MainCategoryCounts> => {
  const ready = peekMainCategoryCounts(tools);
  if (ready) return ready;
  const counts: MainCategoryCounts = {};
  for (const mainCat of mainCategories) {
    await new Promise<void>((resolve) => {
      const ric = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => void) | undefined;
      if (ric) ric(() => resolve(), { timeout: 300 }); else setTimeout(resolve, 16);
    });
    counts[mainCat.name] = countToolsForMainCategory(mainCat.name, tools);
  }
  storeCounts(tools, counts);
  return counts;
};

export const getMainCategoriesWithCounts = (tools: Tool[]): MainCategoryCounts => {
  const ready = peekMainCategoryCounts(tools);
  if (ready) return ready;
  const mainCategoryCounts: MainCategoryCounts = {};
  mainCategories.forEach(mainCat => {
    mainCategoryCounts[mainCat.name] = countToolsForMainCategory(mainCat.name, tools);
  });
  storeCounts(tools, mainCategoryCounts);
  return mainCategoryCounts;
};

const countToolsForMainCategory = (mainCatName: string, tools: Tool[]): number => {
  const mainCat = { name: mainCatName };
  {
    let toolCount = 0;
    
    
    switch (mainCat.name) {
      case "ALL AI TOOLS": {
        toolCount = tools.length;
        break;
      }
      case "HEALTH, WELLNESS & PERSONAL LIFESTYLE":
      case "HEALTH & WELLNESS": {
        const healthTools = tools.filter(tool => isHealthAndWellnessTool(tool));
        toolCount = healthTools.length;
        break;
      }
      case "CREATIVE & ENTERTAINMENT": {
        const creativeTools = tools.filter(tool => isCreativeAndEntertainmentTool(tool));
        toolCount = creativeTools.length;
        break;
      }
      case "GAMING & ENTERTAINMENT": {
        const gamingTools = tools.filter(tool => isGamingEntertainmentTool(tool));
        toolCount = gamingTools.length;
        break;
      }
      case "SECURITY & PRIVACY": {
        const securityTools = tools.filter(tool => isSecurityPrivacyTool(tool));
        toolCount = securityTools.length;
        break;
      }
      case "EDUCATION & LEARNING": {
        const educationTools = tools.filter(tool => isEducationRelatedTool(tool));
        toolCount = educationTools.length;
        break;
      }
      case "INDUSTRY SPECIFIC AI TOOLS": {
        const industryTools = tools.filter(tool => isIndustrySpecificTool(tool));
        toolCount = industryTools.length;
        break;
      }
      case "SPIRITUALITY & PHILOSOPHY": {
        const spiritualTools = tools.filter(tool => isSpiritualityTool(tool));
        toolCount = spiritualTools.length;
        break;
      }
      case "3D & VISUALIZATION": {
        const threeDTools = getThreeDVisualizationTools(tools);
        toolCount = threeDTools.length;
        break;
      }
      case "AUDIO & VOICE TOOLS": {
        const audioTools = getAudioMusicTools(tools);
        toolCount = audioTools.length;
        break;
      }
      case "SOUND EFFECTS & SFX": {
        const sfxTools = getSoundEffectsTools(tools);
        toolCount = sfxTools.length;
        break;
      }
      case "VIDEO & MULTIMEDIA": {
        const videoTools = getVideoMultimediaTools(tools);
        toolCount = videoTools.length;
        break;
      }
      case "IMAGE & DESIGN AI TOOLS": {
        const imageTools = getEnhancedImageDesignTools(tools);
        toolCount = imageTools.length;
        break;
      }
      case "CONTENT CREATION & WRITING": {
        const writingTools = tools.filter(tool => isWritingContentTool(tool));
        toolCount = writingTools.length;
        break;
      }
      case "CODING & DEVELOPMENT":
      case "AI DEVELOPMENT & CODING": {
        const codingTools = getCodingDevelopmentTools(tools);
        toolCount = codingTools.length;
        break;
      }
      case "MARKETING & SALES SOLUTIONS": {
        const marketingTools = getMarketingSalesToolsDirect(tools);
        toolCount = marketingTools.length;
        break;
      }
      default: {
        // Compute only this category. Previously this called the full
        // `buildToolsCache`, so counting one category swept the entire
        // ~5.4k tool database across all ~25 categories synchronously —
        // a multi-second main-thread freeze, repeated per category.
        toolCount = buildSingleCategoryTools(mainCat.name, tools).length;
        break;
      }
    }

    return toolCount;
  }
};

// Cache for getToolsByMainCategory results
let toolsByCategoryCache: Map<string, Tool[]> = new Map();
let toolsByCategoryCacheToolsLength: number = 0;

export const getToolsByMainCategory = (tools: Tool[], mainCategoryName: string): Tool[] => {
  // Check cache first (invalidate if tools array changed)
  if (toolsByCategoryCacheToolsLength === tools.length) {
    const cached = toolsByCategoryCache.get(mainCategoryName);
    if (cached) return cached;
  } else {
    // Tools changed, clear cache
    toolsByCategoryCache.clear();
    toolsByCategoryCacheToolsLength = tools.length;
  }
  
  let categoryTools: Tool[] = [];
  
  // Perplexity Bots — AIWebTools.ai Perplexity Project editions
  if (mainCategoryName === "PERPLEXITY BOTS") {
    categoryTools = tools.filter(tool =>
      (tool.category || "").toLowerCase() === "perplexity bots" ||
      tool.title.toUpperCase().includes("PERPLEXITY BOT")
    );
  }

  else // CORRECTED handling for Health, Wellness & Personal Lifestyle
  if (mainCategoryName === "HEALTH, WELLNESS & PERSONAL LIFESTYLE" || mainCategoryName === "HEALTH & WELLNESS") {
    categoryTools = tools.filter(tool => isHealthAndWellnessTool(tool));
  }
  
  // CORRECTED handling for Creative & Entertainment
  else if (mainCategoryName === "CREATIVE & ENTERTAINMENT") {
    categoryTools = tools.filter(tool => isCreativeAndEntertainmentTool(tool));
  }
  
  // Enhanced handling for Gaming & Entertainment
  else if (mainCategoryName === "GAMING & ENTERTAINMENT") {
    categoryTools = tools.filter(tool => isGamingEntertainmentTool(tool));
  }
  
  // Enhanced handling for Security & Privacy
  else if (mainCategoryName === "SECURITY & PRIVACY") {
    categoryTools = tools.filter(tool => isSecurityPrivacyTool(tool));
  }
  
  // Enhanced handling for 3D & Visualization
  else if (mainCategoryName === "3D & VISUALIZATION") {
    categoryTools = getThreeDVisualizationTools(tools);
  }
  
  // Enhanced handling for Audio & Voice Tools
  else if (mainCategoryName === "AUDIO & VOICE TOOLS") {
    categoryTools = getAudioMusicTools(tools);
  }
  
  // Enhanced handling for Sound Effects & SFX
  else if (mainCategoryName === "SOUND EFFECTS & SFX") {
    categoryTools = getSoundEffectsTools(tools);
  }
  
  // Enhanced handling for Video & Multimedia
  else if (mainCategoryName === "VIDEO & MULTIMEDIA") {
    categoryTools = getVideoMultimediaTools(tools);
  }
  
  // Enhanced handling for Image & Design
  else if (mainCategoryName === "IMAGE & DESIGN AI TOOLS") {
    categoryTools = getEnhancedImageDesignTools(tools);
  }
  
  // Enhanced handling for Content Creation & Writing
  else if (mainCategoryName === "CONTENT CREATION & WRITING") {
    categoryTools = tools.filter(tool => isWritingContentTool(tool));
  }
  
  // Enhanced handling for Coding & Development
  else if (mainCategoryName === "CODING & DEVELOPMENT" || mainCategoryName === "AI DEVELOPMENT & CODING") {
    categoryTools = getCodingDevelopmentTools(tools);
  }
  
  // Enhanced handling for Marketing & Sales
  else if (mainCategoryName === "MARKETING & SALES SOLUTIONS") {
    categoryTools = getMarketingSalesToolsDirect(tools);
  }
  
  // Enhanced handling for Education & Learning
  else if (mainCategoryName === "EDUCATION & LEARNING") {
    categoryTools = tools.filter(tool => isEducationRelatedTool(tool));
  }
  
  // Enhanced handling for Spirituality & Philosophy
  else if (mainCategoryName === "SPIRITUALITY & PHILOSOPHY") {
    categoryTools = tools.filter(tool => isSpiritualityTool(tool));
  }
  
  // Enhanced handling for Industry Specific
  else if (mainCategoryName === "INDUSTRY SPECIFIC AI TOOLS") {
    categoryTools = tools.filter(tool => isIndustrySpecificTool(tool));
  }
  
  // ALL AI TOOLS - return everything
  else if (mainCategoryName === "ALL AI TOOLS") {
    categoryTools = [...tools];
  }
  
  else {
    // Compute only the requested category instead of sweeping all ~25.
    categoryTools = buildSingleCategoryTools(mainCategoryName, tools);
    if (categoryTools.length === 0) return [];
  }
  
  // Priority sorting and interleaving
  const sortedByDirectCategory = sortToolsByDirectCategoryMatch(categoryTools, mainCategoryName);
  const interleavedTools = interleaveAIWebToolsGPTs(sortedByDirectCategory);
  
  // Cache result
  toolsByCategoryCache.set(mainCategoryName, interleavedTools);
  
  return interleavedTools;
};

// Helper function to interleave AI Web Tools GPTs after every 2 category tools
// ONLY injects GPTs that are already matched to this category - no random GPT injection
const interleaveAIWebToolsGPTs = (categoryTools: Tool[]): Tool[] => {
  // Separate GPTs that are IN THIS CATEGORY from other category tools
  const gptsInCategory: Tool[] = [];
  const nonGPTsInCategory: Tool[] = [];
  
  categoryTools.forEach(tool => {
    if (isAIWebToolsGPT(tool)) {
      gptsInCategory.push(tool);
    } else {
      nonGPTsInCategory.push(tool);
    }
  });
  
  if (import.meta.env.DEV) console.log(`🔄 Interleaving: ${nonGPTsInCategory.length} category tools + ${gptsInCategory.length} AI Web Tools GPTs available for injection`);
  
  // If no GPTs in this category, just return category tools as-is
  if (gptsInCategory.length === 0) {
    return categoryTools;
  }
  
  // If no non-GPT tools, return the category tools as-is
  if (nonGPTsInCategory.length === 0) {
    return categoryTools;
  }
  
  // Interleave: 2 category tools, then 1 GPT from THIS category, repeat
  const result: Tool[] = [];
  let categoryIndex = 0;
  let gptIndex = 0;
  
  while (categoryIndex < nonGPTsInCategory.length) {
    // Add 2 category tools
    for (let i = 0; i < 2 && categoryIndex < nonGPTsInCategory.length; i++) {
      result.push(nonGPTsInCategory[categoryIndex]);
      categoryIndex++;
    }
    
    // Add 1 GPT from this category (if available)
    if (gptIndex < gptsInCategory.length) {
      result.push(gptsInCategory[gptIndex]);
      gptIndex++;
    }
  }
  
  // Add any remaining GPTs at the end
  while (gptIndex < gptsInCategory.length) {
    result.push(gptsInCategory[gptIndex]);
    gptIndex++;
  }
  
  if (import.meta.env.DEV) console.log(`✅ Interleaved result: ${result.length} tools (${gptIndex} GPTs injected)`);
  
  return result;
};

// Helper function to prioritize tools whose category directly matches the main category name
const sortToolsByDirectCategoryMatch = (tools: Tool[], mainCategoryName: string): Tool[] => {
  // Extract key terms from the main category name for matching
  const categoryKeywords = mainCategoryName.toLowerCase().split(/[\s&]+/).filter(w => w.length > 2);
  
  // Separate tools into direct matches and related tools
  const directMatches: Tool[] = [];
  const relatedTools: Tool[] = [];
  
  tools.forEach(tool => {
    const toolCategory = (tool.category || '').toLowerCase();
    
    // Check if the tool's category directly contains the main category keywords
    const isDirectMatch = categoryKeywords.some(keyword => 
      toolCategory.includes(keyword) || 
      (keyword === 'video' && toolCategory.includes('video')) ||
      (keyword === 'multimedia' && toolCategory.includes('multimedia')) ||
      (keyword === 'image' && toolCategory.includes('image')) ||
      (keyword === 'design' && toolCategory.includes('design')) ||
      (keyword === 'audio' && toolCategory.includes('audio')) ||
      (keyword === 'voice' && toolCategory.includes('voice')) ||
      (keyword === 'education' && toolCategory.includes('education')) ||
      (keyword === 'learning' && toolCategory.includes('learning')) ||
      (keyword === 'business' && toolCategory.includes('business')) ||
      (keyword === 'marketing' && toolCategory.includes('marketing')) ||
      (keyword === 'data' && toolCategory.includes('data')) ||
      (keyword === 'analytics' && toolCategory.includes('analytics'))
    );
    
    if (isDirectMatch) {
      directMatches.push(tool);
    } else {
      relatedTools.push(tool);
    }
  });
  
  if (import.meta.env.DEV) console.log(`📂 Direct category matches: ${directMatches.length}, Related: ${relatedTools.length}`);
  
  // Return direct matches first, then related tools
  return [...directMatches, ...relatedTools];
};
