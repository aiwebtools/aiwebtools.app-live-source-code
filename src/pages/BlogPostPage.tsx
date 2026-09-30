import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalSearchBar from '@/components/LazyGlobalSearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blogPostContent';
import { Calendar, Clock, ArrowLeft, ArrowRight, Home, Grid3X3, Copy, BookOpen, HelpCircle } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Organization",
      "name": "AI Web Tools",
      "url": "https://aiwebtools.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Web Tools",
      "url": "https://aiwebtools.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiwebtools.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://aiwebtools.app/blog/${post.slug}`
    },
    "keywords": post.keywords.join(", "),
    "articleSection": post.category
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | AI Web Tools Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <link rel="canonical" href={`https://aiwebtools.app/blog/${post.slug}`} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://aiwebtools.app/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:section" content={post.category} />
        <meta property="article:tag" content={post.keywords.join(", ")} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />

      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Navigation */}
          <div className="mb-8 pt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button asChild variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Blog
                </Link>
              </Button>
            </div>

            {/* Quick Nav Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Button asChild size="sm" className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300">
                <Link to="/">
                  <Home className="w-3 h-3 mr-1" />
                  Home
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300">
                <Link to="/main-category/ALL%20AI%20TOOLS">
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  All Tools
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300">
                <a href="https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge" target="_blank" rel="noopener noreferrer">
                  <Copy className="w-3 h-3 mr-1" />
                  Clone
                </a>
              </Button>
              <Button asChild size="sm" className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300">
                <Link to="/our-story">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Our Story
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300">
                <Link to="/faq">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  FAQ
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <GlobalSearchBar />
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime} read
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-gray-400 mb-4">
              {post.excerpt}
            </p>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Published: {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert prose-cyan max-w-none mb-12">
            <div 
              className="
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-cyan-400 [&>h2]:mt-10 [&>h2]:mb-4
                [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-3
                [&>h4]:text-lg [&>h4]:font-medium [&>h4]:text-gray-200 [&>h4]:mt-6 [&>h4]:mb-2
                [&>p]:text-gray-300 [&>p]:leading-relaxed [&>p]:mb-4
                [&>ul]:text-gray-300 [&>ul]:my-4 [&>ul]:ml-6 [&>ul>li]:mb-2
                [&>ol]:text-gray-300 [&>ol]:my-4 [&>ol]:ml-6 [&>ol>li]:mb-2
                [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-400
                overflow-x-auto [&>table]:min-w-[36rem] [&>table]:w-full [&>table]:my-6 [&>table]:border-collapse
                [&>table>thead>tr>th]:bg-slate-800 [&>table>thead>tr>th]:text-cyan-400 [&>table>thead>tr>th]:p-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-slate-700
                [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-slate-700 [&>table>tbody>tr>td]:text-gray-300
                [&>table>tbody>tr:nth-child(even)]:bg-slate-900/50
                [&>a]:text-cyan-400 [&>a]:underline [&>a:hover]:text-cyan-300
                [&>strong]:text-white [&>strong]:font-semibold
                [&>code]:bg-slate-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-cyan-300 [&>code]:text-sm
                [&>pre]:bg-slate-900 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6
                [&>hr]:border-slate-700 [&>hr]:my-8
              "
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/^## /gm, '<h2>')
                  .replace(/^### /gm, '<h3>')
                  .replace(/^#### /gm, '<h4>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/<h2>([^<]+)/g, '</p><h2>$1</h2><p>')
                  .replace(/<h3>([^<]+)/g, '</p><h3>$1</h3><p>')
                  .replace(/<h4>([^<]+)/g, '</p><h4>$1</h4><p>')
                  .replace(/^\|(.+)\|$/gm, (match) => {
                    const cells = match.split('|').filter(c => c.trim());
                    if (cells.every(c => /^[-:]+$/.test(c.trim()))) return '';
                    return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
                  })
                  .replace(/(<tr>.*<\/tr>[\s\S]*?<tr>.*<\/tr>)/gm, '<table><thead>$1</thead><tbody></tbody></table>')
                  .replace(/- \*\*([^*]+)\*\*:?\s*(.+)?/g, '<li><strong>$1</strong>$2</li>')
                  .replace(/- (.+)/g, '<li>$1</li>')
                  .replace(/(\d+)\. (.+)/g, '<li>$2</li>')
                  .replace(/<li>/g, '</p><ul><li>')
                  .replace(/<\/li>\n(?!<li>)/g, '</li></ul><p>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
              }}
            />
          </article>

          {/* Keywords/Tags */}
          <div className="mb-12">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-slate-800 text-gray-400 text-sm rounded-full border border-slate-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card 
                    key={relatedPost.id} 
                    className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all"
                  >
                    <CardHeader className="pb-2">
                      <span className="text-xs text-cyan-400 mb-1">{relatedPost.category}</span>
                      <CardTitle className="text-sm text-white line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="text-center p-8 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-3">Explore 2195+ AI Tools</h2>
            <p className="text-gray-400 mb-6">Find the perfect AI tool for any task in our comprehensive directory.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                <Link to="/">
                  Browse AI Tools
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <Link to="/blog">
                  More Articles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
