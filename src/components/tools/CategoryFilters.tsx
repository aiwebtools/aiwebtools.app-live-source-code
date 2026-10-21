
import React, { useState, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchBar from "@/components/tools/SearchBar";
import CategoryViewToggle from "@/components/tools/CategoryViewToggle";
import MainCategoriesView from "@/components/tools/MainCategoriesView";
import SubcategoriesView from "@/components/tools/SubcategoriesView";
import AllToolsButton from "@/components/tools/AllToolsButton";
import { 
  getCachedCategoryCounts 
} from "@/utils/categoryUtils/precomputedCache";
import { allTools } from "@/data/toolsData";
import { mainCategories } from "@/utils/mainCategoryMapping";
import { getMainCategoriesWithCountsAsync, peekMainCategoryCounts } from "@/utils/categoryUtils/toolFiltering";

interface CategoryFiltersProps {
  categoriesWithCounts: Record<string, number>;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
  showFreeOnly?: boolean;
  onFreeOnlyChange?: (freeOnly: boolean) => void;
}

// Counts come from the instant cache when available; otherwise they are
// computed in small idle slices so the page never freezes while scrolling.
const getInstantMainCategoryCounts = (): Record<string, number> | null => {
  const cached = getCachedCategoryCounts();
  if (cached && Object.keys(cached).length > 0) return cached;
  return peekMainCategoryCounts(allTools);
};

const CategoryFilters = memo(({
  categoriesWithCounts,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  searchTerm,
  showFreeOnly = false,
  onFreeOnlyChange
}: CategoryFiltersProps) => {
  const [viewMode, setViewMode] = useState<'main' | 'sub'>('main');
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);

  // Use pre-computed counts - INSTANT, no heavy computation
  const [staticMainCategoriesWithCounts, setStaticCounts] = useState<Record<string, number>>(
    () => getInstantMainCategoryCounts() ?? {}
  );
  useEffect(() => {
    if (Object.keys(staticMainCategoriesWithCounts).length > 0) return;
    let alive = true;
    void getMainCategoriesWithCountsAsync(allTools).then((counts) => { if (alive) setStaticCounts(counts); });
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalTools = Object.values(categoriesWithCounts).reduce((sum, count) => sum + count, 0);

  const handleCategorySelect = (category: string | null) => {
    onCategoryChange(category);
  };

  const handleMainCategoryNavigate = (category: string | null) => {
    // For main category grid, we navigate to dedicated main-category pages.
    // Avoid triggering heavy homepage filtering here to keep navigation INSTANT.
    console.log('📂 Main category selected for navigation:', category);
  };

  const handleBackToMain = () => {
    setSelectedMainCategory(null);
    setViewMode('main');
  };

  const handleSubCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <div className="mb-8">
      {/* Search Bar - Optimized for instant response */}
      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          preventAutoNavigation={true}
        />
      </div>

      {/* FREE Tools Toggle */}
      {onFreeOnlyChange && (
        <div className="flex justify-center mb-4">
          <Button
            onClick={() => onFreeOnlyChange(!showFreeOnly)}
            variant={showFreeOnly ? "default" : "outline"}
            className={`${
              showFreeOnly 
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:from-yellow-500 hover:to-yellow-700" 
                : "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
            } transition-all duration-200`}
          >
            <span className="mr-2">🆓</span>
            {showFreeOnly ? "Showing FREE Tools Only" : "Show FREE Tools Only"}
          </Button>
        </div>
      )}

      {/* View Toggle */}
      <CategoryViewToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {/* All Tools Button */}
      <AllToolsButton
        selectedCategory={selectedCategory}
        totalTools={totalTools}
        onCategoryChange={handleCategorySelect}
      />

      {/* Categories Section */}
      <div className="mb-4">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          className="w-full text-cyan-300 hover:text-cyan-100 mb-4"
        >
          <span className="text-lg font-semibold">
            {viewMode === 'main' ? '📁 Browse Main Categories' : '🗂️ Browse All SubCategories'}
          </span>
          {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>

        {isExpanded && (
          <div className="space-y-4">
            {viewMode === 'main' ? (
              <MainCategoriesView
                mainCategoryCounts={staticMainCategoriesWithCounts}
                onMainCategoryClick={handleMainCategoryNavigate}
              />
            ) : (
              <SubcategoriesView
                selectedMainCategory={selectedMainCategory}
                selectedCategory={selectedCategory}
                categoriesWithCounts={categoriesWithCounts}
                onBackToMain={handleBackToMain}
                onSubCategoryClick={handleSubCategoryClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CategoryFilters.displayName = "CategoryFilters";

export default CategoryFilters;
