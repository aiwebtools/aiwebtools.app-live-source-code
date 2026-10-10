
import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import MobileMenu from "./header/MobileMenu";
import DesktopMenu from "./header/DesktopMenu";
import TabletMenu from "./header/TabletMenu";
import JoinEmailListButton from "./JoinEmailListButton";

const getViewportMenu = () => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

const Header = () => {
  const [viewportMenu, setViewportMenu] = useState(getViewportMenu);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setViewportMenu(getViewportMenu()));
    };
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-[100] bg-black/95 border-b border-cyan-500/30 shadow-lg">
      {/* Cosmic scrolling marquee - top strip */}
      <div
        aria-label="Cosmic message"
        className="w-full overflow-hidden bg-black border-b border-matrix-green/30 py-1"
      >
        <div className="cosmic-marquee-track whitespace-nowrap text-[10px] md:text-[11px] font-mono tracking-[0.18em] text-matrix-green/90">
          <span className="mx-8 inline-block">
            Believe In Yourself....Light&Fire Within Us...Space Within Us....It's Dope
          </span>
        </div>
      </div>
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between min-h-[50px] md:min-h-[60px] gap-2">
          {/* Logo - smaller on mobile */}
          <div className="flex-shrink min-w-0">
            <Logo />
          </div>
          
          {/* Menu buttons - always visible */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <a
              href="https://github.com/aiwebtools/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AIWebTools GitHub — open source code (opens in a new window)"
              title="AIWebTools GitHub — Open Source"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-green-500/50 text-green-300 hover:text-white hover:bg-green-500/20 hover:border-green-400 transition-all duration-300"
            >
              <Github className="h-4 w-4" />
            </a>
            {viewportMenu === "desktop" && (
              <JoinEmailListButton source="header" variant="compact" className="hidden md:inline-flex" />
            )}
            {viewportMenu === "desktop" && <Navigation />}
            {viewportMenu === "mobile" && <MobileMenu />}
            {viewportMenu === "desktop" && <DesktopMenu />}
            {viewportMenu === "tablet" && <TabletMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
