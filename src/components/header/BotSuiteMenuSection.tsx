import { startTransition, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronDown, Search, Wand2, Trees, ArrowUpRight } from "lucide-react";
import { loadStudioBots, type StudioBot } from "@/components/bot-studio/botCatalog";
import { Button } from "@/components/ui/button";
import { groupBotsByCategory } from "@/components/bot-studio/botCategories";
import { OFF_GRID_PROJECT } from "@/data/offGridProject";
import { createTimePortalEffect } from "@/utils/timeEffects";

/** Header fast-track into every in-site bot room plus the community bot builder. */
export default function BotSuiteMenuSection({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bots, setBots] = useState<StudioBot[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!open || bots) return;
    loadStudioBots().then(setBots).catch((e: Error) => setError(e.message));
  }, [open, bots]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groupBotsByCategory((bots || []).filter((b) => !q || `${b.display_name} ${b.tagline || ""}`.toLowerCase().includes(q)));
  }, [bots, query]);

  const go = (path: string) => {
    onNavigate?.();
    requestAnimationFrame(() => startTransition(() => navigate(path)));
  };
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className="mb-4 grid gap-2" onKeyDown={stop} onPointerDown={stop}>
      <Button asChild variant="outline" className="min-h-11 w-full justify-start gap-2 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20">
        <a href={OFF_GRID_PROJECT.url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
          e.preventDefault();
          onNavigate?.();
          createTimePortalEffect(OFF_GRID_PROJECT.url);
        }}>
          <Trees className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 whitespace-normal text-left">{OFF_GRID_PROJECT.label}</span>
          <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </Button>
      <Button variant="ghost" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-primary/60 bg-primary/10 px-3 text-left text-sm font-bold text-primary hover:bg-primary/20">
        <span className="flex items-center gap-2"><Bot className="h-4 w-4" />AWT Custom Creative Bot Suite{bots ? <span className="text-[10px] font-normal opacity-70">{bots.length}</span> : null}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      <Button variant="ghost" type="button" onClick={() => { go("/app/custom-gpt-maker?builder=1"); }}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-3 text-sm font-bold text-accent-foreground hover:bg-accent/20">
        <Wand2 className="h-4 w-4" />CUSTOM GPT MAKER
      </Button>
      {open && (
        <div className="rounded-lg border border-primary/30 bg-background/95 p-2">
          <label className="flex items-center gap-2 rounded-md border border-primary/30 px-2">
            <Search className="h-4 w-4 text-primary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a bot…" aria-label="Find a bot in the AWT bot suite"
              className="h-9 w-full bg-transparent text-sm text-foreground outline-none" />
          </label>
          <div className="mt-2 max-h-80 overflow-y-auto overscroll-contain">
            {error && <p className="p-2 text-xs text-destructive">{error}</p>}
            {!bots && !error && <p className="p-2 text-xs text-muted-foreground">Loading bots…</p>}
            {bots && groups.length === 0 && <p className="p-2 text-xs text-muted-foreground">No bots match.</p>}
            {groups.map(([category, families]) => {
              const expanded = Boolean(query) || openGroup === category;
              return (
                <div key={category} className="border-b border-primary/10 last:border-0">
                  <Button variant="ghost" type="button" onClick={() => setOpenGroup(expanded && !query ? null : category)} aria-expanded={expanded}
                    className="flex w-full items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wide text-primary">
                    {category}<span className="text-[10px] text-muted-foreground">{families.length}</span>
                  </Button>
                  {expanded && families.map(({ key, base, versions }) => (
                    <div key={key} className="py-0.5 pl-2">
                      {versions.length === 1 ? <Button variant="ghost" type="button" title={base.display_name} onClick={() => go(`/app/${base.slug}`)} className="h-auto min-h-9 w-full justify-start px-1 py-1 text-left text-sm text-foreground">{base.display_name}</Button> :
                      <details open={Boolean(query)}><summary className="cursor-pointer py-2 text-sm text-foreground">{base.display_name} <span className="text-xs text-muted-foreground">· {versions.length} versions</span></summary>
                        <div className="grid grid-cols-4 gap-1">{versions.map((v, i) => <Button variant="outline" key={v.slug} type="button" onClick={() => go(`/app/${v.slug}`)} aria-label={`${base.display_name} version ${i + 1}`} title={v.display_name} className="h-9 px-1 text-xs text-primary">V{i + 1}</Button>)}</div>
                      </details>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
