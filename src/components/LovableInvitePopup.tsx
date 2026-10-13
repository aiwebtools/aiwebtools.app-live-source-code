import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { createTimePortalEffect } from "@/utils/timeEffects";
import lovableBanner from "@/assets/lovable-invite-banner.jpg";
import { schedulePromotion, PROMOTION_INTERVAL_MS } from "@/utils/promotionalPopups";

const INVITE_URL = "https://lovable.dev/invite/P0KP4RR";
const STORAGE_KEY = "lovableInviteShownCount";

/**
 * Shows a friendly popup after 30 minutes, sharing the promotional cooldown,
 * asking visitors to sign up via the
 * Lovable invite link. Each successful signup credits AI Web Tools, helping
 * fund continued platform improvements.
 */
const LovableInvitePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dismissPromotion = useRef<() => void>(() => {});
  const closePopup = () => { dismissPromotion.current(); setIsOpen(false); };

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth < 768;
    if (isMobile) return;

    const shown = parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
    // Only show once per session, never overlapping another promotion.
    if (shown >= 1) return;

    const promotion = schedulePromotion(() => {
      setIsOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 2 * PROMOTION_INTERVAL_MS);
    dismissPromotion.current = promotion.dismiss;

    return promotion.cancel;
  }, []);

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    closePopup();
    createTimePortalEffect(INVITE_URL, "Lovable Invite — Support AI Web Tools");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closePopup(); }}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] bg-[#0a0613] border border-pink-500/40 z-[9999] shadow-2xl shadow-purple-600/30 p-0 overflow-hidden">
        <div className="relative">
          <img
            src={lovableBanner}
            alt="Lovable — Build Apps with AI"
            width={1024}
            height={576}
            loading="lazy"
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0613]" />
        </div>

        <div className="px-6 pb-6 pt-2 -mt-4 relative">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              Build Your Own App with Lovable
            </DialogTitle>
            <DialogDescription className="text-base pt-3 text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Lovable</span> is the AI
              app builder that powers AI Web Tools — turn an idea into a real,
              production-ready web app just by chatting. No code required.
              <br />
              <br />
              Sign up through our partner link and you'll unlock{" "}
              <span className="text-pink-300 font-semibold">
                bonus credits to start building
              </span>{" "}
              — and help keep AI Web Tools growing for everyone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 pt-5">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold px-5 py-2 shadow-lg shadow-pink-500/30"
            >
              Try Lovable Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={closePopup}
              variant="outline"
              className="bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border-gray-700"
            >
              Not Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LovableInvitePopup;