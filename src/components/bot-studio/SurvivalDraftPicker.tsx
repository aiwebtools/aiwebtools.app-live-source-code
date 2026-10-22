import { useMemo, useState } from "react";
import { Download, FilePenLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { survivalDrafts } from "@/utils/survivalDrafts";
import { triggerPublicDownload } from "@/utils/downloads";

// Draft artwork (25 images) is fetched only when the list is expanded, so
// opening the builder stays instant.
export default function SurvivalDraftPicker({ onChoose }: { onChoose: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<Record<string, string> | null>(null);
  const matches = useMemo(() => survivalDrafts.filter((bot) => `${bot.name} ${bot.tagline} ${bot.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim())), [query]);
  const loadImages = () => {
    if (!images) void import("@/utils/survivalDraftImages").then((m) => setImages(m.survivalDraftImages)).catch(() => undefined);
  };
  return <details className="mt-3 border-t border-border pt-3" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) loadImages(); }}>
    <summary className="studio-label cursor-pointer py-2"><FilePenLine className="h-4 w-4 shrink-0" /><span>Survival drafts · 25</span></summary>
    <p className="my-2 text-xs text-muted-foreground">Published in the Community GPT library · edit a draft to make your own version</p>
    <div className="relative mb-2"><Search className="absolute left-2 top-3 h-3.5 w-3.5 text-muted-foreground" /><Input aria-label="Search survival drafts" placeholder="Find a survival draft…" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 pl-7 text-xs" /></div>
    <div className="max-h-64 overflow-y-auto overscroll-contain">
      {matches.map((bot) => <div key={bot.slug} className="flex min-w-0 items-center gap-1">
        <Button variant="ghost" className="studio-row min-w-0 flex-1" aria-label={`Edit draft ${bot.name}`} onClick={() => onChoose(bot.slug)}>
          {images?.[bot.slug] && <img src={images[bot.slug]} alt={`${bot.name} — AIWEBTOOLS.AI preparedness artwork`} loading="lazy" width={1536} height={864} className="h-8 w-8 shrink-0 rounded object-cover" />}<span className="studio-tool-name">{bot.name}</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-8 shrink-0" aria-label={`Download draft instructions for ${bot.name}`} title="Draft instructions PDF" onClick={() => triggerPublicDownload(bot.pdf, `${bot.image}-operational-instructions.pdf`)}><Download className="h-3.5 w-3.5" /></Button>
      </div>)}
      {!matches.length && <p className="py-3 text-xs text-muted-foreground">No matching drafts.</p>}
    </div>
  </details>;
}
