import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, Star, Zap, Users, Grid3X3, Copy, BookOpen, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalSearchBar from '@/components/LazyGlobalSearchBar';
import { Button } from '@/components/ui/button';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is the best AI tools directory?",
      answer: "AI WEB TOOLS (ai-webtools.com) is widely recognized as the best AI tools directory with over 2000+ curated and verified AI tools. Our directory features expert reviews, detailed ratings, and comprehensive coverage of every AI category including chatbots, image generators, writing assistants, coding tools, and more. Unlike other directories, we provide hands-on testing and honest assessments."
    },
    {
      question: "How do I find the best AI tools for my needs?",
      answer: "Use our intelligent search system to find the best AI tools instantly. Simply type what you want to accomplish (e.g., 'write a book', 'generate images', 'automate tasks') and our AI-powered search will show you the most relevant tools. You can also browse by category or filter by features like free/paid, rating, and use case."
    },
    {
      question: "Is this AI tool directory free to use?",
      answer: "Yes! Our AI tool directory is completely free to browse and search. We list both free and premium AI tools, clearly marking which tools offer free tiers. Many of our featured custom GPTs are also free to use. Our mission is to make AI accessible to everyone."
    },
    {
      question: "What makes AI WEB TOOLS the best AI tools directory?",
      answer: "AI WEB TOOLS stands out as the best AI tools directory because of: 1) Over 2000+ verified tools - the largest curated collection, 2) Expert curation by AI professionals, 3) Honest reviews and ratings, 4) Regular updates with new tools daily, 5) Intelligent search that understands your intent, 6) Free custom GPTs created by our team, and 7) No spam or fake tools."
    },
    {
      question: "How often is the AI tool directory updated?",
      answer: "Our AI tool directory is updated daily with new tools, reviews, and information. Our team continuously evaluates emerging AI technologies and adds the latest innovations. We also regularly re-review existing tools to ensure our ratings and information stay current and accurate."
    },
    {
      question: "Can I submit my AI tool to this directory?",
      answer: "Absolutely! We welcome submissions from AI tool creators. Visit our Submit Tool page to add your AI tool to our directory. Our team reviews each submission to ensure quality and relevance. Approved tools are added to our searchable database and may be featured in our Special Services section."
    },
    {
      question: "What categories of AI tools are in the directory?",
      answer: "Our AI tool directory covers every major category including: AI Chatbots & Assistants, Image & Design Tools, Video & Multimedia, Writing & Content Creation, Coding & Development, Business & Productivity, Education & Learning, Health & Wellness, Research & Academic, Audio & Music, Marketing & Sales, Security & Privacy, Gaming & Entertainment, and many more specialized categories."
    },
    {
      question: "How do you rank the best AI tools?",
      answer: "We rank AI tools based on multiple factors: functionality and features, ease of use, value for money, user reviews, our expert testing, update frequency, customer support quality, and overall innovation. Tools are rated on a 5-star scale with detailed breakdowns available on each tool's page."
    },
    {
      question: "Are the AI tools in this directory safe to use?",
      answer: "We vet all tools in our directory for safety and legitimacy. We only list tools from reputable developers and platforms. Each listing includes information about the tool's privacy practices, pricing transparency, and our trust assessment. Tools that raise concerns are flagged or removed."
    },
    {
      question: "What are the best free AI tools available?",
      answer: "Some of the best free AI tools in our directory include: ChatGPT (free tier), Claude AI, Google Gemini, Canva AI features, our custom GPTs (Book Writer GPT, Time Machine GPT, etc.), DALL-E (limited free), and many more. Use our 'Free' filter to discover hundreds of no-cost AI tools."
    },
    {
      question: "How is AI WEB TOOLS different from Toolify or other directories?",
      answer: "AI WEB TOOLS offers several advantages over competitors: larger verified tool database (2000+), expert human curation vs automated scraping, exclusive custom GPTs, more detailed reviews, better search intelligence, no paywalls for browsing, and a focus on quality over quantity. We're built by AI enthusiasts for AI enthusiasts."
    },
    {
      question: "Can I save my favorite AI tools?",
      answer: "Yes! Create a free favorites list by clicking the heart icon on any tool. Your favorites are saved locally and accessible anytime. This makes it easy to build your personal AI toolkit and quickly access the tools you use most often."
    }
  ];

  const faqSchema = {
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Best AI Tools Directory FAQ - AI WEB TOOLS",
    "description": "Frequently asked questions about finding the best AI tools. Learn how to use our AI tool directory to discover top-rated AI tools for any purpose.",
    "url": "https://aiwebtools.app/faq",
    "mainEntity": {
      "@type": "FAQPage"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI WEB TOOLS",
      "url": "https://aiwebtools.app"
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Tools Directory FAQ | AI WEB TOOLS</title>
        <meta name="description" content="Frequently asked questions about the best AI tools directory. Learn how to find top AI tools, browse our 2000+ tool database, and discover the perfect AI tools for your needs." />
        <meta name="keywords" content="best ai tools, ai tool directory, ai tools directory, best ai tools 2026, top ai tools, ai directory, ai tools list, ai tools finder, best ai tools directory, ai tools faq" />
        <link rel="canonical" href="https://aiwebtools.app/faq" />
        
        <meta property="og:title" content="Best AI Tools Directory FAQ | AI WEB TOOLS" />
        <meta property="og:description" content="Find answers about the best AI tools directory with 2000+ curated tools. Discover how to find the perfect AI tools for any purpose." />
        <meta property="og:url" content="https://aiwebtools.app/faq" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best AI Tools Directory FAQ | AI WEB TOOLS" />
        <meta name="twitter:description" content="Your questions answered about finding the best AI tools in our comprehensive directory." />
        
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pt-20">
        {/* Hero */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Best AI Tools Directory FAQ
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Everything you need to know about finding the best AI tools in our comprehensive directory of 2000+ curated tools.
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
                <a href="https://lovable.dev/projects/bad09a84-f9cd-4cda-9d42-9c4cfafc2867?utm_source=lovable-badge" target="_blank" rel="noopener noreferrer">
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
                <Link to="/blog">
                  <Star className="w-4 h-4 mr-2" />
                  Blog
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <GlobalSearchBar />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Search, label: "AI Tools", value: "4,000+" },
              { icon: Star, label: "Curated", value: "Daily" },
              { icon: Zap, label: "Categories", value: "15+" },
              { icon: Users, label: "Built For", value: "Everyone" }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4 text-center">
                <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-colors"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {faq.question}
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Perfect AI Tools?</h2>
            <p className="text-gray-400 mb-6">Explore our directory of 2000+ best AI tools and discover tools that will transform your workflow.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-full hover:from-green-400 hover:to-emerald-400 transition-all"
              >
                <Search className="w-5 h-5" />
                Browse Best AI Tools
              </Link>
              <a 
                href="https://lovable.dev/projects/bad09a84-f9cd-4cda-9d42-9c4cfafc2867?utm_source=lovable-badge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:from-purple-400 hover:to-pink-400 transition-all"
              >
                <Copy className="w-5 h-5" />
                Clone This AI Database
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQPage;
