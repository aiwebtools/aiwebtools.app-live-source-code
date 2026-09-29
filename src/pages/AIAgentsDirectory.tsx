import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DownloadLibraryButton from '@/components/DownloadLibraryButton';

const AIAgentsDirectory = () => {
  return (
    <>
      <Helmet>
        <title>AI Agents Directory — Best AI Agents 2026</title>
        <meta name="description" content="Discover the best AI agents and autonomous AI systems. Compare intelligent agents, AI assistants, and automated AI solutions for business and personal use." />
        <meta name="keywords" content="ai agents, autonomous ai, intelligent agents, ai assistants, automated ai, ai bots, conversational ai, virtual agents, smart agents, ai automation, ai workforce, digital agents" />
        <link rel="canonical" href="https://aiwebtools.app/ai-agents-directory" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🤖 AI Agents Directory
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore the future of AI with autonomous agents that can think, learn, and act independently. 
              From simple task automation to complex decision-making systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-3xl font-bold mb-6 text-purple-400">🎯 Autonomous AI Agents</h2>
              <ul className="space-y-3 text-gray-300">
                <li>• Task automation and workflow management</li>
                <li>• Decision-making and problem-solving agents</li>
                <li>• Learning and adaptive AI systems</li>
                <li>• Multi-agent collaborative systems</li>
                <li>• Goal-oriented AI assistants</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-cyan-500/30">
              <h2 className="text-3xl font-bold mb-6 text-cyan-400">💼 Business AI Agents</h2>
              <ul className="space-y-3 text-gray-300">
                <li>• Customer service and support agents</li>
                <li>• Sales and lead generation agents</li>
                <li>• Data analysis and reporting agents</li>
                <li>• Process optimization agents</li>
                <li>• Virtual workforce solutions</li>
              </ul>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8 text-white">Why AI Agents Are the Future</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-purple-300">🧠 Intelligence</h3>
                <p className="text-gray-300">AI agents can understand context, make decisions, and learn from experience</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-blue-300">⚡ Automation</h3>
                <p className="text-gray-300">Automate complex workflows and repetitive tasks without human intervention</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/20 to-green-600/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">🔄 Adaptability</h3>
                <p className="text-gray-300">Continuously improve and adapt to changing requirements and conditions</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link 
              to="/main-category/AI%20AGENTS" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl mr-4"
            >
              🤖 Browse AI Agents
            </Link>
            <Link 
              to="/" 
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-all"
            >
              🏠 Back to Home
            </Link>
            <DownloadLibraryButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAgentsDirectory;