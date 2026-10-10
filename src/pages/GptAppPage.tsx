import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BotStudio from "@/components/bot-studio/BotStudio";
import { loadStudioBots, type StudioBot } from "@/components/bot-studio/botCatalog";
import { buildCanonicalUrl } from "@/utils/seo";
import { customToStudioBot, isCustomSlug, readCustomBots } from "@/utils/customBots";

export default function GptAppPage() {
  const { slug = "", threadId } = useParams();
  const [app, setApp] = useState<StudioBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setLoading(true);
    if (isCustomSlug(slug)) { const found = readCustomBots().find((b) => b.slug === slug); setApp(found ? customToStudioBot(found) : null); setLoading(false); return; }
    void loadStudioBots().then((bots) => { if (alive) setApp(bots.find((bot) => bot.slug === slug) || null); }).catch((e) => { if (alive) setError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [slug]);
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Opening assistant" /></div>;
  if (!app) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center"><h1 className="text-xl text-primary">Assistant unavailable</h1><p>{error || "This assistant could not be found."}</p><Button asChild><Link to="/">Back to the directory</Link></Button></div>;
  return <><Helmet><title>{app.display_name} — AIWebTools.app</title><meta name="description" content={app.tagline || `Chat with ${app.display_name} on AIWebTools.app.`} />{app.custom && <meta name="robots" content="noindex" />}<link rel="canonical" href={buildCanonicalUrl(`/app/${app.slug}`)} /></Helmet><BotStudio key={`${app.slug}:${threadId || "latest"}`} app={app} threadId={threadId} /></>;
}
