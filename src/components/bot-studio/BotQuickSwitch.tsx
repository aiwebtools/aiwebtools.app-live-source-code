import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StudioBot } from "./botCatalog";
import { getBotCategory, searchStudioBots } from "./botSubjects";

/** Compact catalog search, using the same navigation as the full sidebar. */
export default function BotQuickSwitch({ bots, onChoose, portrait }: { bots: StudioBot[]; onChoose: (slug: string) => void; portrait: (bot: StudioBot) => React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const matches = useMemo(() => searchStudioBots(bots, query).slice(0, 12), [bots, query]);
  const open = focused && Boolean(query.trim());
  const choose = (slug: string) => { setQuery(""); setFocused(false); onChoose(slug); };
  return <div className="relative mx-4 mb-2 sm:mx-6" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-primary" />
      <Input aria-label="Quick switch bot" placeholder="Quick switch · find a bot…" value={query} onFocus={() => setFocused(true)} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
        if (event.key === "Escape") { setFocused(false); setQuery(""); }
        if (event.key === "Enter" && matches[0]) { event.preventDefault(); choose(matches[0].slug); }
      }} className="h-10 border-primary/30 bg-background pl-9 pr-10 text-sm" aria-expanded={open} aria-controls={open ? "studio-quick-results" : undefined} />
      {query && <Button variant="ghost" size="icon" className="absolute right-0 h-10 w-10" aria-label="Clear quick switch search" onClick={() => setQuery("")}><X className="h-4 w-4" /></Button>}
    </div>
    {open && <div id="studio-quick-results" aria-label="Matching bots" className="absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-y-auto overscroll-contain rounded-md border border-primary/30 bg-background shadow-lg">
      {!bots.length ? <p role="status" className="p-3 text-sm text-muted-foreground">Loading bots…</p> : !matches.length ? <p role="status" className="p-3 text-sm text-muted-foreground">No matching bots.</p> : matches.map((bot) => <Button key={bot.slug} variant="ghost" className="h-auto min-h-12 w-full justify-start gap-2 whitespace-normal rounded-none px-3 py-2 text-left" onClick={() => choose(bot.slug)}>
        {portrait(bot)}<span className="min-w-0"><span className="block break-words text-sm">{bot.display_name}</span><span className="block text-xs text-muted-foreground">{getBotCategory(bot)}</span></span>
      </Button>)}
    </div>}
  </div>;
}