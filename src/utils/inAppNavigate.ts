/**
 * Navigate inside the React Router app from components that sit OUTSIDE the
 * router tree and cannot use useNavigate directly.
 * A router-scoped listener claims the request; if no
 * listener is mounted the caller falls back to a real page load.
 */
export const IN_APP_NAVIGATE_EVENT = "aiwt:in-app-navigate";

export function navigateInApp(to: string): boolean {
  const event = new CustomEvent(IN_APP_NAVIGATE_EVENT, { detail: { to, handled: false } });
  window.dispatchEvent(event);
  const detail = event.detail as { handled?: boolean } | undefined;
  if (!detail?.handled) window.location.assign(to);
  return Boolean(detail?.handled);
}
