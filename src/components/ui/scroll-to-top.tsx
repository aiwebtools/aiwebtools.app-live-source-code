import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const touchStartY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible((v) => v || true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true);
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressed) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    
    // If user swipes up significantly (more than 30px), trigger scroll to top
    if (deltaY > 30) {
      scrollToTop();
      setIsPressed(false);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  if (!isVisible) return null;

  return (
    <Button
      ref={buttonRef}
      onClick={scrollToTop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110 active:scale-95 ${
        isPressed ? 'scale-95 bg-cyan-800' : ''
      }`}
      size="sm"
      aria-label="Scroll to top - Click or swipe up"
      style={{ 
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <ArrowUp className={`w-5 h-5 transition-transform duration-200 ${isPressed ? 'scale-110' : ''}`} />
    </Button>
  );
};

export default ScrollToTop;