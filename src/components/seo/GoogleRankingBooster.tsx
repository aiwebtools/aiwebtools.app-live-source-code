import { Helmet } from 'react-helmet-async';
import { competitiveAdvantage } from '@/utils/googleRankingOptimizer';
import { generateToolSlug } from '@/utils/urlGenerator';

interface GoogleRankingBoosterProps {
  pageType?: 'homepage' | 'category' | 'tool' | 'search';
  toolData?: any;
  category?: string;
}

const GoogleRankingBooster = ({ pageType = 'homepage', toolData, category }: GoogleRankingBoosterProps) => {
  // Generate comprehensive competitive structured data
  const generateCompetitiveSchema = () => {
    const organizationSchema = {
      "@type": "Organization",
      "name": "AI WEB TOOLS",
      "alternateName": ["AI WEB TOOLS", "AIWebTools", "AITools.Studio"],
      "url": "https://aiwebtools.app",
      "logo": "https://aiwebtools.app/favicon.ico",
      "description": "AI Web Tools is a curated directory of 4,000+ AI tools with reviews, comparisons, and daily updates.",
      "foundingDate": "2023",
      "keywords": competitiveAdvantage.brandDominance.join(", ") + ", ai web tools, best ai web tools, ai web tools directory, find ai web tools, compare ai web tools",
      "slogan": "Find & Compare 4,000+ AI Web Tools",
      "knowsAbout": [
        "AI Web Tools",
        "AI Web Tools Directory",
        "Best AI Web Tools",
        "Artificial Intelligence Tools",
        "AI Software Directory", 
        "Technology Curation",
        "AI Tool Reviews",
        "Enterprise AI Solutions"
      ],
      "sameAs": [
        "https://aiwebtools.app",
        "https://aiwebtools.app"
      ]
    };

    const websiteSchema = {
      "@type": "WebSite",
      "name": "AI Web Tools Directory",
      "alternateName": "AI Web Tools Directory",
      "url": "https://aiwebtools.app",
      "description": "Discover 4,000+ AI web tools with reviews, ratings, and detailed analysis.",
      "publisher": {
        "@type": "Organization",
        "name": "AI WEB TOOLS"
      },
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
        "name": "AI Web Tools Directory",
        "description": "Comprehensive collection of 4,000+ AI web tools",
        "numberOfItems": 4000
      }
    };

    const baseSchema = {
      "@context": "https://schema.org",
      "@graph": [organizationSchema, websiteSchema] as any[]
    };

    // Add tool-specific schema if available
    if (toolData) {
      const softwareSchema = {
        "@type": "SoftwareApplication",
        "name": toolData.title,
        "description": toolData.description,
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      };
      baseSchema["@graph"].push(softwareSchema);
    }

    return baseSchema;
  };

  // Generate FAQ schema for featured snippets
  const generateFAQSchema = () => {
    const faqs = [
      {
        question: "What are AI web tools?",
        answer: "AI web tools are artificial intelligence-powered applications and software that run in web browsers. AI WEB TOOLS directory features 4,000+ AI web tools for content creation, business automation, data analysis, design, development, and more. These AI web tools help users work smarter and faster."
      },
      {
        question: "How do I find the best AI web tools?",
        answer: "Use AI WEB TOOLS directory to find and compare the best AI web tools. We provide expert reviews, ratings, pricing information, and detailed analysis for 4,000+ AI web tools. Filter by category, use case, or pricing to discover AI web tools perfect for your needs."
      },
      {
        question: "Are AI web tools free to use?",
        answer: "Many AI web tools offer free tiers or completely free access. On AI WEB TOOLS directory, we clearly indicate pricing for each AI web tool and highlight the best free AI web tools available. Browse our collection to find both free and premium AI web tools."
      },
      {
        question: "What makes AI WEB TOOLS the best AI web tools directory?",
        answer: "AI Web Tools is a curated directory of 4,000+ AI web tools with reviews, comparisons, and daily updates to help you find the right tool for your needs."
      },
      {
        question: "How often are new AI web tools added to the directory?",
        answer: "AI WEB TOOLS directory is updated daily with new AI web tools and reviews. Our team continuously discovers, tests, and adds the latest AI web tools to ensure you have access to the most current and innovative AI web tools available in 2026."
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage", 
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  // Generate competitive How-To schema
  const generateHowToSchema = () => {
    if (!toolData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Use ${toolData.title} - Complete Guide 2026`,
      "description": `Step-by-step guide to using ${toolData.title} effectively. Expert tips and best practices from AI WEB TOOLS.`,
      "image": "https://aiwebtools.app/placeholder.svg",
      "totalTime": "PT10M",
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Internet connection"
        },
        {
          "@type": "HowToSupply",
          "name": "Web browser"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": toolData.title
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Access the Tool",
          "text": `Visit the ${toolData.title} website and create an account if required.`,
          "url": `https://aiwebtools.app/${generateToolSlug(toolData.title)}`
        },
        {
          "@type": "HowToStep",
          "name": "Explore Features",
          "text": `Familiarize yourself with ${toolData.title}'s interface and core features.`
        },
        {
          "@type": "HowToStep",
          "name": "Start Using",
          "text": `Begin using ${toolData.title} for your ${toolData.category?.toLowerCase() || 'productivity'} needs.`
        },
        {
          "@type": "HowToStep",
          "name": "Optimize Results",
          "text": `Apply advanced techniques and best practices for optimal results with ${toolData.title}.`
        }
      ]
    };
  };

  return (
    <Helmet>
      {/* Competitive Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(generateCompetitiveSchema())}
      </script>

      {/* FAQ Schema for Featured Snippets */}
      {pageType === 'homepage' && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema())}
        </script>
      )}

      {/* How-To Schema for Tools */}
      {toolData && (
        <script type="application/ld+json">
          {JSON.stringify(generateHowToSchema())}
        </script>
      )}

      {/* Content Freshness Signals */}
      <meta name="last-modified" content={new Date().toISOString()} />
      <meta name="date" content={new Date().toISOString().split('T')[0]} />
      <meta name="news_keywords" content="AI tools 2026, best AI software, artificial intelligence directory, ChatGPT, Claude, Gemini, AI productivity" />
      
      {/* Additional Resource Hints for Speed */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.youtube.com" />
      <link rel="dns-prefetch" href="//i.ytimg.com" />
      <link rel="preconnect" href="https://api.ai-webtools.com" />
      
      {/* Competitive Advantage Links */}
      <link rel="alternate" type="application/json" title="AI Tools API" href="https://aiwebtools.app/api/tools" />
      <link rel="alternate" type="application/rss+xml" title="AI Web Tools Feed" href="https://aiwebtools.app/feed.xml" />
      <link rel="sitemap" type="application/xml" href="https://aiwebtools.app/sitemap.xml" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Author & Publisher Links */}
      <link rel="author" href="https://aiwebtools.app/about" />
      <link rel="publisher" href="https://aiwebtools.app" />
      <link rel="me" href="https://twitter.com/aiwebtools" />
    </Helmet>
  );
};

export default GoogleRankingBooster;