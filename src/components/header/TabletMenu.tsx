import { downloadAllOperationalInstructions } from "@/utils/downloads";

import { Menu, Phone, Globe, ChevronDown, Download, Copy, Gift, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { triggerPublicDownload } from "@/utils/downloads";
import { playMtvFlash } from "@/utils/mtvFlash";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { createConfettiCelebration } from "@/utils/effects/audioEffects";
import GlobalSearchBar from "@/components/LazyGlobalSearchBar";
import Logo from "./Logo";
import { useRecentlyVisitedTools } from "@/hooks/useRecentlyVisitedTools";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";

const TabletMenu = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [renderSearch, setRenderSearch] = useState(false);
  const [isWeb3Open, setIsWeb3Open] = useState(false);
  const { recentTools } = useRecentlyVisitedTools();

  useEffect(() => {
    if (!isMenuOpen) {
      setRenderSearch(false);
      return;
    }
    const id = window.setTimeout(() => setRenderSearch(true), 450);
    return () => window.clearTimeout(id);
  }, [isMenuOpen]);

  const handleBrowseAITools = () => {
    // Navigate to ALL AI TOOLS main category page
    navigate("/main-category/ALL%20AI%20TOOLS");
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    createTimePortalEffect(url);
  };

  // Enhanced CSV download with all comprehensive data fields
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
      
      console.log(`✅ CSV download complete! ${allTools.length} tools exported with comprehensive data`);
      
      // Also download the GPT Instructions ZIP file
      setTimeout(() => {
        downloadAllOperationalInstructions();
        console.log('🎁 Also downloaded 150+ GPT Instructions ZIP!');
      }, 500);
    } catch (err) {
      console.error("Failed to generate comprehensive CSV:", err);
    }
  };

  return (
    <TooltipProvider>
      <div className="hidden md:block lg:hidden">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-cyan-500/30 bg-black/80 text-cyan-100 hover:bg-cyan-500/20 flex-shrink-0">
              <Menu className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[400px] bg-black/95 shadow-xl border border-cyan-500/30 backdrop-blur-md max-h-[80vh] overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain' }}>
            <div className="p-4">
              {/* Header with Logo */}
              <div className="text-center mb-4 border-b border-cyan-500/30 pb-4">
                <div className="flex justify-center mb-1">
                  <Logo compact={true} />
                </div>
                <p className="text-sm text-cyan-200">Navigate our platform</p>
              </div>

              {/* Search Bar - use the SAME global search as hero/category pages */}
              <div className="mb-4">
                {renderSearch ? (
                  <GlobalSearchBar />
                ) : (
                  <div className="h-10 rounded-lg border-2 border-emerald-500/70 bg-background" aria-hidden="true" />
                )}
              </div>

              <DropdownMenuItem onClick={() => navigate('/')} className="text-cyan-100 hover:bg-cyan-500/20 mb-2 rounded">
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { playMtvFlash().then(() => navigate('/music-stream')); }}
                className="text-fuchsia-100 hover:bg-fuchsia-500/20 mb-2 rounded border border-fuchsia-500/30"
                style={{ textShadow: '0 0 6px rgba(168,85,247,0.55)' }}
              >
                📺 AiWebTools Music Stream
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-gray-700 mb-2" />
              
              {/* Browse Categories */}
              <DropdownMenuItem
                onClick={handleBrowseAITools}
                className="text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 font-medium mb-3 rounded-lg p-3"
              >
                🎯 Browse AI Tool Categories
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="border-gray-700 mb-3" />
              
              {/* Footer */}
              <div className="space-y-1">
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); createTimePortalEffect('https://aiwebtools.lovable.app/?via=aiwebtools'); }} className="text-cyan-100 hover:bg-cyan-500/20 rounded">
                  ABOUT AI WEB TOOLS
                </DropdownMenuItem>
                
                {/* Register WEB3 Domains Accordion */}
                <div className="mb-2 p-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    🔗 <span className="font-semibold text-cyan-400">Connect to Your Crypto Wallet</span><br/>
                    Own forever • Resell for profit • Minted as NFT • Trade anytime
                  </p>
                  <p className="text-xs mt-1.5 font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    🏦 DECENTRALIZED BANKING • A FAIR WORLD FOR ALL
                  </p>
                  <p className="text-[10px] mt-1 italic text-cyan-300/80 leading-snug">
                    "Overcoming poverty is not a gesture of charity. It is an act of justice." — Nelson Mandela
                  </p>
                </div>
                <Collapsible open={isWeb3Open} onOpenChange={setIsWeb3Open}>
                  <CollapsibleTrigger 
                    className="w-full text-cyan-100 hover:bg-cyan-500/20 rounded flex items-center justify-between px-2 py-1.5 text-sm outline-none focus:bg-cyan-500/20 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsWeb3Open(!isWeb3Open);
                    }}
                  >
                    <span className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> Register your WEB3 Domain
                    </span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isWeb3Open ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-6 max-h-64 overflow-y-auto pr-1">
                    <div className="text-xs text-cyan-400 mb-2 font-semibold">💰 Financial & Cash Transfer</div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/transfermoney'); }} className="flex-1 text-left">💸 .transfermoney</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/transfercoin'); }} className="flex-1 text-left">🪙 .transfercoin</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/cointransfer'); }} className="flex-1 text-left">💰 .cointransfer</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/transfercash'); }} className="flex-1 text-left">💵 .transfercash</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/cashtransfer'); }} className="flex-1 text-left">💴 .cashtransfer</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    
                    <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🤖 AI & Technology</div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/ai-tools?ref=olive-ears-obey'); }} className="flex-1 text-left">🧠 .ai-tools</button>
                      <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/.aiwebtools?ref=olive-ears-obey'); }} className="flex-1 text-left">🤖 .aiwebtools</button>
                      <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/aimainframe?ref=olive-ears-obey'); }} className="flex-1 text-left">🗄️ .aimainframe</button>
                      <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/aitoolscompany?ref=olive-ears-obey'); }} className="flex-1 text-left">🏢 .aitoolscompany</button>
                      <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                    </div>
                    
                    <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🤖 Robotics & Automation</div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/robotsales?ref=olive-ears-obey'); }} className="flex-1 text-left">🦾 .robotsales</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/robotshop?ref=olive-ears-obey'); }} className="flex-1 text-left">🛍️ .robotshop</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/robotstore?ref=olive-ears-obey'); }} className="flex-1 text-left">🛒 .robotstore</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    
                    <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🌍 Global & World</div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/worldpeace?ref=olive-ears-obey'); }} className="flex-1 text-left">🕊️ .worldpeace</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/worldtrade?ref=olive-ears-obey'); }} className="flex-1 text-left">🌐 .worldtrade</button>
                      <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                    </div>
                    <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); createTimePortalEffect('https://freename.io/discover/worldtrader?ref=olive-ears-obey'); }} className="flex-1 text-left">💹 .worldtrader</button>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <DropdownMenuItem className="text-cyan-100 hover:bg-cyan-500/20 rounded">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href="tel:+14758008096">475-800-8096</a>
                </DropdownMenuItem>

                {/* Download ALL AI tools CSV - tablet only */}
                <div className="py-1">
                  <DownloadLibraryButton
                    compact
                    label="Free 3,200+ GPT Instructions"
                    onBeforeOpen={() => setIsMenuOpen(false)}
                  />
                </div>
                <DropdownMenuItem onClick={handleDownloadAllToolsCSV} className="text-cyan-100 hover:bg-cyan-500/20 rounded">
                  <Download className="w-4 h-4 mr-2" />
                  📊 Download ALL 5,500+ AI Tools (CSV)
                </DropdownMenuItem>

                {/* Recently Visited Tools */}
                {recentTools.length > 0 && (
                  <div className="my-3">
                    <div className="px-2 py-1 text-xs text-cyan-400/70 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Recently Visited
                    </div>
                    <div className="bg-gray-900/50 rounded-lg border border-white/5 p-2 space-y-1">
                      {recentTools.map((tool, index) => (
                        <button
                          key={`${tool.url}-${index}`}
                          onClick={(e) => handleExternalLink(tool.url, e)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-cyan-100 hover:bg-cyan-500/20 transition-colors text-left"
                        >
                          <span>{tool.emoji}</span>
                          <span className="truncate flex-1">{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Clone This Site Button with Gold Styling */}
                <DropdownMenuItem 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    createTimePortalEffect('https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge');
                  }}
                  className="text-yellow-100 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-amber-500/20 rounded flex items-center space-x-2 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 border border-yellow-500/30 p-2 font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  <span>Clone This Site</span>
                </DropdownMenuItem>

                {/* AI HUMAN BILL OF RIGHTS - bottom featured button */}
                <DropdownMenuItem
                  onClick={(e) => { e.preventDefault(); createTimePortalEffect('https://human-ai-guardian.lovable.app'); }}
                  className="text-amber-100 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-cyan-500/30 rounded flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600/20 via-cyan-600/20 to-emerald-600/20 border border-amber-400/50 p-2.5 mt-2 font-bold tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                >
                  <span>⚖️</span>
                  <span>AI HUMAN BILL OF RIGHTS</span>
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

export default TabletMenu;
