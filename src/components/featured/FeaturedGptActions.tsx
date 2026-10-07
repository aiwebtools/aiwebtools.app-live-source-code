import { lazy, Suspense, useEffect, useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import OpInstructionsButton from "@/components/tool-detail/OpInstructionsButton";
import { getOpInstructionDoc } from "@/data/opInstructionDocs";
import { downloadAllOperationalInstructions } from "@/utils/downloads";
import { generateToolSlug } from "@/utils/urlGenerator";
import { Tool } from "@/types/tools";

const InSiteGptRunner = lazy(() => import("@/components/tool-detail/InSiteGptRunner"));

interface AppRow { slug: string; tool_title: string; display_name: string }

// One shared fetch of every hosted bot so cards can match themselves cheaply.
let appsPromise: Promise<AppRow[]> | null = null;
const loadApps = () => {
  if (!appsPromise) {
    appsPromise = Promise.resolve(
      supabase.from("gpt_apps").select("slug, tool_title, display_name").eq("is_active", true),
    ).then(({ data }) => (data as AppRow[]) ?? []).catch(() => []);
  }
  return appsPromise;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// Looser key: drops filler words so "Fact Checker GPT" ~ "Fact Checker".
const loose = (s: string) =>
  s.toLowerCase().replace(/\b(gpt|ai|the|suite|assistant|tool|by aiwebtools)\b/g, "").replace(/[^a-z0-9]/g, "");

export const findApp = (apps: AppRow[], titles: string[]) => {
  for (const t of titles) {
    const n = norm(t);
    const slug = generateToolSlug(t);
    const hit = apps.find((a) => norm(a.tool_title) === n || norm(a.display_name) === n || a.slug === slug);
    if (hit) return hit;
  }
  for (const t of titles) {
    const l = loose(t);
    if (l.length < 4) continue;
    const hit = apps.find((a) => loose(a.tool_title) === l || loose(a.display_name) === l);
    if (hit) return hit;
  }
  return null;
};

const btn =
  "op-gold-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide";

/**
 * Card actions for a featured Custom GPT: "Try It Here" pop-up chat running on
 * its operational instructions, plus a download of those instructions. Always
 * renders; without a hosted bot it opens the tool page at its chat and offers
 * the full instruction library.
 */
const FeaturedGptActions = ({ titles, tool }: { titles: string[]; tool: Tool }) => {
  const [app, setApp] = useState<AppRow | null>(null);
  const [open, setOpen] = useState(false);
  const pageSlug = generateToolSlug(titles[0]);

  useEffect(() => {
    let alive = true;
    loadApps().then((apps) => alive && setApp(findApp(apps, titles)));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles.join("|")]);

  const hasDoc = !!(app && getOpInstructionDoc(app.slug));
  const name = app?.display_name ?? titles[titles.length - 1];

  return (
    <div className="mb-2 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => (app ? setOpen(true) : window.open(`/${pageSlug}#try-bot`, "_blank"))}
        className={btn}
        title={`Try ${name} right here, running on its operational instructions`}
      >
        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Try It Here
      </button>
      {hasDoc ? (
        <OpInstructionsButton
          slug={app!.slug}
          name={name}
          singleOnly
          label="Instructions"
          className="flex-1 justify-center px-3 py-1.5 text-[10px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => downloadAllOperationalInstructions()}
          className={btn}
          title="Download the AIWebTools operational instructions library"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Instructions
        </button>
      )}
      {app && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[92dvh] w-[96vw] max-w-3xl overflow-y-auto p-2 sm:p-4">
            <DialogTitle className="sr-only">{app.display_name}</DialogTitle>
            <DialogDescription className="sr-only">
              Chat with {app.display_name}, following its AIWebTools operational instructions.
            </DialogDescription>
            {open && (
              <Suspense fallback={<p className="p-8 text-center text-sm text-muted-foreground">Opening {app.display_name}…</p>}>
                <InSiteGptRunner tool={{ ...tool, title: app.tool_title }} />
              </Suspense>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeaturedGptActions;
