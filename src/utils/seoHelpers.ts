
export const generateCanonicalUrl = (path: string) => {
  const baseUrl = "https://aiwebtools.app";
  return path.startsWith('http') ? path : `${baseUrl}${path}`;
};

export const generateAlternateLanguages = () => {
  return [
    { lang: "en", url: "https://aiwebtools.app" },
    { lang: "x-default", url: "https://aiwebtools.app" }
  ];
};

export const generateRSSFeed = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Tools Studio - Latest AI Tools</title>
    <description>Discover the latest AI tools and innovations</description>
    <link>https://aiwebtools.app</link>
    <atom:link href="https://aiwebtools.app/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>1440</ttl>
  </channel>
</rss>`;
};

export const generatePreloadTags = () => {
  return [
    { href: "https://fonts.googleapis.com", rel: "preconnect" },
    { href: "https://fonts.gstatic.com", rel: "preconnect", crossorigin: true },
    { href: "/favicon.ico", rel: "preload", as: "image" },
    { href: "/placeholder.svg", rel: "preload", as: "image" }
  ];
};

export const generateSecurityHeaders = () => {
  return {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:;",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(self), geolocation=()"
  };
};
