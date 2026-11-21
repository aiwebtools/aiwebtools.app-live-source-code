import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Tool } from "@/types/tools";
import { getToolTagline } from "@/data/toolTaglines";
import { isExpiredHost, getYouTubeId, getResolvedAssetUrl, getYouTubeThumbnail } from "@/utils/imageUtils";
import { startYouTubeWithSound, youtubePlaybackUrl } from "@/utils/videoPlayback";

interface ToolMediaProps {
  tool: Tool;
  toolIndex: number;
}

const ToolMedia = ({ tool, toolIndex }: ToolMediaProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = useMemo(() => getYouTubeId(tool.videoUrl), [tool.videoUrl]);
  const youtubeThumbnail = useMemo(() => getYouTubeThumbnail(tool.videoUrl), [tool.videoUrl]);

  // Unmute this video (after user clicks or interacts)
  const unmuteToolVideo = useCallback(() => {
    if (iframeRef.current && videoId) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute' }),
          'https://www.youtube.com'
        );
      } catch {}
    }
  }, [videoId]);

  // Track last visibility state to prevent redundant events
  const lastVisibilityRef = useRef<boolean | null>(null);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowVisible = entry.isIntersecting;
          if (lastVisibilityRef.current === nowVisible) return;
          
          if (visibilityTimeoutRef.current) {
            clearTimeout(visibilityTimeoutRef.current);
          }
          
          visibilityTimeoutRef.current = setTimeout(() => {
            lastVisibilityRef.current = nowVisible;
            window.dispatchEvent(new CustomEvent('toolVideoVisibility', { 
              detail: { isVisible: nowVisible } 
            }));
            
            if (nowVisible) {
              setIsVisible(true);
              window.dispatchEvent(new CustomEvent('toolVideoPlaying'));
              setTimeout(() => {
                unmuteToolVideo();
                try {
                  iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo' }),
                    'https://www.youtube.com'
                  );
                } catch {}
              }, 0);
            }
          }, 150);
        });
      },
      { 
        threshold: [0.2, 0.5],
        rootMargin: '-50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      lastVisibilityRef.current = null;
      window.dispatchEvent(new CustomEvent('toolVideoVisibility', { 
        detail: { isVisible: false } 
      }));
    };
  }, [unmuteToolVideo]);

  const getOptimizedEmbedUrl = (url: string) => {
    if (videoId) {
      return youtubePlaybackUrl(`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&origin=${encodeURIComponent(window.location.origin)}&modestbranding=1&fs=1&iv_load_policy=3&cc_load_policy=0&start=0`);
    }
    
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=0&autopause=0&muted=0&quality=1080p&dnt=1`;
    }
    
    return url;
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const MediaComponent = () => {
    if (tool.videoUrl && !videoError) {
      const embedUrl = getOptimizedEmbedUrl(tool.videoUrl);
      
      return (
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-800" style={{ aspectRatio: '16/9' }}>
          {isVisible ? (
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={embedUrl}
              title={`${tool.title} Demo`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              className="w-full h-full rounded-xl"
              loading="eager"
              style={{ 
                border: 'none',
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              onError={handleVideoError}
              onLoad={() => { if (videoId) startYouTubeWithSound(iframeRef.current); }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </div>
      );
    }

    let resolvedImageUrl = tool.imageUrl ? getResolvedAssetUrl(tool.imageUrl) : '';
    if (resolvedImageUrl && isExpiredHost(resolvedImageUrl)) {
      resolvedImageUrl = '';
    }
    
    const effectiveImageUrl = (resolvedImageUrl && !imageError) ? resolvedImageUrl : youtubeThumbnail;

    if (effectiveImageUrl) {
      return (
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-800" style={{ aspectRatio: '16/9' }}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center animate-pulse">
              <ImageIcon className="w-8 sm:w-12 h-8 sm:h-12 text-gray-500" />
            </div>
          )}
          <img
            src={effectiveImageUrl}
            alt={`${tool.title} Preview`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      );
    }
    
    return (
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-cyan-500/30 neon-border rounded-xl" style={{ aspectRatio: '16/9' }}>
        <span className="text-4xl sm:text-6xl glow-effect">{tool.emoji}</span>
      </div>
    );
  };

  const tagline = getToolTagline(tool.title, tool.description);

  return (
    <div ref={containerRef} className="mb-4 sm:mb-6 px-4 sm:px-0">
      {tagline && (
        <p className="text-gray-400 text-xs mb-2 text-center leading-snug max-w-lg mx-auto">
          {tagline}
        </p>
      )}
      <div className="shadow-lg border border-cyan-500/30 neon-border rounded-xl overflow-hidden">
        <MediaComponent />
      </div>
    </div>
  );
};

export default ToolMedia;
