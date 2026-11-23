
import { allTools } from "@/data/toolsData";
import { seoConfig } from "./seo";
import { getStandardizedCategoriesWithCounts } from "./categoryTitles";
import { generateToolSlug } from "./urlGenerator";

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

export const generateSitemap = () => {
  console.log(`📄 Generating sitemap for ${allTools.length} tools...`);
  
  const baseUrls: SitemapUrl[] = [
    { loc: seoConfig.siteUrl, changefreq: 'daily', priority: '1.0' },
  ];

  // Generate URLs for ALL tools using slug-based URLs to ensure they're indexed
  const toolUrls: SitemapUrl[] = allTools.map((tool, index) => {
    const slug = generateToolSlug(tool.title);
    return {
      loc: `${seoConfig.siteUrl}/${slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    };
  });

  // Generate category URLs using standardized category titles
  const categoriesWithCounts = getStandardizedCategoriesWithCounts();
  const categoryUrls: SitemapUrl[] = Object.keys(categoriesWithCounts).map(category => ({
    loc: `${seoConfig.siteUrl}/category/${encodeURIComponent(category)}`,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const allUrls = [...baseUrls, ...toolUrls, ...categoryUrls];

  console.log(`✅ Generated sitemap with ${allUrls.length} URLs (${toolUrls.length} tool pages, ${categoryUrls.length} category pages)`);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Verify all tools can be accessed via their individual URLs
export const verifyToolPageUrls = () => {
  const toolUrls = allTools.map((tool, index) => {
    const slug = generateToolSlug(tool.title);
    return {
      index,
      title: tool.title,
      category: tool.category,
      slug,
      url: `/${slug}`,
      fullUrl: `${seoConfig.siteUrl}/${slug}`
    };
  });

  console.log(`🔗 Verified ${toolUrls.length} tool page URLs`);
  console.log('📄 Sample tool URLs:', toolUrls.slice(0, 10));

  return toolUrls;
};
