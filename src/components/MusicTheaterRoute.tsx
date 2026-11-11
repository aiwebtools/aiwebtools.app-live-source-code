import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function TheaterStatus({ failed = false, retry }: { failed?: boolean; retry?: () => void }) {
  useEffect(() => {
    window.dispatchEvent(new Event("aiwt:route-ready"));
  }, []);
  return <main className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center gap-4 px-6 text-center" aria-label="MTVAI music theater">
    <h1 className="text-2xl font-bold text-primary">MTVAI.live</h1>
    <p className="text-muted-foreground">Presented by aiwebtools.app</p>
    <p role={failed ? "alert" : "status"}>{failed ? "The music theater could not load. Please try again." : "Loading the music theater and track list…"}</p>
    {failed && <Button variant="outline" onClick={retry}><RefreshCw />Retry music theater</Button>}
  </main>;
}

class TheaterBoundary extends Component<{ children: ReactNode; retry: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <TheaterStatus failed retry={this.props.retry} /> : this.props.children; }
}

export default function MusicTheaterRoute() {
  // Recreate lazy on explicit retry: rejected imports must not remain cached by React.
  const [attempt, setAttempt] = useState(() => ({
    Page: lazy(loadTheater), key: 0,
  }));
  const retry = () => setAttempt(previous => ({ Page: lazy(loadTheater), key: previous.key + 1 }));
  const Page = attempt.Page;
  return <TheaterBoundary key={attempt.key} retry={retry}>
    <Suspense fallback={<TheaterStatus />}><Page /></Suspense>
  </TheaterBoundary>;
}

async function loadTheater() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      import("@/pages/MusicStream"),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Music theater load timed out")), 12000); }),
    ]);
  } catch {
    // Handle download errors before React emits a global chunk-error event,
    // which would trigger the site's unrelated automatic reload recovery.
    // Browsers cache failed module fetches. An explicit same-URL retry starts
    // a fresh module graph without ever navigating to the directory.
    return { default: () => <TheaterStatus failed retry={() => window.location.reload()} /> };
  } finally { if (timer) clearTimeout(timer); }
}