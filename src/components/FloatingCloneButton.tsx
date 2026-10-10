import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Copy } from "lucide-react";
import { createTimePortalEffect } from "@/utils/timeEffects";

const CLONE_URL =
  "https://lovable.dev/projects/c6134e40-21cf-4136-aebd-49c9868dd2ad?utm_source=lovable-badge";

const FloatingCloneButton = () => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.id = "floating-clone-button-root";
    document.body.appendChild(node);
    setMountNode(node);

    return () => {
      // Defer removal so React can unmount the portal's children BEFORE the
      // host node disappears. Removing synchronously here causes:
      //   "Failed to execute 'removeChild' on 'Node': The node to be removed
      //    is not a child of this node."
      // because React's commit phase then tries to detach children from a
      // parent that no longer exists in the DOM.
      setTimeout(() => {
        try { node.remove(); } catch { /* already gone */ }
      }, 0);
    };
  }, []);

  const content = useMemo(
    () => (
      <div
        className="awt-floating-overlay"
        style={{
          position: 'fixed',
          // Top-right: opposite the logo so nothing overlaps; sits well below the
          // hamburger / header strip on mobile so the two never visually crowd.
          right: '12px',
          // Sit roughly one extra inch below the hamburger menu strip on mobile,
          // so the clone circle never visually crowds the dropdown trigger.
          top: '328px',
          zIndex: 2147483646, // Just below pinned player, but above everything else
          pointerEvents: 'auto',
          isolation: 'isolate',
          contain: 'layout style paint',
        }}
      >
        <a
          href={CLONE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createTimePortalEffect(CLONE_URL, "Clone AI Web Tools");
          }}
          className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white 
            w-14 h-14 md:w-20 md:h-20 
            rounded-full shadow-lg flex flex-col items-center justify-center relative"
          style={{
            boxShadow: "0 4px 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(168, 85, 247, 0.3)",
            display: 'flex',
          }}
          title="Clone This AI Tools Website"
        >
          {/* Lightweight border glow */}
          <div 
            className="absolute inset-0 rounded-full border-2 md:border-4 border-cyan-400/70"
            style={{
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(6, 182, 212, 0.2)'
            }}
          />

          <div className="relative flex flex-col items-center justify-center text-center">
            <Copy className="w-4 h-4 md:w-5 md:h-5 mb-0.5" />
            <div className="text-[7px] md:text-[9px] font-bold leading-tight tracking-wide">
              <div>CLONE</div>
              <div>THIS SITE</div>
              <div className="text-yellow-300" style={{ textShadow: '0 0 8px #FFD700' }}>FREE</div>
            </div>
          </div>
        </a>
      </div>
    ),
    []
  );

  if (!mountNode) return null;
  return createPortal(content, mountNode);
};

export default FloatingCloneButton;
