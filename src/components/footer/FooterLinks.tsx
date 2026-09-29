
import FooterWeb3Domains from "./FooterWeb3Domains";
import { createTimePortalEffect } from "@/utils/timeEffects";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";

const FooterLinks = () => {
  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌀 External link clicked in footer links:', url);
    createTimePortalEffect(url);
  };

  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-semibold mb-6 text-green-400" style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.4)' }}>Quick Links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <DownloadLibraryButton
            compact
            label="Free Operational Instructions"
            className="justify-start"
          />
          <a
            href="/our-story"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            📖 Our Story
          </a>
          <button
            onClick={(e) => handleExternalLink("https://aiwebtools.lovable.app/hire-us-to-build-your-ai-1?via=aiwebtools", e)}
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🚀 More Services
          </button>
          <button
            onClick={(e) => handleExternalLink("https://docs.google.com/forms/d/e/1FAIpQLSchtKquEqaaKSZM9AWygcY3Uf3uQOpVHZUMayVZMCbDTxfyfQ/viewform?usp=sf_link", e)}
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🤖 Custom AI Development Request Form
          </button>
        </div>
        <div className="space-y-3">
          <a
            href="/submit-tool"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            ➕ Submit Your AI Tool
          </a>
          <a
            href="/user-submitted"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🌐 User Submitted Tools
          </a>
          <a
            href="/blog"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            📰 Blog
          </a>
          <a
            href="/features"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🏅 Flagship AI Tool Features
          </a>
          <a
            href="/spotlights"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            ✨ AI Tool Spotlights
          </a>
          <a
            href="/rankings"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🏆 Most Popular AI Tools
          </a>

          <a
            href="/privacy-policy"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            🔒 Privacy Policy
          </a>
          <a
            href="/disclaimers"
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            📜 Terms of Service
          </a>
          <button
            onClick={(e) => handleExternalLink("https://aiwebtools.lovable.app/contact?via=aiwebtools", e)}
            className="block text-green-200 hover:text-green-400 transition-colors text-left"
          >
            📞 Contact
          </button>
        </div>
      </div>
      <FooterWeb3Domains />
    </div>
  );
};

export default FooterLinks;