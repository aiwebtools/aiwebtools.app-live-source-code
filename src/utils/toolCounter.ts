import { TOTAL_TOOLS, TOTAL_TOOL_CATEGORIES, MARKETING_TOOL_COUNT } from '@/data/generated/toolCount';

// Keep the first paint path tiny. Importing the full tool database and all
// integrity/category verifiers here was blocking the homepage lazy route for
// many seconds before React could mount. The browser gets a fast static count;
// heavyweight audits are loaded dynamically only when explicitly requested.
// Auto-generated at build time from the real database (see scripts/generate-sitemap.ts)
const FAST_TOOL_TOTAL = TOTAL_TOOLS;

const getFastCountResult = () => ({
  exactTotal: FAST_TOOL_TOTAL,
  marketingNumber: MARKETING_TOOL_COUNT,
  totalTools: FAST_TOOL_TOTAL,
  categoryBreakdown: {},
  mainCategoryCounts: { 'ALL AI TOOLS': FAST_TOOL_TOTAL },
  categoriesCount: TOTAL_TOOL_CATEGORIES,
  rawToolsCount: FAST_TOOL_TOTAL,
  removedByDeduplication: 0,
  preservationScore: 100,
  criticalToolsStatus: [],
  missingTools: 0,
});

export const getToolCount = () => getFastCountResult();

export const getToolCountAudit = async () => {
  // Non-browser / debug path keeps the full integrity verification for deep audits
  const [
    { getAllToolCategories },
    { deduplicateTools },
    { trackToolChanges },
    { runIntegrityCheck },
    { getMainCategoriesWithCounts },
    { allTools },
    { runFullToolVerification },
  ] = await Promise.all([
    import('@/data/toolsCollection'),
    import('@/utils/toolDeduplication'),
    import('@/utils/toolChangeTracker'),
    import('@/utils/toolIntegrityChecker'),
    import('@/utils/categoryUtils/toolFiltering'),
    import('@/data/toolsData'),
    import('@/utils/toolPreservationVerifier'),
  ]);

  // Track changes before counting
  trackToolChanges('tool_count_check');
  
  const allToolsFromCollection = getAllToolCategories();
  console.log(`🔍 RAW TOOLS FROM COLLECTION: ${allToolsFromCollection.length}`);
  
  // Use ultra conservative deduplication
  const deduplicatedTools = deduplicateTools(allToolsFromCollection);
  
  console.log(`🎯 TOOL COUNT PRESERVATION ANALYSIS:`);
  console.log(`📊 Raw tools from collection: ${allToolsFromCollection.length}`);
  console.log(`📊 After ultra conservative deduplication: ${deduplicatedTools.length}`);
  console.log(`📊 Tools removed by deduplication: ${allToolsFromCollection.length - deduplicatedTools.length}`);
  
  // Run comprehensive tool preservation verification
  console.log(`\n🔍 RUNNING COMPREHENSIVE TOOL PRESERVATION VERIFICATION...`);
  const preservationReport = runFullToolVerification();
  
  // Get main category counts using the EXACT same logic as the website
  const mainCategoryCounts = getMainCategoriesWithCounts(allTools);
  
  console.log(`🎉 TOOL COUNT STATUS REPORT 🎉`);
  console.log(`📊 EXACT Tool Count: ${deduplicatedTools.length}`);
  console.log(`📊 allTools count: ${allTools.length}`);
  console.log(`📊 Should be 1100+: ${allTools.length >= 1100 ? '✅ YES' : '❌ NO'}`);
  console.log(`🎯 Preservation Score: ${preservationReport.integrityScore.toFixed(1)}/100`);
  
  // Check consistency between different counts
  console.log(`🔍 CONSISTENCY CHECK:`);
  console.log(`   Collection tools (deduplicated): ${deduplicatedTools.length}`);
  console.log(`   allTools count: ${allTools.length}`);
  console.log(`   Preservation report final tools: ${preservationReport.totalToolsInAllTools}`);
  console.log(`   All counts match: ${deduplicatedTools.length === allTools.length && allTools.length === preservationReport.totalToolsInAllTools ? '✅' : '❌'}`);
  
  if (allTools.length !== preservationReport.totalToolsInAllTools) {
    console.warn(`⚠️ MISMATCH DETECTED! allTools has ${allTools.length} but preservation report shows ${preservationReport.totalToolsInAllTools}`);
  }
  
  // Critical tool verification
  const missingCriticalTools = preservationReport.criticalTools.filter(t => t.status === 'missing');
  if (missingCriticalTools.length > 0) {
    console.error(`🚨 CRITICAL: ${missingCriticalTools.length} critical AI Web Tools GPTs are missing!`);
    missingCriticalTools.forEach(tool => {
      console.error(`   ❌ Missing: "${tool.title}"`);
    });
  } else {
    console.log(`✅ All critical AI Web Tools GPTs are preserved!`);
  }
  
  // If we're under 1100, something is wrong
  if (allTools.length < 1100) {
    console.error(`🚨 CRITICAL: Tool count is ${allTools.length} but should be 1100+!`);
    console.error(`🚨 Tools may have been lost during processing!`);
    console.error(`🚨 Preservation score: ${preservationReport.integrityScore.toFixed(1)}/100`);
  } else {
    console.log(`🎉 SUCCESS: Tool count is ${allTools.length} which meets the 1100+ requirement!`);
  }
  
  // Run enhanced integrity check
  console.log('\n🔍 RUNNING ENHANCED INTEGRITY CHECK...');
  runIntegrityCheck();
  
  return {
    exactTotal: allTools.length, // Use allTools.length as the authoritative count
    marketingNumber: `${(Math.floor(allTools.length / 100) * 100).toLocaleString('en-US')}+`,
    totalTools: allTools.length,
    categoryBreakdown: preservationReport.categoryDistribution,
    mainCategoryCounts,
    categoriesCount: Object.keys(preservationReport.categoryDistribution).length,
    rawToolsCount: allToolsFromCollection.length,
    removedByDeduplication: allToolsFromCollection.length - deduplicatedTools.length,
    preservationScore: preservationReport.integrityScore,
    criticalToolsStatus: preservationReport.criticalTools,
    missingTools: preservationReport.missingTools.length
  };
};

// Export a function to get the current accurate count for use in components
export const getCurrentToolCount = (): { total: number; marketing: string; categories: number; mainCategoryCounts: Record<string, number> } => {
  const result = getToolCount();
  return {
    total: result.exactTotal,
    marketing: result.marketingNumber,
    categories: result.categoriesCount,
    mainCategoryCounts: result.mainCategoryCounts
  };
};

// Export helper to track changes during tool additions
export const trackToolAddition = (operation: string, additionFn: () => void) => {
  console.log(`🔄 TRACKING TOOL ADDITION: ${operation}`);
  import('@/utils/toolChangeTracker')
    .then(({ trackToolChanges }) => trackToolChanges(`before_${operation}`))
    .catch(() => {});

  additionFn();

  Promise.all([
    import('@/utils/toolChangeTracker'),
    import('@/utils/toolPreservationVerifier'),
  ]).then(([{ trackToolChanges }, { runQuickToolVerification }]) => {
    trackToolChanges(`after_${operation}`);
    console.log(`✅ TOOL ADDITION TRACKING COMPLETE: ${operation}`);
    console.log(`🔍 Running post-addition verification...`);
    runQuickToolVerification();
  }).catch(() => {});
};

// Export comprehensive verification function
export const verifyAllToolsPreservation = async () => {
  console.log(`🔍 COMPREHENSIVE TOOL PRESERVATION CHECK INITIATED...`);
  const { runFullToolVerification } = await import('@/utils/toolPreservationVerifier');
  return runFullToolVerification();
};

