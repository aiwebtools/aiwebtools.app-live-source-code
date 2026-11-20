import React, { memo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tool } from "@/types/tools";
import { Card, CardContent } from "@/components/ui/card";
import { generateToolSlug } from "@/utils/urlGenerator";
import { prefetchToolData } from "@/utils/toolPrefetcher";
import { isFreeTool } from "@/utils/freeToolDetection";
import { getToolPricing, getPricingLabel } from "@/utils/pricingClassification";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import AutoScaleTitle from "@/components/ui/auto-scale-title";
import ToolThumb from "@/components/tools/ToolThumb";

interface MinimalToolCardProps {
  tool: Tool;
  index?: number;
}

const MinimalToolCard = memo(({ tool, index = 0 }: MinimalToolCardProps) => {
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isCustomGPT = isFreeTool(tool);
  const isAIWebToolsOriginal = isCustomGPT;
  const pricing = getToolPricing(tool);
  const pricingLabel = getPricingLabel(pricing);

  const previewDescription = (() => {
    const description = tool.description?.trim() || "Powerful AI tool for enhanced productivity.";
    if (description.length <= 220) return description;
    const truncated = description.slice(0, 220);
    const lastSpace = truncated.lastIndexOf(" ");
    return `${truncated.slice(0, lastSpace > 150 ? lastSpace : 220)}...`;
  })();
  
  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      prefetchToolData(tool.title);
    }, 100);
  }, [tool.title]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);
  
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    const slug = generateToolSlug(tool.title);
    navigate(`/${slug}`, {
      state: {
        instantTool: {
          title: tool.title,
          category: tool.category,
          description: tool.description,
          directUrl: tool.directUrl,
          imageUrl: typeof tool.imageUrl === "string" ? tool.imageUrl : undefined,
          videoUrl: tool.videoUrl,
          emoji: tool.emoji,
          color: tool.color,
          rating: tool.rating,
          totalVotes: tool.totalVotes,
          tags: Array.isArray(tool.tags) ? tool.tags.slice(0, 24) : [],
          isFree: tool.isFree,
        },
      },
    });
  };

  return (
    <Card 
      className="group h-full overflow-hidden cursor-pointer hover:shadow-lg transition-colors duration-150 border-gray-800 bg-gray-900/50 hover:bg-gray-800/70 relative"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Open ${tool.title} details`}
    >
      <FavoriteButton tool={tool} size="sm" className="top-2 right-2 z-30" />
      
      <div className="absolute top-0 left-0 z-20">
        <div
          className={`px-2 py-1 rounded-br-lg rounded-tl-lg text-xs font-bold shadow-lg ${
            pricing === "free"
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
              : pricing === "freemium"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              : "bg-gradient-to-r from-gray-600 to-gray-800 text-white"
          }`}
        >
          {pricingLabel}
        </div>
      </div>
      
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <ToolThumb tool={tool} className="w-full h-full" rounded="rounded-none" emojiClassName="text-4xl" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 
              className="font-bold text-foreground mb-2 break-words line-clamp-2 min-h-12 text-base leading-6"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
                wordBreak: 'break-word'
              }}
            >
              <AutoScaleTitle title={tool.title} baseSize="sm" />
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-4 min-h-[5rem] sm:min-h-[5.5rem]">
              {previewDescription}
            </p>
            {tool.category && (
              <div className="mt-2.5">
                <span className="inline-block max-w-full px-2.5 py-1 text-[11px] bg-gray-800 text-gray-300 rounded break-words">
                  {tool.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MinimalToolCard.displayName = "MinimalToolCard";

export default MinimalToolCard;