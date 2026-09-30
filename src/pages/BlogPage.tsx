import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalSearchBar from '@/components/LazyGlobalSearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, TrendingUp, Users, Sparkles, Grid3X3, Copy, BookOpen, Home, HelpCircle } from 'lucide-react';
import { blogPosts } from '@/data/blogPostContent';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "AI Web Tools Blog",
  "description": "Expert insights, tutorials, and reviews on AI tools for productivity, creativity, and business",
  "url": "https://aiwebtools.app/blog",
  "publisher": {
    "@type": "Organization",
    "name": "AI Web Tools",
    "url": "https://aiwebtools.app"
  },
  "blogPost": blogPosts.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishDate,
    "author": {
      "@type": "Organization",
      "name": "AI Web Tools"
    },
    "keywords": post.keywords.join(", ")
  }))
};

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>AI Tools Blog | GPT-5 News, AI Reviews & Tutorials | AI Web Tools</title>
        <meta name="description" content="Latest AI news including GPT-5, Claude 4, Sora 2 & more. Expert tutorials, reviews, and guides on 2000+ AI tools. Stay ahead with trending AI developments." />
        <meta name="keywords" content="GPT-5, GPT-5 news, AI tools blog, AI tutorials, Claude 4, Sora 2, best AI tools, AI tool directory, Gemini 2.5, AI reviews, ChatGPT alternatives, DeepSeek, AI agents" />
        <link rel="canonical" href="https://aiwebtools.app/blog" />
        
        <meta property="og:title" content="AI Tools Blog | Expert Reviews & Tutorials" />
        <meta property="og:description" content="Expert insights, tutorials, and reviews on 2195+ AI tools. Learn how AI can transform your business and creativity." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiwebtools.app/blog" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Tools Blog | Expert Reviews & Tutorials" />
        <meta name="twitter:description" content="Expert insights, tutorials, and reviews on 2195+ AI tools." />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />

      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-cyan-400">AI Tools</span> Blog & Tutorials
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Expert insights, reviews, and guides on 2000+ AI tools. Stay ahead with the latest AI trends including GPT-5, Claude 4, and more.
            </p>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button asChild className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button asChild className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300">
                <Link to="/main-category/ALL%20AI%20TOOLS">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Browse All Tools
                </Link>
              </Button>
              <Button asChild className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300">
                <a href="https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge" target="_blank" rel="noopener noreferrer">
                  <Copy className="w-4 h-4 mr-2" />
                  Clone AI Database
                </a>
              </Button>
              <Button asChild className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300">
                <Link to="/our-story">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Our Story
                </Link>
              </Button>
              <Button asChild className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300">
                <Link to="/faq">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <GlobalSearchBar />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">{blogPosts.length}+</div>
              <div className="text-xs text-gray-500">Articles</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">2195+</div>
              <div className="text-xs text-gray-500">Tools Covered</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">Daily</div>
              <div className="text-xs text-gray-500">Updates</div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-base text-white leading-tight">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishDate).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Button asChild variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-0">
                    <Link to={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-bold text-white mb-6">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['AI Trends', 'Reviews', 'Case Studies', 'Tutorials', 'Free Tools'].map((cat) => (
                <span key={cat} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 cursor-pointer transition-colors">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Explore AI Tools?</h2>
            <p className="text-gray-400 mb-6">Discover 2195+ AI tools for every need in our comprehensive directory.</p>
            <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              <Link to="/">
                Browse AI Tools Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
