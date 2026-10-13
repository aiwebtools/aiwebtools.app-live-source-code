import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import { playTimeWarpVoice } from "@/utils/effects/timeWarpVoice";

/**
 * TEMPORARY ACCESS-CODE GATE
 * Set ACCESS_GATE_ENABLED to false to turn the gate off completely.
 * Search-engine crawlers are let through so SEO is never affected.
 */
export const ACCESS_GATE_ENABLED = true;
const ACCESS_CODE = "1111";
export const acceptsAccessCode = (code: string) => code.trim() === ACCESS_CODE;

const CRAWLER_PATTERN =
  /bot|crawl|spider|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|embedly|whatsapp|telegrambot|lighthouse/i;

const isCrawler = () =>
  typeof navigator !== "undefined" && CRAWLER_PATTERN.test(navigator.userAgent || "");

const AccessCodeGate = ({ children }: { children: ReactNode }) => {
  const bypass = !ACCESS_GATE_ENABLED || isCrawler();
  const [unlocked, setUnlocked] = useState<boolean>(bypass);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [granted, setGranted] = useState(false);
  const opening = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const grantAccess = () => {
    if (opening.current) return;
    opening.current = true;
    setGranted(true);
    setError(false);
    playTimeWarpVoice();
    timer.current = setTimeout(() => setUnlocked(true), 900);
  };

  // Close the Matrix loading screen so the code prompt is visible.
  useEffect(() => {
    if (unlocked) return;
    try {
      (window as any).__aiwtRouteReady = true;
      window.dispatchEvent(new Event("aiwt:route-ready"));
    } catch {
      /* noop */
    }
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (acceptsAccessCode(code)) {
      grantAccess();
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <main className="fixed inset-0 z-[99999] isolate flex items-center justify-center overflow-y-auto bg-background px-4 py-6 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden font-mono text-sm text-primary/20">
        {Array.from({ length: 18 }, (_, column) => <span key={column} className="whitespace-pre leading-8">{Array.from({ length: 40 }, (_, row) => "01ｱｲｳｴｵ<>"[(row + column * 3) % 9]).join("\n")}</span>)}
      </div>
      <MatrixRainBackdrop intensity={0.9} />
      <form
        onSubmit={submit}
        className="relative z-10 my-auto w-full max-w-sm space-y-5 rounded-3xl border border-primary/40 bg-card/90 p-6 text-center shadow-2xl backdrop-blur sm:p-8"
        aria-labelledby="access-title"
      >
        <h1 id="access-title" className="font-mono text-2xl font-bold text-primary">
          AIWebTools.ai
        </h1>
        <p className="text-sm text-muted-foreground">Enter the access code to continue.</p>
        <p className="text-sm text-primary">Hint: Angel Numbers</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={code}
          disabled={granted}
          onChange={(e) => {
            const value = e.target.value;
            setCode(value);
            setError(false);
            if (acceptsAccessCode(value)) grantAccess();
          }}
          aria-label="Access code"
          aria-invalid={error}
          style={{ borderRadius: "9999px" }}
          placeholder="••••"
          className="w-full rounded-full border border-primary/40 bg-background px-5 py-3 text-center text-xl tracking-[0.5em] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        {granted && <p role="status" className="flex items-center justify-center gap-2 text-primary"><CheckCircle2 className="h-6 w-6" />Access granted</p>}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            That code isn't right. Please try again.
          </p>
        )}
        <Button
          variant="outline"
          type="submit"
          disabled={granted}
          className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {granted ? "WebTools initializing…" : "Enter"}
        </Button>
      </form>
    </main>
  );
};

export default AccessCodeGate;
