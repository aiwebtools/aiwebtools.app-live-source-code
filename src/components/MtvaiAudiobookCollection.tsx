import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { audiobookEdition, findMtvaiAudiobooks, MTVAI_AUDIOBOOKS, nextMtvaiAudiobookPart } from "@/data/mtvaiAudiobooks";
import { startYouTubeWithSound, youtubePlaybackUrl } from "@/utils/videoPlayback";
import { createVideoCompletionGate } from "@/utils/mtvaiPlayback";

export default function MtvaiAudiobookCollection() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof MTVAI_AUDIOBOOKS)[number] | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const results = useMemo(() => findMtvaiAudiobooks(query), [query]);
  useEffect(() => {
    if (!selected) return;
    const completion = createVideoCompletionGate();
    const receive = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com" || event.source !== frameRef.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const state = data?.event === "onStateChange" ? data.info : data?.info?.playerState;
        if (typeof state !== "number" || !completion.observe(state)) return;
        const next = nextMtvaiAudiobookPart(selected.id);
        if (next) setSelected(next);
      } catch { /* Ignore unrelated/malformed player messages. */ }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [selected]);
  const startBook = (frame: HTMLIFrameElement) => {
    frame.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: selected?.id, channel: "widget" }), "https://www.youtube.com");
    frame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "https://www.youtube.com");
    startYouTubeWithSound(frame);
  };
  return <div className="flex min-h-0 flex-1 flex-col gap-3">
    {selected && <div className="shrink-0 border-b border-border pb-3">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
        <iframe ref={frameRef} key={selected.id} src={youtubePlaybackUrl(`https://www.youtube.com/embed/${selected.id}?controls=1&rel=0&loop=0`)} onLoad={event => startBook(event.currentTarget)} title={selected.title} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-foreground">{selected.title}</p>
    </div>}
    <div className="relative shrink-0">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input aria-label="Search audiobooks" placeholder="Search audiobooks…" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
    </div>
    <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain" data-audiobook-list>
      <p className="mb-2 text-xs text-muted-foreground">{results.length} recordings</p>
      <div className="space-y-2">
        {results.map(book => <Button key={book.id} variant="ghost" aria-label={`Play ${book.title}`} aria-pressed={selected?.id === book.id} onClick={() => setSelected(book)} className="btn-flat h-auto min-h-16 w-full justify-start border border-border bg-background px-3 py-3 text-left text-foreground hover:bg-accent hover:text-accent-foreground">
          {selected?.id === book.id ? <Headphones className="text-primary" /> : <Play className="text-primary" />}
          <span className="min-w-0 flex-1"><span className="block break-words text-sm leading-snug">{book.title}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{audiobookEdition(book.title)}</span></span>
        </Button>)}
        {results.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No audiobooks found.</p>}
      </div>
    </div>
  </div>;
}