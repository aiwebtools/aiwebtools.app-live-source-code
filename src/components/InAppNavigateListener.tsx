import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IN_APP_NAVIGATE_EVENT } from "@/utils/inAppNavigate";

/**
 * Mounted inside <BrowserRouter> so overlay surfaces that live outside the
 * router (the access gate) can still move the visitor to a real page.
 * Only same-origin absolute paths are accepted.
 */
export default function InAppNavigateListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ to?: unknown; handled?: boolean }>).detail;
      const to = typeof detail?.to === "string" ? detail.to : "";
      if (!to.startsWith("/") || to.startsWith("//")) return;
      detail.handled = true;
      navigate(to);
    };
    window.addEventListener(IN_APP_NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(IN_APP_NAVIGATE_EVENT, onNavigate);
  }, [navigate]);

  return null;
}
