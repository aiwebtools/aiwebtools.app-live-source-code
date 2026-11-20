import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";
import SEOHead from "@/components/SEOHead";
import ToolsGridSkeleton from "@/components/tools/ToolsGridSkeleton";
import MinimalToolCard from "@/components/MinimalToolCard";
import ToolsGrid from "@/components/tools/ToolsGrid";
import SearchBar from "@/components/tools/SearchBar";
import MainCategoryFilter from "@/components/category/MainCategoryFilter";
import { Button } from "@/components/ui/button";
import { filterDirectoryTools } from "@/utils/directoryIntegrity";
import { MARKETING_TOOL_COUNT } from "@/data/generated/toolCount";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { Tool } from "@/types/tools";

const PAGE_TITLE = "ALL AI TOOLS";

const AllToolsFastPage = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [displayedCount, setDisplayedCount] = useState(48);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [sortedTools, setSortedTools] = useState<Tool[]>([]);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo({ top: 0, behavior: "auto" });

    requestAnimationFrame(() => {
      Promise.all([
        import("@/data/toolsData"),
        import("@/utils/category/categoryOrdering"),
      ])
        .then(([{ directoryTools: allTools }, { orderCategoryTools }]) => {
          if (cancelled) return;
          // Dedupe + GPT-first deterministic ordering, same as every other category page.
          setTools(orderCategoryTools(allTools, PAGE_TITLE));
          setIsReady(true);
          window.dispatchEvent(new Event("aiwt:page-data-ready"));
        })
        .catch((error) => {
          if (!cancelled) console.error("Failed to load all tools", error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const matchingTools = useMemo(() => filterDirectoryTools(tools, searchTerm, showFreeOnly), [tools, searchTerm, showFreeOnly]);
  const displayedTools = useMemo(() => sortedTools.slice(0, displayedCount), [sortedTools, displayedCount]);
  const handleFilteredToolsChange = useCallback((filtered: Tool[]) => {
    setSortedTools(filtered);
    setDisplayedCount(48);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || displayedCount >= sortedTools.length) return;
    setIsLoadingMore(true);
    requestAnimationFrame(() => {
      setDisplayedCount((count) => Math.min(count + 48, sortedTools.length));
      setIsLoadingMore(false);
    });
  }, [displayedCount, isLoadingMore, sortedTools.length]);

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <SEOHead
        title="ALL AI TOOLS - Complete AI Tools Directory"
        description={`Browse the complete AIWebTools.ai directory of ${MARKETING_TOOL_COUNT} AI Tools, searchable and categorized for fast discovery.`}
        keywords={["all ai tools", `${MARKETING_TOOL_COUNT} AI Tools`, "ai tools directory", "AIWebTools.ai"]}
      />

      <div className="relative z-10 cyber-grid">
        <Header />

        <main className="container mx-auto px-4 py-8 pt-32 md:pt-36 lg:pt-40">
          <BreadcrumbNav items={[{ label: PAGE_TITLE, emoji: "🌟" }]} className="mb-4" />

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gray-800/60 text-gray-400 border border-gray-600/30 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-200"
            >
              ← Back
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🌟</div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent cyber-glow">
              {PAGE_TITLE}
            </h1>
            <p className="text-base text-gray-300 mb-4 max-w-xl mx-auto">
              Complete collection of all AI tools and platforms available in our directory.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-6">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} preventAutoNavigation />
          </div>

          <div className="flex justify-center mb-4">
            <Button variant={showFreeOnly ? "default" : "outline"} aria-pressed={showFreeOnly}
              onClick={() => setShowFreeOnly(value => !value)}>
              🆓 {showFreeOnly ? "Showing FREE Tools Only" : "Show FREE Tools Only"}
            </Button>
          </div>
          {isReady && <MainCategoryFilter tools={matchingTools} currentMainCategory={PAGE_TITLE}
            onFilteredToolsChange={handleFilteredToolsChange} />}

          {!isReady ? (
            <ToolsGridSkeleton count={12} />
          ) : (
            <>
              <div className="text-center mb-8">
                <div role="status" aria-label="Tool results count" className="text-cyan-400 font-semibold">
                  Showing {displayedTools.length} of {sortedTools.length} tools{displayedTools.length < sortedTools.length ? " — scroll for more" : ""}
                </div>
              </div>

              <div id="tools-section">
                {sortedTools.length === 0 ? <div role="status" className="py-16 text-center text-muted-foreground">
                  <h2 className="text-2xl font-bold text-foreground">No AI tools found</h2>
                  {searchTerm.trim() && <p className="mt-4">No matches for “{searchTerm.trim()}”.</p>}
                </div> : <ToolsGrid
                  tools={sortedTools}
                  displayedCount={displayedCount}
                  selectedCategory={null}
                  searchTerm={searchTerm}
                  onLoadMore={handleLoadMore}
                  hasInfiniteScroll
                  isLoading={isLoadingMore}
                />}

                {displayedCount < sortedTools.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-6 py-3 font-bold text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-60"
                    >
                      {isLoadingMore ? "Loading…" : "Load More AI Tools"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="container mx-auto flex justify-center px-4 py-10">
            <DownloadLibraryButton />
          </div>
        </main>

        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default AllToolsFastPage;