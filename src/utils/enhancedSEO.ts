// Enhanced SEO Utilities for Maximum Search Engine Visibility
// Optimized for "aiwebtools.ai" and "ai web tools" keywords

export const generateEnhancedStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aiwebtools.app/#organization",
        "name": "AI WEB TOOLS",
        "alternateName": ["AIWEBTOOLS.AI", "AI WEB TOOLS", "AIWEBTOOLS", "AITools.Studio"],
        "url": "https://aiwebtools.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aiwebtools.app/favicon.ico",
          "width": 512,
          "height": 512
        },
        "description": "AI Web Tools is a curated directory of 4,000+ AI tools for business, creativity, and productivity.",
        "foundingDate": "2024",
        "numberOfEmployees": "1-10",
        "industry": "Technology",
        "knowsAbout": [
          "AI WEB TOOLS",
          "aiwebtools.ai",
          "artificial intelligence tools",
          "machine learning platforms",
          "automation software",
          "productivity tools",
          "business AI solutions",
          "creative AI tools",
          "ChatGPT alternatives"
        ],
        "sameAs": [
          "https://aiwebtools.app",
          "https://www.aiwebtools.ai",
          "https://linktr.ee/aiwebtools",
          "https://www.tiktok.com/@aiwebtools"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+14758008096",
          "contactType": "customer service",
          "email": "Contact@ai-webtools.com",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "brand": {
          "@type": "Brand",
          "name": "AIWEBTOOLS.AI",
          "alternateName": "AI WEB TOOLS"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://aiwebtools.app/#website",
        "url": "https://aiwebtools.app",
        "name": "AI Web Tools Directory",
        "alternateName": "AI WEB TOOLS Directory",
        "description": "A curated directory of 4,000+ AI tools with reviews, comparisons, and daily updates.",
        "publisher": {
          "@id": "https://aiwebtools.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://aiwebtools.app/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "AI WEB TOOLS",
            "sameAs": "https://en.wikipedia.org/wiki/Artificial_intelligence"
          },
          {
            "@type": "Thing", 
            "name": "aiwebtools.ai",
            "description": "Comprehensive AI tools directory platform"
          }
        ],
        "keywords": "aiwebtools.ai, ai web tools, AIWEBTOOLS, AI WEB TOOLS, best ai tools 2026, ai tools directory, better than toolify, comprehensive ai tools, verified ai tools, ChatGPT alternatives"
      },
      {
        "@type": "ItemList",
        "@id": "https://aiwebtools.app/#itemlist",
        "name": "AI WEB TOOLS Directory",
        "description": "Comprehensive list of 1000+ AI tools curated by AIWEBTOOLS.AI",
        "numberOfItems": 1000,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "mainEntity": {
          "@id": "https://aiwebtools.app/#website"
        }
      },
      {
        "@type": "Service",
        "@id": "https://aiwebtools.app/#service",
        "name": "AI WEB TOOLS Directory Service",
        "description": "Professional AI tools curation and directory service by AIWEBTOOLS.AI",
        "provider": {
          "@id": "https://aiwebtools.app/#organization"
        },
        "serviceType": "AI Tools Directory",
        "areaServed": "Worldwide",
        "audience": {
          "@type": "Audience",
          "audienceType": ["Business Professionals", "Content Creators", "Developers", "Entrepreneurs", "Students"]
        }
      },
      {
        "@type": "Dataset",
        "@id": "https://aiwebtools.app/#dataset", 
        "name": "AIWEBTOOLS.AI - AI Tools Dataset",
        "description": "Comprehensive dataset of 1000+ AI tools with detailed metadata, categories, and reviews",
        "creator": {
          "@id": "https://aiwebtools.app/#organization"
        },
        "keywords": "ai tools, artificial intelligence, machine learning, automation, productivity, business tools",
        "license": "https://aiwebtools.app/terms"
      },
      {
        "@type": "FAQPage",
        "@id": "https://aiwebtools.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is AIWEBTOOLS.AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Web Tools is a curated directory of 4,000+ AI tools with reviews, ratings, and direct access links."
            }
          },
          {
            "@type": "Question", 
            "name": "How many AI tools are in the AI WEB TOOLS directory?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AIWEBTOOLS.AI features over 1000+ carefully curated AI tools across multiple categories including business, creativity, productivity, and more."
            }
          },
          {
            "@type": "Question",
            "name": "Is AIWEBTOOLS.AI better than Toolify?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AIWEBTOOLS.AI offers a more comprehensive directory with better curation, verified tools, detailed reviews, and superior user experience compared to Toolify."
            }
          }
        ]
      }
    ]
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateToolStructuredData = (tool: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.description,
    "url": tool.directUrl,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI WEB TOOLS",
      "url": "https://aiwebtools.app"
    }
  };
};

export const generateCategoryStructuredData = (category: string, tools: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} - AI WEB TOOLS Directory`,
    "description": `Discover the best ${category} AI tools curated by AIWEBTOOLS.AI`,
    "url": `https://aiwebtools.app/category/${encodeURIComponent(category)}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tools.length,
      "itemListElement": tools.slice(0, 10).map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.title,
          "url": tool.directUrl
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "AIWEBTOOLS.AI",
          "item": "https://aiwebtools.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category,
          "item": `https://aiwebtools.app/category/${encodeURIComponent(category)}`
        }
      ]
    }
  };
};

export const generateSearchResultsStructuredData = (query: string, results: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search Results for "${query}" - AIWEBTOOLS.AI`,
    "description": `Find the best AI tools for ${query} in our comprehensive directory`,
    "url": `https://aiwebtools.app/?search=${encodeURIComponent(query)}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": results.length,
      "itemListElement": results.slice(0, 10).map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.title,
          "description": tool.description,
          "url": tool.directUrl
        }
      }))
    }
  };
};

export const metaKeywords = [
  "aiwebtools.ai",
  "AIWEBTOOLS.AI", 
  "aiwebtools",
  "AIWEBTOOLS",
  "ai web tools",
  "AI WEB TOOLS",
  "AI WEB TOOLS directory",
  "aiwebtools ai",
  "ai web tools ai",
  "best ai tools 2026",
  "ai tools directory",
  "better than toolify",
  "comprehensive ai tools",
  "verified ai tools",
  "ChatGPT alternatives",
  "top ai tools ranking",
  "professional ai tools",
  "enterprise ai solutions",
  "ai tools comparison",
  "trusted ai directory",
  "complete ai tools list",
  "ai tools marketplace",
  "curated ai tools",
  "aitools studio",
  "ai tools company",
  "ai web tools"
];