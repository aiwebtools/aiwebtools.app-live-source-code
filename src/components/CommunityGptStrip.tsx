import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import BotPortrait from '@/components/bot-studio/BotPortrait';
import { getGptRoomTheme } from '@/components/tool-detail/gptRoomThemes';
import { Button } from '@/components/ui/button';
import { loadCommunityBots, getCommunityBotsSync, type CommunityBotTool } from "@/utils/communityBots";

/** Ethics-approved community GPTs, shown in the main directories. Renders nothing until some exist. */
const CommunityGptStrip = () => {
  const [bots, setBots] = useState<CommunityBotTool[] | null>(getCommunityBotsSync);
  const [shown, setShown] = useState(12);
  useEffect(() => { if (!bots) loadCommunityBots().then(setBots).catch(() => setBots([])); }, [bots]);
  if (!bots?.length) return null;
  return (
    <section aria-label="Community GPTs" className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 font-mono text-lg font-bold text-green-300">
        <Users className="h-5 w-5" /> Community GPTs <span className="text-xs font-normal text-green-500/70">· AI ethics reviewed</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.slice(0, shown).map((b) => (
          <Link key={b.categoryPath} to={b.categoryPath} className="group min-w-0 overflow-hidden rounded-lg border border-border bg-card hover:border-primary">
            <div className="aspect-video bg-muted">
              <BotPortrait src={b.imageUrl || ''} name={b.title} themeKey={getGptRoomTheme(b.categoryPath.split('/').pop() || '',b.description,b.title).key} emblem="" className="h-full w-full" />
            </div>
            <div className="p-3">
              <h3 className="break-words font-mono text-sm font-bold text-foreground group-hover:text-primary">{b.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-green-300/70">{b.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {shown < bots.length && <Button variant="outline" onClick={() => setShown((n) => n + 24)} className="mt-4 w-full font-mono text-sm">Show more community GPTs ({bots.length - shown} more)</Button>}
    </section>
  );
};

export default CommunityGptStrip;
