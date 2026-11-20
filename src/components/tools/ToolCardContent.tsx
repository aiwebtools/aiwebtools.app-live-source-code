
import { CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tool } from "@/types/tools";
import ToolCardMedia from "./ToolCardMedia";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { generateToolSlug } from "@/utils/urlGenerator";

interface ToolCardContentProps {
  tool: Tool;
  toolIndex: number;
  isFeatured: boolean;
  buttonSize: string;
  isAIWebToolsOriginal: boolean;
  imageHeight: string;
  getDescription: () => string;
}

const ToolCardContent = ({ 
  tool, 
  toolIndex, 
  isFeatured, 
  buttonSize, 
  isAIWebToolsOriginal, 
  imageHeight, 
  getDescription 
}: ToolCardContentProps) => {
  
  const handleDirectAccess = (e: React.MouseEvent) => {
    if (tool.directUrl) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Direct access clicked for:', tool.title);
      // Pass the tool title to the time portal effect
      createTimePortalEffect(tool.directUrl, tool.title);
    }
  };

  const handleCreatorFeedback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Creator feedback clicked for:', tool.title);
    
    // Create feedback email with tool details
    const subject = encodeURIComponent(`Feedback for ${tool.title} GPT`);
    const body = encodeURIComponent(`Hi AI Web Tools Team,

I'd like to provide feedback for ${tool.title}:

Tool URL: ${tool.directUrl}
Category: ${tool.category}

My feedback:
[Please share your thoughts, suggestions, or issues here]

Thank you for creating amazing AI tools!

Best regards`);
    
    const mailtoLink = `mailto:contact@ai-webtools.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <CardContent className="text-center flex-grow flex flex-col relative z-10">
      <ToolCardMedia 
        tool={tool} 
        isFeatured={isFeatured} 
        imageHeight={imageHeight} 
      />
      
      <CardDescription className="text-foreground mb-4 leading-relaxed text-sm line-clamp-4 min-h-20">
        {getDescription()}
      </CardDescription>
      
      <div className="mt-auto space-y-2">
        {/* View Details Button - now uses clean URL slug */}
        <Link
          to={`/${generateToolSlug(tool.title)}`}
          state={{
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
          }}
        >
          <Button 
            size={buttonSize as any}
            className={`w-full ${isAIWebToolsOriginal ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'} text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30`}
          >
            View Details
          </Button>
        </Link>
        
        {/* Direct Access Button - only show if tool has directUrl */}
        {tool.directUrl && (
          <Button 
            size={buttonSize as any}
            onClick={handleDirectAccess}
            variant="outline"
            className="w-full border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:border-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 USE IT NOW
          </Button>
        )}
        
        {/* Creator Feedback Button - only show for AI Web Tools original GPTs */}
        {isAIWebToolsOriginal && (
          <Button 
            size={buttonSize as any}
            onClick={handleCreatorFeedback}
            variant="outline"
            className="w-full border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            💬 Send Creator Feedback
          </Button>
        )}
      </div>
    </CardContent>
  );
};

export default ToolCardContent;
