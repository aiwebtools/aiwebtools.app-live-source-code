
import { useState, useEffect } from "react";
import { Search, Sparkles, Zap, Brain, Rocket, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalSearchBar from "./GlobalSearchBar";
import { useDeferredAnimation } from "@/hooks/useReducedMotion";
import DeferredMount from "./DeferredMount";

const HERO_TOOL_STATS = { total: 4571, marketing: "5,500+", categories: 21 };

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState(0);
  const [showBrandName, setShowBrandName] = useState(false);
  const toolStats = HERO_TOOL_STATS;
  
  // Show animations immediately
  const animationsReady = useDeferredAnimation();
  
  const words = [
    "Find",
    "Discover", 
    "Access",
    "Explore",
    "Browse",
    "Search"
  ];

  useEffect(() => {
    // Only start text animations after page has loaded
    if (!animationsReady) return;
    
    const brandInterval = setInterval(() => {
      setShowBrandName(prev => !prev);
    }, 4000);
    
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    
    return () => {
      clearInterval(brandInterval);
      clearInterval(wordInterval);
    };
  }, [animationsReady]);

  const handleExploreAITools = () => {
    navigate('/main-category/ALL%20AI%20TOOLS');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pt-32 md:pt-36 lg:pt-40" style={{ contain: 'layout style' }}>
      {/* Animated background elements - lighter blur for better perf */}
      {animationsReady && (
        <div className="absolute inset-0 overflow-hidden" style={{ willChange: 'auto' }}>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-2xl"></div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* SEO + accessibility — visible H1 (small, unobtrusive) so screen readers
            and crawlers see a real visual heading, not display:none text. */}
        <h1 className="text-center text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-cyan-300/80 mb-2">
          AI WEB TOOLS — 5,500+ AI WEB TOOLS DIRECTORY FOR 2026 AND BEYOND
        </h1>
        
        {/* Main heading with stabilized layout */}
        <div className="mb-6">
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" role="heading" aria-level={2}>
            {/* First line - Animated between tool count and brand name */}
            <div className="relative h-20 md:h-24 lg:h-28 mb-3 flex items-center justify-center">
              <span 
                className={`absolute text-white hero-3d-text hero-stroke-text transition-all duration-1000 ease-in-out ${
                  showBrandName ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                data-text={`${toolStats.marketing} TOOLS`}
              >
                {toolStats.marketing} TOOLS
              </span>
              <span 
                className={`absolute text-white hero-3d-glow hero-stroke-text transition-all duration-1000 ease-in-out ${
                  showBrandName ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
                data-text="AI WEB TOOLS"
              >
                AI WEB TOOLS
              </span>
            </div>
            
            {/* Second line with animated word - FIXED width container to prevent jumping */}
            <span className="text-3xl md:text-4xl lg:text-5xl text-white block">
              <span 
                className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent hero-animated-word hero-stroke-text inline-block transitioning-word"
                style={{ 
                  width: '220px',
                  textAlign: 'center',
                  display: 'inline-block',
                  textShadow: '0 0 20px rgba(0, 255, 0, 0.5)'
                }}
                data-text={words[currentWord]}
              >
                {words[currentWord]}
              </span>
              <span className="ml-4 hero-3d-glow hero-stroke-text" data-text="& Compare">& Compare</span>
            </span>
          </div>
          
          {/* Clear value proposition subtitle */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-green-100 font-medium max-w-4xl mx-auto leading-relaxed hero-white-stroke">
               The largest directory of AI Web Tools for productivity, creativity, education, and business.{"\u00a0"}
              <span className="text-green-400 font-semibold hero-white-stroke" style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}> Find the perfect AI tool for any task.</span>
            </p>
          </div>
        </div>

        {/* Search section with stable positioning */}
        <div className="mb-8 max-w-4xl mx-auto" style={{ minHeight: '80px' }}>
          <GlobalSearchBar />
        </div>

        {/* Primary CTA Button */}
        <div className="mb-6">
          <button
            onClick={handleExploreAITools}
            className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-xl rounded-full shadow-2xl shadow-green-500/40 hover:shadow-green-400/60 transform hover:scale-105 transition-all duration-300 border-2 border-green-400 hover:border-green-300"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
          >
            <span className="flex items-center space-x-3">
              <Search className="w-7 h-7" />
              <span>Browse All {toolStats.marketing} AI Tools</span>
              <Sparkles className="w-7 h-7 group-hover:animate-spin" />
            </span>
          </button>
        </div>

        {/* Secondary CTA - Search hint */}
        <div className="mb-8">
          <p className="text-green-200/80 text-base">
             💡 Try searching: "ChatGPT", "image generator", "video editor", or I want to make a movie"
          </p>
        </div>

        {/* Stats - updated with new verbiage */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent" style={{ textShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}>{toolStats.marketing}</div>
            <div className="text-green-200 text-sm">AI WEB TOOLS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent" style={{ textShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}>100%</div>
            <div className="text-green-200 text-sm">Free AI Web Tool Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent" style={{ textShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}>24/7</div>
            <div className="text-green-200 text-sm">FREE TO CLONE / MAKE YOUR OWN VERSION</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
