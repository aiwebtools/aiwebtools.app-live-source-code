import { downloadAllOperationalInstructions } from "@/utils/downloads";

import { Phone, Trees, Clapperboard, Heart, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { createConfettiCelebration } from "@/utils/effects/audioEffects";
import { triggerPublicDownload } from "@/utils/downloads";
import { useFavorites } from "@/hooks/useFavorites";
import { prefetchNow } from "@/hooks/usePrefetch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const Navigation = () => {
  const navigate = useNavigate();
  
  // Safe hook usage with error handling
  let getFavoritesCount;
  try {
    const favoritesContext = useFavorites();
    getFavoritesCount = favoritesContext.getFavoritesCount;
  } catch (error) {
    console.warn('useFavorites hook not available, using fallback');
    getFavoritesCount = () => 0;
  }
  
  // Enhanced CSV download with all comprehensive data fields + GPT Instructions ZIP
  const handleDownloadAllToolsCSV = async () => {
    try {
      // Trigger confetti celebration first
      createConfettiCelebration();
      const { allTools } = await import("@/data/toolsData");
      
      console.log(`📊 Generating comprehensive CSV with ${allTools.length} tools...`);
      
      // Enhanced headers with all available data fields
      const headers = [
        "Title", 
        "Category", 
        "URL", 
        "Description", 
        "Emoji", 
        "Tags", 
        "Rating", 
        "Total Votes",
        "Color Scheme",
        "Pricing"
      ];
      
      // Enhanced data extraction with all fields
      const rows = allTools.map((tool, index) => [
        tool.title || "",
        tool.category || "",
        tool.directUrl || "",
        tool.description || "",
        tool.emoji || "",
        (tool.tags || []).join("; "),
        tool.rating?.toString() || "",
        tool.totalVotes?.toString() || "",
        tool.color || "",
        (tool.tags || []).find(tag => 
          tag.toLowerCase().includes('free') || 
          tag.toLowerCase().includes('premium') || 
          tag.toLowerCase().includes('freemium')
        ) || "Not specified"
      ]);
      
      const escapeCSV = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;
      const csv = [headers, ...rows]
        .map((r) => r.map((c) => escapeCSV(String(c))).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-tools-complete-${allTools.length}-tools-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log(`✅ CSV download complete! ${allTools.length} tools exported with enhanced data`);
      
      // Also download the GPT Instructions ZIP file after a short delay
      setTimeout(() => {
        downloadAllOperationalInstructions();
        console.log('🎁 Also downloaded 150+ GPT Instructions ZIP!');
      }, 500);
      
    } catch (err) {
      console.error("Failed to generate comprehensive CSV:", err);
    }
  };

  const scrollToHome = () => {
    // INSTANT home navigation
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleBrowseAITools = () => {
    // Navigate to ALL AI TOOLS main category page
    navigate('/main-category/ALL%20AI%20TOOLS');
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌀 External link clicked in navigation:', url);
    createTimePortalEffect(url);
  };

  return (
    <nav className="hidden md:flex items-center space-x-1 min-w-0">
      <button 
        onClick={() => navigate('/favorites')}
        onMouseEnter={() => prefetchNow('/favorites')}
        className="text-cyan-100 hover:text-pink-400 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium"
        title={`My Favorites (${getFavoritesCount()})`}
      >
        <Heart className="w-3 h-3" fill={getFavoritesCount() > 0 ? 'currentColor' : 'none'} />
        <span className="hidden xl:inline">Favorites</span>
        {getFavoritesCount() > 0 && (
          <span className="bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
            {getFavoritesCount()}
          </span>
        )}
      </button>
      
      <button 
        onClick={handleBrowseAITools}
        onMouseEnter={() => prefetchNow('/main-category/ALL%20AI%20TOOLS')}
        className="text-cyan-100 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer px-2 py-1 rounded text-xs font-medium"
      >
        🎯 Browse Tools
      </button>

      <button 
        onClick={() => navigate('/submit-tool')}
        onMouseEnter={() => prefetchNow('/submit-tool')}
        className="text-cyan-100 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer px-2 py-1 rounded text-xs font-medium"
      >
        ➕ Submit Tool
      </button>

      <button 
        onClick={handleDownloadAllToolsCSV}
        className="text-cyan-100 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium"
        title="Download all 4,000+ AI tools as CSV"
      >
        <Download className="w-3 h-3" />
        <span className="hidden xl:inline">CSV</span>
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="text-cyan-100 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium"
          >
            <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">WEB3</span>
            <span className="hidden xl:inline">Domains</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] max-h-[85vh] overflow-y-auto bg-popover text-popover-foreground border border-cyan-500/40 z-[200] shadow-2xl" align="end" side="bottom" collisionPadding={20} sideOffset={8}>
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/60 to-blue-900/60 rounded-xl border border-purple-500/40 shadow-lg">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <span className="text-lg">🔗</span> Connect to Your Crypto Wallet
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Own forever • Resell for profit • Minted as NFT • Connect to wallet • Trade anytime
            </p>
          </div>
          <Accordion type="multiple" className="space-y-3">
            {/* Financial & Cash Transfer Domains */}
            <AccordionItem value="financial" className="border border-cyan-500/20 rounded-xl bg-slate-900/40 shadow-lg">
              <AccordionTrigger className="text-sm px-4 py-3 hover:no-underline hover:bg-white/5 rounded-t-xl transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold">Financial & Cash Transfer Domains</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/transfermoney", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">💸</span>
                      <span className="relative z-10 font-medium tracking-wide">.transfermoney</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/transfercoin", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🪙</span>
                      <span className="relative z-10 font-medium tracking-wide">.transfercoin</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/cointransfer", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">💰</span>
                      <span className="relative z-10 font-medium tracking-wide">.cointransfer</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/transfercash", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">💵</span>
                      <span className="relative z-10 font-medium tracking-wide">.transfercash</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/cashtransfer", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">💴</span>
                      <span className="relative z-10 font-medium tracking-wide">.cashtransfer</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* AI & Technology Domains */}
            <AccordionItem value="ai" className="border border-cyan-500/20 rounded-xl bg-slate-900/40 shadow-lg">
              <AccordionTrigger className="text-sm px-4 py-3 hover:no-underline hover:bg-white/5 rounded-t-xl transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <span className="font-semibold">AI & Technology Domains</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/ai-tools?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🧠</span>
                      <span className="relative z-10 font-medium tracking-wide">.ai-tools</span>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-200 px-3 py-1.5 rounded-full border border-green-500/40 font-medium">Solana</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/.aiwebtools?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🤖</span>
                      <span className="relative z-10 font-medium tracking-wide">.aiwebtools</span>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-200 px-3 py-1.5 rounded-full border border-green-500/40 font-medium">Solana</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/aimainframe?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🗄️</span>
                      <span className="relative z-10 font-medium tracking-wide">.aimainframe</span>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-200 px-3 py-1.5 rounded-full border border-green-500/40 font-medium">Solana</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/aitoolscompany?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🏢</span>
                      <span className="relative z-10 font-medium tracking-wide">.aitoolscompany</span>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-200 px-3 py-1.5 rounded-full border border-green-500/40 font-medium">Solana</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Robotics & Automation Domains */}
            <AccordionItem value="robotics" className="border border-cyan-500/20 rounded-xl bg-slate-900/40 shadow-lg">
              <AccordionTrigger className="text-sm px-4 py-3 hover:no-underline hover:bg-white/5 rounded-t-xl transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦾</span>
                  <span className="font-semibold">Robotics & Automation Domains</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/robotsales?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🦾</span>
                      <span className="relative z-10 font-medium tracking-wide">.robotsales</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/robotshop?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🛍️</span>
                      <span className="relative z-10 font-medium tracking-wide">.robotshop</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/robotstore?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🛒</span>
                      <span className="relative z-10 font-medium tracking-wide">.robotstore</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Global & World Domains */}
            <AccordionItem value="global" className="border border-cyan-500/20 rounded-xl bg-slate-900/40 shadow-lg">
              <AccordionTrigger className="text-sm px-4 py-3 hover:no-underline hover:bg-white/5 rounded-t-xl transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌍</span>
                  <span className="font-semibold">Global & World Domains</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/worldpeace?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🕊️</span>
                      <span className="relative z-10 font-medium tracking-wide">.worldpeace</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/worldtrade?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">🌐</span>
                      <span className="relative z-10 font-medium tracking-wide">.worldtrade</span>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-200 px-3 py-1.5 rounded-full border border-green-500/40 font-medium">Solana</span>
                  </button>
                  <button
                    onClick={(e) => handleExternalLink("https://freename.io/discover/worldtrader?ref=olive-ears-obey", e)}
                    className="group relative w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 hover:text-cyan-300 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                  >
                    <div className="flex items-center">
                      <span className="relative z-10 text-lg mr-3">💹</span>
                      <span className="relative z-10 font-medium tracking-wide">.worldtrader</span>
                    </div>
                    <span className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1.5 rounded-full border border-purple-500/40 font-medium">Polygon</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PopoverContent>
      </Popover>
      
      <button 
        onClick={(e) => handleExternalLink('https://linktr.ee/aiwebtools', e)}
        className="text-cyan-100 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer inline-flex items-center px-2 py-1 rounded text-xs font-medium"
        aria-label="AI Web Tools Linktree"
        title="Linktree"
      >
        <Trees className="w-3 h-3" />
      </button>
    </nav>
  );
};

export default Navigation;
