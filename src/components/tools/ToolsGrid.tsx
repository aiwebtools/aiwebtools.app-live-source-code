import React, { useMemo, memo, useEffect, useRef } from "react";
import { Tool } from "@/types/tools";
import ToolCard from "@/components/tools/ToolCard";
import SimilarToolsRecommendation from "@/components/tools/SimilarToolsRecommendation";
import SeeMoreCategoriesButton from "@/components/tools/SeeMoreCategoriesButton";
// NOTE: never statically import allTools-backed utils here — it pulls the whole
// 5,600-tool database into every route chunk that renders a grid.

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// Regular import instead of lazy loading to prevent module loading errors
import VirtualizedToolsGrid from "./VirtualizedToolsGrid";

interface ToolsGridProps {
  tools: Tool[];
  displayedCount: number;
  selectedCategory: string | null;
  searchTerm: string;
  onLoadMore: () => void;
  hasInfiniteScroll?: boolean;
  isLoading?: boolean;
  onCategoryChange?: (category: string) => void;
  isFilterSearch?: boolean;
  filteredToolsCount?: number; // Number of tools from selected categories (before recommendations)
}

const ToolsGrid = memo(({ 
  tools, 
  displayedCount, 
  selectedCategory, 
  searchTerm, 
  onLoadMore,
  hasInfiniteScroll = false,
  isLoading = false,
  onCategoryChange,
  isFilterSearch = false,
  filteredToolsCount = 0
}: ToolsGridProps) => {
  // Memoize expensive calculations - simplified for performance
  const { 
    displayTools, 
    shouldShowSimilar, 
    similarTools, 
    hasMoreTools,
    categoriesWithCounts,
    shouldShowCategoriesButton
  } = useMemo(() => {
    const displayTools = tools.slice(0, displayedCount);
    const shouldShowSimilar = false; // Disabled for performance
    const similarTools = []; // Disabled for performance
    
    const hasMoreTools = displayedCount < tools.length;
    const categoriesWithCounts = {}; // Simplified for performance
    const shouldShowCategoriesButton = false; // Disabled for performance
    
    return {
      displayTools,
      shouldShowSimilar,
      similarTools,
      hasMoreTools,
      categoriesWithCounts,
      shouldShowCategoriesButton
    };
  }, [tools, displayedCount, searchTerm, selectedCategory]);

  // Enable infinite scroll when hasInfiniteScroll is true
  const { handleLoadMore } = useInfiniteScroll({
    isLoading,
    showLoadMoreButton: false, // Never show manual buttons
    displayedCount,
    totalTools: tools.length,
    onLoadMore,
    searchTerm,
    selectedCategory,
    enableInfiniteScroll: hasInfiniteScroll
  });

  // IntersectionObserver sentinel is the primary trigger. It routes through the
  // hook's guarded loader so it can never double-fire alongside the scroll
  // fallback, and it is not re-created on every isLoading flip.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef(handleLoadMore);
  loadMoreRef.current = handleLoadMore;
  useEffect(() => {
    if (!hasInfiniteScroll || displayedCount >= tools.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMoreRef.current();
    }, { root: null, rootMargin: '1500px', threshold: 0 }); // Trigger 1500px before visible
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasInfiniteScroll, displayedCount, tools.length]);

  const getSectionTitle = useMemo(() => {
    if (selectedCategory) {
      return <>🎯 <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">{selectedCategory}</span></>;
    }
    if (searchTerm) {
      return <>🔍 <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">Search Results for "{searchTerm}"</span></>;
    }
    return <>🚀 <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">AI TOOLS COLLECTION</span></>;
  }, [selectedCategory, searchTerm]);

  // Create a stable key for each tool to prevent React reconciliation issues
  const toolsWithStableKeys = useMemo(() => {
    return displayTools.map((tool, index) => ({
      ...tool,
      stableKey: `${tool.title}-${tool.directUrl || tool.category}`
    }));
  }, [displayTools]);

  if (toolsWithStableKeys.length === 0) {
    return searchTerm ? (
      <div role="status" className="mx-auto max-w-xl px-4 py-12 text-center text-cyan-100" data-search-results>
        <p className="text-lg font-semibold">Showing 0 tools matching "{searchTerm}"</p>
        <p className="mt-2 text-sm text-gray-300">No tools here match every word of your search. Try fewer or different words.</p>
      </div>
    ) : null;
  }

  // Always use virtualized grid for maximum performance - simplified
  const useVirtualization = true;

  return (
    <>
      {/* Show title for search results and categories */}
      {(selectedCategory || searchTerm) && (
        <div className="text-center mb-8 sm:mb-12 px-4" data-search-results>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-100 mb-6 sm:mb-8 cyber-glow">
            {getSectionTitle}
          </h3>
          {searchTerm && (
            <p className="text-gray-300 text-sm">
              Showing {displayTools.length} of {tools.length} {tools.length === 1 ? 'tool' : 'tools'} matching "{searchTerm}"
              {tools.length > displayTools.length && " • Scroll down to load the rest"}
            </p>
          )}
          {selectedCategory && !searchTerm && (
            <p className="text-gray-300 text-sm">
              Exploring {selectedCategory} - endless AI tools await! Keep scrolling for automatic discovery.
            </p>
          )}
        </div>
      )}

      {/* Show title for main page only when not at the beginning */}
      {(!selectedCategory && !searchTerm && displayedCount > 12) && (
        <div className="text-center mb-8 sm:mb-12 px-4" data-search-results>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-100 mb-6 sm:mb-8 cyber-glow">
            {getSectionTitle}
          </h3>
          <p className="text-gray-300 text-sm">
            Scroll down to discover more amazing AI tools!
          </p>
        </div>
      )}

      {/* Direct VirtualizedToolsGrid without Suspense */}
      {useVirtualization ? (
        <VirtualizedToolsGrid
          tools={tools}
          displayedCount={displayedCount}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          filteredToolsCount={filteredToolsCount}
        />
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-0 efficient-grid" 
          style={{ 
            contain: 'layout style',
            contentVisibility: 'auto',
            containIntrinsicSize: '300px 400px'
          }}
        >
          {toolsWithStableKeys.map((tool, index) => (
            <ToolCard key={tool.stableKey} tool={tool} index={index} />
          ))}
        </div>
      )}

      {/* Only show similar tools on homepage, not on category pages */}
      {!searchTerm && !selectedCategory && (
        <SimilarToolsRecommendation 
          similarTools={similarTools}
          originalCount={tools.length}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Only show categories button on homepage */}
      {shouldShowCategoriesButton && onCategoryChange && (
        <SeeMoreCategoriesButton 
          categoriesWithCounts={categoriesWithCounts}
          onCategoryChange={onCategoryChange}
        />
      )}

      {/* Smooth loading indicator for infinite scroll */}
      {hasInfiniteScroll && isLoading && (
        <div className="text-center mt-8 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <span className="text-cyan-200 text-lg">
              {searchTerm ? `Loading more search results...` : selectedCategory ? `Auto-loading more AI tools...` : `Loading more amazing AI tools...`}
            </span>
          </div>
        </div>
      )}

      {/* Show completion message only for search results that have ended */}
      {hasInfiniteScroll && !hasMoreTools && !isLoading && searchTerm && tools.length > 15 && (
        <div className="text-center mt-12 py-8 text-cyan-300">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-lg font-semibold mb-2">
            You've seen all {tools.length} tools matching "{searchTerm}"!
          </div>
          <div className="text-sm opacity-80">
            Try a different search term to discover more tools.
          </div>
        </div>
      )}

      {/* Endless scroll encouragement for categories (no end message ever) */}
      {hasInfiniteScroll && selectedCategory && !searchTerm && displayTools.length > 100 && !isLoading && (
        <div className="text-center mt-12 py-8 text-cyan-300">
          <div className="text-2xl mb-2">🌟</div>
          <div className="text-lg font-semibold mb-2">
            Amazing! You're discovering our endless AI tools collection.
          </div>
          <div className="text-sm opacity-80">
            Keep scrolling - we automatically load similar tools and related categories!
          </div>
        </div>
      )}

      {/* COMPLETELY DISABLE MANUAL LOAD MORE BUTTONS - Use infinite scroll or featured button only */}

      {hasInfiniteScroll && (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // A same-length filter/shuffle can contain completely different tools. Use
  // array identity so React never preserves stale/repeated cards.
  return (
    prevProps.tools === nextProps.tools &&
    prevProps.displayedCount === nextProps.displayedCount &&
    prevProps.selectedCategory === nextProps.selectedCategory &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.filteredToolsCount === nextProps.filteredToolsCount
  );
});

ToolsGrid.displayName = "ToolsGrid";

export default ToolsGrid;
