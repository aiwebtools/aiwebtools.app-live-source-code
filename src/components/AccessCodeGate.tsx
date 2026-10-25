import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, Sparkles, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import pandoraPanel from "@/assets/pandora-gate-panel.jpg";
import "@/styles/angel-gate.css";

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
    if ("speechSynthesis" in window) {
      const announcement = new SpeechSynthesisUtterance("Web tools initializing");
      announcement.rate = 0.95;
      window.speechSynthesis.speak(announcement);
    }
    timer.current = setTimeout(() => setUnlocked(true), 2200);
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
    <main className="angel-gate fixed inset-0 z-[99999] isolate flex items-center justify-center overflow-y-auto px-5 py-8 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden font-mono text-sm text-primary/20">
        {Array.from({ length: 18 }, (_, column) => <span key={column} className="whitespace-pre leading-8">{Array.from({ length: 40 }, (_, row) => "01ｱｲｳｴｵ<>"[(row + column * 3) % 9]).join("\n")}</span>)}
      </div>
      <MatrixRainBackdrop intensity={0.9} />
      {granted && <div aria-hidden="true" className="gate-confetti">{Array.from({ length: 48 }, (_, index) => <i key={index} style={{ "--x": `${Math.sin(index * 2.4) * (170 + index * 9)}px`, "--y": `${Math.cos(index * 2.4) * 350 + 240}px`, "--spin": `${index * 47}deg` } as React.CSSProperties} />)}</div>}
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
        <div className={`pandora-box ${granted ? "is-opening" : ""}`}>
          <div className="pandora-lid" aria-hidden="true"><img src={pandoraPanel} alt="" width={1536} height={864} /></div>
          <div className="pandora-body space-y-5">
        <LockKeyhole aria-hidden="true" className="mx-auto h-7 w-7 text-primary" />
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
        {granted && <p role="status" className="flex items-center justify-center gap-2 font-mono text-sm text-primary"><Sparkles className="h-5 w-5" />web tools initializing</p>}
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
          <KeyRound aria-hidden="true" />{granted ? "Opening…" : "Unlock the box"}
        </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default AccessCodeGate;
