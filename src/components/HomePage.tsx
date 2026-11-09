
import { useEffect, useMemo } from "react";
import { useFeaturedToolsState } from "@/hooks/useFeaturedToolsState";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobile } from "@/hooks/useMobile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollToTop from "@/components/ui/scroll-to-top";
import EnhancedSEOHead from "@/components/seo/EnhancedSEOHead";
import GoogleRankingBooster from "@/components/seo/GoogleRankingBooster";
import CategoryFilters from "@/components/tools/CategoryFilters";
import ToolsGrid from "@/components/tools/ToolsGrid";
import { runFullToolVerification } from "@/utils/toolIndexing";
import { searchTools } from "@/utils/searchUtils";
import dualityLight from "@/assets/balance-of-duality-light.png";
import dualityDark from "@/assets/balance-of-duality-dark.png";
import dualityMatrix from "@/assets/balance-of-duality-matrix.png";
import dualityPath from "@/assets/balance-of-duality-path.png";

const HomePage = () => {
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
  const { 
    enableReducedMotion, 
    createThrottledScrollHandler,
    measurePerformance 
  } = usePerformanceOptimization();

  // Run tool verification lazily in the background ONLY once per session for SEO
  useEffect(() => {
    let idleId: number | null = null;

    const runVerification = () => {
      try {
        measurePerformance("tool-verification", () => {
          runFullToolVerification(searchTools);
        });
      } catch (e) {
        console.error("Tool verification failed", e);
      }
    };

    // Defer to idle time so it NEVER blocks initial render/navigation
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(runVerification, { timeout: 10000 });
    } else {
      // Fallback: run once after a delay without blocking initial paint
      setTimeout(runVerification, 10000);
    }

    return () => {
      if (idleId !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
    };
  }, [measurePerformance]);

  // Optimized load more with performance considerations
  const handleLoadMore = useMemo(() => 
    createThrottledScrollHandler(() => {
      if (isLoading || !hasMoreTools) return;

      // Instant append — no artificial delay, no loading flash. The grid is
      // virtualized, so a larger batch costs nothing extra to render.
      // Keep each React commit below a frame budget. The sentinel loads early,
      // so small batches remain visually continuous without mounting 120 cards
      // in one scroll frame.
      const batchSize = isMobile ? 24 : 36;
      setDisplayedCount(prev => prev + batchSize);
    }), 
    [createThrottledScrollHandler, isLoading, hasMoreTools, isMobile, setIsLoading, setDisplayedCount]
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

  // Memoized component structure for better performance
  const backgroundComponent = useMemo(() => 
    enableReducedMotion ? null : <AnimatedBackground />,
    [enableReducedMotion]
  );

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

      {/* Duality Images Section - directly under "Why AI WEB TOOLS..." */}
      <section aria-labelledby="duality-title" className="mt-8 max-w-6xl mx-auto">
        <h3 id="duality-title" className="sr-only">The Balance of Duality</h3>
        <figure className="bg-gray-900/40 rounded-xl p-4 md:p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <img
              src={dualityLight}
              alt="The Balance of Duality - Matrix of Light diagram showing inner cosmos and two paths"
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <img
              src={dualityDark}
              alt="The Balance of Duality - Middle path artwork with light vs dark symbolism"
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <img
              src={dualityMatrix}
              alt="The Balance of Duality - Your Inner Cosmos flowchart and binary code background"
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <img
              src={dualityPath}
              alt="The Path of Duality - consequence and light vs dark choice diagram"
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href="https://worldresourceclock.lovable.app/?via=aiwebtools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
              </svg>
              <span>Keep an Eye on the Natural Resources Clock</span>
            </a>
          </div>
          <figcaption className="text-center mt-4 text-sm md:text-base text-gray-300">
            The truth of our matrix of light and the spiritual test of two paths.
            <span className="block mt-1 text-cyan-300 font-medium">— <span className="bg-gradient-to-r from-yellow-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-black text-xl tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]">KGB</span>, Maker of this AI Web Tools page</span>
          </figcaption>
        </figure>
      </section>
    </div>
  );
};

export default HomePage;
