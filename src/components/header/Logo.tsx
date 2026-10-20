
import { Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createTimePortalEffect } from "@/utils/timeEffects";

const Logo = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();

  const scrollToHome = () => {
    // Make Home feel INSTANT: no slow smooth scroll
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      navigate('/');
      // Ensure we jump to top right after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 0);
    }
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌀 External link clicked in header:', url);
    createTimePortalEffect(url);
  };

  return (
    <div className={`flex items-center gap-2 md:gap-3 flex-shrink min-w-0 relative z-[110] ${compact ? 'scale-90' : ''}`}>
      {/* Home Button on the LEFT so the wording flows right without being smooshed */}
      <button
        onClick={scrollToHome}
        className={`
          group relative flex-shrink-0 
          ${compact ? 'w-9 h-9' : 'w-10 h-10 md:w-12 md:h-12'} 
          rounded-full 
          bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20
          border border-cyan-400/50
          hover:border-cyan-300
          transition-all duration-300 
          hover:scale-110
          flex items-center justify-center
          overflow-hidden
          shadow-[0_0_20px_rgba(6,182,212,0.3)]
          hover:shadow-[0_0_30px_rgba(6,182,212,0.5),0_0_60px_rgba(6,182,212,0.2)]
        `}
        title="Go to Home"
        aria-label="Home"
      >
        {/* Animated background ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse" />
        
        {/* Inner glow effect */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent" />
        
        {/* Rotating accent ring (subtle) */}
        <div 
          className="absolute inset-0 rounded-full border border-cyan-300/20 group-hover:border-cyan-300/40 transition-colors"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(6,182,212,0.1), transparent, rgba(6,182,212,0.1), transparent)'
          }}
        />
        
        {/* Home Icon */}
        <Home 
          className={`
            ${compact ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} 
            text-cyan-300 
            drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]
            group-hover:text-white
            group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]
            transition-all duration-300
            relative z-10
          `} 
        />
        
        {/* Sparkle accent on hover */}
        <Sparkles 
          className="absolute top-1 right-1 w-3 h-3 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" 
        />
      </button>

      <div className="text-left flex-1 min-w-0">
        {/* Main title row */}
        <div className={`flex items-center gap-1 md:gap-2 ${compact ? 'mb-0' : 'mb-0.5 md:mb-1'}`}>
          <div className={`font-bold ${compact ? 'text-[11px]' : 'text-[13px] sm:text-base md:text-lg'} tracking-wider letter-spacing-wide relative leading-tight`}>
            <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent logo-text-crisp">AI WEB TOOLS DIRECTORY</span>
            <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent logo-text-crisp hidden md:inline"> - AIWEBTOOLS.APP</span>
          </div>
          {!compact && (
            <span className="text-xs text-cyan-200/80 font-medium hidden 2xl:block tracking-wide">
              AN AI TOOLS DIRECTORY
            </span>
          )}
        </div>

        {/* Mobile-visible branding info - now clickable link to new domain */}
        <div className={`${compact ? 'text-[8px]' : 'text-[9px] sm:text-[10px] md:text-xs'} -mt-0.5 truncate`}>
          <a
            href="https://aiwebtools.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleExternalLink("https://aiwebtools.app", e)}
            className="font-light tracking-wide text-cyan-300 hover:text-cyan-200 transition-colors underline-offset-2 hover:underline"
            title="Visit AIWEBTOOLS.APP"
          >
            aiwebtools.app
          </a>
        </div>

        {/* AIWebTools.ai link - always visible */}
        <div className={`${compact ? 'text-[8px]' : 'text-[9px] sm:text-[10px] md:text-xs'} text-gray-400 mt-0 truncate`}>
          MADE BY AWT-{" "}
          <button
            onClick={(e) => handleExternalLink("https://aiwebtools.lovable.app/?via=aiwebtools", e)}
            className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:text-shadow-glow font-medium tracking-wide"
          >
            AIWEBTOOLS.AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logo;
