import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tools";
import { playTimeWarpVoice } from "@/utils/effects/timeWarpVoice";

interface InSiteGptButtonProps {
  tool: Tool;
}

/**
 * Shows "Try the in-site version" when this directory tool has a hosted
 * counterpart in gpt_apps. Silent when there is no match.
 */
const InSiteGptButton = ({ tool }: InSiteGptButtonProps) => {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!tool?.title) return;

    supabase
      .from("gpt_apps")
      .select("slug")
      .eq("tool_title", tool.title)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setSlug(data?.slug ?? null);
      });

    return () => {
      alive = false;
    };
  }, [tool?.title]);

  if (!slug) return null;

  return (
    <Link
      to={`/app/${slug}`}
      onClick={() => playTimeWarpVoice()}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20"
    >
      <Sparkles className="h-4 w-4 transition group-hover:scale-110" aria-hidden="true" />
      Try the in-site version of this tool — free
    </Link>
  );
};

export default InSiteGptButton;
