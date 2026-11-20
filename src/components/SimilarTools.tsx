
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Tool } from "@/types/tools";
import ToolCard from "@/components/tools/ToolCard";
import { directoryNameKey } from "@/utils/directoryIntegrity";
import { allTools } from "@/data/toolsData";
// Removed embla carousel in favor of reliable native scrolling
import { getContextAwareAdditionalTools, getHighlyRelevantSimilarTools } from "@/utils/contextAwareSimilarTools";

interface SimilarToolsProps {
  currentTool: Tool;
  currentToolIndex: number;
}

const SimilarTools = ({ currentTool, currentToolIndex }: SimilarToolsProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Build a stable, infinite recommendation list:
  // 1) Top relevant similar tools first (up to 24)
  // 2) Then fill with the rest of the catalog (deduped, excluding current tool)
  const fullList = useMemo(() => {
    const top = getHighlyRelevantSimilarTools(currentTool, 24);
    const seen = new Set<string>([directoryNameKey(currentTool.title)]);
    return [...top, ...allTools].filter(tool => {
      const key = directoryNameKey(tool.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [currentTool, currentToolIndex]);

  const PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(Math.min(PAGE, fullList.length));

  useEffect(() => {
    setVisibleCount(Math.min(PAGE, fullList.length));
  }, [fullList]);

  const visible = useMemo(() => fullList.slice(0, visibleCount), [fullList, visibleCount]);

  // Infinite scroll: when the user scrolls near the right edge, load more.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const remaining = el.scrollWidth - (el.scrollLeft + el.clientWidth);
    if (remaining < 600 && visibleCount < fullList.length) {
      setVisibleCount(c => Math.min(c + PAGE, fullList.length));
    }
  }, [visibleCount, fullList.length]);

  if (fullList.length === 0) return null;

  return (
    <section className="mt-16" aria-label="Recommended similar AI tools">
      <h2 className="text-2xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8 cyber-glow">
        Recommended Similar Tools
      </h2>

      <div className="relative">
        {/* touch-action: pan-x pan-y allows both horizontal carousel AND vertical page scroll */}
        <div 
          className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-1" 
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ 
            touchAction: 'pan-x pan-y',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
          {visible.map((tool, index) => (
            <div key={`sim-${tool.title}-${index}`} className="snap-start shrink-0 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <ToolCard tool={tool} index={index} />
            </div>
          ))}
        </div>
        {/* Nav buttons */}
        <button
          type="button"
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -window.innerWidth * 0.6, behavior: 'smooth' });
            handleScroll();
          }}
          className="flex absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-cyan-500/40 text-cyan-200 bg-black/60 hover:bg-black/80 shadow-lg backdrop-blur-sm"
          aria-label="Scroll recommendations left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => {
            // Pre-emptively load more so the next click always reveals new tools.
            if (visibleCount < fullList.length) {
              setVisibleCount(c => Math.min(c + PAGE, fullList.length));
            }
            requestAnimationFrame(() => {
              scrollRef.current?.scrollBy({ left: window.innerWidth * 0.6, behavior: 'smooth' });
            });
          }}
          className="flex absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-cyan-500/40 text-cyan-200 bg-black/60 hover:bg-black/80 shadow-lg backdrop-blur-sm"
          aria-label="Scroll recommendations right"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default SimilarTools;
