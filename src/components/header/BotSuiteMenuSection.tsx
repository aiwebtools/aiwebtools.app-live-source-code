import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronDown, RotateCw, Search, Wand2 } from "lucide-react";
import { loadStudioBots, type StudioBot } from "@/components/bot-studio/botCatalog";
import { Button } from "@/components/ui/button";
import { groupBotsByCategory } from "@/components/bot-studio/botCategories";
import CommunityAppsMenuSection from "./CommunityAppsMenuSection";
import { searchStudioBots } from "@/components/bot-studio/botSubjects";

/** Header fast-track into every in-site bot room plus the community bot builder. */
export default function BotSuiteMenuSection({ onNavigate, gptsOnly = false, fullPage = false }: { onNavigate?: () => void; gptsOnly?: boolean; fullPage?: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(gptsOnly);
  const [bots, setBots] = useState<StudioBot[] | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!open || bots) return;
    let alive = true;
    setError("");
    void loadStudioBots().then((loaded) => {
      if (alive) { setBots(loaded); setError(""); }
    }).catch((e: unknown) => {
      if (alive) setError(e instanceof Error ? e.message : "The assistant directory could not load. Please try again.");
    });
    return () => { alive = false; };
  }, [open, bots, retry]);

  const matches = useMemo(() => searchStudioBots(bots || [], query.trim()), [bots, query]);
  const groups = useMemo(() => groupBotsByCategory(matches), [matches]);
  const best = query.trim() ? matches.slice(0, 3) : [];

  const go = (path: string) => {
    onNavigate?.();
    // A transition here can keep the old page on screen indefinitely while the bot room loads.
    requestAnimationFrame(() => navigate(path));
  };
  const openBuilder = () => {
    onNavigate?.();
    if (window.location.pathname.startsWith("/app/")) {
      // Already inside a bot room: open the builder in place instead of waiting on a route change.
      requestAnimationFrame(() => window.dispatchEvent(new Event("awt-open-builder")));
      return;
    }
    sessionStorage.setItem("awt-open-builder", "1");
    requestAnimationFrame(() => navigate("/app/custom-gpt-maker?builder=1"));
  };
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className={gptsOnly ? "grid gap-2" : "mb-4 grid gap-2"} onKeyDown={stop} onPointerDown={stop}>
      {gptsOnly ? (
        <Button variant="ghost" type="button" onClick={openBuilder}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-3 text-sm font-bold text-accent-foreground hover:bg-accent/20">
          <Wand2 className="h-4 w-4" />CUSTOM GPT BUILDER
        </Button>
      ) : null}
      {gptsOnly && !fullPage && (
        <Button variant="outline" type="button" onClick={() => go("/gpts")} className="min-h-9 w-full text-xs font-semibold text-primary">Open full bot directory page</Button>
      )}
      {!gptsOnly && (<>
      <Button variant="ghost" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-primary/60 bg-primary/10 px-3 text-left text-sm font-bold text-primary hover:bg-primary/20">
        <span className="flex items-center gap-2"><Bot className="h-4 w-4" />AWT Custom Creative Bot Suite{bots ? <span className="text-[10px] font-normal opacity-70">{bots.length}</span> : null}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      <Button variant="ghost" type="button" onClick={openBuilder}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-3 text-sm font-bold text-accent-foreground hover:bg-accent/20">
        <Wand2 className="h-4 w-4" />CUSTOM GPT MAKER
      </Button>
      </>)}
      {open && (
        <div className="rounded-lg border border-primary/30 bg-background/95 p-2">
          <label className="flex items-center gap-2 rounded-md border border-primary/30 px-2">
            <Search className="h-4 w-4 text-primary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a bot or describe your task…" aria-label="Find a bot in the AWT bot suite"
              className="h-9 w-full bg-transparent text-sm text-foreground outline-none" />
          </label>
          <div className={fullPage ? "mt-2" : "mt-2 max-h-80 overflow-y-auto overscroll-contain"}>
            {error && <div role="status" className="grid gap-2 p-2">
              <p className="text-xs text-destructive">{error}</p>
              <Button variant="outline" type="button" onClick={() => { setError(""); setRetry((value) => value + 1); }} className="justify-self-start gap-2 text-xs">
                <RotateCw className="h-3.5 w-3.5" />Retry bot directory
              </Button>
            </div>}
            {!bots && !error && <p className="p-2 text-xs text-muted-foreground">Loading bots…</p>}
            {best.length > 0 && <div className="mb-2 rounded-md border border-accent/40 bg-accent/10 p-1.5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">Best match for your task</p>
              {best.map((b) => <Button variant="ghost" key={b.slug} type="button" onClick={() => go(`/app/${b.slug}`)} className="h-auto min-h-9 w-full justify-start px-1 py-1 text-left text-sm font-semibold text-foreground">{b.display_name}</Button>)}
            </div>}
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
      {!gptsOnly && <CommunityAppsMenuSection onNavigate={onNavigate} />}
    </div>
  );
}
