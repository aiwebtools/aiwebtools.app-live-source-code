
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
          group relative flex-shrink-0 ${compact ? '' : 'hidden sm:flex'}
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
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); scrollToHome(); }}
          className={`awt-brand-mark block ${compact ? 'text-[15px]' : 'text-[17px] sm:text-xl md:text-2xl'}`}
          title="AIWEBTOOLS.APP — An AI tools directory driven by imagination"
          aria-label="AIWEBTOOLS.APP home"
        >
          <span>AI</span>WEBTOOLS<span>.APP</span>
        </a>
        <p className={`awt-brand-tagline ${compact ? 'text-[7px]' : 'text-[7.5px] sm:text-[9px] md:text-[11px]'}`}>
          AN AI TOOLS DIRECTORY DRIVEN BY IMAGINATION
        </p>
        <div className={`${compact ? 'text-[8px]' : 'text-[8px] sm:text-[10px] md:text-xs'} text-muted-foreground mt-0.5 truncate hidden sm:block`}>
          MADE BY AWT-{" "}
          <button
            onClick={(e) => handleExternalLink("https://aiwebtools.lovable.app/?via=aiwebtools", e)}
            className="text-primary hover:opacity-80 font-medium tracking-wide"
          >
            AIWEBTOOLS.AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logo;
