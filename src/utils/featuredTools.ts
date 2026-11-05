import { Tool } from "@/types/tools";
import { aiWebToolsGPTs } from "@/data/tools/aiWebTools/aiWebToolsGPTs";
import { applyAIWebToolsPrioritization } from "@/utils/aiWebToolsPrioritization";
import { TIER_1_LEGENDARY_GPTS, TIER_2_PROFESSIONAL_GPTS, TIER_3_SPECIALIST_GPTS } from "@/utils/gptPowerRanking";

export const createFeaturedTools = (allTools: Tool[]): Tool[] => {
  console.log(`🔍 Creating featured tools from ${allTools.length} total tools`);
  console.log(`🎯 AI Web Tools GPTs available in source: ${aiWebToolsGPTs.length}`);
  
  // Tools to exclude from featured sections but keep in database (not our designs)
  const excludedFromFeatured = ['bolt.new', 'gemini'];
  
  // Verify bolt.new and gemini are still searchable in main database
  const boltTool = allTools.find(tool => tool.title.toLowerCase().includes('bolt.new'));
  const geminiTool = allTools.find(tool => tool.title.toLowerCase().includes('gemini'));
  
  console.log(`🔍 Verification - bolt.new searchable: ${!!boltTool}`);
  console.log(`🔍 Verification - gemini searchable: ${!!geminiTool}`);
  
  if (!boltTool) console.warn('⚠️ bolt.new not found in searchable database!');
  if (!geminiTool) console.warn('⚠️ gemini not found in searchable database!');
  
  console.log(`🚀 POWER RANKING SYSTEM ACTIVE:`);
  console.log(`👑 TIER 1 Legendary GPTs (${TIER_1_LEGENDARY_GPTS.length}):`, TIER_1_LEGENDARY_GPTS.slice(0, 5));
  console.log(`💼 TIER 2 Professional GPTs (${TIER_2_PROFESSIONAL_GPTS.length}):`, TIER_2_PROFESSIONAL_GPTS.slice(0, 5));
  console.log(`🎯 TIER 3 Specialist GPTs (${TIER_3_SPECIALIST_GPTS.length}):`, TIER_3_SPECIALIST_GPTS.slice(0, 5));
  
  // Filter function to exclude specific tools from featured but keep in database
  const isExcludedFromFeatured = (tool: Tool): boolean => {
    const toolTitle = tool.title.toLowerCase();
    return excludedFromFeatured.some(excluded => 
      toolTitle.includes(excluded.toLowerCase()) ||
      tool.directUrl?.toLowerCase().includes(excluded.toLowerCase())
    );
  };
  
  // Find ALL AI Web Tools GPTs (our creations) - these MUST appear in featured sections
  const aiWebToolsGPTsInMain = allTools.filter(tool => 
    !isExcludedFromFeatured(tool) && // Exclude bolt.new and gemini from featured
    (aiWebToolsGPTs.some(awTool => awTool.title === tool.title) ||
     tool.category === 'Perplexity Bots' ||
     tool.category === 'Custom Gemini Gems' ||
     tool.directUrl?.includes('lovable.app'))
  );
  
  console.log(`🎯 AI Web Tools GPTs found for featured: ${aiWebToolsGPTsInMain.length}`);
  
  // Find legendary GPTs for verification
  const legendaryGPTsFound = aiWebToolsGPTsInMain.filter(tool => 
    TIER_1_LEGENDARY_GPTS.some(legendary => tool.title.includes(legendary))
  );
  
  console.log(`👑 Legendary GPTs found in featured: ${legendaryGPTsFound.length}`);
  console.log(`🚀 Top Legendary GPTs:`, legendaryGPTsFound.slice(0, 10).map(t => t.title));
  
  // Ensure we have ALL AI Web Tools GPTs
  // Match by title or the same live app address: duplicates merge under the
  // catalog's spelling (e.g. "Trivia Night GPT"), which is still featured.
  const appKey = (u?: string) => (u || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split(/[/?#]/)[0];
  const featuredKeys = new Set(aiWebToolsGPTsInMain.map(t => appKey(t.directUrl)));
  const missingFromFeatured = aiWebToolsGPTs.filter(gpt => 
    !aiWebToolsGPTsInMain.some(tool => tool.title === gpt.title) &&
    !(gpt.directUrl && featuredKeys.has(appKey(gpt.directUrl))) &&
    !isExcludedFromFeatured(gpt)
  );
  
  if (missingFromFeatured.length > 0) {
    console.warn(`⚠️ Missing AI Web Tools GPTs from featured:`, missingFromFeatured.slice(0, 10).map(t => t.title));
  }
  
  // ONLY show AI Web Tools GPTs (our creations) in featured section with POWER-BASED prioritization
  const allFeaturedTools = applyAIWebToolsPrioritization(aiWebToolsGPTsInMain);
  
  console.log(`🚀 PORTFOLIO SHOWCASE: ${aiWebToolsGPTsInMain.length} AI Web Tools GPTs in featured section`);
  console.log(`📊 Total featured tools: ${allFeaturedTools.length}`);
  console.log(`👑 LEGENDARY GPTs dominate the top positions!`);
  console.log(`🎬 Priority GPTs with videos/images appear first within each power tier!`);
  console.log(`✅ bolt.new and gemini excluded from featured but remain searchable`);
  
  // Show top 15 featured tools to verify power ranking is working
  console.log(`🔥 TOP 15 FEATURED TOOLS (Power Ranked):`, 
    allFeaturedTools.slice(0, 15).map((t, i) => `${i+1}. ${t.title}`));
  
  // Final verification that bolt.new and gemini are searchable but not featured
  const featuredBolt = allFeaturedTools.find(tool => tool.title.toLowerCase().includes('bolt.new'));
  const featuredGemini = allFeaturedTools.find(tool => tool.title.toLowerCase().includes('gemini'));
  
  console.log(`🔍 FINAL CHECK - bolt.new in featured: ${!!featuredBolt} (should be false)`);
  console.log(`🔍 FINAL CHECK - gemini in featured: ${!!featuredGemini} (should be false)`);
  console.log(`🔍 FINAL CHECK - bolt.new searchable in main DB: ${!!boltTool} (should be true)`);
  console.log(`🔍 FINAL CHECK - gemini searchable in main DB: ${!!geminiTool} (should be true)`);
  
  return allFeaturedTools;
};
