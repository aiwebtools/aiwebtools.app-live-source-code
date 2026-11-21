import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, ArrowLeft, User } from "lucide-react";
import { fetchUserSubmittedToolBySlug, type UserSubmittedTool } from "@/hooks/useUserSubmittedTools";
import SEOHead from "@/components/SEOHead";
import { youtubePlaybackUrl, startYouTubeWithSound } from "@/utils/videoPlayback";

const UserSubmittedToolDetail = () => {
  const { slug } = useParams();
  const [tool, setTool] = useState<UserSubmittedTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);
    (async () => {
      const t = await fetchUserSubmittedToolBySlug(slug);
      if (!t) setNotFound(true);
      else setTool(t);
      setLoading(false);
    })();
  }, [slug]);

  const youtubeEmbed = (url: string | null) => {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([\w-]{11})/);
    return m ? youtubePlaybackUrl(`https://www.youtube.com/embed/${m[1]}?controls=1&rel=0`) : null;
  };

  return (
    <div className="min-h-screen bg-black relative">
      <SEOHead
        title={tool ? `${tool.name} · Community AI Tool — AIWebTools.ai` : "Community Tool — AIWebTools.ai"}
        description={tool?.description?.slice(0, 155) || "Community-submitted AI tool on AIWebTools.ai"}
      />
      <AnimatedBackground />
      <div className="relative z-10 cyber-grid">
        <Header />
        <div className="container mx-auto px-4 py-24 max-w-4xl">
          <Link to="/user-submitted" className="inline-flex items-center gap-1 text-green-300 font-mono text-sm hover:text-matrix-green mb-4">
            <ArrowLeft className="w-4 h-4" /> All community tools
          </Link>

          {loading ? (
            <div className="h-96 animate-pulse rounded-lg border border-green-500/20 bg-green-500/5" />
          ) : notFound || !tool ? (
            <div className="text-center py-20 text-green-300 font-mono">
              <p className="text-2xl mb-2">Tool not found.</p>
              <p className="text-sm text-green-400/70">It may have been removed or is awaiting approval.</p>
            </div>
          ) : (
            <article className="rounded-lg border border-green-500/40 bg-gray-900/80 overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.25)]">
              {tool.image_url && (
                <img src={tool.image_url} alt={tool.name} className="w-full aspect-video object-cover" />
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-[11px] text-green-400/80 font-mono uppercase mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> AI Safety Verified · Score {tool.ai_safety_score ?? "–"}/100 · {tool.category}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-matrix-green font-mono" style={{ textShadow: "0 0 10px rgba(0,255,65,0.6)" }}>
                  {tool.name}
                </h1>
                {tool.submitter_name && (
                  <p className="mt-2 text-green-300/80 font-mono text-xs flex items-center gap-1">
                    <User className="w-3 h-3" /> Submitted by {tool.submitter_name}
                  </p>
                )}
                <p className="mt-4 text-green-100/90 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {tool.description}
                </p>

                <a href={tool.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-block mt-6">
                  <Button className="bg-green-500 hover:bg-green-400 text-black font-bold font-mono" style={{ boxShadow: "0 0 20px rgba(0,255,65,0.5)" }}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Visit Tool
                  </Button>
                </a>

                {youtubeEmbed(tool.video_url) && (
                  <div className="mt-6 aspect-video rounded-lg overflow-hidden border border-green-500/30">
                    <iframe
                      onLoad={event => startYouTubeWithSound(event.currentTarget)}
                      src={youtubeEmbed(tool.video_url) as string}
                      title={tool.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="mt-6 text-[11px] text-green-500/70 font-mono border border-green-500/20 rounded p-2 bg-green-500/5">
                  Disclaimer: This tool was submitted by the community. AIWebTools.ai auto-scans every URL for malware, phishing, and scam patterns before publishing, but is not affiliated with the tool's owner. Use at your own discretion.
                </div>
              </div>
            </article>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserSubmittedToolDetail;