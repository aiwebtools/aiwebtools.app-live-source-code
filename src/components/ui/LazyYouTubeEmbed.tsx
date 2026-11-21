import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { startYouTubeWithSound, youtubePlaybackUrl } from "@/utils/videoPlayback";
import { Button } from "@/components/ui/button";

interface LazyYouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
  autoplayOnVisible?: boolean;
  showPlayButton?: boolean;
}

// Extract video ID from various YouTube URL formats
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  
  // Standard youtube.com/watch?v=
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  
  // Shortened youtu.be/ - extract ID before any query params (handles ?si= etc)
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&]|$)/);
  if (shortMatch) return shortMatch[1];
  
  // Embed URL
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  
  return null;
};

const LazyYouTubeEmbed = ({
  videoId,
  title = "YouTube Video",
  className = "",
  aspectRatio = "16/9",
  autoplayOnVisible = false,
  showPlayButton = true
}: LazyYouTubeEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Extract ID if full URL was passed
  const actualVideoId = extractYouTubeId(videoId) || videoId;
  
  // High quality thumbnail URL
  const thumbnailUrl = `https://i.ytimg.com/vi/${actualVideoId}/hqdefault.jpg`;
  const maxResThumbnail = `https://i.ytimg.com/vi/${actualVideoId}/maxresdefault.jpg`;

  useEffect(() => {
    if (!isLoaded) return;
    const receive = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onAutoplayBlocked") setSoundBlocked(true);
      } catch { /* Ignore unrelated player messages. */ }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [isLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            if (autoplayOnVisible && !document.querySelector('[aria-label="MTVAI opening"]')) {
              setIsLoaded(true);
            }
          }
        });
      },
      { rootMargin: "0px", threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoplayOnVisible]);

  const handleClick = () => {
    setIsLoaded(true);
  };

  const embedUrl = youtubePlaybackUrl(`https://www.youtube.com/embed/${actualVideoId}?controls=1&rel=0&modestbranding=1`);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-800 cursor-pointer ${className}`}
      style={{ aspectRatio }}
      onClick={!isLoaded ? handleClick : undefined}
    >
      {!isLoaded ? (
        <>
          {/* Thumbnail with progressive loading */}
          {isNearViewport && (
            <picture>
              <source srcSet={maxResThumbnail} type="image/jpeg" />
              <img
                src={thumbnailUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          )}
          
          {/* Loading placeholder when not near viewport */}
          {!isNearViewport && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 animate-pulse" />
          )}
          
          {/* Play button overlay */}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          )}
          
          {/* Video title tooltip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <span className="text-white text-sm font-medium truncate block">{title}</span>
          </div>
        </>
      ) : (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          onLoad={() => {
            const player = iframeRef.current?.contentWindow;
            player?.postMessage(JSON.stringify({ event: "listening", id: actualVideoId, channel: "widget" }), "https://www.youtube.com");
            player?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onAutoplayBlocked"] }), "https://www.youtube.com");
            startYouTubeWithSound(iframeRef.current);
          }}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      )}
      {isLoaded && soundBlocked && <Button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2" onClick={() => { setSoundBlocked(false); startYouTubeWithSound(iframeRef.current); }}><Play className="h-4 w-4" />Play with sound</Button>}
    </div>
  );
};

export default LazyYouTubeEmbed;
