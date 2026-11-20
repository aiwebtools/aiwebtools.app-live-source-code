import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import DeferredMount from "@/components/DeferredMount";
import { allTools } from "@/data/toolsData";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { searchTools } from "@/utils/searchUtils";
import ToolsGrid from "@/components/tools/ToolsGrid";
import { useDebounce } from "@/hooks/useDebounce";
import { getContextAwareSimilarTools } from "@/utils/contextAwareSimilarTools";
import EnhancedSEOHead from "@/components/seo/EnhancedSEOHead";
import { generateToolSlug } from "@/utils/urlGenerator";
import ToolDisclaimerBadges from "@/components/disclaimers/ToolDisclaimerBadges";
import FullSpiritualDisclaimer from "@/components/disclaimers/FullSpiritualDisclaimer";
import FullMedicalDisclaimer from "@/components/disclaimers/FullMedicalDisclaimer";
import FullCompanionDisclaimer from "@/components/disclaimers/FullCompanionDisclaimer";
import FullDivinationDisclaimer from "@/components/disclaimers/FullDivinationDisclaimer";
import { 
  needsSpiritualDisclaimer, 
  needsMedicalDisclaimer,
  needsCompanionDisclaimer,
  needsDivinationDisclaimer
} from "@/utils/toolDisclaimerDetection";
import ToolCardMedia from "@/components/tools/ToolCardMedia";
import { openDestinationUrl } from "@/utils/effects/domEffects";
import { useCommunityRating } from '@/hooks/useCommunityRating';

const ToolPage = () => {
  const { toolIndex } = useParams<{ toolIndex: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const community = useCommunityRating(tool ? generateToolSlug(tool.title) : '');
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 25);

  useEffect(() => {
    if (!toolIndex) {
      navigate('/');
      return;
    }

    const index = parseInt(toolIndex, 10);
    if (isNaN(index) || index < 0 || index >= allTools.length) {
      navigate('/');
      return;
    }

    const selectedTool = allTools[index];
    setTool(selectedTool);

    // Fetch similar tools based on category and tags
    const calculatedSimilarTools = getContextAwareSimilarTools([selectedTool], "", selectedTool.category || "", 24);
    setSimilarTools(calculatedSimilarTools);

    window.scrollTo(0, 0);
  }, [toolIndex, navigate]);

  if (!tool) {
    return null;
  }

  const handleNavigation = (url: string | undefined) => {
    if (url) {
      openDestinationUrl(url);
    }
  };

  const handleLoadMore = () => {
    // This is for the ToolsGrid component requirement
    console.log("Load more requested");
  };

  const searchedSimilarTools = searchTerm
    ? searchTools(similarTools, searchTerm)
    : similarTools;

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <EnhancedSEOHead
        title={`${tool.title} - AI Tool Review & Complete Guide`}
        description={`${tool.title} overview: features, pricing, and alternatives. Cataloged in the AI Web Tools directory.`}
        keywords={[
          tool.title,
          tool.category || "AI tool",
          `${tool.title} review`,
          `${tool.title} alternatives`,
          "AI tools 2026",
          ...(tool.tags || [])
        ]}
        image={tool.imageUrl}
        url={`/${generateToolSlug(tool.title)}`}
        type="article"
        category={tool.category}
        toolData={tool}
        pageType="tool"
      />
      
      <DeferredMount delay={50}><AnimatedBackground /></DeferredMount>
      
      <div className="relative z-10 cyber-grid">
        <Header />
        
          <main className="container mx-auto px-4 py-8">
            {/* Tool Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{tool.emoji}</div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent cyber-glow">
                {tool.title}
              </h1>

              {/* Tool media (image/video) */}
              {(tool.imageUrl || tool.videoUrl) && (
                <div className="max-w-4xl mx-auto mb-6 group">
                  <ToolCardMedia tool={tool} isFeatured={true} imageHeight="h-72" />
                </div>
              )}
              
              {/* Disclaimer badges for spiritual/medical tools */}
              <div className="flex justify-center mb-4">
                <ToolDisclaimerBadges tool={tool} size="md" showFullText={true} />
              </div>
              
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                {tool.description}
              </p>
              <Button
                onClick={() => handleNavigation(tool.directUrl)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ExternalLink className="mr-2" />
                Visit Website
              </Button>
            </div>
            
          {/* Full Disclaimers for spiritual/medical/companion/divination tools */}
          <div className="max-w-4xl mx-auto space-y-6 mb-8">
            {needsSpiritualDisclaimer(tool) && (
              <FullSpiritualDisclaimer tool={tool} />
            )}
            {needsMedicalDisclaimer(tool) && (
              <FullMedicalDisclaimer tool={tool} />
            )}
            {needsCompanionDisclaimer(tool) && (
              <FullCompanionDisclaimer tool={tool} />
            )}
            {needsDivinationDisclaimer(tool) && (
              <FullDivinationDisclaimer tool={tool} />
            )}
          </div>

          {/* Tool Details */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-cyan-300 font-semibold">
                Category: {tool.category}
              </span>
              {community.data && community.data.count > 0 && (
                <span className="text-green-300">
                  Rating: {community.data.rating.toFixed(1)} ({community.data.count} community reviews)
                </span>
              )}
            </div>
            <div className="flex items-center justify-center mt-2 space-x-4">
              <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
                <ThumbsUp className="mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
                <ThumbsDown className="mr-2" />
                Dislike
              </Button>
            </div>
          </div>

          {/* Search Similar Tools */}
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              🔍 Search Similar Tools
            </h3>
            <input
              type="text"
              placeholder="Search for similar tools..."
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Similar Tools Grid */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Similar AI Tools
            </h3>
            {searchedSimilarTools.length > 0 ? (
              <ToolsGrid
                tools={searchedSimilarTools}
                displayedCount={24}
                selectedCategory={tool.category || ""}
                searchTerm={debouncedSearchTerm}
                onLoadMore={handleLoadMore}
                hasInfiniteScroll={false}
              />
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-cyan-100 mb-4">No similar tools found</h3>
                <p className="text-gray-300 mb-8">
                  {searchTerm
                    ? `No tools found similar to "${tool.title}" for "${searchTerm}".`
                    : `No tools found similar to "${tool.title}".`}
                </p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ToolPage;
