
export const SITE_URL = "https://aiwebtools.app" as const;

/** Keep every canonical URL on the one authoritative public origin. */
export const buildCanonicalUrl = (value: string = "/"): string => {
  try {
    const parsed = new URL(value, SITE_URL);
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
    return `${SITE_URL}${path}${parsed.search}`;
  } catch {
    const path = value.startsWith("/") ? value : `/${value}`;
    return `${SITE_URL}${path}`;
  }
};

export const buildAbsoluteAssetUrl = (value?: string): string => {
  if (!value) return `${SITE_URL}/og-default.jpg`;
  if (/^https:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

export const seoConfig = {
  siteName: "AI WEB TOOLS",
  siteUrl: SITE_URL,
  description: "Discover 4,000+ free AI tools: ChatGPT alternatives, custom GPTs, AI agents, image, writing & business AI. Updated daily.",
  keywords: [
    "AI WEB TOOLS",
    "free ai tools",
    "best ai tools 2026",
    "ai tools directory",
    "chatgpt alternatives",
    "custom gpts",
    "ai directory",
    "free ai tools list",
    "top AI tools ranking",
    "ChatGPT alternatives free",
    "ai tools for business",
    "ai tools comparison",
    "productivity ai tools",
    "creative ai tools",
    "web3 domains",
    "ai coding tools",
    "ai design tools",
    "ai writing tools",
    "ai tools finder"
  ],
  author: "AI WEB TOOLS",
  twitterHandle: "@aiwebtools",
  facebookAppId: "ai-web-tools-facebook-app-id",
  linkedinCompany: "ai-web-tools-llc"
};

export const generateStructuredData = (page: string = "homepage") => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.siteUrl}/#website`,
    "name": seoConfig.siteName,
    "alternateName": "AITools.Studio",
    "url": seoConfig.siteUrl,
    "description": seoConfig.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${seoConfig.siteUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Best AI Tools Directory 2026",
      "description": "Comprehensive collection of 4,000+ AI tools",
      "numberOfItems": 4000
    },
    "sameAs": [
      "https://www.aiwebtools.ai",
      "https://aitoolwebsites.com"
    ]
  };

  return baseStructuredData;
};

export const generateFAQStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is AI WEB TOOLS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI WEB TOOLS is the world's most comprehensive AI tools directory with 1000+ verified tools, expert reviews, and detailed analysis. We're better than Toolify and all competitors."
        }
      },
      {
        "@type": "Question",
        "name": "How is AI WEB TOOLS better than Toolify?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI WEB TOOLS offers more comprehensive tool coverage, expert curation, detailed reviews, better user experience, and regular updates. We have 1000+ verified tools compared to competitors."
        }
      },
      {
        "@type": "Question",
        "name": "Are the AI tools on AI WEB TOOLS free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI WEB TOOLS features both free and premium AI tools. Each tool listing includes pricing information and free tier availability. Many tools offer free trials or freemium models."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the AI tools directory updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI WEB TOOLS is updated daily with new AI tools, reviews, and information. Our expert team continuously evaluates and adds the latest AI innovations to the directory."
        }
      }
    ]
  };
};

export const generateLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${seoConfig.siteUrl}/#organization`,
    "name": "AI WEB TOOLS",
    "alternateName": "AI WEB TOOLS",
    "url": seoConfig.siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${seoConfig.siteUrl}/favicon.ico`
    },
    "description": "The world's most comprehensive AI tools directory with 1000+ curated AI applications.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "KB"
      }
    ],
    "numberOfEmployees": "10-50",
    "industry": "Technology, AI Tools, Software Directory",
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "areaServed": "Global",
    "knowsAbout": [
      "Artificial Intelligence",
      "AI Tools",
      "ChatGPT Alternatives",
      "Software Directory",
      "Technology Reviews"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+14758008096",
      "contactType": "Customer Service",
      "email": "Contact@ai-webtools.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.aiwebtools.ai",
      "https://aitoolwebsites.com"
    ]
  };
};
