import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { MUSE_CODE, copyMuseCode } from "@/components/muse/museOffer";

/** Big tap-to-copy Muse code; the code text stays selectable when clipboard access is blocked. */
const MuseCodeCopy = ({ className = "" }: { className?: string }) => {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    const ok = await copyMuseCode();
    if (ok) {
      setState("copied");
      window.setTimeout(() => setState("idle"), 2500);
    } else {
      setState("manual");
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy Muse code ${MUSE_CODE}`}
        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary bg-primary/10 px-4 py-3 text-primary transition-colors hover:bg-primary/20 touch-manipulation"
      >
        <input
          ref={inputRef}
          readOnly
          value={MUSE_CODE}
          aria-label="Muse referral code"
          onFocus={(e) => e.currentTarget.select()}
          className="w-[7.5ch] min-w-0 bg-transparent font-mono text-2xl font-bold tracking-widest text-primary outline-none sm:text-3xl"
        />
        <span className="flex items-center gap-1 text-xs font-semibold">
          {state === "copied" ? <><Check className="h-4 w-4" />Copied!</> : <><Copy className="h-4 w-4" />Tap to copy</>}
        </span>
      </button>
      {state === "manual" && (
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          Your code is selected — press and hold to copy: <b className="font-mono text-foreground">{MUSE_CODE}</b>
        </p>
      )}
    </div>
  );
};

export default MuseCodeCopy;
