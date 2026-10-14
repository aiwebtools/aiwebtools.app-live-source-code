import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "@/components/HeroSection";
import ImprovedSEOHead from "@/components/ImprovedSEOHead";
import GoogleRankingBooster from "@/components/seo/GoogleRankingBooster";
import { Button } from "../components/ui/button";
import DeferredMount from "@/components/DeferredMount";
import SectionLoading from "@/components/SectionLoading";
import { lazyWithRetry as lazy } from "@/utils/lazyWithRetry";
import { useMobile } from "@/hooks/useMobile";
import CategoryPageSelection from "@/components/CategoryPageSelection";

const loadSpecialServices = () => import("@/components/SpecialServices");
const loadFeaturedTools = () => import("@/components/LazyFeaturedTools");
// Warm the featured GPT cards immediately (even behind the access/disclaimer
// screens) so they are ready the moment the visitor reaches them.
if (typeof window !== "undefined") { void loadSpecialServices().catch(() => {}); window.setTimeout(() => { void loadFeaturedTools().catch(() => {}); }, 400); }
const SpecialServices = lazy(loadSpecialServices);
const Footer = lazy(() => import("@/components/Footer"));
const ScrollToTop = lazy(() => import("@/components/ui/scroll-to-top"));
const BookPromotionCard = lazy(() => import("@/components/BookPromotionCard"));
const LazyFeaturedTools = lazy(loadFeaturedTools);
const LazySearchPortal = lazy(() => import("@/components/LazySearchPortal"));
const InteractiveMatrixBackground = lazy(() => import("@/components/InteractiveMatrixBackground"));
const AnimatedBackground = lazy(() => import("@/components/AnimatedBackground"));
const CloneOfferPopup = lazy(() => import("@/components/CloneOfferPopup"));
const LovableInvitePopup = lazy(() => import("@/components/LovableInvitePopup"));
const AIWebToolsSEOSection = lazy(() => import("@/components/seo/AIWebToolsSEOSection"));
const EthicalAIQuoteSection = lazy(() => import("@/components/EthicalAIQuoteSection"));
const InspirationCarousel = lazy(() => import("@/components/InspirationCarousel"));
const TikTokFeedSection = lazy(() => import("@/components/social/TikTokFeedSection"));
const AwtTextToSpeech = lazy(() => import("@/components/AwtTextToSpeech"));



// Removed loading spinner - causes perceived slowness on refresh

const Index = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  // On mobile, defer the heavy matrix canvas way longer so the user's
  // very first scroll-touch isn't fighting a full-screen rAF loop.
  // Keep animated full-screen canvases out of the opening interaction window
  // on every device. Fast desktops do not benefit from starting two animation
  // systems while the visitor makes their first scroll/click.
  const matrixBgDelay = isMobile ? 15000 : 12000;
  const firstScrollSafeDelay = 12000;

  const [mainVideoActive, setMainVideoActive] = useState(false);

  // Force scroll to top on mount - fixes "start at bottom" glitch after disclaimer
  useEffect(() => {
    // Immediate scroll reset
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("aiwt:route-ready"));
    }, 160);

    return () => {
      window.clearTimeout(id);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <ImprovedSEOHead pageType="homepage" />
      
      {/* SEO booster - keep off the first paint path */}
      <DeferredMount delay={firstScrollSafeDelay} mountOnVisible={false}>
        <GoogleRankingBooster pageType="homepage" />
      </DeferredMount>
      
      {/* Background effects - on mobile we defer aggressively so the first
          finger-scroll is instant and doesn't fight the matrix canvas rAF. */}
      <DeferredMount delay={matrixBgDelay} mountOnVisible={false}>
        <Suspense fallback={null}>
          <InteractiveMatrixBackground />
          <AnimatedBackground />
        </Suspense>
      </DeferredMount>
      
      {/* Fixed Header - outside of relative container */}
      <Header />
      
      <main className="relative z-10 pt-[70px] md:pt-[85px]">
        <HeroSection />
        
        {/* Featured Video Section: lite YouTube embed so mobile scroll never waits on iframe boot. */}
        <section className="py-12 md:py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #001a00 50%, #0a0a0a 100%)' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-green-400" style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}>AI WEB TOOLS THAT BEND THE FABRIC OF WHAT IS POSSIBLE</span>
              </h2>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="relative w-full aspect-video rounded-xl border border-green-500/30 bg-slate-950 overflow-hidden shadow-2xl shadow-green-500/10">
                {mainVideoActive ? (
                  <iframe
                    className="absolute inset-0 w-full h-full bg-slate-950"
                    src="https://www.youtube.com/embed/4zflGSSuBcA?autoplay=1&controls=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&vq=hd1080&iv_load_policy=3&cc_load_policy=0&fs=1&color=red&theme=dark"
                    title="AI Web Tools Featured Video - 1080p HD"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setMainVideoActive(true)}
                    className="absolute inset-0 w-full h-full group touch-manipulation"
                    aria-label="Play AI Web Tools featured video"
                  >
                    <img
                      src="https://i.ytimg.com/vi/4zflGSSuBcA/hqdefault.jpg"
                      alt="AI Web Tools featured video preview"
                      className="h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-95"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute inset-0 bg-gradient-to-br from-black/30 via-emerald-950/20 to-black/60" />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-green-500/90 text-4xl shadow-2xl shadow-green-400/40 transition-transform duration-200 group-hover:scale-105">▶</span>
                      <span className="rounded-full border border-green-400/40 bg-black/70 px-5 py-2 text-sm font-bold text-green-100 backdrop-blur-sm">Tap to load HD video</span>
                    </span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  onClick={() => navigate('/main-category/ALL%20AI%20TOOLS')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 text-lg"
                  style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
                >
                  🚀 Browse All AI Tools
                </Button>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10 font-bold px-8 py-4 text-lg"
                >
                  🔍 Back to Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Custom GPT collection sits directly under the main video. */}
        <DeferredMount delay={0} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <SpecialServices />
          </Suspense>
        </DeferredMount>

        {/* Free AWT text-to-speech generator: lightweight, browser-voice powered. */}
        <DeferredMount delay={1600} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <AwtTextToSpeech />
          </Suspense>
        </DeferredMount>

        {/* Lightweight and immediately available: this is the first content a
            visitor reaches, so never compile/mount it during their first scroll. */}
        <div id="categories-section">
          <CategoryPageSelection />
        </div>
        
        <DeferredMount delay={2400} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <AIWebToolsSEOSection />
          </Suspense>
        </DeferredMount>
   
        <DeferredMount delay={0} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <LazyFeaturedTools onToolsLoaded={(count) => {}} />
          </Suspense>
        </DeferredMount>

        <DeferredMount delay={2000} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <BookPromotionCard />
          </Suspense>
        </DeferredMount>

        <DeferredMount delay={2600} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <TikTokFeedSection />
          </Suspense>
        </DeferredMount>

        
        <DeferredMount delay={2800} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <section className="py-16 relative" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #001a00 50%, #0a0a0a 100%)' }}>
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                     <span className="text-green-400" style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}>🔍 SEARCH ALL OTHER AI TOOLS</span>
                  </h2>
                  <p className="text-xl text-green-200 max-w-3xl mx-auto mb-4">
                     Explore our complete database of AI Web Tools with advanced search and filtering
                  </p>
                </div>
                
                <LazySearchPortal />
              </div>
            </section>
          </Suspense>
        </DeferredMount>
        
        <DeferredMount delay={isMobile ? 3200 : 860} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <EthicalAIQuoteSection />
          </Suspense>
        </DeferredMount>
        
        <DeferredMount delay={isMobile ? 3600 : 920} fallback={<SectionLoading />}>
          <Suspense fallback={<SectionLoading />}>
            <InspirationCarousel />
          </Suspense>
        </DeferredMount>

        <Suspense fallback={null}>
          <ScrollToTop />
          <Footer />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <CloneOfferPopup />
        <LovableInvitePopup />
      </Suspense>
    </div>
  );
};

export default Index;
