import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getOpInstructionDoc } from "@/data/opInstructionDocs";
import { downloadAllOperationalInstructions, resolvePublicAssetUrl } from "@/utils/downloads";

interface OpInstructionsButtonProps {
  slug?: string | null;
  name?: string | null;
  className?: string;
  compact?: boolean;
  /** Show only this bot's download (no all-library button), for compact cards. */
  singleOnly?: boolean;
  label?: string;
}

/**
 * Gold one-click download of the ORIGINAL operational instructions document,
 * exactly as authored by AIWebTools.ai. The file is served verbatim — never rewritten.
 * Uses a fetch -> blob -> object URL download so it works reliably on mobile
 * browsers that drop plain anchor `download` attributes; falls back to opening
 * the PDF in a new tab if the fetch fails.
 */
const OpInstructionsButton = ({ slug, name, className = "", compact = false, singleOnly = false, label: labelOverride }: OpInstructionsButtonProps) => {
  const [busy, setBusy] = useState(false);
  const doc = getOpInstructionDoc(slug);
  if (!doc) return null;

  const label = labelOverride ?? (compact
    ? "Download Instructions (PDF)"
    : "Download Operational Instructions for this Bot (PDF)");

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (busy) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(doc.href, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // The preview sandbox answers static files with a login page; never save
      // that as a "PDF" — fall through to the public copy instead.
      if (!(res.headers.get("content-type") || "").includes("pdf")) throw new Error("not a pdf");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.download;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      // Fallback: open the PDF directly so the visitor still gets the document.
      window.open(resolvePublicAssetUrl(doc.href), "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
    <a
      href={doc.href}
      download={doc.download}
      onClick={handleClick}
      className={`op-gold-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${busy ? "opacity-80 pointer-events-none" : ""} ${className}`}
      title={`Download the complete operational instructions for ${name || "this tool"} (original document, unedited)`}
      aria-label={`Download the full operational instructions for ${name || "this tool"}`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {busy ? "Preparing download…" : label}
    </a>
    {!singleOnly && (
    <button
      type="button"
      onClick={() => downloadAllOperationalInstructions()}
      className="op-gold-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide"
      title="Download all 3,200+ AIWebTools operational instructions (ZIP)"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {compact ? "All 3,200+ + Code" : "Download All 3,200+ Operational Instructions + Source Code"}
    </button>
    )}
    </span>
  );
};

export default OpInstructionsButton;
