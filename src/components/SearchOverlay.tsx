
import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { allTools } from "@/data/toolsData";
import { searchTools } from "@/utils/searchUtils";
import { useNavigate } from "react-router-dom";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { generateToolSlug } from "@/utils/urlGenerator";
import ToolThumb from "@/components/tools/ToolThumb";
import AISearchAssistant from "@/components/ai/AISearchAssistant";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(allTools.slice(0, 24)); // Start with 24 tools
  const [displayedCount, setDisplayedCount] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchTools(allTools, searchTerm); // Get ALL results
      setSearchResults(results);
      setDisplayedCount(24); // Reset display count
    } else {
      // Show random tools when no search term
      const shuffled = [...allTools].sort(() => 0.5 - Math.random());
      setSearchResults(shuffled);
      setDisplayedCount(24);
    }
  }, [searchTerm]);

  const handleToolClick = (tool: any) => {
    onClose();
    navigate(`/${generateToolSlug(tool.title)}`, {
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

  const handleDirectAccess = (tool: any, e: React.MouseEvent) => {
    if (tool.directUrl) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🌀 Direct access clicked in search overlay for:', tool.title);
      createTimePortalEffect(tool.directUrl);
      onClose();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when user scrolls near the bottom
    if (scrollHeight - scrollTop <= clientHeight + 100 && displayedCount < searchResults.length) {
      setDisplayedCount(prev => Math.min(prev + 24, searchResults.length));
    }
  };

  const displayedResults = searchResults.slice(0, displayedCount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4">
        <Card className="bg-gray-900/95 border border-cyan-500/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-100">Search AI Tools</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search 4,000+ AI tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 text-lg py-4"
                autoFocus
              />
            </div>

            <div className="mb-4 text-center text-sm text-cyan-400">
              {searchTerm ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'tool' : 'tools'}` : `Browsing ${searchResults.length} tools`}
              {displayedCount < searchResults.length && ` • Showing first ${displayedCount}`}
            </div>

            {searchTerm.trim() && (
              <AISearchAssistant
                query={searchTerm.trim()}
                candidates={searchResults}
                onPick={handleToolClick}
              />
            )}



            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-800"
              onScroll={handleScroll}
            >
              {displayedResults.map((tool, index) => {
                const toolIndex = allTools.findIndex(t => t.title === tool.title);
                return (
                  <Card 
                    key={`search-${tool.title}-${index}`}
                    className="bg-gray-800/50 border-gray-600 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleToolClick(tool)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-r ${tool.color} flex items-center justify-center text-lg`}>
                          <ToolThumb tool={tool} className="w-full h-full" emojiClassName="text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-400 transition-colors">
                            {tool.title}
                          </h3>
                          {tool.category && (
                            <p className="text-xs text-gray-400 truncate">{tool.category}</p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToolClick(tool);
                          }}
                        >
                          View Details
                        </Button>
                        
                        {tool.directUrl && (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 text-xs px-2"
                            onClick={(e) => handleDirectAccess(tool, e)}
                          >
                            🚀 USE
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {displayedCount < searchResults.length && (
                <div className="col-span-full text-center py-6">
                  <div className="text-cyan-400 text-lg animate-pulse">Loading more tools...</div>
                  <div className="text-gray-400 text-sm mt-2">
                    {searchResults.length - displayedCount} more tools available - Keep scrolling!
                  </div>
                </div>
              )}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No tools found matching "{searchTerm}"</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchOverlay;
