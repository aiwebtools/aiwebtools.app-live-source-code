import { lazy, Suspense, useEffect, useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import OpInstructionsButton from "@/components/tool-detail/OpInstructionsButton";
import { getOpInstructionDoc, OP_INSTRUCTION_DOCS } from "@/data/opInstructionDocs";
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

// Null-safe: some bot rows have no display name, which used to crash matching
// and silently push every card to the bulk library instead of its own PDF.
const norm = (s?: string | null) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
// Looser key: drops filler words so "Fact Checker GPT" ~ "Fact Checker".
const loose = (s?: string | null) =>
  (s ?? "").toLowerCase().replace(/\b(gpt|ai|the|suite|assistant|tool|by aiwebtools)\b/g, "").replace(/[^a-z0-9]/g, "");

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

/**
 * Featured cards whose title differs from their instruction document's name.
 * Each value is a key of OP_INSTRUCTION_DOCS (Master's original document).
 */
const FEATURED_DOC_SLUGS: Record<string, string> = {
  "Algebraic Expression Creative Inventor GPT": "algebraic-expression-inventor-gpt",
  "Cannabis GPT": "cannabis-gpt-not-gpt4o1-compliant",
  "Clarity Omni GPT": "clarity-writer-gpt",
  "COLLECTIBLES APPRAISAL GPT": "antique-collectible-appraisal-gpt",
  "Customizable GPT Maker": "custom-gpt-maker",
  "Data Research Analysis Report GPT": "data-analysis-and-report-gpt",
  "GRAPHIC & COVER DESIGN GPT": "cover-design-graphic-design-gpt",
  "Illuminous World Data Explorer GPT": "illuminous-data-explorer-instrucutions",
  "Agronomus AI Farming Expert": "agronomus-the-ai-farmer",
  "MULTITASKER GPT": "multitasker-gpt4-turbo-newer-segmented-approach-to-handle-tasks",
  "Public Testimony Writer GPT": "testimony-writer-gpt",
  "Oraculum – The Revealer of Hidden Truths": "oraculum-u-the-illuminator-of-hidden-truths-safer",
  "Personalized DR. GPT (Doctor GPT)": "doctor-gpt-open-source",
  "Survivalist GPT": "survivalist-gpt-public-open-source-for-local-deployment-by-aiwebtools",
  "TALK TO THE GODS GPT": "talk-to-your-god-gpt",
  "Travel Advisor GPT": "travel-agent-gpt",
  "Plastoline GPT - Plastic to Fuel": "plastoline-gpt",
  "ENTER THE MATRIX GPT": "neo-matrix-gpt",
  "Legislator Link GPT": "legistlator-link-prompt-state-rep-finder-writer-and-insights",
  "Legislation Writer & Compiler GPT": "legislation-writer-gpt",
  "Mental Wellness GPT (CBT)": "mental-wellness-gpt",
  "Home-Schooling Assistant GPT": "home-school-gpt",
  "Coloring Book Generator GPT": "coloring-book-generator-with-compiler",
  "King Blueberry GPT": "blueberry-gpt",
  "Custom GPT Ideas & Brainstorming Assistant": "gpt-ideas-creator",
  "AD Maker GPT4o Image GPT": "ad-maker-gpt",
  "MiddleJourney Midjourney Prompting Assistant": "mid-journey-prompt-optimizer-open-source",
};

/** Instruction document for a card, resolved instantly (no network wait). */
export const resolveDocSlug = (titles: string[], appSlug?: string | null): string | null => {
  for (const t of titles) {
    const mapped = FEATURED_DOC_SLUGS[t];
    if (mapped && OP_INSTRUCTION_DOCS[mapped]) return mapped;
  }
  if (appSlug && OP_INSTRUCTION_DOCS[appSlug]) return appSlug;
  for (const t of titles) {
    const slug = generateToolSlug(t);
    if (OP_INSTRUCTION_DOCS[slug]) return slug;
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
    loadApps().then((apps) => {
      if (!alive) return;
      const docSlug = resolveDocSlug(titles);
      setApp(findApp(apps, titles) ?? (docSlug ? apps.find((a) => a.slug === docSlug) ?? null : null));
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles.join("|")]);

  const docSlug = resolveDocSlug(titles, app?.slug);
  const hasDoc = !!getOpInstructionDoc(docSlug);
  const name = app?.display_name || titles[titles.length - 1];

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
          slug={docSlug}
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
          title="This bot's single document isn't published yet — open the full AIWebTools instruction library"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Library
        </button>
      )}
      {app && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[92dvh] w-[96vw] max-w-3xl overflow-y-auto p-2 sm:p-4">
            <DialogTitle className="sr-only">{name}</DialogTitle>
            <DialogDescription className="sr-only">
              Chat with {name}, following its AIWebTools operational instructions.
            </DialogDescription>
            {open && (
              <Suspense fallback={<p className="p-8 text-center text-sm text-muted-foreground">Opening {name}…</p>}>
                <InSiteGptRunner tool={{ ...tool, title: app.tool_title || tool.title }} appSlug={app.slug} showLoading />
              </Suspense>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeaturedGptActions;
