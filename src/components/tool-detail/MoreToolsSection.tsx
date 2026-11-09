
import { Button } from "@/components/ui/button";
import FeaturedTools from "@/components/FeaturedTools";

interface MoreToolsSectionProps {
  showMoreTools: boolean;
  totalTools: number;
  onSeeMoreTools: () => void;
  onToolsLoaded: (count: number) => void;
}

const MoreToolsSection = ({ 
  showMoreTools, 
  totalTools, 
  onSeeMoreTools, 
  onToolsLoaded 
}: MoreToolsSectionProps) => {
  const handleSeeMoreTools = () => {
    onSeeMoreTools();
    // Don't scroll - just show more tools in place
  };

  if (!showMoreTools) {
    return (
      <div className="text-center mt-16 mb-16 px-4">
        <Button
          onClick={handleSeeMoreTools}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
        >
          🚀 SEE MORE AI TOOLS
        </Button>
        <div className="mt-4 text-cyan-300 text-sm">
          Explore our complete collection of {totalTools.toLocaleString()} amazing AI tools
        </div>
      </div>
    );
  }

  return (
    <div id="more-tools-section" className="mt-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 cyber-glow">
          🚀 Explore More AI Tools
        </h3>
        <p className="text-gray-300">
          Continuously discover new AI tools from our collection
        </p>
      </div>
      <FeaturedTools 
        showLoadMoreButton={true} 
        onToolsLoaded={onToolsLoaded}
      />
    </div>
  );
};

export default MoreToolsSection;
