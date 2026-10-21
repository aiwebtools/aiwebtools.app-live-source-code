import { useSyncExternalStore } from "react";
import type { PersonalAi } from "../../supabase/functions/_shared/personal-provider-policy";

// Active-page memory, not browser storage. Owner binding prevents account crossover.
let active: { owner: string; value: PersonalAi } | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
export const setPersonalAi = (owner: string, value: PersonalAi) => { active = { owner, value }; notify(); };
export const clearPersonalAi = () => { active = null; notify(); };
export const getPersonalAi = (owner?: string) => active && active.owner === owner ? active.value : null;
export const clearOtherPersonalAi = (owner?: string) => { if (active && active.owner !== owner) clearPersonalAi(); };
export function usePersonalAi(owner?: string) {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => getPersonalAi(owner), () => null);
}