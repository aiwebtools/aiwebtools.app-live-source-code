import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles } from "lucide-react";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { schedulePromotion } from "@/utils/promotionalPopups";

// Served from /public to guarantee a stable URL inside id-preview and
// avoid any bundler/asset-pipeline edge cases where the import resolves
// to a hashed asset that fails to load before the dialog renders.
const cloneKingdomImage = "/clone-popup/clone-kingdom.jpg";
const clonePopup4 = "/clone-popup/clone-popup-4.jpg";
const clonePopup5 = "/clone-popup/clone-popup-5.jpg";
const clonePopup6 = "/clone-popup/clone-popup-6.jpg";
const clonePopup7 = "/clone-popup/clone-popup-7.jpg";
const clonePopup8 = "/clone-popup/clone-popup-8.jpg";

const popupImages: Record<number, string> = {
  4: clonePopup4,
  5: clonePopup5,
  6: clonePopup6,
  7: clonePopup7,
  8: clonePopup8,
};

const CloneOfferPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCount, setShowCount] = useState(0);
  const dismissPromotion = useRef<() => void>(() => {});
  const closePopup = () => { dismissPromotion.current(); setIsOpen(false); };

  // Function to pause all videos on the page
  const pauseAllVideos = () => {
    const videos = document.querySelectorAll('video, iframe');
    videos.forEach((video) => {
      if (video instanceof HTMLVideoElement) {
        video.pause();
        video.muted = true;
      } else if (video instanceof HTMLIFrameElement) {
        const src = video.src;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
          // Send pause command via YouTube iframe API
          try {
            video.contentWindow?.postMessage(JSON.stringify({
              event: 'command',
              func: 'pauseVideo',
              args: ''
            }), '*');
          } catch (e) {
            console.log('Could not pause video:', e);
          }
        }
      }
    });
  };

  useEffect(() => {
    // Check if device is mobile (don't show popup on mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
      return; // Don't show popup on mobile devices
    }

    // Check how many times popup has been shown
    const shownCount = parseInt(sessionStorage.getItem('cloneOfferShowCount') || '0');
    setShowCount(shownCount);

    // If already shown 9 times (indices 0-8), don't show again
    if (shownCount >= 9) {
      return;
    }

    const promotion = schedulePromotion(() => {
      pauseAllVideos();
      setIsOpen(true);
      const newCount = shownCount + 1;
      setShowCount(newCount);
      sessionStorage.setItem('cloneOfferShowCount', newCount.toString());
    });
    dismissPromotion.current = promotion.dismiss;

    return promotion.cancel;
  }, []);

  const handleClone = (e: React.MouseEvent) => {
    e.preventDefault();
    const cloneUrl = "https://lovable.dev/projects/bad09a84-f9cd-4cda-9d42-9c4cfafc2867?utm_source=lovable-badge";
    
    // Close popup immediately
    closePopup();
    
    // Trigger time warp effect with sound - this will open the URL after the effect
    createTimePortalEffect(cloneUrl, "Clone AI Empire");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closePopup(); }}>
      <DialogContent className="sm:max-w-xl max-w-[95vw] bg-gray-900 border-2 border-cyan-500/50 max-h-[90vh] overflow-y-auto z-[9999] shadow-2xl shadow-cyan-500/20 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl text-white">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-pulse" />
            Your AI Empire Awaits!
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base pt-1 sm:pt-2 text-gray-300">
            {showCount === 1 ? (
              <>Hey, we're glad you like this website. <span className="text-cyan-400 font-semibold">It's actually yours</span> — you just don't know it yet.</>
            ) : (
              <>Just a friendly reminder: This website can be <span className="text-cyan-400 font-semibold">100% yours</span> with just one click!</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {/* Media Section - Image on first popup, video on 2-3, images on 4-8 */}
        <div className="w-full rounded-lg overflow-hidden bg-black border border-gray-700">
          {showCount <= 1 ? (
            <img
              src={cloneKingdomImage}
              alt="Inner Cosmos - Inner Temple - Light Within - Your AI Empire Awaits"
              className="w-full h-auto max-h-[45vh] object-contain mx-auto"
            />
          ) : showCount >= 4 && popupImages[showCount] ? (
            <img
              src={popupImages[showCount]}
              alt="I AM the truth hidden in plain sight - Your AI Empire Awaits - AIWebTools.ai"
              className="w-full h-auto max-h-[45vh] object-contain mx-auto"
            />
          ) : (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={isOpen ? (
                  showCount === 3 
                    ? "https://www.youtube.com/embed/s5lZHJU3y08?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=1&vq=hd1080&hd=1&enablejsapi=1"
                    : showCount === 2 
                      ? "https://www.youtube.com/embed/nG4NqPwNHaw?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=1&vq=hd1080&hd=1&enablejsapi=1"
                      : "https://www.youtube.com/embed/lPZVKMfUcrs?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=1&vq=hd1080&hd=1&enablejsapi=1"
                ) : ""}
                key={isOpen ? `playing-${showCount}` : "stopped"}
                title="Clone This Website"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                loading="eager"
              ></iframe>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleClone}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 text-sm shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 border-0 cursor-pointer select-none"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            <Copy className="w-4 h-4 mr-1" />
            Clone Now
          </Button>
          
          <Button
            onClick={closePopup}
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500 font-medium px-4 py-2 text-sm cursor-pointer select-none"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CloneOfferPopup;
