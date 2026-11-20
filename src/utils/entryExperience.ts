export const ACCESS_GATE_ENABLED = false;
export const OPENING_SESSION_KEY = 'awt-mtv-opening-seen-v1';
export function shouldShowOpening(pathname: string, seen: string | null): boolean {
  return pathname === '/' && seen !== '1';
}