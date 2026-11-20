import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getToolCategoryColor } from "@/utils/search/categoryColors";
import { generateToolSlug } from "@/utils/urlGenerator";
import { getToolImage, getToolImageMapSync, onToolImageMapReady } from "@/utils/search/toolImageMap";
interface GlobalSearchResultsProps {
  searchResults: any[];
  displayedCount: number;
  isLoadingMore: boolean;
  directMatchCount?: number; // How many are direct matches vs recommendations
  onToolClick: (tool: any) => void;
  onDirectAccess: (tool: any, e: React.MouseEvent) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const GlobalSearchResults = ({
  searchResults,
  displayedCount,
  isLoadingMore,
  directMatchCount = searchResults.length,
  onToolClick,
  onDirectAccess,
  onScroll,
}: GlobalSearchResultsProps) => {
  const displayedResults = searchResults.slice(0, displayedCount);
  const hasMoreToLoad = displayedCount < searchResults.length || isLoadingMore;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageMap, setImageMap] = useState<Map<string, string> | null>(() => getToolImageMapSync());

  useEffect(() => {
    if (imageMap) return;
    return onToolImageMapReady(setImageMap);
  }, [imageMap]);
  
  // Track if we've passed direct matches into recommendations
  const showingRecommendations = displayedCount > directMatchCount;
  const directMatchesDisplayed = Math.min(displayedCount, directMatchCount);
  const recommendationsDisplayed = Math.max(0, displayedCount - directMatchCount);

  // Keep scroll at top when new search results load
  useEffect(() => {
    if (scrollRef.current && displayedResults.length > 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [searchResults]);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        data-scroll-container
        className="absolute top-full left-0 right-0 mt-2 bg-black border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 z-[9999] max-h-[60vh] overflow-y-scroll overflow-x-hidden rounded-lg" 
        onScroll={onScroll}
        style={{ 
          maxHeight: 'min(60vh, 60dvh)',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(6 182 212 / 0.5) rgb(31 41 55)',
          cursor: 'grab',
          pointerEvents: 'auto',
        }}
      >
        <div className="p-0" style={{ transform: 'translateZ(0)' }}>
        <div className="p-2 pt-4" style={{ transform: 'translateZ(0)' }}>
          {displayedResults.map((tool, index) => {
            const isRecommendation = index >= directMatchCount;
            
            // Show separator before first recommendation
            const showSeparator = index === directMatchCount && directMatchCount > 0;
            
            // Get category-based color coding
            const categoryStyle = getToolCategoryColor(tool);
            
            const toolPath = tool?.title ? `/${generateToolSlug(tool.title)}` : "/main-category/ALL%20AI%20TOOLS";
            const heroImage = getToolImage(tool, imageMap);

            const toolItem = (
              <div
                role="button"
                tabIndex={0}
                data-tool-title={tool.title}
                aria-label={`Open ${tool.title}`}
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-cyan-500/10 cursor-pointer group border border-transparent hover:border-cyan-500/30 ${isRecommendation ? 'opacity-90' : ''}`}
                onClick={() => { if (tool.isCategory && tool.path) { window.location.href = tool.path; } else { onToolClick(tool); } }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToolClick(tool);
                  }
                }}
                style={{ transform: 'translateZ(0)', touchAction: 'pan-y' }}
              >
                <div className="flex min-w-0 flex-1 items-center space-x-3" data-tool-path={toolPath}>
                  {/* Category color-coded icon */}
                  <div 
                    className={`relative overflow-hidden w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${categoryStyle.bg} ${categoryStyle.border} border flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow-lg ${categoryStyle.glow} group-hover:scale-110`}
                    style={{ transition: 'none' }}
                  >
                    <span aria-hidden="true">{categoryStyle.icon}</span>
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={`${tool.title} AI tool thumbnail`}
                        loading={index < 12 ? "eager" : "lazy"}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        width={40}
                        height={40}
                        className="absolute inset-0 h-full w-full rounded-lg object-cover"
                        onError={(event) => {
                          // Reveal this tool's category icon instead of replacing every
                          // failed image with the same generic AI Web Tools artwork.
                          event.currentTarget.hidden = true;
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-cyan-100 text-xs sm:text-sm leading-tight mb-1 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    {tool.category && (
                      <p className="text-xs text-cyan-400/70 truncate">
                        <span className="mr-1">{categoryStyle.icon}</span>
                        {tool.category}
                      </p>
                    )}
                  </div>
                </div>
                
                {tool.directUrl && (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-green-400/50 bg-green-400/10 text-green-300 hover:bg-green-400/20 hover:border-green-400 text-xs px-2 py-1 h-auto flex-shrink-0"
                    aria-label={`Open ${tool.title} provider website in a new tab`}
                    title={`Open ${tool.title} provider website`}
                    onClick={(e) => onDirectAccess(tool, e)}
                  >
                    🚀
                  </Button>
                )}
              </div>
            );

            return (
              <div key={`global-search-${tool.title}-${index}`}>
                {/* Separator between direct matches and recommendations */}
                {showSeparator && (
                  <div className="my-4 py-4 border-t border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5">
                    <div className="text-center">
                      <div className="text-xl mb-2">✨</div>
                      <div className="text-cyan-300 font-semibold text-sm">
                        End of {directMatchCount} <span className="text-cyan-100">DIRECT</span> matching results
                      </div>
                      <div className="text-cyan-400/70 text-xs mt-1">
                        🚀 Discover more indirect matching AI tool suggestions below
                      </div>
                    </div>
                  </div>
                )}
                
                <div data-testid="global-search-result" data-tool-title={tool.title}>
                  {toolItem}
                </div>
              </div>
            );
          })}
          
          {/* Loading more indicator - always show when there's more to load */}
          {(hasMoreToLoad || isLoadingMore) && (
            <div className="text-center py-4 text-cyan-400/70 text-sm">
              {isLoadingMore ? (
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="ml-2">
                    {showingRecommendations ? 'Loading more AI tools...' : 'Loading more matches...'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-pulse">📜 Scroll down for more amazing AI tools</div>
                  <div className="text-xs text-cyan-300/60">
                    {displayedCount < directMatchCount 
                      ? `${directMatchCount - displayedCount} more matches in this search`
                      : 'Explore more AI tools from our database'
                    }
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* No results message */}
          {searchResults.length === 0 && (
            <div className="text-center py-8 text-cyan-400/70 text-sm">
              <div className="text-3xl mb-3">🔍</div>
              <div className="font-semibold mb-2">No exact matches found</div>
              <div className="text-xs text-cyan-400/50">Try different keywords or check spelling</div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Arrow Scroller Buttons - Hidden on mobile, only show on desktop */}
    {searchResults.length > 5 && (
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-col space-y-1 z-[60] hidden md:flex">
        <Button
          onClick={scrollToTop}
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-black/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          onClick={scrollToBottom}
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-black/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    )}
  </div>
  );
};

export default GlobalSearchResults;
