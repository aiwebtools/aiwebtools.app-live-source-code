
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedBackground from "@/components/AnimatedBackground";

interface ToolNotFoundProps {
  requestedSlug?: string;
  totalTools: number;
}

const ToolNotFound = ({ requestedSlug, totalTools }: ToolNotFoundProps) => {
  return (
    <div className="min-h-screen bg-black relative">
      <SEOHead
        title="Tool Not Found"
        description="The requested AI tool could not be found. Browse our collection of 4,000+ AI tools."
        noIndex={true}
      />
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center cyber-grid">
        <div className="text-center p-8 bg-gray-900/80 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <h1 className="text-3xl font-bold text-cyan-100 mb-4 cyber-glow">Tool Not Found</h1>
          <p className="text-gray-300 mb-3">This tool address does not match a current directory entry.</p>
          {requestedSlug ? <p className="text-gray-400 mb-6 text-sm break-all">/{requestedSlug}</p> : null}
          <Link to="/">
            <Button variant="outline" className="border-cyan-500/30 bg-gray-900/80 text-cyan-100 hover:bg-cyan-500/20 interactive-button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse 4,000+ AI Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolNotFound;
