import { Button } from "@/components/ui/button";
import { ExternalLink, Plus, Search, Download, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { downloadToolsCSV } from "@/utils/csvExport";
import { createConfettiCelebration } from "@/utils/effects/audioEffects";
import LocalModelsAccordion from "@/components/LocalModelsAccordion";

const TOOL_COUNT = 5000;

interface FooterActionsProps {
  handleExternalLink: (url: string, e: React.MouseEvent) => void;
  handleSubmitTool: () => void;
  handleRequestTool: () => void;
}

const FooterActions = ({ handleExternalLink, handleSubmitTool, handleRequestTool }: FooterActionsProps) => {
  const navigate = useNavigate();
  
  const handleViewAllTools = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/main-category/ALL%20AI%20TOOLS');
  };

  const handleViewPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    handleExternalLink('https://aiwebtools.lovable.app/?via=aiwebtools', e);
  };

  const handleDownloadAIList = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { allTools } = await import("@/data/toolsData");
    console.log(`📥 Downloading CSV with ${allTools.length} AI tools...`);
    
    // Trigger confetti celebration
    createConfettiCelebration();
    
    // Download CSV with all tools
    setTimeout(() => {
      downloadToolsCSV(
        allTools, 
        `AIWebTools-Complete-Directory-${allTools.length}-Tools.csv`
      );
    }, 300);
  };

  return (
    <div className="text-center mb-16">
      <h3 className="text-2xl font-bold text-green-300 mb-6" style={{ textShadow: '0 0 15px rgba(0, 255, 0, 0.5)' }}>
        🚀 Discover More AI Tools
      </h3>
      <div className="flex flex-wrap gap-4 justify-center items-stretch max-w-6xl mx-auto">
        <Button
          onClick={handleDownloadAIList}
          variant="gold"
          size="lg"
          className="w-full sm:w-auto px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <Download className="mr-2 h-5 w-5 animate-bounce flex-shrink-0" />
          DOWNLOAD {TOOL_COUNT}+ AI TOOLS (CSV)
        </Button>
        
        <Button
          onClick={handleViewAllTools}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-green-500 text-green-300 hover:bg-green-500/20 hover:text-white transition-all duration-300 px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <Search className="mr-2 h-5 w-5 flex-shrink-0" />
          VIEW ALL AI TOOLS
        </Button>
        
        <Button
          onClick={handleViewPortfolio}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 hover:text-white transition-all duration-300 px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <ExternalLink className="mr-2 h-5 w-5 flex-shrink-0" />
          VIEW PORTFOLIO
        </Button>
        
        <Button
          onClick={handleSubmitTool}
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto border-emerald-500 text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all duration-300 px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <Plus className="mr-2 h-5 w-5 flex-shrink-0" />
           SUBMIT YOUR AI TOOL TO OUR DIRECTORY
        </Button>
        
        <Button
          onClick={handleRequestTool}
          variant="outline"
          size="lg" 
          className="w-full sm:w-auto border-green-400 text-green-400 hover:bg-green-400/20 hover:text-white transition-all duration-300 px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <ExternalLink className="mr-2 h-5 w-5 flex-shrink-0" />
           SUBMIT REQUEST A CUSTOM AI TOOL BUILD
        </Button>

        <Button
          onClick={(e) => handleExternalLink('https://github.com/aiwebtools/', e)}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-gray-400 text-gray-200 hover:bg-gray-400/20 hover:text-white transition-all duration-300 px-6 py-3 h-auto min-h-[3rem] whitespace-nowrap text-sm md:text-base font-bold tracking-wide"
        >
          <Github className="mr-2 h-5 w-5 flex-shrink-0" />
           AWT GITHUB — OPEN SOURCE
        </Button>

        <div className="w-full sm:w-auto sm:min-w-[22rem]">
          <LocalModelsAccordion />
        </div>
      </div>
    </div>
  );
};

export default FooterActions;