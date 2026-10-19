import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateToolSlug } from '@/utils/urlGenerator';
import { buildAbsoluteAssetUrl, buildCanonicalUrl } from '@/utils/seo';

interface ImprovedSEOHeadProps {
  pageType?: 'homepage' | 'category' | 'tool' | 'search';
  tool?: any;
  category?: string;
  searchTerm?: string;
}

const ImprovedSEOHead: React.FC<ImprovedSEOHeadProps> = ({
  pageType = 'homepage',
  tool,
  category,
  searchTerm
}) => {
  const getTitle = () => {
    switch (pageType) {
      case 'tool': {
        const t = tool?.title || 'AI Tool';
        const access = tool?.isFree ? 'Free ' : '';
        const full = `${t} — ${access}${tool?.category || 'AI'} Tool | AI Web Tools`;
        return full.length > 60 ? `${t} | AI Web Tools` : full;
      }
      case 'category':
        return `Best ${category} AI Tools 2026 | AI Web Tools`;
      case 'search':
        return `${searchTerm} AI Tools | AI Web Tools`;
      default:
        return 'AI Web Tools — 4,000+ Best Free AI Tools 2026';
    }
  };

  // Open Graph titles render best ≤60 chars; clamp to avoid social-preview truncation.
  const clampOg = (s: string) => (s.length > 60 ? `${s.slice(0, 57).trimEnd()}…` : s);
  const ogTitle = clampOg(getTitle());

  const getDescription = () => {
    switch (pageType) {
      case 'tool': {
        const toolDesc = tool?.description || `Powerful ${tool?.category || 'AI'} tool for productivity and creativity.`;
    const suffix = tool?.isFree ? ` — Try ${tool?.title} free.` : ` — Explore ${tool?.title}.`;
        const max = 158;
        const room = max - suffix.length;
        const base = toolDesc.length > room ? toolDesc.substring(0, room - 1).trimEnd() + '…' : toolDesc;
        return base + suffix;
      }
      case 'category':
        return `Discover the best ${category?.toLowerCase()} AI tools for 2026. Compare features, pricing, and reviews of top ${category?.toLowerCase()} tools in our comprehensive directory.`;
      case 'search':
        return `Find the best AI tools for "${searchTerm}". Browse our comprehensive directory of AI tools with reviews, features, and direct access links.`;
      default:
        return 'Discover 4,000+ free AI tools: ChatGPT alternatives, custom GPTs, AI agents, image, writing & business AI. Updated daily.';
    }
  };

  const getKeywords = () => {
    const baseKeywords = ['ai tools', 'free ai tools', 'best ai tools 2026', 'ai directory', 'chatgpt alternatives', 'custom gpts'];
    
    switch (pageType) {
      case 'tool':
        return [...baseKeywords, tool?.title?.toLowerCase(), tool?.category?.toLowerCase(), 'free ' + tool?.title?.toLowerCase(), ...tool?.tags || []];
      case 'category':
        return [...baseKeywords, `${category?.toLowerCase()} ai tools`, `best ${category?.toLowerCase()} tools`, `free ${category?.toLowerCase()} ai`];
      case 'search':
        return [...baseKeywords, searchTerm?.toLowerCase(), `${searchTerm} ai tools`, `free ${searchTerm}`];
      default:
        return [...baseKeywords, 'ai web tools', 'productivity ai', 'creative ai tools', 'ai tools list'];
    }
  };

  const getCanonicalUrl = () => {
    switch (pageType) {
      case 'tool':
        // Use clean slug-based URL with proper utility
        const slug = generateToolSlug(tool?.title || '');
        return buildCanonicalUrl(`/${slug}`);
      case 'category':
        return buildCanonicalUrl(`/category/${category?.toLowerCase().replace(/\s+/g, '-')}`);
      case 'search':
        return buildCanonicalUrl(`/search?q=${encodeURIComponent(searchTerm || '')}`);
      default:
        return buildCanonicalUrl('/');
    }
  };

  const getOgImage = () => {
    // Social scrapers (Facebook, X, LinkedIn, Discord, iMessage) require an
    // absolute https:// URL and cannot fetch Vite-bundled or relative asset
    // paths. Normalize any tool image to a crawler-safe URL, and fall back to
    // our verified og-default.jpg when the image isn't remotely fetchable.
    const DEFAULT_OG = buildAbsoluteAssetUrl('/og-default.jpg');
    const normalize = (raw?: string): string | null => {
      if (!raw || typeof raw !== 'string') return null;
      const url = raw.trim();
      if (!url) return null;
      if (/^https?:\/\//i.test(url)) return url;
      if (url.startsWith('//')) return `https:${url}`;
      if (url.startsWith('/')) return buildAbsoluteAssetUrl(url);
      // bundled ES6 imports, data:, blob:, or relative — not scraper-safe
      return null;
    };

    if (pageType === 'tool' && tool) {
      // Priority 1: Absolute image URL on the tool
      const direct = normalize(tool?.imageUrl);
      if (direct) return direct;

      // Priority 2: YouTube thumbnail derived from videoUrl
      if (tool?.videoUrl) {
        const videoId = tool.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }

      // Priority 3: Default AI Web Tools branded image (crawler-safe)
      return DEFAULT_OG;
    }

    return DEFAULT_OG;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": pageType === 'tool' ? "SoftwareApplication" : "WebSite",
    "name": pageType === 'tool' ? tool?.title : "AI Web Tools",
    "description": getDescription(),
    "url": getCanonicalUrl(),
    ...(pageType === 'tool' && {
      "applicationCategory": tool?.category || "Artificial Intelligence",
      "operatingSystem": "Web Browser",
        "offers": {
        "@type": "Offer",
          ...(tool?.isFree ? { "price": "0" } : {}),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      // Star ratings in Google results: only emitted from real stored
      // rating data, never fabricated.
      ...(tool?.rating && tool?.totalVotes
        ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": Number(tool.rating).toFixed(1),
              "ratingCount": tool.totalVotes,
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        : {}),
      ...(Array.isArray(tool?.tags) && tool.tags.length
        ? { "keywords": tool.tags.slice(0, 25).join(", ") }
        : {})
    })
  };

  // Video schema for tools with YouTube URLs. Do not fabricate upload dates
  // or durations; search engines treat invented media metadata as invalid.
  const videoSchema = pageType === 'tool' && tool?.videoUrl ? (() => {
    const videoId = tool.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (!videoId) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": `${tool.title} - Demo & Tutorial`,
      "description": tool.description || `Watch how to use ${tool.title}`,
      "thumbnailUrl": `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      "contentUrl": tool.videoUrl,
      "embedUrl": `https://www.youtube.com/embed/${videoId}`,
      "publisher": {
        "@type": "Organization",
        "name": "AI Web Tools",
        "logo": {
          "@type": "ImageObject",
          "url": buildAbsoluteAssetUrl('/logo.png')
        }
      }
    };
  })() : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": buildCanonicalUrl('/')
      },
      ...(category ? [{
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": buildCanonicalUrl(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`)
      }] : []),
      ...(tool ? [{
        "@type": "ListItem",
        "position": category ? 3 : 2,
        "name": tool.title,
        "item": getCanonicalUrl()
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Core SEO */}
      <title>{getTitle()}</title>
      <meta name="description" content={getDescription()} />
      <meta name="keywords" content={getKeywords().join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {/* Preload Critical Assets */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Improved Crawlability */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="duckduckbot" content="index, follow" />
      <meta name="facebookexternalhit" content="index, follow" />
      <meta name="twitterbot" content="index, follow" />
      
      {/* Safari Compatibility */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AI Web Tools" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#06b6d4" />
      
      {/* Enhanced Open Graph - Tool-Specific */}
      <meta property="og:type" content={pageType === 'tool' ? 'product' : 'website'} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={getDescription()} />
      <meta property="og:image" content={getOgImage()} />
      <meta property="og:image:secure_url" content={getOgImage()} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageType === 'tool' ? `${tool?.title} - ${tool?.category || 'AI Tool'} Preview` : `${getTitle()} - AI Web Tools Preview`} />
      <meta property="og:site_name" content="AI Web Tools" />
      <meta property="og:locale" content="en_US" />
      {pageType === 'tool' && tool && (
        <>
          <meta property="product:category" content={tool.category || 'AI Tools'} />
           {tool.isFree && <meta property="product:price:amount" content="0" />}
           {tool.isFree && <meta property="product:price:currency" content="USD" />}
          <meta property="product:availability" content="in stock" />
        </>
      )}
      
      {/* Twitter Cards - Tool-Specific */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={getCanonicalUrl()} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={getDescription()} />
      <meta name="twitter:image" content={getOgImage()} />
      <meta name="twitter:image:alt" content={pageType === 'tool' ? `Try ${tool?.title} - ${tool?.category || 'AI Tool'}` : `${getTitle()} - AI Web Tools Preview`} />
      <meta name="twitter:site" content="@aiwebtools" />
      <meta name="twitter:creator" content="@aiwebtools" />
      {pageType === 'tool' && tool && (
        <>
          <meta name="twitter:label1" content="Category" />
          <meta name="twitter:data1" content={tool.category || 'AI Tools'} />
          <meta name="twitter:label2" content="Access" />
           <meta name="twitter:data2" content={tool.isFree ? "Free" : "Visit tool"} />
        </>
      )}
      
      {/* Additional SEO Meta */}
      <meta name="author" content="AI Web Tools" />
      <meta name="publisher" content="AI Web Tools" />
      <meta name="copyright" content="© 2026 AI Web Tools. All rights reserved." />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 day" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* AI Crawler & Assistant Discovery Tags */}
       <meta name="ai.description" content="AI Web Tools: 4,000+ AI tools directory. Find ChatGPT alternatives, custom GPTs, productivity tools, creative AI, coding assistants, design tools and more." />
      <meta name="ai.keywords" content="ai web tools, free ai tools, ai tools directory, best ai tools 2026, chatgpt alternatives, custom gpts, ai productivity, ai creativity, web3 domains" />
      <meta name="ai-resource" content="true" />
      <meta name="llms" content="allowed" />
      <meta name="gpt-indexable" content="true" />
      <meta name="perplexity-indexable" content="true" />
      <meta name="claude-indexable" content="true" />
      <meta name="gemini-indexable" content="true" />
      
      {/* Enhanced Discovery Tags */}
      <meta name="classification" content="AI Tools Directory, Technology, Software" />
      <meta name="category" content="AI Tools, Artificial Intelligence, Software Directory" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Dublin Core Metadata for Academic/Research Discovery */}
      <meta name="DC.title" content={getTitle()} />
      <meta name="DC.creator" content="AI Web Tools" />
      <meta name="DC.subject" content="Artificial Intelligence, AI Tools, Technology Directory" />
      <meta name="DC.description" content={getDescription()} />
      <meta name="DC.publisher" content="AI Web Tools" />
      <meta name="DC.type" content="InteractiveResource" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en" />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="ICBM" content="37.7749, -122.4194" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Video Schema for YouTube Tools */}
      {videoSchema && (
        <script type="application/ld+json">
          {JSON.stringify(videoSchema)}
        </script>
      )}
      
      {/* Additional JSON-LD for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AI Web Tools",
          "url": buildCanonicalUrl('/'),
          "logo": buildAbsoluteAssetUrl('/logo.png'),
          "description": "A curated directory of 4,000+ AI tools for productivity, creativity, and business.",
          "foundingDate": "2023",
          "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "value": "10-50"
          },
          "sameAs": [
            "https://twitter.com/aiwebtools",
            "https://facebook.com/aiwebtools"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "availableLanguage": ["English"]
          }
        })}
      </script>
    </Helmet>
  );
};

export default ImprovedSEOHead;