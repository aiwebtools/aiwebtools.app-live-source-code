import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useUserSubmittedTools } from "@/hooks/useUserSubmittedTools";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ShieldCheck, Globe, Search } from "lucide-react";
import SubmitToolModal from "@/components/SubmitToolModal";
import SEOHead from "@/components/SEOHead";
import CommunityGptStrip from "@/components/CommunityGptStrip";

const UserSubmittedToolsPage = () => {
  const { tools, loading } = useUserSubmittedTools();
  const [q, setQ] = useState("");
  const [openSubmit, setOpenSubmit] = useState(false);

  const filtered = useMemo(() => {
    if (!q.trim()) return tools;
    const needle = q.toLowerCase();
    return tools.filter((t) =>
      [t.name, t.description, t.category].some((v) => (v || "").toLowerCase().includes(needle))
    );
  }, [tools, q]);

  return (
    <div className="min-h-screen bg-black relative">
      <SEOHead
        title="User Submitted AI Tools · Community Directory — AIWebTools.ai"
        description="Discover AI tools submitted by the community. Every tool is auto-screened by our AI safety model before it goes live. Submit yours in seconds."
      />
      <AnimatedBackground />
      <div className="relative z-10 cyber-grid">
        <Header />
        <div className="container mx-auto px-4 py-24 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-500/40 rounded-full bg-green-500/10 text-green-300 font-mono text-xs mb-4">
              <Globe className="w-3 h-3" /> Community · Auto-Published · AI Safety Screened
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-matrix-green font-mono mb-3" style={{ textShadow: "0 0 12px rgba(0,255,65,0.6)" }}>
              User Submitted AI Tools
            </h1>
            <p className="text-green-200/80 font-mono text-sm max-w-2xl mx-auto">
              Real AI tools published by the community. Every submission is auto-scanned by our AI safety model — safe ones publish instantly.
            </p>
            <Button
              onClick={() => setOpenSubmit(true)}
              className="mt-5 bg-green-500 hover:bg-green-400 text-black font-bold font-mono"
              style={{ boxShadow: "0 0 20px rgba(0,255,65,0.5)" }}
            >
              <Send className="w-4 h-4 mr-2" /> Submit Your AI Tool
            </Button>
          </div>

          <CommunityGptStrip />
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-500/70" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search community tools…"
              className="pl-9 bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg border border-green-500/20 bg-green-500/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-green-300/80 font-mono">
              <p className="mb-3">No community tools yet — be the first!</p>
              <Button onClick={() => setOpenSubmit(true)} className="bg-green-500 hover:bg-green-400 text-black font-mono">
                <Send className="w-4 h-4 mr-2" /> Submit a Tool
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <Link
                  key={t.id}
                  to={`/user-submitted/${t.slug}`}
                  className="group block rounded-lg border border-green-500/30 bg-gray-900/70 overflow-hidden hover:border-green-400 hover:shadow-[0_0_20px_rgba(0,255,65,0.35)] transition-all"
                >
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.name} loading="lazy" className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-green-900/40 to-black flex items-center justify-center text-green-500/40 font-mono text-xs">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[10px] text-green-400/80 font-mono uppercase mb-1">
                      <ShieldCheck className="w-3 h-3" /> Score {t.ai_safety_score ?? "–"}/100 · {t.category}
                    </div>
                    <h3 className="text-green-100 font-mono font-bold text-lg line-clamp-1 group-hover:text-matrix-green">{t.name}</h3>
                    <p className="mt-1 text-green-200/70 font-mono text-xs line-clamp-3">{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
      <SubmitToolModal open={openSubmit} onOpenChange={setOpenSubmit} />
    </div>
  );
};

export default UserSubmittedToolsPage;