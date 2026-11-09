import React from "react";
import { useFeaturedToolsState } from "@/hooks/useFeaturedToolsState";
import { useMobile } from "@/hooks/useMobile";
import CategoryFilters from "@/components/tools/CategoryFilters";
import ToolsGrid from "@/components/tools/ToolsGrid";
import { useMemo } from "react";

const SearchPortal = () => {
  const {
    selectedCategory,
    searchTerm,
    displayedCount,
    isLoading,
    showFreeOnly,
    setDisplayedCount,
    setIsLoading,
    handleCategoryChange,
    handleSearchChange,
    handleFreeOnlyChange,
    filteredTools,
    totalToolsCount,
    categoriesWithCounts,
    hasMoreTools
  } = useFeaturedToolsState();

  const { isMobile } = useMobile();

  // Load more (must set isLoading synchronously so IntersectionObserver/scroll can't spam)
  const handleLoadMore = useMemo(
    () => () => {
      if (isLoading || !hasMoreTools) return;

      setIsLoading(true);

      // Reduce batch size on mobile for smoother performance
      const batchSize = isMobile ? 30 : 60;

      // Use shorter delay on mobile to feel more responsive
      const delay = isMobile ? 50 : 100;

      window.setTimeout(() => {
        setDisplayedCount((prev) => prev + batchSize);
        setIsLoading(false);
      }, delay);
    },
    [isLoading, hasMoreTools, isMobile, setIsLoading, setDisplayedCount]
  );

  const displayedTools = useMemo(() => 
    filteredTools.slice(0, displayedCount),
    [filteredTools, displayedCount]
  );

  // Convert categoriesWithCounts to the format expected by CategoryFilters
  const categoriesRecord = categoriesWithCounts.reduce((acc, cat) => {
    acc[cat.name] = cat.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-transparent relative">
      {/* Category Filters with Search */}
      <CategoryFilters
        categoriesWithCounts={categoriesRecord}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        showFreeOnly={showFreeOnly}
        onFreeOnlyChange={handleFreeOnlyChange}
      />

      {/* Tools Count Display */}
      <div className="text-center mb-8">
        <div className="text-cyan-400 font-semibold text-lg">
          {searchTerm ? (
            `${totalToolsCount} AI tools found for "${searchTerm}"`
          ) : selectedCategory ? (
            `${totalToolsCount} tools in ${selectedCategory}`
          ) : (
            `Discover ${totalToolsCount.toLocaleString()} curated AI tools`
          )}
        </div>
        {!searchTerm && !selectedCategory && (
          <div className="text-gray-400 text-sm mt-1">
            Featuring the best AI tools, ChatGPT alternatives, and cutting-edge artificial intelligence solutions
          </div>
        )}
      </div>

      {/* Tools Grid */}
      <div id="tools-section">
        {displayedTools.length > 0 ? (
          <ToolsGrid
            tools={filteredTools}
            displayedCount={displayedCount}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onLoadMore={handleLoadMore}
            hasInfiniteScroll={true}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-cyan-100 mb-4">No AI tools found</h3>
            <p className="text-gray-300 mb-8">
              {searchTerm 
                ? `No AI tools found for "${searchTerm}". Try a different search term.`
                : selectedCategory
                ? `No tools found in the ${selectedCategory} category.`
                : "No tools available at the moment."
              }
            </p>
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why Choose AI WEB TOOLS
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">🏆 Comprehensive Directory</h3>
              <p>A broad, curated catalog of AI tools with detailed descriptions and category filtering.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">✅ Expert Curation</h3>
              <p>Tools are manually reviewed and organized so you can find what fits your workflow.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">🔄 Always Updated</h3>
              <p>Regular updates as new AI tools launch so the directory stays current.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">👥 Built for Everyone</h3>
              <p>Useful for professionals, developers, creators, and businesses exploring AI tools.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SearchPortal;