
import React, { memo, useMemo, useCallback, useRef, useState } from "react";
import { Tool } from "@/types/tools";
import { Card } from "@/components/ui/card";
import { useMobile } from "@/hooks/useMobile";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { prefetchToolData } from "@/utils/toolPrefetcher";
import { isFreeTool } from "@/utils/freeToolDetection";
import { trackToolClickEvent } from "@/hooks/useToolAnalytics";
import { requiresAgeVerification, isAgeVerified } from "@/utils/ageVerification";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import ToolCardHeader from "./ToolCardHeader";
import ToolCardContent from "./ToolCardContent";
import FavoriteButton from "@/components/favorites/FavoriteButton";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

// Memoized ToolCard for performance with large lists
const ToolCard = memo(({ tool, index = 0 }: ToolCardProps) => {
  const { isMobile, isTouch } = useMobile();
  const { enableReducedMotion, getOptimizedStyles } = usePerformanceOptimization();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const pendingUrlRef = useRef<string | null>(null);
  
  // Determine if this is a FREE custom GPT using centralized detection
  const isCustomGPT = useMemo(() => isFreeTool(tool), [tool]);
  
  const isAIWebToolsOriginal = isCustomGPT;
  
  // Check if tool requires age verification
  const needsAgeGate = useMemo(() => requiresAgeVerification(tool), [tool]);
  
  // Prefetch tool detail page on hover (100ms delay to avoid unnecessary prefetches)
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
  
  // Handle age verification success
  const handleAgeVerified = useCallback(() => {
    setShowAgeModal(false);
    if (pendingUrlRef.current) {
      console.log('✅ Age verified - proceeding to:', pendingUrlRef.current);
      trackToolClickEvent(tool.title, tool.category);
      createTimePortalEffect(pendingUrlRef.current, tool.title);
      pendingUrlRef.current = null;
    }
  }, [tool.title, tool.category]);
  
  // Handle card click - trigger time warp effect for external tools
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
      return;
    }
    
    // If tool has external URL, check age verification first
    if (tool.directUrl) {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if age verification is required
      if (needsAgeGate && !isAgeVerified()) {
        console.log('🔞 Age verification required for:', tool.title);
        pendingUrlRef.current = tool.directUrl;
        setShowAgeModal(true);
        return;
      }
      
      console.log('🌀 Tool card clicked - triggering time warp for:', tool.title);
      // Track click analytics
      trackToolClickEvent(tool.title, tool.category);
      createTimePortalEffect(tool.directUrl, tool.title);
    }
  };
  
  // Dynamic sizing based on featured status and mobile optimization
  const isFeatured = index < 12; // First 12 tools are considered featured
  const cardSize = isMobile 
    ? (isFeatured ? "w-12 h-12" : "w-10 h-10") // Smaller on mobile
    : (isFeatured ? "w-16 h-16" : "w-12 h-12");
  const titleSize = isMobile 
    ? (isFeatured ? "text-base" : "text-sm") // Smaller text on mobile
    : (isFeatured ? "text-lg sm:text-xl" : "text-base sm:text-lg");
  const buttonSize = isFeatured ? "default" : "sm";
  const imageHeight = isMobile 
    ? (isFeatured ? "160px" : "140px") // Smaller images on mobile
    : (isFeatured ? "200px" : "160px");
  
  // Enhanced rating calculation
  const baseRating = tool.rating || 4.2;
  const boostedRating = baseRating;
  const defaultVotes = tool.totalVotes || (isAIWebToolsOriginal ? 847 : 324);

  // Description function
  const getDescription = () => {
    if (!tool.description) return "Powerful AI tool for enhanced productivity.";
    
    const maxLength = isFeatured ? 180 : 140;
    if (tool.description.length <= maxLength) return tool.description;
    
    const truncated = tool.description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  // Memoized optimized styles
  const optimizedStyles = useMemo(() => {
    const styles = getOptimizedStyles();
    return {
      ...styles,
      // Optimize rendering with contain property
      contain: 'layout style paint' as const,
      // Avoid rendering offscreen content until needed
      contentVisibility: 'auto' as any,
      containIntrinsicSize: '300px 400px' as any,
      // Improve scroll performance 
      willChange: isMobile ? 'auto' : 'transform',
      // Hardware acceleration for mobile
      transform: isMobile ? 'translateZ(0)' : undefined,
      backfaceVisibility: isMobile ? ('hidden' as const) : undefined,
    };
  }, [getOptimizedStyles, isMobile]);

  return (
    <>
      <Card 
        className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 lg:p-6 h-full flex flex-col focus-within:border-cyan-400 focus-within:shadow-cyan-400/20 ${
          enableReducedMotion 
            ? 'transition-none' 
            : 'transition-all duration-300'
        } ${
          !isTouch 
            ? 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 cursor-pointer' 
            : 'active:bg-gray-800/70'
        } ${
          needsAgeGate ? 'ring-1 ring-amber-500/30' : ''
        } tool-card`}
        style={optimizedStyles}
        tabIndex={0}
        role="article"
        aria-label={`AI Tool: ${tool.title}${needsAgeGate ? ' (18+)' : ''}`}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 18+ Badge for age-restricted tools */}
        {needsAgeGate && (
          <div className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 bg-amber-500/90 rounded text-[10px] font-bold text-black">
            🔞 18+
          </div>
        )}
        
        <ToolCardHeader 
          tool={tool}
          toolIndex={index}
          isFeatured={isFeatured}
          cardSize={cardSize}
          titleSize={titleSize}
          isAIWebToolsOriginal={isAIWebToolsOriginal}
          boostedRating={boostedRating}
          defaultVotes={defaultVotes}
        />
        
        {/* Favorite Button */}
        <FavoriteButton tool={tool} size="sm" className="top-1.5 right-1.5 z-30" />
        
        <ToolCardContent 
          tool={tool}
          toolIndex={index}
          isFeatured={isFeatured}
          buttonSize={buttonSize}
          isAIWebToolsOriginal={isAIWebToolsOriginal}
          imageHeight={imageHeight}
          getDescription={getDescription}
        />
      </Card>
      
      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showAgeModal}
        onClose={() => {
          setShowAgeModal(false);
          pendingUrlRef.current = null;
        }}
        onVerified={handleAgeVerified}
        toolTitle={tool.title}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Re-render whenever the tool itself changes so a reused card never
  // keeps showing a previous tool's image/description after a sort/shuffle.
  return prevProps.tool === nextProps.tool && prevProps.index === nextProps.index;
});

ToolCard.displayName = "ToolCard";

export default ToolCard;
