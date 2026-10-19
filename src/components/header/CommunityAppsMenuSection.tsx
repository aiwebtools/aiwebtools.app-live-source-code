import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Loader2, PlusCircle, Trees, Users } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { OFF_GRID_PROJECT } from "@/data/offGridProject";
import { createTimePortalEffect } from "@/utils/timeEffects";

type CommunityApp = { id: string; title: string; url: string; description: string };

const schema = z.object({
  title: z.string().trim().min(2, "Title needs at least 2 characters").max(80, "Title must be under 80 characters"),
  url: z.string().trim().url("Paste the full link, starting with https://").max(500).refine((u) => /^https?:\/\//i.test(u), "Link must start with https://"),
  description: z.string().trim().min(10, "Description needs at least 10 characters").max(500, "Description must be under 500 characters"),
});

const withVia = (url: string) => {
  try { const u = new URL(url); if (!u.searchParams.has("via")) u.searchParams.set("via", "aiwebtools"); return u.toString(); } catch { return url; }
};

export default function CommunityAppsMenuSection({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState<CommunityApp[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () => {
    supabase.from("community_apps").select("id,title,url,description").eq("status", "approved").order("created_at", { ascending: true }).limit(200)
      .then(({ data }) => setApps((data as CommunityApp[]) || []));
  };
  useEffect(() => { if (open && !apps) load(); }, [open, apps]);

  const launch = (url: string) => { onNavigate?.(); createTimePortalEffect(url); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { setNotice({ ok: false, text: parsed.error.issues[0].message }); return; }
    setBusy(true); setNotice({ ok: true, text: "Our AI is opening your app to check it matches. This takes about 10–20 seconds…" });
    const { data, error } = await supabase.functions.invoke("submit-community-app", { body: parsed.data });
    setBusy(false);
    const msg = (data as { message?: string; status?: string } | null);
    if (error && !msg?.message) { setNotice({ ok: false, text: "Submission failed. Please try again in a minute." }); return; }
    const ok = msg?.status === "approved";
    setNotice({ ok, text: msg?.message || "Done." });
    if (ok) { setForm({ title: "", url: "", description: "" }); setApps(null); load(); }
  };

  const field = "w-full rounded-md border border-primary/40 bg-background px-2 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="grid gap-2">
      <Button variant="ghost" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-primary/60 bg-primary/10 px-3 text-left text-sm font-bold text-primary hover:bg-primary/20">
        <span className="flex items-center gap-2"><Users className="h-4 w-4" />Community Apps To Help Society</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <div className="grid gap-2 rounded-lg border border-primary/30 bg-background/95 p-2">
          <Button asChild variant="outline" className="min-h-11 w-full justify-start gap-2 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20">
            <a href={OFF_GRID_PROJECT.url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); launch(OFF_GRID_PROJECT.url); }}>
              <Trees className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 whitespace-normal text-left">{OFF_GRID_PROJECT.label}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </Button>
          {!apps && <p className="px-1 text-xs text-muted-foreground">Loading community apps…</p>}
          {apps?.map((app) => (
            <Button key={app.id} asChild variant="outline" className="h-auto min-h-11 w-full justify-start gap-2 border-primary/40 py-2 text-foreground">
              <a href={withVia(app.url)} target="_blank" rel="noopener noreferrer" title={app.description} onClick={(e) => { e.preventDefault(); launch(withVia(app.url)); }}>
                <span className="min-w-0 text-left"><span className="block font-bold">{app.title}</span><span className="block text-xs font-normal text-muted-foreground line-clamp-2">{app.description}</span></span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </Button>
          ))}
          <Button type="button" variant="gold" onClick={() => { setShowForm((v) => !v); setNotice(null); }} className="min-h-11 w-full font-bold">
            <PlusCircle className="h-4 w-4" />Submit your community app
          </Button>
          {showForm && (
            <form onSubmit={submit} className="grid gap-2 rounded-md border border-primary/30 p-2" onKeyDown={(e) => e.stopPropagation()}>
              <label className="grid gap-1 text-xs font-bold text-primary">App title
                <input className={field} value={form.title} maxLength={80} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Tribestead" />
              </label>
              <label className="grid gap-1 text-xs font-bold text-primary">App link (URL)
                <input className={field} type="url" inputMode="url" value={form.url} maxLength={500} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://your-app.lovable.app" />
              </label>
              <label className="grid gap-1 text-xs font-bold text-primary">Short description
                <textarea className={`${field} min-h-20`} value={form.description} maxLength={500} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does your app do and who does it help?" />
              </label>
              <p className="text-[11px] text-muted-foreground">Use the exact name shown on your app. Our AI opens the link and adds it automatically if the title and description match and it's safe.</p>
              <Button type="submit" disabled={busy} className="min-h-11 w-full font-bold">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Checking your app…</> : "Submit for instant AI review"}
              </Button>
            </form>
          )}
          {notice && <p role="status" className={`rounded-md px-2 py-1 text-xs ${notice.ok ? "text-primary" : "text-destructive"}`}>{notice.text}</p>}
        </div>
      )}
    </div>
  );
}
