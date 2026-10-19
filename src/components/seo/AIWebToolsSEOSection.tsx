import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Compact SEO Section for "ai web tools" keyword ranking
 * Designed to be small and unobtrusive while still providing SEO value
 */
const AIWebToolsSEOSection = () => {
  return (
    <section className="py-6 bg-slate-950/80 border-y border-cyan-500/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm md:text-base font-medium text-gray-400 mb-2">
            <span className="text-cyan-500">AI Web Tools</span> — Your Complete AI Tools Directory for 2026
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-gray-400">AI WEB TOOLS</strong> is the world's most comprehensive directory of AI web tools. 
            Access <strong>4,000+ verified AI web tools</strong> for productivity, creativity, and business. 
            <Link to="/main-category/ALL%20AI%20TOOLS" className="text-cyan-500 hover:text-cyan-400 ml-1">
              Browse all AI web tools →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIWebToolsSEOSection;
