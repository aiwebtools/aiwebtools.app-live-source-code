import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, LockKeyhole, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import pandoraPanel from "@/assets/pandora-gate-panel.jpg";
import "@/styles/angel-gate.css";

function OpeningUnavailable({ onFinish }: { onFinish: () => void }) {
  useEffect(onFinish, [onFinish]);
  return null;
}
const GateOpeningVideo = lazy(() => import("./GateOpeningVideo").catch(() => ({ default: OpeningUnavailable })));

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
  const finishOpening = useCallback(() => setUnlocked(true), []);

  const grantAccess = () => {
    if (opening.current) return;
    opening.current = true;
    setGranted(true);
    setError(false);
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

  if (unlocked || granted) return <>
    <div {...(unlocked ? {} : { inert: "" })} aria-hidden={unlocked ? undefined : true}>{children}</div>
    {!unlocked && <Suspense fallback={<div role="dialog" aria-modal="true" aria-label="MTVAI opening" className="fixed inset-0 z-[2147483647] flex items-start justify-end bg-background p-4"><Button variant="outline" size="icon" onClick={finishOpening} aria-label="Skip opening video"><X className="h-5 w-5" /></Button></div>}>
      <GateOpeningVideo onFinish={finishOpening} />
    </Suspense>}
  </>;

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
    <main className="angel-gate fixed inset-0 z-[99999] isolate flex items-center justify-center overflow-y-auto px-5 py-8 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden font-mono text-sm text-primary/20">
        {Array.from({ length: 18 }, (_, column) => <span key={column} className="whitespace-pre leading-8">{Array.from({ length: 40 }, (_, row) => "01ｱｲｳｴｵ<>"[(row + column * 3) % 9]).join("\n")}</span>)}
      </div>
      <MatrixRainBackdrop intensity={0.9} />
      <form
        onSubmit={submit}
        className="relative z-10 my-auto w-full max-w-md text-center"
        aria-labelledby="access-title"
      >
        <p className="mb-3 font-mono text-sm text-primary">AIWEBTOOLS.AI</p>
        <h1 id="access-title" className="font-mono text-3xl font-bold text-foreground">
          Angel Number Gate
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Pandora’s box awaits your key.</p>
        <div className="pandora-box" aria-hidden="true">
          <div className="pandora-glow" />
          <div className="pandora-lid"><img src={pandoraPanel} alt="" width={1536} height={864} /></div>
          <div className="pandora-body"><img src={pandoraPanel} alt="" width={1536} height={864} /><div className="pandora-lock"><LockKeyhole className="h-7 w-7" /></div></div>
          <div className="pandora-feet" />
        </div>
        <div className="gate-controls space-y-4">
        <p className="font-mono text-sm text-primary">Hint: Angel Numbers · 11:11</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
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
          placeholder="••••"
          className="gate-input w-full rounded-md border border-primary/40 bg-background px-5 py-3 text-center text-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            Try the angel number 1111.
          </p>
        )}
        <Button
          variant="outline"
          type="submit"
          disabled={granted}
          className="gate-open-button w-full rounded-md px-5 py-3 font-semibold transition hover:opacity-90"
        >
          <KeyRound aria-hidden="true" />Unlock the box
        </Button>
        </div>
      </form>
    </main>
  );
};

export default AccessCodeGate;
