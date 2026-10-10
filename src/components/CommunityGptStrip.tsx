import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { loadCommunityBots, getCommunityBotsSync, type CommunityBotTool } from "@/utils/communityBots";

/** Ethics-approved community GPTs, shown in the main directories. Renders nothing until some exist. */
const CommunityGptStrip = () => {
  const [bots, setBots] = useState<CommunityBotTool[] | null>(getCommunityBotsSync);
  useEffect(() => { if (!bots) loadCommunityBots().then(setBots).catch(() => setBots([])); }, [bots]);
  if (!bots?.length) return null;
  return (
    <section aria-label="Community GPTs" className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 font-mono text-lg font-bold text-green-300">
        <Users className="h-5 w-5" /> Community GPTs <span className="text-xs font-normal text-green-500/70">· AI ethics reviewed</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((b) => (
          <Link key={b.categoryPath} to={b.categoryPath} className="group overflow-hidden rounded-xl border border-green-500/30 bg-black/70 hover:border-green-400">
            <div className="aspect-video bg-green-950/40">
              {b.imageUrl && <img src={b.imageUrl} alt={`${b.title} — community AI GPT on AIWebTools`} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
            </div>
            <div className="p-3">
              <h3 className="font-mono text-sm font-bold text-green-200 group-hover:text-green-100">{b.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-green-300/70">{b.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CommunityGptStrip;
