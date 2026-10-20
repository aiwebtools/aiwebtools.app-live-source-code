import { lazy, Suspense, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BotSuiteMenuSection = lazy(() => import("./BotSuiteMenuSection"));

/** Little robot waving hello. */
export const WavingRobotIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10 2v2" />
    <rect x="5" y="4" width="10" height="7" rx="2" />
    <circle cx="8.5" cy="7.5" r="0.8" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="0.8" fill="currentColor" />
    <rect x="6" y="12" width="8" height="7" rx="1.5" />
    <path d="M6 14l-3 2" />
    <path d="M14 14l3-3 2-4" />
    <path d="M20.5 5.5l1-1M21 8h1.5" />
    <path d="M8 19v3M12 19v3" />
  </svg>
);

/** Header shortcut: CUSTOM GPT BUILDER + accordion of every in-site bot category. */
export default function HeaderGptsButton() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="GPTs — open our in-site custom bots and the Custom GPT Builder"
          title="GPTs — In-site custom bots"
          className="inline-flex flex-col items-center justify-center gap-0.5 text-green-300 hover:text-white transition-colors"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-green-500/50 hover:bg-green-500/20 hover:border-green-400 transition-all duration-300">
            <WavingRobotIcon />
          </span>
          <span className="text-[9px] font-bold leading-none tracking-wide">GPTs</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8}
        className="z-[200] w-[min(92vw,22rem)] max-h-[75vh] overflow-y-auto border-primary/50 bg-background p-3">
        <Suspense fallback={<p className="p-2 text-xs text-muted-foreground">Loading bots…</p>}>
          <BotSuiteMenuSection gptsOnly onNavigate={() => setOpen(false)} />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
}
