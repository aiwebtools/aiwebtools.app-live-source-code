import { useState } from "react";
import { ChevronDown, Cpu, Download, Usb } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { createTimePortalEffect } from "@/utils/timeEffects";

const LM_STUDIO_LOCAL_URL = "https://lmstudio.ai/download/latest/win32/x64";
const LM_STUDIO_BIONIC_URL = "https://lmstudio.ai/download/bionic/latest/win32/x64";

/**
 * PortableMind offline AI USB devices — TikTok Shop affiliate links
 * (shared from the AIWebTools TikTok shop; these links earn us commission,
 * so they are used exactly as provided with their _t affiliate tokens).
 */
const PORTABLE_MIND_DEVICES = [
  {
    name: "PortableMind PRO Navigator",
    detail: "Offline AI + nationwide GPS on one USB",
    url: "https://shop.tiktok.com/us/pdp/1732431433077985518?_t=ZT-9AiohtuEZAc",
  },
  {
    name: "PortableMind MAX-SPEED v1.8.0",
    detail: "400 MB/s high-performance offline AI USB",
    url: "https://shop.tiktok.com/us/pdp/1729479607213724910?_t=ZT-9AiogwqWyhq",
  },
  {
    name: "PortableMind Offline AI Workspace USB 64GB",
    detail: "Offline AI chat, voice & vision — no internet",
    url: "https://shop.tiktok.com/us/pdp/1732008718572359918?_t=ZT-9Aiog3KqN81",
  },
];

interface LocalModelsAccordionProps {
  /** Called after a link is opened (e.g. to close the mobile menu). */
  onNavigate?: () => void;
}

/**
 * Accordion offering LM Studio downloads (local + Bionic agent, Windows) and
 * PortableMind offline AI USB devices via our TikTok Shop affiliate links.
 * Shared by the header hamburger menu and the footer.
 */
const LocalModelsAccordion = ({ onNavigate }: LocalModelsAccordionProps) => {
  const [open, setOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);

  const openLink = (url: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Opens in an independent new window so visitors stay on our site.
    createTimePortalEffect(url);
    onNavigate?.();
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-md border border-emerald-500/60 bg-background px-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
        aria-expanded={open}
      >
        <Cpu className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>DOWNLOAD LOCAL MODELS TO RUN ON YOUR PC</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-2 rounded-md border border-emerald-500/30 bg-black/40 p-2">
        {/* LM Studio — fully local, no internet required */}
        <button
          type="button"
          onClick={openLink(LM_STUDIO_LOCAL_URL)}
          className="w-full rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-left transition-colors hover:bg-emerald-500/25"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-200">
            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            LM STUDIO — RUN MODELS LOCALLY (WINDOWS)
          </span>
          <span className="mt-0.5 block text-[10px] leading-snug text-emerald-300/80">
            Experiment with LLMs on your computer — chat interface &amp; programmable API. No internet required.
          </span>
        </button>

        {/* LM Studio Bionic — agent, requires internet */}
        <button
          type="button"
          onClick={openLink(LM_STUDIO_BIONIC_URL)}
          className="w-full rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-left transition-colors hover:bg-cyan-500/25"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-cyan-200">
            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            LM STUDIO BIONIC AGENT (WINDOWS)
          </span>
          <span className="mt-0.5 block text-[10px] leading-snug text-cyan-300/80">
            An agent made for open models — natively local, built for creativity, work &amp; code. Internet connection required.
          </span>
        </button>

        {/* PortableMind offline AI USB devices — affiliate links */}
        <Collapsible open={devicesOpen} onOpenChange={setDevicesOpen}>
          <CollapsibleTrigger
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDevicesOpen(!devicesOpen);
            }}
            className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-200 transition-colors hover:bg-amber-500/25"
            aria-expanded={devicesOpen}
          >
            <span className="flex items-center gap-2">
              <Usb className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              PORTABLE MIND — OFFLINE AI USB DEVICES
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${devicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 pl-2">
            <p className="text-[10px] leading-snug text-amber-300/70">
              AI that runs entirely offline from a USB drive — opens in a new window.
            </p>
            {PORTABLE_MIND_DEVICES.map((device) => (
              <button
                key={device.url}
                type="button"
                onClick={openLink(device.url)}
                className="w-full rounded-md border border-amber-500/30 bg-black/30 px-3 py-2 text-left transition-colors hover:bg-amber-500/20"
              >
                <span className="block text-xs font-bold text-amber-100">{device.name}</span>
                <span className="mt-0.5 block text-[10px] leading-snug text-amber-300/80">{device.detail}</span>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LocalModelsAccordion;
