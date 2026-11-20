import { Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { MTVAI_YOUTUBE_URL } from "@/data/featuredLinks";

/** Visible link to the official MTVai YouTube channel (Shorts tab). */
export default function MtvaiYouTubeLink({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a
      href={MTVAI_YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch MTVai on YouTube (@AIWEBTOOLS-MTVai)"
      title="MTVai on YouTube"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-destructive/60 bg-background/80 font-mono font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-destructive/20",
        compact ? "px-2 py-1 text-[10px]" : "px-3 py-2 text-xs",
        className,
      )}
    >
      <Youtube className={compact ? "h-3.5 w-3.5 text-destructive" : "h-4 w-4 text-destructive"} aria-hidden="true" />
      <span>{compact ? "YouTube" : "MTVai on YouTube"}</span>
    </a>
  );
}
