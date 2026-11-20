// Real-catalog regression: run with bunx vite-node scripts/check-directory-integrity.ts.
import assert from "node:assert/strict";
import { allTools, directoryTools } from "../src/data/toolsData";
import { TOTAL_TOOLS, MAIN_CATEGORY_COUNTS } from "../src/data/generated/toolCount";
import { mainCategories } from "../src/utils/mainCategoryMapping";
import { directoryNameKey, belongsToDirectoryCategory, filterDirectoryTools, sortDirectoryAlphabetically, uniqueDirectoryTools } from "../src/utils/directoryIntegrity";
import { getCategoriesWithCounts, getToolsByCategory, getToolsByMainCategory } from "../src/utils/categoryUtils/toolFiltering";
import { getToolPricing } from "../src/utils/pricingClassification";
import { perplexityBotsBatch2026 } from "../src/data/tools/perplexityBotsBatch2026";

assert.equal(allTools.length, 5563, "preserve every original lookup record");
assert.equal(directoryTools.length, 5437, "one listing per established normalized name");
assert.equal(TOTAL_TOOLS, directoryTools.length);
assert.equal(new Set(directoryTools.map(tool => directoryNameKey(tool.title))).size, directoryTools.length);
for (const category of mainCategories) {
  const results = getToolsByMainCategory(directoryTools, category.name);
  assert.equal(results.length, MAIN_CATEGORY_COUNTS[category.name], category.name);
  assert.ok(results.every(tool => belongsToDirectoryCategory(tool, category.name)), category.name);
}
for (const [name, count] of Object.entries(getCategoriesWithCounts(directoryTools))) {
  assert.equal(getToolsByCategory(directoryTools, name).length, count, name);
}
assert.equal(uniqueDirectoryTools(perplexityBotsBatch2026).length, MAIN_CATEGORY_COUNTS["PERPLEXITY BOTS"]);
const images = getToolsByMainCategory(directoryTools, "IMAGE & DESIGN AI TOOLS");
for (const title of ["🐾Veterinarian GPT", "Activepieces", "Medical Chat", "Voiceflow", "Course Maker GPT", "FramePack"]) {
  assert.ok(allTools.some(tool => tool.title === title), `${title} retained`);
  assert.ok(!images.some(tool => tool.title === title), `${title} excluded from image category`);
}
assert.ok(images.some(tool => tool.title === "Midjourney"));
assert.equal(filterDirectoryTools(directoryTools, "zzzxnonexistenttool").length, 0);
const claude = filterDirectoryTools(directoryTools, "Claude");
assert.ok(claude.length > 0 && claude.length < directoryTools.length);
assert.equal(claude.filter(tool => directoryNameKey(tool.title) === "claude").length, 1);
const free = filterDirectoryTools(directoryTools, "", true);
assert.ok(free.length > 0 && free.length < directoryTools.length);
assert.ok(free.every(tool => getToolPricing(tool) === "free"));
const sorted = sortDirectoryAlphabetically(directoryTools);
assert.equal(sorted.length, directoryTools.length);
for (let i = 1; i < sorted.length; i++) {
  assert.ok(directoryNameKey(sorted[i - 1].title).localeCompare(directoryNameKey(sorted[i].title), "en", { sensitivity: "base", numeric: true }) <= 0, `alphabetical position ${i}`);
}
console.log(`Directory integrity verified: ${allTools.length} preserved records, ${directoryTools.length} unique listings, ${images.length} image tools, ${free.length} free tools; all ${mainCategories.length} main counts and subcategory counts agree.`);