import React from 'react';
import { Helmet } from 'react-helmet-async';
import { buildAbsoluteAssetUrl, buildCanonicalUrl } from '@/utils/seo';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: string;
  structuredData?: any;
}

const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title = "AI Web Tools — 4,000+ AI Tools Directory 2026",
  description = "Discover the world's largest directory of AI tools for productivity, creativity, and business. Find the perfect AI tool for any task with our comprehensive collection of 1300+ AI tools.",
  keywords = ['ai tools', 'artificial intelligence', 'productivity tools', 'ai directory', 'ai web tools'],
  url = '/',
  image = '/og-image.png',
  type = 'website',
  structuredData
}) => {
  const canonicalUrl = buildCanonicalUrl(url);
  const socialImage = buildAbsoluteAssetUrl(image);
  const keywordsString = keywords.join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:site_name" content="AI Web Tools" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={socialImage} />
      <meta name="twitter:creator" content="@aiwebtools" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="duckduckbot" content="index, follow" />
      
      {/* Safari specific */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta property="og:locale" content="en_US" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Meta for better crawling */}
      <meta name="author" content="AI Web Tools" />
      <meta name="publisher" content="AI Web Tools" />
      <meta name="copyright" content="AI Web Tools" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
    </Helmet>
  );
};

export default SEOMetaTags;