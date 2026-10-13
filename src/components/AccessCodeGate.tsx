import { useEffect, useState, type FormEvent, type ReactNode } from "react";

/**
 * TEMPORARY ACCESS-CODE GATE
 * Set ACCESS_GATE_ENABLED to false to turn the gate off completely.
 * Search-engine crawlers are let through so SEO is never affected.
 */
export const ACCESS_GATE_ENABLED = false;
const ACCESS_CODE = "1111";
const STORAGE_KEY = "awt-access-code-ok";

const CRAWLER_PATTERN =
  /bot|crawl|spider|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|embedly|whatsapp|telegrambot|lighthouse/i;

const isCrawler = () =>
  typeof navigator !== "undefined" && CRAWLER_PATTERN.test(navigator.userAgent || "");

const alreadyUnlocked = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const AccessCodeGate = ({ children }: { children: ReactNode }) => {
  const bypass = !ACCESS_GATE_ENABLED || isCrawler();
  const [unlocked, setUnlocked] = useState<boolean>(() => bypass || alreadyUnlocked());
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
    if (code.trim() === ACCESS_CODE) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
      setUnlocked(true);
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <main className="fixed inset-0 z-[99999] flex items-center justify-center bg-background px-6 text-foreground">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-3xl border border-primary/40 bg-card/80 p-8 text-center shadow-2xl backdrop-blur"
        aria-labelledby="access-title"
      >
        <h1 id="access-title" className="font-mono text-2xl font-bold text-primary">
          AIWebTools.ai
        </h1>
        <p className="text-sm text-muted-foreground">Enter the access code to continue.</p>
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
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Enter
        </button>
      </form>
    </main>
  );
};

export default AccessCodeGate;
