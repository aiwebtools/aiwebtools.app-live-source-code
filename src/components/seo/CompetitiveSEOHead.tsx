
import { Helmet } from 'react-helmet-async';
import { Tool } from '@/types/tools';
import { enhancedSchemaMarkup, generateCompetitiveContent } from '@/utils/advancedCompetitiveSEO';
import { enhancedFAQs, socialMediaSEO } from '@/utils/additionalSEO';
import { generateToolSlug } from '@/utils/urlGenerator';
import { buildCanonicalUrl, seoConfig } from '@/utils/seo';

interface CompetitiveSEOHeadProps {
  tool?: Tool;
  toolIndex?: number;
  category?: string;
  isHomepage?: boolean;
}

const CompetitiveSEOHead = ({ tool, toolIndex, category, isHomepage }: CompetitiveSEOHeadProps) => {
  // Generate competitive content
  const competitiveContent = tool ? generateCompetitiveContent(tool, toolIndex || 0) : null;
  
  // Homepage competitive SEO
  if (isHomepage) {
    return (
      <Helmet>
        {/* Ultra-competitive homepage targeting */}
        <title>AI Web Tools — 4,000+ AI Tools Directory 2026</title>
        <meta name="description" content="Curated directory of 4,000+ AI tools with reviews, comparisons, and category filtering. Discover ChatGPT alternatives and the latest AI tools for 2026." />
        
        {/* Competitive keyword targeting */}
        <meta name="keywords" content="AI Web Tools, AI tools directory 2026, ChatGPT alternatives, AI tools comparison, AI tools for business, curated AI tools, best AI tools" />
        <link rel="canonical" href={buildCanonicalUrl('/')} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="AI WEB TOOLS" />
        
        {/* Advanced competitive meta */}
        <meta name="topic" content="AI Tools Directory, Artificial Intelligence, AI Tools 2026, ChatGPT Alternatives" />
        
        {/* Enhanced Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl('/')} />
        <meta property="og:site_name" content="AI WEB TOOLS" />
        <meta property="og:title" content="AI Web Tools — 4,000+ AI Tools Directory 2026" />
        <meta property="og:description" content="Curated directory of 4,000+ AI tools with reviews, comparisons, and category filtering." />
        <meta property="og:image" content="https://aiwebtools.app/og-image-homepage.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AI WEB TOOLS - Best AI Tools Directory 2026" />
        
        {/* Enhanced Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AIWebTools" />
        <meta name="twitter:creator" content="@AIWebTools" />
        <meta name="twitter:title" content="AI Web Tools — AI Tools Directory 2026" />
        <meta name="twitter:description" content="4,000+ curated AI tools with reviews and category filtering." />
        <meta name="twitter:image" content="https://aiwebtools.app/og-image-homepage.jpg" />
        
        {/* Mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Enhanced structured data for homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AI Web Tools Directory",
            "alternateName": "AITools.Studio",
            "url": "https://aiwebtools.app",
            "description": "A curated directory of AI tools with reviews, comparisons, and category filtering.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://aiwebtools.app/?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "AI Tools Directory 2026",
              "description": "Curated collection of AI tools",
              "numberOfItems": 4000
            },
            "sameAs": [
              "https://aiwebtools.app",
              "https://www.aiwebtools.ai"
            ]
          })}
        </script>
        
        {/* Enhanced FAQ Schema for Featured Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": enhancedFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>
    );
  }
  
  // Tool page competitive SEO
  if (tool && toolIndex !== undefined && competitiveContent) {
    const selectedTitle = competitiveContent.metaContent.titleVariations[0];
    const selectedDescription = competitiveContent.metaContent.descriptionVariations[0];
    
    // Get proper tool image for social sharing
    const getToolImage = () => {
      // Priority 1: Tool's direct image
      if (tool?.imageUrl && tool.imageUrl.trim() !== '') {
        return tool.imageUrl;
      }
      // Priority 2: YouTube thumbnail from videoUrl
      if (tool?.videoUrl) {
        const videoId = tool.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      // Priority 3: Default AI Web Tools branded image
      return `${seoConfig.siteUrl}/og-default.jpg`;
    };
    
    const toolImage = getToolImage();
    
    return (
      <Helmet>
        <title>{selectedTitle}</title>
        <meta name="description" content={selectedDescription} />
        
        {/* Enhanced tool-specific keywords */}
        <meta name="keywords" content={`${tool.title}, ${tool.category}, AI tool review, best AI tools 2026, ${tool.tags?.join(', ') || ''}, AI WEB TOOLS directory, expert analysis, tool comparison, user reviews, professional AI tools`} />
        <link rel="canonical" href={buildCanonicalUrl(`/${generateToolSlug(tool.title)}`)} />
        
        {/* Tool authority indicators */}
        <meta name="expertise" content={`Expert review and analysis of ${tool.title}`} />
        <meta name="authoritative-source" content="AI WEB TOOLS - Trusted AI Directory" />
        <meta name="comprehensive-review" content={`Complete guide to ${tool.title} with features, pricing, and alternatives`} />
        
        {/* Enhanced Open Graph for tools */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={buildCanonicalUrl(`/${generateToolSlug(tool.title)}`)} />
        <meta property="og:title" content={selectedTitle} />
        <meta property="og:description" content={selectedDescription} />
        <meta property="og:image" content={toolImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${tool.title} - ${tool.category} Preview`} />
        
        {/* Twitter Cards for tools */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={selectedTitle} />
        <meta name="twitter:description" content={selectedDescription} />
        <meta name="twitter:image" content={toolImage} />
        <meta name="twitter:image:alt" content={`${tool.title} - ${tool.category}`} />
        
        {/* Enhanced structured data for tools */}
        <script type="application/ld+json">
          {JSON.stringify(enhancedSchemaMarkup(tool, toolIndex))}
        </script>
        
        {/* FAQ structured data for featured snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What is ${tool.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${tool.title} is ${tool.description} It's featured in the AI WEB TOOLS directory as one of the top ${tool.category} solutions available.`
                }
              },
              {
                "@type": "Question",
                "name": `How does ${tool.title} compare to alternatives?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Based on our expert analysis at AI WEB TOOLS, ${tool.title} ranks highly due to its performance, features, and user satisfaction in the ${tool.category} category.`
                }
              }
            ]
          })}
        </script>
      </Helmet>
    );
  }
  
  // Category page competitive SEO
  if (category) {
    return (
      <Helmet>
        <title>{category} AI Tools - Best Directory 2026 | AI WEB TOOLS</title>
        <meta name="description" content={`Discover ${category.toLowerCase()} AI tools in our curated directory with reviews and comparisons from AI Web Tools.`} />
        <meta name="keywords" content={`${category} AI tools, best ${category.toLowerCase()} AI, ${category.toLowerCase()} artificial intelligence, AI ${category.toLowerCase()} solutions, ${category.toLowerCase()} automation, AI WEB TOOLS directory`} />
        <link rel="canonical" href={buildCanonicalUrl(`/category/${encodeURIComponent(category)}`)} />
        
        {/* Category Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl(`/category/${encodeURIComponent(category)}`)} />
        <meta property="og:title" content={`${category} AI Tools - Best Directory 2026`} />
        <meta property="og:description" content={`Expert-curated ${category.toLowerCase()} AI tools with reviews and ratings`} />
      </Helmet>
    );
  }
  
  return null;
};

export default CompetitiveSEOHead;
