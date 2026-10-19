
import { Helmet } from 'react-helmet-async';
import { buildAbsoluteAssetUrl, buildCanonicalUrl, seoConfig, generateFAQStructuredData, generateLocalBusinessStructuredData } from '@/utils/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: any;
  noIndex?: boolean;
  includeFAQ?: boolean;
  includeLocalBusiness?: boolean;
  category?: string;
  toolData?: any;
}

const SEOHead = ({
  title,
  description = seoConfig.description,
  keywords = seoConfig.keywords,
  image = '/og-default.jpg',
  url = seoConfig.siteUrl,
  type = 'website',
  structuredData,
  noIndex = false,
  includeFAQ = false,
  includeLocalBusiness = false,
  category,
  toolData
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} | AI Web Tools` : "AI Web Tools — 4,000+ Best Free AI Tools 2026";
  const canonical = buildCanonicalUrl(url);
  const fullImage = buildAbsoluteAssetUrl(image);

  // Canonical breadcrumb schema for category pages (replaces redundant BreadcrumbSEO)
  const breadcrumbSchema = category ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": buildCanonicalUrl('/')
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": canonical
      }
    ]
  } : null;

  // Focused keyword set — over-stuffed lists trigger Google spam demotions.
  const competitiveKeywords = Array.from(new Set([
    "ai tools",
    "free ai tools",
    "ai tools directory",
    "best ai tools 2026",
    "chatgpt alternatives",
    "custom gpts",
    "ai agents",
    "ai web tools",
    ...keywords,
  ]));

  return (
    <Helmet>
      {/* Critical SEO Meta Tags for Ranking */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={competitiveKeywords.join(', ')} />
      <meta name="author" content="AI WEB TOOLS" />
      <link rel="canonical" href={canonical} />
      
      {/* ENHANCED COMPETITIVE META TAGS FOR #1 RANKING */}
      <meta name="application-name" content="AIWEBTOOLS.AI" />
      <meta name="language" content="English" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Technical Performance Meta */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="renderer" content="webkit" />
      <meta name="force-rendering" content="webkit" />
      <meta httpEquiv="Cache-Control" content="no-transform" />
      <meta httpEquiv="Cache-Control" content="no-siteapp" />
      <meta name="format-detection" content="telephone=no, email=no" />
      <meta name="wap-font-scale" content="no" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AI WEB TOOLS" />
      
      {/* Geographic and Business Meta */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="ICBM" content="40.7128, -74.0060" />
      <meta name="geo.position" content="40.7128;-74.0060" />
      <meta name="nuts" content="US" />
      
      {/* Business Contact Data */}
      <meta name="business.contact_data.street_address" content="Remote Operations Worldwide" />
      <meta name="business.contact_data.locality" content="Global" />
      <meta name="business.contact_data.region" content="Worldwide" />
      <meta name="business.contact_data.postal_code" content="00000" />
      <meta name="business.contact_data.country_name" content="United States" />
      <meta name="business.contact_data.email" content="Contact@ai-webtools.com" />
      <meta name="business.contact_data.phone_number" content="+14758008096" />
      <meta name="business.contact_data.website" content={seoConfig.siteUrl} />
      
      {/* Enhanced Crawling Instructions */}
      {noIndex ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, max-video-preview:30" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="slurp" content="index, follow, max-image-preview:large" />
          <meta name="duckduckbot" content="index, follow" />
          <meta name="facebookexternalhit" content="index, follow" />
          <meta name="twitterbot" content="index, follow" />
          <meta name="linkedinbot" content="index, follow" />
          <meta name="whatsapp" content="index, follow" />
          <meta name="telegrambot" content="index, follow" />
          <meta name="applebot" content="index, follow" />
          <meta name="gptbot" content="index, follow" />
          <meta name="claude-web" content="index, follow" />
          <meta name="ccbot" content="index, follow" />
        </>
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="AI WEB TOOLS - The Ultimate AI Tools Directory with 1000+ Curated AI Applications" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AI WEB TOOLS - Best AI Tools Directory" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:determiner" content="the" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta property="og:see_also" content="https://aiwebtools.app" />
      <meta property="og:see_also" content="https://www.aiwebtools.ai" />
      <meta property="og:see_also" content="https://AItoolwebsites.com" />
      <meta property="fb:app_id" content={seoConfig.facebookAppId} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content="AI WEB TOOLS - Ultimate AI Tools Directory with 1000+ Curated AI Applications" />
      <meta name="twitter:site" content={seoConfig.twitterHandle} />
      <meta name="twitter:creator" content={seoConfig.twitterHandle} />
      <meta name="twitter:domain" content="aiwebtools.app" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:data1" content="1000+ AI Tools" />
      <meta name="twitter:label1" content="Directory Size" />
      <meta name="twitter:data2" content="Free & Premium" />
      <meta name="twitter:label2" content="Pricing" />
      
      {/* Article and Content Meta */}
      <meta property="article:publisher" content="https://aitoolwebsites.com" />
      <meta property="article:author" content="AI WEB TOOLS" />
      <meta property="article:published_time" content="2024-01-01T00:00:00Z" />
      <meta property="article:modified_time" content={new Date().toISOString()} />
      <meta property="article:section" content={category || "AI Tools Directory"} />
      <meta property="article:tag" content={competitiveKeywords.slice(0, 15).join(", ")} />
      
      {/* Mobile and PWA Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#0891b2" />
      <meta name="msapplication-TileColor" content="#0891b2" />
      <meta name="msapplication-TileImage" content="/favicon.ico" />
      <meta name="msapplication-navbutton-color" content="#0891b2" />
      <meta name="msapplication-starturl" content="/" />
      <meta name="msapplication-window" content="width=1024;height=768" />
      <meta name="msapplication-tooltip" content="AI WEB TOOLS - Best AI Tools Directory with 1000+ curated tools" />
      
      {/* Security and Performance Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* Enhanced DNS Prefetch and Preconnect */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//ai-webtools.com" />
      <link rel="dns-prefetch" href="//www.aiwebtools.ai" />
      <link rel="dns-prefetch" href="//aitoolwebsites.com" />
      <link rel="dns-prefetch" href="//www.google.com" />
      <link rel="dns-prefetch" href="//www.bing.com" />
      <link rel="dns-prefetch" href="//search.yahoo.com" />
      <link rel="dns-prefetch" href="//duckduckgo.com" />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://aiwebtools.app" />
      <link rel="preconnect" href="https://www.aiwebtools.ai" />
      <link rel="preconnect" href="https://aitoolwebsites.com" />
      
      {/* Resource Hints for Performance */}
      <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" as="style" />
      <link rel="prefetch" href="/og-default.jpg" />
      
      {/* Alternate Languages and Feeds */}
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <link rel="alternate" type="application/rss+xml" title="AI WEB TOOLS RSS Feed" href={`${seoConfig.siteUrl}/rss.xml`} />
      <link rel="alternate" type="application/atom+xml" title="AI WEB TOOLS Atom Feed" href={`${seoConfig.siteUrl}/atom.xml`} />
      <link rel="sitemap" type="application/xml" title="Sitemap" href={`${seoConfig.siteUrl}/sitemap.xml`} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* FAQ Structured Data */}
      {includeFAQ && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQStructuredData())}
        </script>
      )}
      
      {/* Local Business Structured Data */}
      {includeLocalBusiness && (
        <script type="application/ld+json">
          {JSON.stringify(generateLocalBusinessStructuredData())}
        </script>
      )}
      
      {/* Feed and news discovery */}
      <meta name="news_keywords" content="AI tools, artificial intelligence, ChatGPT alternatives, AI directory, AI web tools" />
    </Helmet>
  );
};

export default SEOHead;
