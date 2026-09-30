import { downloadAllOperationalInstructions } from "@/utils/downloads";
import { Menu, Phone, X, Globe, ChevronDown, Download, Trees, Clapperboard, Heart, Copy, Clock, Github } from "lucide-react";
import mtvAiWebToolsLogo from "@/assets/mtv-aiwebtools-logo.png";
import { useState, useRef, useCallback, useEffect, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useFavorites } from "@/hooks/useFavorites";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { triggerPublicDownload } from "@/utils/downloads";
import { playMtvFlash } from "@/utils/mtvFlash";
import { createConfettiCelebration } from "@/utils/effects/audioEffects";
import Logo from "./Logo";
import GlobalSearchBar, { prefetchGlobalSearchBar } from "@/components/LazyGlobalSearchBar";
import JoinEmailListButton from "@/components/JoinEmailListButton";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";

import { useRecentlyVisitedTools } from "@/hooks/useRecentlyVisitedTools";

const MobileMenu = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWeb3Open, setIsWeb3Open] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only load heavy data when menu is open
  const { recentTools } = useRecentlyVisitedTools();
  
  // Lazy load favorites count
  let getFavoritesCount = () => 0;
  try {
    const favoritesContext = useFavorites();
    getFavoritesCount = favoritesContext.getFavoritesCount;
  } catch (error) {
    // Fallback silently
  }
  
  const openedAtRef = useRef(0);

  const handleMenuToggle = useCallback((open: boolean) => {
    if (open) {
      openedAtRef.current = Date.now();
      // Chunk is already warming from the trigger's pointerdown; ensure it either way.
      prefetchGlobalSearchBar();
      setIsMenuOpen(true);
      return;
    }
    // Ignore the phantom close that fires from the same tap that opened the menu
    // (mobile browsers emit a delayed synthetic click ~300-500ms after touchend)
    if (Date.now() - openedAtRef.current < 700) return;
    setIsMenuOpen(false);
  }, []);




  const handleExternalLink = useCallback((url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    createTimePortalEffect(url);
    setIsMenuOpen(false);
  }, []);

  /**
   * Navigate without the tap→page freeze: close the menu first so the UI
   * responds on the same frame, then route inside a transition on the next
   * frame so the lazy route chunk never blocks the click handler.
   */
  const go = useCallback((path: string) => {
    openedAtRef.current = 0;
    setIsMenuOpen(false);
    requestAnimationFrame(() => {
      startTransition(() => navigate(path));
    });
  }, [navigate]);

  const handleBrowseAITools = useCallback(() => {
    go('/main-category/ALL%20AI%20TOOLS');
  }, [go]);

  const openDownloads = useCallback(() => {
    openedAtRef.current = Date.now();
    prefetchGlobalSearchBar();
    setIsToolsOpen(true);
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    openedAtRef.current = 0;
    setIsMenuOpen(false);
  }, []);

  // Enhanced CSV download with all comprehensive data fields
  const handleDownloadAllToolsCSV = async () => {
    try {
      // Trigger confetti celebration first
      createConfettiCelebration();
      const { allTools } = await import("@/data/toolsData");
      
      console.log(`📊 Generating comprehensive CSV with ${allTools.length} tools...`);
      
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
      // Prepend a metadata banner so every export carries site + clone info
      const meta = [
        ["# AIWebTools.ai — Complete AI Tools Directory Export"],
        ["# Website", "https://aiwebtools.app"],
        ["# Clone This AI Tool Empire (FREE)", "https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge"],
        ["# Total Tools", String(allTools.length)],
        ["# Exported", new Date().toISOString()],
        [""],
      ];
      const csv = [...meta, headers, ...rows]
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
      
      // Also download the GPT Instructions ZIP file
      setTimeout(() => {
        downloadAllOperationalInstructions();
        console.log('🎁 Also downloaded 150+ GPT Instructions ZIP!');
      }, 500);
      
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Failed to generate comprehensive CSV:", err);
    }
  };

  // Touch/swipe handling for closing menu
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY.current;
    const deltaX = Math.abs(touchEndX - (touchStartX.current || 0));
    
    // Swipe down to close (at least 80px down, and more vertical than horizontal)
    if (deltaY > 80 && deltaY > deltaX) {
      closeMenu();
    }
    
    touchStartY.current = null;
    touchStartX.current = null;
  }, [closeMenu]);

  return (
    <>
      <div className="flex items-center gap-2 md:hidden">  {/* Show on mobile only */}
        {/* No custom backdrop: Radix handles outside dismissal. A manual overlay
            caught the delayed synthetic tap-click and closed the menu instantly. */}

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={openDownloads}
          className="h-11 w-11 shrink-0 border-primary/60 bg-background/90 text-primary shadow-lg"
          aria-label="Open CSV and operational instructions downloads"
          title="Downloads"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
        </Button>

        <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuToggle} modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-cyan-400 bg-cyan-500/20 text-cyan-100 px-4 py-3 min-w-[56px] min-h-[56px] rounded-xl active:bg-cyan-500/40"
              aria-label="Open menu"
              onPointerDown={prefetchGlobalSearchBar}
              style={{ touchAction: 'manipulation', transform: 'translateZ(0)' }}
            >
              <Menu className="w-7 h-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            ref={dropdownRef}
            className="w-[95vw] max-w-[400px] bg-black border-2 border-cyan-500/50 max-h-[68vh] overflow-visible z-[110]"
            align="end"
            side="bottom"
            alignOffset={0}
            sideOffset={16}
            avoidCollisions={true}
            collisionPadding={{ top: 80, left: 10, right: 10, bottom: 10 }}
            sticky="always"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              scrollBehavior: 'auto',
              overscrollBehavior: 'contain',
              transform: 'translateZ(0)',
              willChange: 'auto',
              contain: 'layout style paint'
            }}
          >
            {/* Sticky Close Button - Always visible while scrolling */}
            <div className="sticky top-0 z-[130] flex justify-end p-2 pointer-events-none bg-black">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="pointer-events-auto h-10 w-10 p-0 text-red-400 bg-black/80 border border-red-500/50 rounded-full active:bg-red-500/70"
                aria-label="Close menu"
                style={{ touchAction: 'manipulation', transform: 'translateZ(0)' }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 pt-0 overflow-y-scroll max-h-[64vh]" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain', transform: 'translateZ(0)' }}>
              {/* Redesigned Header Section */}
              <div className="relative mb-5">
                {/* Glowing header background */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent rounded-2xl -z-10" />
                
                {/* Logo and branding */}
                <div className="flex flex-col items-center pt-2 pb-4">
                  <Logo compact={true} />
                  
                  {/* Animated divider line */}
                  <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent my-3" />
                  
                  {/* Tagline with glow */}
                  <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    AI Tools Navigator
                  </h2>
                  <p className="text-xs text-cyan-200/70 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Discover • Create • Innovate
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </p>
                </div>
                
                {/* Bottom border glow */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              </div>

              {/* Search Bar - At top for easy access */}
              <div className="mb-4">
                <div className="text-xs text-cyan-400 mb-2">🔍 Search AI Tools</div>
                <GlobalSearchBar autoFocus />
              </div>

              {/* Downloads stay above the fold when opened from the header icon. */}
              <div className="mb-4 grid gap-2 border-y border-primary/30 py-3">
                <DownloadLibraryButton
                  compact
                  label="Download 3,200+ Instructions + Source Code"
                  onBeforeOpen={closeMenu}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadAllToolsCSV}
                  className="min-h-11 w-full justify-center gap-2 border-primary/50 bg-background text-xs font-bold text-primary"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download All 5,500+ AI Tools (CSV)
                </Button>
              </div>

              <>
              {/* MTVai.live — square MTV-logo entry button (matches Desktop menu) */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  playMtvFlash().then(() => go('/music-stream'));
                }}
                className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-fuchsia-500/50 bg-gradient-to-r from-fuchsia-600/30 via-purple-600/30 to-cyan-600/30 active:from-fuchsia-500/40 active:via-purple-500/40 active:to-cyan-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                aria-label="Open MTVai Theater"
                title="Enter MTVai.live — 24/7 AI music videos"
              >
                <img
                  src={mtvAiWebToolsLogo}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="w-9 h-9 rounded-md drop-shadow-[0_0_8px_rgba(236,72,153,0.85)]"
                />
                <span className="font-mono text-[12px] font-bold tracking-[0.16em] uppercase text-fuchsia-100" style={{ textShadow: '0 0 6px rgba(168,85,247,0.7)' }}>
                  🎬 MTVai.live · Enter Theater
                </span>
              </button>

              {/* Navigation Section */}
              <DropdownMenuItem onClick={() => go('/')} className="text-cyan-100 hover:bg-cyan-500/20 mb-3 rounded-lg h-12 text-sm font-medium px-3">
                <span className="mr-3 text-lg">🏠</span> Home
              </DropdownMenuItem>
              
              {/* Browse Categories + Clone Empire — side-by-side compact tiles */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={handleBrowseAITools}
                  className="rounded-lg p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-[11px] leading-tight shadow-lg shadow-cyan-500/30 border border-cyan-400/50 active:scale-[0.97] transition-transform flex flex-col items-center justify-center gap-1 min-h-[64px]"
                >
                  <span className="text-lg leading-none">🎯</span>
                  <span className="text-center">Browse AI Tool Categories</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleExternalLink('https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge', e);
                  }}
                  className="relative overflow-hidden rounded-lg p-2.5 text-black font-black text-[11px] leading-tight active:scale-[0.97] transition-transform flex flex-col items-center justify-center gap-0.5 min-h-[64px] border border-yellow-200/60"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'goldShimmer 2s ease-in-out infinite',
                    boxShadow: '0 0 18px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  <span className="text-base leading-none">⚡</span>
                  <span className="text-center tracking-wide">CLONE THIS AI EMPIRE</span>
                  <span className="text-black/70 text-[8px] font-bold tracking-wider">100% FREE</span>
                </button>
                <style>{`
                  @keyframes goldShimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                  }
                `}</style>
              </div>

              <DropdownMenuSeparator className="border-gray-700 mb-2" />
                
              {/* WEB3 Domains Section — compact */}
              <Collapsible open={isWeb3Open} onOpenChange={setIsWeb3Open}>
                <CollapsibleTrigger 
                  className="w-full rounded-lg flex items-center justify-between px-3 py-2 text-sm outline-none border border-purple-500/40 bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-100 active:bg-purple-500/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsWeb3Open(!isWeb3Open);
                  }}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Globe className="w-4 h-4 text-cyan-300" />
                    <span>WEB3 Domains</span>
                    <span className="text-[9px] font-bold text-emerald-300 tracking-wider">· NFT · OWN FOREVER</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isWeb3Open ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-4 max-h-60 overflow-y-auto pr-1">
                  <div className="text-xs text-cyan-400 mb-1 font-semibold">💰 Financial & Cash Transfer</div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/transfermoney", e); }} className="flex-1 text-left">💸 .transfermoney</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/transfercoin", e); }} className="flex-1 text-left">🪙 .transfercoin</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/cointransfer", e); }} className="flex-1 text-left">💰 .cointransfer</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/transfercash", e); }} className="flex-1 text-left">💵 .transfercash</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/cashtransfer", e); }} className="flex-1 text-left">💴 .cashtransfer</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  
                  <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🤖 AI & Technology</div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/ai-tools?ref=olive-ears-obey", e); }} className="flex-1 text-left">🧠 .ai-tools</button>
                    <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/.aiwebtools?ref=olive-ears-obey", e); }} className="flex-1 text-left">🤖 .aiwebtools</button>
                    <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/aimainframe?ref=olive-ears-obey", e); }} className="flex-1 text-left">🗄️ .aimainframe</button>
                    <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/aitoolscompany?ref=olive-ears-obey", e); }} className="flex-1 text-left">🏢 .aitoolscompany</button>
                    <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                  </div>
                  
                  <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🤖 Robotics & Automation</div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/robotsales?ref=olive-ears-obey", e); }} className="flex-1 text-left">🦾 .robotsales</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/robotshop?ref=olive-ears-obey", e); }} className="flex-1 text-left">🛍️ .robotshop</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/robotstore?ref=olive-ears-obey", e); }} className="flex-1 text-left">🛒 .robotstore</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  
                  <div className="text-xs text-cyan-400 mt-3 mb-2 font-semibold">🌍 Global & World</div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/worldpeace?ref=olive-ears-obey", e); }} className="flex-1 text-left">🕊️ .worldpeace</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/worldtrade?ref=olive-ears-obey", e); }} className="flex-1 text-left">🌐 .worldtrade</button>
                    <span className="text-xs bg-green-600/20 text-green-300 px-1 py-0.5 rounded border border-green-500/30 ml-2">Solana</span>
                  </div>
                  <div className="flex justify-between items-center w-full px-3 py-1 rounded-md hover:bg-white/5 hover:text-cyan-300 transition-colors text-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExternalLink("https://freename.io/discover/worldtrader?ref=olive-ears-obey", e); }} className="flex-1 text-left">💹 .worldtrader</button>
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30 ml-2">Polygon</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <DropdownMenuSeparator className="border-gray-700 mb-2" />
              
              {/* Music Stream button lives at the top of the menu now (MTV logo) */}

              {/* About & Company Accordion */}
              <Collapsible open={isAboutOpen} onOpenChange={setIsAboutOpen}>
                <CollapsibleTrigger 
                  className="w-full text-cyan-100 hover:bg-cyan-500/20 rounded flex items-center justify-between px-2 py-1 text-sm outline-none focus:bg-cyan-500/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsAboutOpen(!isAboutOpen);
                  }}
                >
                  <span className="flex items-center">
                    🏢 About & Company
                  </span>
                  <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-2">
                  <DropdownMenuItem onClick={(e) => handleExternalLink('https://linktr.ee/aiwebtools', e)} className="text-cyan-100 hover:bg-cyan-500/20 mb-1 rounded text-sm">
                    <Trees className="w-3 h-3 mr-2" /> Linktree
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleExternalLink('https://www.tiktok.com/@aiwebtools', e)} className="text-cyan-100 hover:bg-cyan-500/20 mb-1 rounded text-sm">
                    <Clapperboard className="w-3 h-3 mr-2" /> TikTok
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleExternalLink('https://github.com/aiwebtools/', e)} className="text-cyan-100 hover:bg-cyan-500/20 mb-1 rounded text-sm">
                    <Github className="w-3 h-3 mr-2" /> GitHub — Open Source
                  </DropdownMenuItem>
                  <div className="flex items-center space-x-2 text-cyan-100 px-3 py-1 rounded hover:bg-cyan-500/20 mb-2 text-sm">
                    <Phone className="w-3 h-3" />
                    <a href="tel:+14758008096" className="hover:text-cyan-400 transition-colors">
                      📞 Contact: 475-800-8096
                    </a>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Tools & Downloads Accordion */}
              <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
                <CollapsibleTrigger 
                  className="w-full text-cyan-100 hover:bg-cyan-500/20 rounded flex items-center justify-between px-2 py-1 text-sm outline-none focus:bg-cyan-500/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsToolsOpen(!isToolsOpen);
                  }}
                >
                  <span className="flex items-center">
                    🔧 Tools & Downloads
                  </span>
                  <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-2">
                  <div className="px-1 pb-1">
                    <DownloadLibraryButton
                      compact
                      label="Free 3,200+ GPT Instructions"
                      onBeforeOpen={closeMenu}
                    />
                  </div>
                  <DropdownMenuItem onClick={handleDownloadAllToolsCSV} className="text-cyan-100 hover:bg-cyan-500/20 mb-1 rounded text-sm">
                    <Download className="w-3 h-3 mr-2" />
                    📊 Download ALL 5,500+ AI Tools (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                     onClick={(e) => { 
                       e.preventDefault();
                       handleExternalLink("https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge", e);
                     }}
                    className="text-yellow-100 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-amber-500/20 mb-2 rounded flex items-center space-x-2 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 border border-yellow-500/30 p-2"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="font-semibold text-sm">Clone This Site</span>
                  </DropdownMenuItem>
                </CollapsibleContent>
              </Collapsible>

              {/* Recently Visited Tools */}
              {recentTools.length > 0 && (
                <div className="mb-3">
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

              {/* Favorites - Standalone */}
              <DropdownMenuItem onClick={() => go('/favorites')} className="text-cyan-100 hover:bg-cyan-500/20 mb-2 rounded flex items-center space-x-2 text-sm">
                <Heart className="w-3 h-3 fill-current text-red-500" />
                <span>Favorites ({getFavoritesCount()})</span>
              </DropdownMenuItem>

              {/* AI HUMAN BILL OF RIGHTS - bottom featured button */}
              <DropdownMenuItem
                onClick={(e) => handleExternalLink("https://human-ai-guardian.lovable.app", e)}
                className="text-amber-100 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-cyan-500/30 rounded flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600/20 via-cyan-600/20 to-emerald-600/20 border border-amber-400/50 p-2.5 font-bold tracking-wide mb-2 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              >
                <span>⚖️</span>
                <span>AI HUMAN BILL OF RIGHTS</span>
              </DropdownMenuItem>

              {/* Join Email List CTA - placed after Bill of Rights */}
              <div className="mb-3">
                <JoinEmailListButton
                  source="mobile-menu"
                  variant="mobile"
                  onBeforeOpen={() => setIsMenuOpen(false)}
                />
              </div>

              {/* Close Button */}
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              </>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default MobileMenu;