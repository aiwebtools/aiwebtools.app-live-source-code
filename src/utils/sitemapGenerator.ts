
import { allTools } from '@/data/toolsData';

export const generateEnhancedSitemap = () => {
  const baseUrl = 'https://aiwebtools.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Get unique categories from tools data
  const categories = Array.from(new Set(allTools.map(tool => tool.category).filter(Boolean)));
  
  // Priority levels optimized for competitive ranking
  const priorities = {
    homepage: '1.0',
    category: '0.95',
    popularTool: '0.9',
    tool: '0.85',
    search: '0.9',
    highVolumeSearch: '0.95'
  };
  
  // Change frequencies optimized for Google crawling
  const changeFreqs = {
    homepage: 'daily',
    category: 'daily',
    tool: 'weekly',
    search: 'daily'
  };

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Homepage with enhanced competitive positioning
  sitemap += `  <url>
    <loc>${baseUrl}</loc>
    <changefreq>${changeFreqs.homepage}</changefreq>
    <priority>${priorities.homepage}</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}"/>
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}"/>
  </url>
`;

  // Category pages with enhanced competitive SEO
  categories.forEach((category) => {
    const categoryUrl = `${baseUrl}/category/${encodeURIComponent(category)}`;
    sitemap += `  <url>
    <loc>${categoryUrl}</loc>
    <changefreq>${changeFreqs.category}</changefreq>
    <priority>${priorities.category}</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${categoryUrl}"/>
  </url>
`;
  });

  // Individual tool pages with competitive optimization
  allTools.forEach((tool, index) => {
    const toolUrl = `${baseUrl}/tool/${index}`;
    const isPopular = tool.rating && parseFloat(tool.rating.toString()) > 4.5;
    const priority = isPopular ? priorities.popularTool : priorities.tool;
    
    sitemap += `  <url>
    <loc>${toolUrl}</loc>
    <changefreq>${changeFreqs.tool}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${toolUrl}"/>
`;

    // Enhanced image data for better ranking
    if (tool.imageUrl) {
      sitemap += `    <image:image>
      <image:loc>${tool.imageUrl}</image:loc>
      <image:title>${tool.title} - Best AI Tool for ${tool.category}</image:title>
      <image:caption>Discover ${tool.title} - ${tool.description} | AI WEB TOOLS Directory</image:caption>
    </image:image>
`;
    }

    // Enhanced video data for multimedia content
    if (tool.videoUrl) {
      sitemap += `    <video:video>
      <video:thumbnail_loc>${tool.imageUrl || `${baseUrl}/placeholder.svg`}</video:thumbnail_loc>
      <video:title>${tool.title} Demo - Complete AI Tool Review | AI WEB TOOLS</video:title>
      <video:description>Complete guide and review of ${tool.title} - ${tool.description} | Best AI Tools 2026</video:description>
      <video:content_loc>${tool.videoUrl}</video:content_loc>
      <video:category>${tool.category}</video:category>
      <video:tag>AI tool, ${tool.tags?.join(', ') || tool.category}, best AI tools 2026, ${tool.title} review</video:tag>
      <video:family_friendly>yes</video:family_friendly>
      <video:duration>300</video:duration>
      <video:publication_date>${currentDate}</video:publication_date>
    </video:video>
`;
    }

    sitemap += `  </url>
`;
  });

  // High-priority competitive search terms for ranking against Toolify and competitors
  const competitiveSearchTerms = [
    // Primary competitive terms
    'AI WEB TOOLS', 'best ai tools 2026', 'ai tools directory', 'comprehensive ai tools',
    'verified ai tools', 'toolify alternative', 'better than toolify', 'complete ai tools list',
    
    // High-volume AI terms
    'chatgpt alternatives', 'ai assistant tools', 'ai image generator', 'ai writing tools',
    'ai video editor', 'ai content creation', 'ai business tools', 'ai productivity tools',
    
    // Category-specific competitive terms
    'best ai tools for business', 'ai tools for marketing', 'ai tools for content creation',
    'ai tools for developers', 'ai tools for design', 'ai tools for video editing',
    'ai tools for writing', 'ai tools for automation', 'ai tools for social media',
    
    // Platform and technology terms
    'openai tools', 'gpt tools', 'claude ai tools', 'gemini ai tools', 'custom gpt tools',
    'machine learning tools', 'ai automation platforms', 'enterprise ai tools',
    
    // Intent-based searches
    'how to find best ai tools', 'ai tools comparison', 'ai tools reviews',
    'top ai tools ranking', 'professional ai tools', 'free ai tools directory',
    
    // Trending AI concepts
    'ai agents 2026', 'multimodal ai tools', 'generative ai tools', 'ai workflow automation',
    'artificial intelligence directory', 'ai tools marketplace', 'curated ai tools'
  ];

  competitiveSearchTerms.forEach(term => {
    const searchUrl = `${baseUrl}/?search=${encodeURIComponent(term)}`;
    const isHighVolume = ['AI WEB TOOLS', 'best ai tools 2026', 'chatgpt alternatives', 'ai tools directory'].includes(term);
    const priority = isHighVolume ? priorities.highVolumeSearch : priorities.search;
    
    sitemap += `  <url>
    <loc>${searchUrl}</loc>
    <changefreq>${changeFreqs.search}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  // Enhanced main category pages for better organization and ranking
  const strategicCategories = [
    'AI Assistants & Chatbots', 'AI Image Generation & Art', 'AI Writing & Content Creation', 
    'AI Video & Multimedia Tools', 'AI Audio & Music Tools', 'AI Business & Productivity', 
    'AI Education & Learning', 'AI Creative Services', 'AI Developer Tools', 
    'AI Healthcare Solutions', 'AI Marketing & Sales Tools', 'AI Data & Analytics',
    'AI Design & Graphics', 'AI Automation & Workflow', 'AI Research & Science'
  ];

  strategicCategories.forEach(category => {
    const categoryUrl = `${baseUrl}/main-category/${encodeURIComponent(category)}`;
    sitemap += `  <url>
    <loc>${categoryUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${categoryUrl}"/>
  </url>
`;
  });

  // Tool comparison pages for competitive ranking
  const comparisonPages = [
    'chatgpt-vs-claude', 'midjourney-vs-dalle', 'ai-writing-tools-comparison',
    'best-ai-image-generators', 'top-ai-video-editors', 'ai-productivity-tools-ranking'
  ];

  comparisonPages.forEach(comparison => {
    const comparisonUrl = `${baseUrl}/compare/${comparison}`;
    sitemap += `  <url>
    <loc>${comparisonUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;
  return sitemap;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /404
Disallow: /*?*
Allow: /*?search=*

# Enhanced crawling rules for competitive advantage
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5
Allow: /sitemap.xml
Allow: /search
Allow: /category/
Allow: /tool/
Allow: /main-category/

User-agent: Bingbot
Allow: /
Crawl-delay: 0.5
Allow: /sitemap.xml

User-agent: Slurp
Allow: /
Crawl-delay: 1
Allow: /sitemap.xml

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Social media crawlers for better sharing
User-agent: facebookexternalhit
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /
Crawl-delay: 1

User-agent: LinkedInBot
Allow: /
Crawl-delay: 1

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: PinterestBot
Allow: /

User-agent: Applebot
Allow: /

# AI and ML bots for enhanced discovery
User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /

User-agent: CCBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

# Block aggressive SEO crawlers that don't add value
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SiteAuditBot
Disallow: /

User-agent: MegaIndex
Disallow: /

User-agent: ZoominfoBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

# Sitemap location with enhanced indexing
Sitemap: https://aiwebtools.app/sitemap.xml

# Host preference for canonical URLs
Host: aiwebtools.ai

# Optimized crawl delay for faster indexing
Crawl-delay: 0.5

# Additional directives for competitive SEO
Request-rate: 1/1s
Visit-time: 0600-2300

# Clean URLs directive
Clean-param: utm_source&utm_medium&utm_campaign&fbclid&gclid`;
};

// Generate performance-optimized robots.txt
export const generateOptimizedRobotsTxt = () => {
  return generateRobotsTxt();
};

// Generate comprehensive sitemap for competitive ranking
export const generateComprehensiveSitemap = () => {
  return generateEnhancedSitemap();
};
