import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DownloadLibraryButton from '@/components/DownloadLibraryButton';

const AIToolsHub = () => {
  return (
    <>
      <Helmet>
        <title>AI Tools Hub — AI Agents & ChatGPT Alternatives</title>
        <meta name="description" content="Explore the ultimate AI tools hub with 1000+ AI applications, agents, ChatGPT alternatives, and automation solutions. Find the perfect AI tool for any task." />
        <meta name="keywords" content="ai tools hub, ai agents, chatgpt alternatives, ai directory, artificial intelligence tools, ai applications, ai software, ai platforms, ai solutions, automation tools, machine learning tools" />
        <link rel="canonical" href="https://aiwebtools.app/ai-tools-hub" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              🤖 AI Tools Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your central hub for discovering, comparing, and accessing the world's best AI tools, agents, and applications. 
              From ChatGPT alternatives to specialized AI solutions - find everything you need in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">🤖 AI Agents</h2>
              <p className="text-gray-300 mb-4">Intelligent AI agents that can perform complex tasks, automate workflows, and assist with various business processes.</p>
              <Link to="/main-category/AI%20AGENTS" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Explore AI Agents →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-green-400">💬 ChatGPT Alternatives</h2>
              <p className="text-gray-300 mb-4">Discover powerful alternatives to ChatGPT with unique features, specialized capabilities, and competitive advantages.</p>
              <Link to="/main-category/CHAT%20%26%20ASSISTANTS" className="text-green-400 hover:text-green-300 font-semibold">
                Find Alternatives →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">🎨 Creative AI Tools</h2>
              <p className="text-gray-300 mb-4">AI-powered tools for content creation, design, art generation, video editing, and creative workflows.</p>
              <Link to="/main-category/CREATIVE%20%26%20DESIGN" className="text-purple-400 hover:text-purple-300 font-semibold">
                Get Creative →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">📊 Business AI Tools</h2>
              <p className="text-gray-300 mb-4">Professional AI solutions for business automation, analytics, customer service, and enterprise operations.</p>
              <Link to="/main-category/BUSINESS%20%26%20PRODUCTIVITY" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Boost Business →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-red-400">🔧 Developer AI Tools</h2>
              <p className="text-gray-300 mb-4">AI-powered development tools for coding, debugging, testing, and software development workflows.</p>
              <Link to="/main-category/DEVELOPER%20TOOLS" className="text-red-400 hover:text-red-300 font-semibold">
                Code Smarter →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400">🎬 Media AI Tools</h2>
              <p className="text-gray-300 mb-4">Advanced AI tools for video, audio, image processing, and multimedia content creation and editing.</p>
              <Link to="/main-category/VIDEO%20%26%20MULTIMEDIA" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Create Media →
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              🏠 Back to Main Directory
            </Link>
            <DownloadLibraryButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIToolsHub;