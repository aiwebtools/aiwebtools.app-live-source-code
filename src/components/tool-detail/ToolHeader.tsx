
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Tool } from "@/types/tools";
import StarRating from "@/components/tools/StarRating";
import { useNavigate } from "react-router-dom";
import { isFreeTool } from "@/utils/freeToolDetection";
import { getToolPricing, getPricingLabel } from "@/utils/pricingClassification";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { getDisplayedCategory } from "@/utils/toolCategoryDisplay";

interface ToolHeaderProps {
  tool: Tool;
  defaultRating: number;
  defaultVotes: number;
  toolIndex?: number;
}

const ToolHeader = ({ tool, defaultRating, defaultVotes, toolIndex }: ToolHeaderProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    if (tool.category) {
      navigate(`/category/${encodeURIComponent(tool.category)}`);
    }
  };

  const handleQuickUse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tool.directUrl) return;
    createTimePortalEffect(tool.directUrl || '', tool.title);
  };

  // Check if this is a FREE custom GPT
  const isFreeCustomGPT = isFreeTool(tool);
  const pricing = getToolPricing(tool);
  const pricingLabel = getPricingLabel(pricing);
  // Page-level label only; the catalog category behind filtering is unchanged.
  const displayedCategory = getDisplayedCategory(tool);

  return (
    <div className="text-center pb-6 bg-gradient-to-r from-gray-900/50 to-gray-800/30 relative">
      {/* Pricing badge (FREE / FREEMIUM / PAID) */}
      <div className="absolute top-4 right-4 z-20">
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
            pricing === "free"
              ? `bg-gradient-to-r from-yellow-400 to-yellow-600 text-black transform rotate-12${isFreeCustomGPT ? " animate-pulse" : ""}`
              : pricing === "freemium"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              : "bg-gradient-to-r from-gray-600 to-gray-800 text-white"
          }`}
        >
          {pricingLabel}
        </div>
      </div>
      
      <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-4xl shadow-lg shadow-cyan-500/30 glow-effect`}>
        {tool.emoji}
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cyber-glow">
          {tool.title}
          <span className="sr-only"> — {displayedCategory || 'AI Tool'} Review & Free Access</span>
        </h1>
        {tool.category && (
          <Badge 
            variant="outline" 
            className="text-sm border-cyan-400 text-cyan-400 bg-cyan-400/10 px-4 py-2 glow-effect cursor-pointer hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-200 transform hover:scale-105"
            onClick={handleCategoryClick}
          >
            {displayedCategory}
          </Badge>
        )}
        
        {/* Quick USE IT NOW shortcut button */}
        <div className="pt-2">
          <Button
            size="sm"
            onClick={handleQuickUse}
            disabled={!tool.directUrl}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 text-xs rounded-lg shadow-md shadow-cyan-500/20"
            style={{ touchAction: 'manipulation' }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {tool.directUrl ? "USE IT NOW" : "COMING SOON"}
          </Button>
        </div>
        
        <div className="flex justify-center">
          <StarRating 
            rating={defaultRating} 
            totalVotes={defaultVotes}
            toolId={toolIndex !== undefined ? `tool-${toolIndex}` : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolHeader;
