import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEOHead from "@/components/SEOHead";
import SubmitToolModal from "@/components/SubmitToolModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, ShieldCheck, ImageIcon, Globe } from "lucide-react";

const ToolSubmission = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Open the submission flow straight away so the page is a single-click action.
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      <SEOHead
        title="Submit Your AI Tool · Free Listing — AIWebTools.ai"
        description="Submit your AI tool to AIWebTools.ai with a name, description, link and custom image. Safe submissions publish instantly to our community directory of 4,000+ AI tools."
      />
      <AnimatedBackground />
      <div className="relative z-10 cyber-grid">
        <Header />
        <div className="container mx-auto px-4 py-24 max-w-3xl">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-green-300 font-mono">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-500/40 rounded-full bg-green-500/10 text-green-300 font-mono text-xs mb-4">
              <ShieldCheck className="w-3 h-3" /> AI Safety Screened · Instant Publishing
            </div>
            <h1
              className="text-4xl md:text-5xl font-black text-matrix-green font-mono mb-4"
              style={{ textShadow: "0 0 12px rgba(0,255,65,0.6)" }}
            >
              Submit Your AI Tool
            </h1>
            <p className="text-green-200/80 font-mono text-sm max-w-xl mx-auto mb-8">
              Add your tool with a name, description, link and your own image. Our AI screener checks it in seconds —
              safe tools go live instantly in the community directory.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 text-left mb-10">
              {[
                { icon: ImageIcon, t: "Your own image", d: "Upload a PNG, JPG, WEBP or GIF up to 5 MB." },
                { icon: ShieldCheck, t: "Screened instantly", d: "Real AI tools only — no fakes, no NSFW." },
                { icon: Globe, t: "Own page + search", d: "You get a live page, fully searchable site-wide." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="border border-green-500/25 rounded-lg bg-black/50 p-4">
                  <Icon className="w-4 h-4 text-green-400 mb-2" />
                  <div className="text-green-300 font-mono text-sm font-bold">{t}</div>
                  <div className="text-green-200/60 font-mono text-xs mt-1">{d}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-green-500 hover:bg-green-400 text-black font-bold font-mono"
              style={{ boxShadow: "0 0 20px rgba(0,255,65,0.5)" }}
            >
              <Send className="w-4 h-4 mr-2" /> Open the submission form
            </Button>

            <div className="mt-6 text-green-200/60 font-mono text-xs">
              Browse everything the community has added on the{" "}
              <Link to="/user-submitted" className="text-green-400 underline">
                User Submitted AI Tools
              </Link>{" "}
              page. By submitting you agree to our{" "}
              <Link to="/disclaimers" className="text-green-400 underline">
                guidelines and terms
              </Link>
              .
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <SubmitToolModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default ToolSubmission;
