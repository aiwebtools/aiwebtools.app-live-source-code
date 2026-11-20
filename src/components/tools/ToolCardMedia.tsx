import { useState, useRef, useEffect } from "react";
import { Tool } from "@/types/tools";
import { Play } from "lucide-react";
import { isExpiredHost, getYouTubeId, getYouTubeThumbnail, getBrandLogo } from "@/utils/imageUtils";
import { useResolvedToolImage } from "@/utils/assetResolver";

interface ToolCardMediaProps {
  tool: Tool;
  isFeatured: boolean;
  imageHeight: string;
}

const ToolCardMedia = ({ tool, isFeatured, imageHeight }: ToolCardMediaProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const videoId = getYouTubeId(tool.videoUrl);
  const isYouTube = !!videoId;
  const youtubeThumbnail = getYouTubeThumbnail(tool.videoUrl);
  
  // Resolve image URL (build-time asset map for legacy "/src/assets/..." paths)
  const rawImageUrl = typeof tool.imageUrl === 'string' ? tool.imageUrl.trim() : '';
  const resolvedImageUrl = useResolvedToolImage(isExpiredHost(rawImageUrl) ? '' : rawImageUrl) || '';

  const hasVideo = !!tool.videoUrl;
  const hasImage = !!resolvedImageUrl && !imageFailed;
  
  // Effective image for display (Image -> YT Thumb -> Fallback)
  const effectiveImageUrl = hasImage ? resolvedImageUrl : thumbnailFailed ? undefined : youtubeThumbnail;
  // No hero image and no video: show the tool's OWN site logo on a branded
  // tile so every card still previews the real product.
  const brandLogo = !effectiveImageUrl ? getBrandLogo(tool.directUrl, 256) : undefined;

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoLoaded(true);
  };
  
  const getOptimizedEmbedUrl = (url: string) => {
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&modestbranding=1&fs=1&iv_load_policy=3`;
    }
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&volume=1&muted=0`;
    }
    return url;
  };
  
  return (
    <div 
      ref={containerRef}
      className={`${isFeatured ? 'mb-6' : 'mb-4'} rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative group-hover:scale-105 transition-transform duration-200`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* YouTube video with thumbnail lazy loading */}
      {hasVideo && isYouTube && !isVideoLoaded ? (
        <div 
          className="relative w-full h-full cursor-pointer"
          onClick={handlePlayClick}
        >
          {isNearViewport && youtubeThumbnail ? (
            <img
              src={youtubeThumbnail}
              alt={`${tool.title} video thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              onError={() => setThumbnailFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse" />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      ) : hasVideo && isVideoLoaded ? (
        <iframe
          width="100%"
          height="100%"
          src={getOptimizedEmbedUrl(tool.videoUrl || "")}
          title={`${tool.title} Demo`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-lg"
          style={{ minHeight: '200px' }}
        />
      ) : hasVideo && !isYouTube ? (
        <iframe
          width="100%"
          height="100%"
          src={getOptimizedEmbedUrl(tool.videoUrl || "")}
          title={`${tool.title} Demo`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-lg"
          loading="lazy"
          style={{ minHeight: '200px' }}
        />
      ) : effectiveImageUrl ? (
        <>
          <img 
            src={effectiveImageUrl} 
            alt={`${tool.title} screenshot`}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => { if (hasImage) setImageFailed(true); else setThumbnailFailed(true); }}
          />
          {imageFailed && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
              {tool.emoji}
            </div>
          )}
        </>
      ) : brandLogo ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3 text-center">
          <span aria-hidden="true" className="text-3xl">{tool.emoji || tool.title.slice(0, 2)}</span>
          <img
            src={brandLogo}
            alt={`${tool.title} logo`}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="w-14 h-14 object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-xs font-semibold text-foreground/80 line-clamp-2">
            {tool.title}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center text-6xl opacity-50 w-full h-full">
          {tool.emoji}
        </div>
      )}
      
      {effectiveImageUrl && !hasVideo && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
};

export default ToolCardMedia;
