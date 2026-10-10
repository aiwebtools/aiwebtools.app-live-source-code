import { useEffect, useState } from "react";
import { Tool } from "@/types/tools";
import BotStudio from "@/components/bot-studio/BotStudio";
import { loadStudioBots, type StudioBot } from "@/components/bot-studio/botCatalog";

export default function InSiteGptRunner({ tool, appSlug, showLoading = false }: { tool: Tool; appSlug?: string; showLoading?: boolean }) {
  const [app, setApp] = useState<StudioBot | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let alive = true;
    setApp(null); setDone(false);
    void loadStudioBots().then((bots) => { if (alive) setApp(bots.find((bot) => appSlug ? bot.slug === appSlug : bot.tool_title === tool.title) || null); }).catch(() => {}).finally(() => { if (alive) setDone(true); });
    return () => { alive = false; };
  }, [appSlug, tool.title]);
  useEffect(() => {
    if (!app || window.location.hash !== "#try-bot") return;
    const id = requestAnimationFrame(() => document.getElementById("try-bot")?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(id);
  }, [app]);
  if (!app) return showLoading ? <p role="status" className="p-8 text-center text-sm text-muted-foreground">{done ? "This assistant is unavailable right now." : "Opening the assistant…"}</p> : null;
  return <BotStudio key={app.slug} app={app} embedded />;
}
