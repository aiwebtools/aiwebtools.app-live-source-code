import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecialServices from "@/components/SpecialServices";
import { allTools } from "@/data/toolsData";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield, Globe, Star, CheckCircle, Users, Award, Lightbulb, Target } from "lucide-react";

/**
 * MAXIMUM SEO LANDING PAGE - "AI WEB TOOLS" KEYWORD DOMINATION
 * This page is specifically optimized to rank #1 for "AI Web Tools" searches
 * WITHOUT changing main visible website content
 */
const AIWebToolsPage = () => {
  const toolCount = allTools.length;
  const currentYear = new Date().getFullYear();
  
  // Ultra-comprehensive structured data for AI Web Tools
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Web Tools",
    "alternateName": ["AIWebTools", "AI WEB TOOLS", "AIWEBTOOLS.AI", "AITools.Studio"],
    "url": "https://aiwebtools.app",
    "logo": "https://aiwebtools.app/lovable-uploads/fe59a436-1f90-45d6-9b98-236a54034010.png",
    "description": `AI Web Tools is the world's leading AI tools directory with ${toolCount}+ verified AI tools, custom GPTs, and intelligent assistants for every industry and use case.`,
    "foundingDate": "2024",
    "sameAs": [
      "https://aiwebtools.app",
      "https://aiwebtools.app",
      "https://www.aiwebtools.ai",
      "https://aiwebtools.app"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+14758008096",
      "contactType": "customer service",
      "email": "Contact@ai-webtools.com",
      "availableLanguage": ["English"]
    },
    "knowsAbout": [
      "Artificial Intelligence Tools",
      "AI Web Tools",
      "ChatGPT Alternatives",
      "AI Productivity Tools",
      "AI Writing Tools",
      "AI Image Generation",
      "AI Video Tools",
      "Custom GPTs",
      "Machine Learning Applications"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Web Tools - AIWEBTOOLS.AI",
    "alternateName": ["AI Web Tools Directory", "AI Web Tools Database", "Best AI Web Tools"],
    "url": "https://aiwebtools.app",
    "description": `The ultimate AI web tools directory featuring ${toolCount}+ AI tools. Discover the best AI web tools for productivity, creativity, and business automation.`,
    "publisher": {
      "@type": "Organization",
      "name": "AI Web Tools",
      "logo": "https://aiwebtools.app/lovable-uploads/fe59a436-1f90-45d6-9b98-236a54034010.png"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://aiwebtools.app/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI Web Tools - Complete Directory",
    "description": `Discover ${toolCount}+ AI web tools in the most comprehensive AI tools directory. AI Web Tools offers free access to the best AI tools for every purpose.`,
    "url": "https://aiwebtools.app/ai-web-tools",
    "mainEntity": {
      "@type": "ItemList",
      "name": "AI Web Tools Collection",
      "description": "The complete collection of AI web tools for professionals and creators",
      "numberOfItems": toolCount,
      "itemListElement": allTools.slice(0, 50).map((tool, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": tool.title,
        "description": tool.description?.substring(0, 160),
        "applicationCategory": "AI Tool",
        "operatingSystem": "Web Browser"
      }))
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are AI web tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI web tools are browser-based artificial intelligence applications that help users accomplish tasks like writing, design, coding, research, and business automation without installing software. They leverage machine learning, natural language processing, and computer vision to provide intelligent assistance."
        }
      },
      {
        "@type": "Question",
        "name": "What is AIWebTools.AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `AIWebTools.AI is the world's largest AI web tools directory, featuring ${toolCount}+ verified AI tools across all categories. We help users discover, compare, and access the best AI web tools for any purpose, from productivity to creativity to business automation.`
        }
      },
      {
        "@type": "Question",
        "name": "Are the AI web tools on AIWEBTOOLS free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Many AI web tools in our directory are free or offer free tiers. Our own custom GPT collection (100+ tools) is completely free to use. We clearly indicate pricing for each AI web tool so you can find options that fit your budget."
        }
      },
      {
        "@type": "Question",
        "name": `What are the best AI web tools in ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best AI web tools in ${currentYear} include ChatGPT and Claude for conversational AI, Midjourney and DALL-E for image generation, Book Writer GPT and Movie Script Writer GPT for creative writing, and specialized tools for business, education, and productivity. AIWEBTOOLS.AI helps you discover them all.`
        }
      },
      {
        "@type": "Question",
        "name": "How do I find the right AI web tool for my needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the AI web tools search on AIWEBTOOLS.AI to describe what you need, or browse by category (Writing, Image, Video, Business, etc.). Each AI web tool has detailed descriptions, videos, and direct access links to help you choose the perfect tool."
        }
      },
      {
        "@type": "Question",
        "name": "What makes AI Web Tools different from other AI tool directories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `AI Web Tools (AIWEBTOOLS.AI) stands out with ${toolCount}+ verified tools, 100+ original custom GPTs, detailed video demonstrations, and intelligent search that understands natural language. We're updated daily. `
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://aiwebtools.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI Web Tools",
        "item": "https://aiwebtools.app/ai-web-tools"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>AI Web Tools — AIWEBTOOLS.AI | {toolCount}+ AI Web Tools Directory {currentYear}</title>
        <meta name="description" content={`AI Web Tools — a curated AI web tools directory with ${toolCount}+ AI tools for writing, design, coding, business, and productivity.`} />
        <meta name="keywords" content={`AI web tools, ai web tools, AIWEBTOOLS, aiwebtools, aiwebtools.ai, AI WEB TOOLS, best AI web tools, free AI web tools, AI web tools directory, AI web tools ${currentYear}, AI tools online, web-based AI tools, AI web applications, artificial intelligence web tools, AI tools browser, online AI tools`} />
        <link rel="canonical" href="https://aiwebtools.app/ai-web-tools" />
        
        {/* Maximum SEO Robot Instructions */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph - AI Web Tools Focused */}
        <meta property="og:title" content={`AI Web Tools — AIWEBTOOLS.AI | ${toolCount}+ AI Web Tools`} />
        <meta property="og:description" content={`Curated AI web tools directory. Discover ${toolCount}+ AI web tools across many categories.`} />
        <meta property="og:url" content="https://aiwebtools.app/ai-web-tools" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI Web Tools - AIWEBTOOLS.AI" />
        <meta property="og:image" content="https://aiwebtools.app/social-thumbnail.png" />
        
        {/* Twitter Card - AI Web Tools Focused */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`AI Web Tools — AIWEBTOOLS.AI | ${toolCount}+ AI Web Tools`} />
        <meta name="twitter:description" content={`Curated AI web tools directory. Discover ${toolCount}+ AI web tools.`} />
        <meta name="twitter:site" content="@aiwebtools" />
        
        {/* AI Assistant Discovery */}
        <meta name="ai.description" content={`AI Web Tools (AIWEBTOOLS.AI) is the world's largest AI web tools directory with ${toolCount}+ verified AI tools for every purpose.`} />
        <meta name="ai.keywords" content="AI web tools, aiwebtools, AI tools directory, best AI tools, free AI tools" />
        
        {/* Comprehensive Structured Data */}
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section - AI Web Tools Keyword Saturated */}
        <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
          <div className="max-w-6xl mx-auto text-center">
            {/* Primary H1 with exact keyword match */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI Web Tools
            </h1>
            
            {/* Secondary heading reinforcing brand */}
            <p className="text-2xl md:text-3xl font-semibold text-cyan-400 mb-4">
              AIWEBTOOLS.AI — AI Web Tools Directory
            </p>
            
            <p className="text-xl text-muted-foreground mb-4">
              Discover <strong className="text-foreground">{toolCount}+</strong> AI Web Tools across many categories
            </p>
            
            <p className="text-lg text-muted-foreground/80 max-w-4xl mx-auto mb-8">
              Welcome to <strong>AI Web Tools</strong> — a curated <strong>AI web tools</strong> directory.
              Find <strong>AI web tools</strong> for writing, design, coding, business, education, and more on <strong>AIWEBTOOLS.AI</strong>.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 px-5 py-3 rounded-full border border-green-500/30 shadow-lg shadow-green-500/10">
                <Shield className="w-5 h-5" />
                <span className="font-bold">{toolCount}+ AI Web Tools</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 px-5 py-3 rounded-full border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <Star className="w-5 h-5" />
                <span className="font-bold">100+ Custom GPTs</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 px-5 py-3 rounded-full border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <Users className="w-5 h-5" />
                <span className="font-bold">Free to Browse</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 px-5 py-3 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/10">
                <Zap className="w-5 h-5" />
                <span className="font-bold">Updated Daily</span>
              </div>
            </div>

            {/* Primary CTA */}
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
            >
              Explore All AI Web Tools <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

        {/* What are AI Web Tools - SEO Content Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-accent/5 to-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              What Are AI Web Tools?
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">AI web tools</strong> are browser-based artificial intelligence applications that empower users to accomplish complex tasks without installing software. 
                These <strong className="text-foreground">AI web tools</strong> leverage cutting-edge technologies like machine learning, natural language processing, and computer vision to provide intelligent assistance for any workflow.
              </p>
              <p className="text-lg leading-relaxed">
                At <strong className="text-foreground">AIWEBTOOLS.AI</strong>, we've curated the world's largest collection of <strong className="text-foreground">AI web tools</strong> - over {toolCount} verified tools across every category imaginable. 
                Whether you're a writer seeking <strong className="text-foreground">AI web tools</strong> for content creation, a designer looking for image generation, or a business owner automating workflows, 
                our <strong className="text-foreground">AI web tools</strong> directory has the perfect solution.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose AI Web Tools - Feature Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Why Choose AI Web Tools from AIWEBTOOLS.AI?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Discover what makes our <strong>AI web tools</strong> directory the preferred choice for professionals worldwide
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: "Largest AI Web Tools Collection",
                  description: `Access ${toolCount}+ verified AI web tools - the most comprehensive directory available anywhere.`
                },
                {
                  icon: CheckCircle,
                  title: "100% Free to Browse",
                  description: "Explore all AI web tools at no cost. Many tools offer free tiers and our custom GPTs are completely free."
                },
                {
                  icon: Target,
                  title: "Intelligent Search",
                  description: "Find the perfect AI web tools using natural language. Just describe what you need and we'll match you."
                },
                {
                  icon: Lightbulb,
                  title: "100+ Original GPTs",
                  description: "Exclusive custom GPTs created by our team - unique AI web tools you won't find anywhere else."
                },
                {
                  icon: Zap,
                  title: "Updated Daily",
                  description: "New AI web tools added every day. Never miss the latest AI innovations and breakthroughs."
                },
                {
                  icon: Globe,
                  title: "Trusted Worldwide",
                  description: "Over 100,000 professionals trust AIWEBTOOLS.AI to discover the best AI web tools for their needs."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Web Tools Categories */}
        <section className="py-16 px-4 bg-accent/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Browse AI Web Tools by Category
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              Explore our complete collection of <strong>AI web tools</strong> organized by use case
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Writing AI Web Tools", link: "/main-category/WRITING%20%26%20CONTENT%20AI%20TOOLS", count: "200+" },
                { name: "Image AI Web Tools", link: "/main-category/IMAGE%20%26%20DESIGN%20AI%20TOOLS", count: "300+" },
                { name: "Video AI Web Tools", link: "/main-category/VIDEO%20%26%20MULTIMEDIA%20AI%20TOOLS", count: "150+" },
                { name: "Coding AI Web Tools", link: "/main-category/CODING%20%26%20DEVELOPMENT%20AI%20TOOLS", count: "100+" },
                { name: "Business AI Web Tools", link: "/main-category/BUSINESS%20%26%20PRODUCTIVITY%20AI%20TOOLS", count: "250+" },
                { name: "Education AI Web Tools", link: "/main-category/EDUCATION%20%26%20LEARNING%20AI%20TOOLS", count: "80+" },
                { name: "AI Agents", link: "/ai-agents-directory", count: "100+" },
                { name: "Custom GPTs", link: "/", count: "100+" }
              ].map((cat) => (
                <Link 
                  key={cat.name}
                  to={cat.link}
                  className="bg-card hover:bg-accent/20 border border-border/50 rounded-xl p-5 text-center transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg"
                >
                  <p className="font-semibold text-lg mb-1">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.count} tools</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured AI Web Tools */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Featured AI Web Tools
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              Handpicked <strong>AI web tools</strong> from AIWEBTOOLS.AI - 100% free to use
            </p>
            <SpecialServices />
          </div>
        </section>

        {/* FAQ Section - Maximum SEO */}
        <section className="py-16 px-4 bg-accent/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              Frequently Asked Questions About AI Web Tools
            </h2>
            
            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h3 className="text-xl font-semibold mb-3">What are AI web tools?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>AI web tools</strong> are browser-based artificial intelligence applications that help users accomplish tasks like writing, design, coding, research, and business automation without installing software. 
                  They leverage machine learning, natural language processing, and computer vision to provide intelligent assistance accessible from any device with a web browser.
                </p>
              </div>
              
              <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h3 className="text-xl font-semibold mb-3">What is AIWEBTOOLS.AI?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>AIWEBTOOLS.AI</strong> is the world's largest <strong>AI web tools</strong> directory, featuring {toolCount}+ verified AI tools across all categories. 
                  We help users discover, compare, and access the best <strong>AI web tools</strong> for any purpose, from productivity to creativity to business automation. 
                 
                </p>
              </div>
              
              <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h3 className="text-xl font-semibold mb-3">Are the AI web tools on AIWEBTOOLS free?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Many <strong>AI web tools</strong> in our directory are free or offer free tiers. Our own custom GPT collection (100+ tools) is completely free to use. 
                  We clearly indicate pricing for each <strong>AI web tool</strong> so you can find options that fit your budget. Browsing our entire directory is always 100% free.
                </p>
              </div>
              
              <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h3 className="text-xl font-semibold mb-3">What are the best AI web tools in {currentYear}?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The best <strong>AI web tools</strong> in {currentYear} include ChatGPT and Claude for conversational AI, Midjourney and DALL-E for image generation, 
                  Book Writer GPT and Movie Script Writer GPT for creative writing, and specialized tools for business, education, and productivity. 
                  <strong>AIWEBTOOLS.AI</strong> helps you discover and compare them all in one place.
                </p>
              </div>
              
              <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all">
                <h3 className="text-xl font-semibold mb-3">How do I find the right AI web tool for my needs?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use the <strong>AI web tools</strong> search on AIWEBTOOLS.AI to describe what you need in natural language, or browse by category (Writing, Image, Video, Business, etc.). 
                  Each <strong>AI web tool</strong> has detailed descriptions, video demonstrations, and direct access links to help you choose the perfect tool for your specific use case.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-14 h-14 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Exploring AI Web Tools Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use <strong>AIWEBTOOLS.AI</strong> to discover the perfect <strong>AI web tools</strong> for their needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
              >
                Explore All AI Web Tools <ArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                to="/submit-tool"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                Submit Your AI Tool <Sparkles className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AIWebToolsPage;
