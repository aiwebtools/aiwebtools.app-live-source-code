import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";

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
      setUnlocked(true);
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
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          aria-label="Access code"
          aria-invalid={error}
          style={{ borderRadius: "9999px" }}
          placeholder="••••"
          className="w-full rounded-full border border-primary/40 bg-background px-5 py-3 text-center text-xl tracking-[0.5em] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            That code isn't right. Please try again.
          </p>
        )}
        <Button
          variant="outline"
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Enter
        </Button>
      </form>
    </main>
  );
};

export default AccessCodeGate;
