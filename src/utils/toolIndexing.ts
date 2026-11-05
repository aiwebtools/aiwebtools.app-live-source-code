
import { allTools } from "@/data/toolsData";
import { Tool } from "@/types/tools";
import { aiWebToolsGPTs } from "@/data/tools/aiWebTools/aiWebToolsGPTs";

// Verify all tools have proper indexing and can be found
export const verifyToolIndexing = () => {
  console.log(`🔍 Verifying indexing for ${allTools.length} total tools...`);
  console.log(`🎯 AI Web Tools GPTs available: ${aiWebToolsGPTs.length}`);
  
  // Check for recently added tools specifically
  const recentlyAddedTools = [
    'AI TOOL EXPERT',
    'King Blueberry GPT',
    'CT MMP Data Explorer',
    'AI LANGUAGE TRANSLATOR GPT',
    'Creative Logo Assistant',
    'AD Maker GPT4o Image GPT',
    'This Day in History GPT',
    'VIRTUAL TRY ON STYLIST GPT',
    'SHOPPING GPT',
    'COMMERCIAL SCENE IMAGE GENERATOR GPT',
    'SCREENPLAY WRITER GPT',
    'Business Analyst GPT'
  ];
  
  const indexingReport = {
    totalTools: allTools.length,
    aiWebToolsGPTs: aiWebToolsGPTs.length,
    aiWebToolsInAllTools: 0,
    toolsWithCategories: 0,
    toolsWithDirectUrls: 0,
    toolsWithTags: 0,
    toolsWithDescriptions: 0,
    categoriesFound: new Set<string>(),
    duplicateTitles: new Map<string, number>(),
    indexingIssues: [] as string[],
    missingAiWebToolsGPTs: [] as string[],
    recentlyAddedToolsFound: [] as string[]
  };
  
  // Check how many AI Web Tools GPTs are actually in allTools
  const aiWebToolTitles = new Set(aiWebToolsGPTs.map(t => t.title));
  
  allTools.forEach((tool, index) => {
    // Check if this is an AI Web Tools GPT
    if (aiWebToolTitles.has(tool.title) || tool.directUrl?.includes('lovable.app')) {
      indexingReport.aiWebToolsInAllTools++;
    }

    // Check for recently added tools
    if (recentlyAddedTools.includes(tool.title)) {
      indexingReport.recentlyAddedToolsFound.push(tool.title);
    }

    // Check for essential properties
    if (tool.category) {
      indexingReport.toolsWithCategories++;
      indexingReport.categoriesFound.add(tool.category);
    } else {
      indexingReport.indexingIssues.push(`Tool ${index}: "${tool.title}" missing category`);
    }

    if (tool.directUrl) {
      indexingReport.toolsWithDirectUrls++;
    }

    if (tool.tags && tool.tags.length > 0) {
      indexingReport.toolsWithTags++;
    }

    if (tool.description && tool.description.trim().length > 0) {
      indexingReport.toolsWithDescriptions++;
    } else {
      indexingReport.indexingIssues.push(`Tool ${index}: "${tool.title}" missing description`);
    }

    // Check for duplicate titles
    const titleCount = indexingReport.duplicateTitles.get(tool.title) || 0;
    indexingReport.duplicateTitles.set(tool.title, titleCount + 1);
  });

  // Find missing AI Web Tools GPTs
  aiWebToolsGPTs.forEach(gpt => {
    const foundInAllTools = allTools.some(tool => tool.title === gpt.title);
    if (!foundInAllTools) {
      indexingReport.missingAiWebToolsGPTs.push(gpt.title);
    }
  });

  // Report duplicates
  indexingReport.duplicateTitles.forEach((count, title) => {
    if (count > 1) {
      indexingReport.indexingIssues.push(`Duplicate tool title found: "${title}" (${count} times)`);
    }
  });

  console.log('📊 Tool Indexing Report:', {
    ...indexingReport,
    categoriesFound: Array.from(indexingReport.categoriesFound).sort(),
    duplicateTitles: undefined // Don't log the full map
  });

  console.log('✅ Recently added tools found:', indexingReport.recentlyAddedToolsFound);

  if (indexingReport.missingAiWebToolsGPTs.length > 0) {
    console.error('❌ Missing AI Web Tools GPTs from allTools:', indexingReport.missingAiWebToolsGPTs);
  }

  if (indexingReport.aiWebToolsInAllTools < aiWebToolsGPTs.length) {
    console.warn(`⚠️ Only ${indexingReport.aiWebToolsInAllTools} of ${aiWebToolsGPTs.length} AI Web Tools GPTs found in allTools`);
  } else {
    console.log(`✅ All ${aiWebToolsGPTs.length} AI Web Tools GPTs are properly indexed!`);
  }

  return indexingReport;
};

// Generate URLs for all tool pages to ensure they're properly accessible
export const generateToolPageUrls = (): string[] => {
  return allTools.map((tool, index) => `/tool/${index}`);
};

// Verify that each tool can be found by search
export const verifyToolSearchability = (searchFunction: (tools: Tool[], term: string) => Tool[]) => {
  console.log('🔍 Verifying tool searchability...');
  
  const searchTests = [
    // Test exact title matches for AI Web Tools GPTs
    'TIME MACHINE GPT',
    'BOOK WRITER GPT',
    'G-Mode GPT',
    'Movie Maker Studio',
    // Test category searches
    'AI Assistants',
    'Image Generation',
    'Business Tools',
    'Writing',
    // Test common keywords
    'chat',
    'image',
    'video',
    'business',
    'design'
  ];

  const searchResults = searchTests.map(term => ({
    term,
    results: searchFunction(allTools, term),
    resultCount: searchFunction(allTools, term).length
  }));

  console.log('🔍 Search Test Results:', searchResults);
  
  return searchResults;
};

// Check tool page accessibility
export const checkToolPageAccessibility = () => {
  const toolUrls = generateToolPageUrls();
  console.log(`📄 Generated ${toolUrls.length} tool page URLs`);
  console.log('📄 Sample URLs:', toolUrls.slice(0, 10));
  
  return {
    totalPages: toolUrls.length,
    sampleUrls: toolUrls.slice(0, 10),
    allUrls: toolUrls
  };
};

// Main verification function
export const runFullToolVerification = (searchFunction: (tools: Tool[], term: string) => Tool[]) => {
  console.log('🚀 Running full tool verification...');
  
  const indexingReport = verifyToolIndexing();
  const searchabilityReport = verifyToolSearchability(searchFunction);
  const accessibilityReport = checkToolPageAccessibility();
  
  const summary = {
    indexing: indexingReport,
    searchability: searchabilityReport,
    accessibility: accessibilityReport,
    overallHealth: {
      toolsIndexed: indexingReport.totalTools,
      aiWebToolsGPTsIndexed: indexingReport.aiWebToolsInAllTools,
      aiWebToolsGPTsTotal: indexingReport.aiWebToolsGPTs,
      categoriesAvailable: indexingReport.categoriesFound.size,
      toolsWithIssues: indexingReport.indexingIssues.length,
      pagesGenerated: accessibilityReport.totalPages
    }
  };
  
  console.log('✅ Full Verification Complete:', summary.overallHealth);
  
  return summary;
};

// Verify featured tools specifically
export const verifyFeaturedToolsContent = (featuredTools: Tool[]) => {
  console.log(`🎯 Verifying featured tools content - Total: ${featuredTools.length}`);
  
  const aiWebToolsInFeatured = featuredTools.filter(tool => 
    tool.directUrl?.includes('lovable.app') || 
    aiWebToolsGPTs.some(gpt => gpt.title === tool.title)
  );
  
  console.log(`🚀 AI Web Tools GPTs in featured: ${aiWebToolsInFeatured.length} of ${aiWebToolsGPTs.length}`);
  console.log(`📋 Featured AI Web Tools GPT titles:`, aiWebToolsInFeatured.slice(0, 20).map(t => t.title));
  
  const appKey = (u?: string) => (u || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split(/[/?#]/)[0];
  const featuredKeys = new Set(featuredTools.map(t => appKey(t.directUrl)));
  const missingFromFeatured = aiWebToolsGPTs.filter(gpt => 
    !featuredTools.some(featured => featured.title === gpt.title) &&
    !(gpt.directUrl && featuredKeys.has(appKey(gpt.directUrl)))
  );
  
  if (missingFromFeatured.length > 0) {
    console.warn(`❌ Missing from featured tools:`, missingFromFeatured.slice(0, 10).map(t => t.title));
  }
  
  return {
    totalFeatured: featuredTools.length,
    aiWebToolsInFeatured: aiWebToolsInFeatured.length,
    aiWebToolsTotal: aiWebToolsGPTs.length,
    missingCount: missingFromFeatured.length,
    missingTitles: missingFromFeatured.map(t => t.title)
  };
};
