export const ANGEL_UNLOCK_KEY = 'awt-angel-unlocked-v1';
export function hasAngelUnlock(local: Pick<Storage, 'getItem'>, session: Pick<Storage, 'getItem'>): boolean {
  for (const storage of [local, session]) { try { if (storage.getItem(ANGEL_UNLOCK_KEY) === '1') return true; } catch { /* try backup */ } }
  return false;
}
export function saveAngelUnlock(code: string, local: Pick<Storage, 'setItem'>, session: Pick<Storage, 'setItem'>): boolean {
  if (code !== '1111') return false;
  for (const storage of [local, session]) { try { storage.setItem(ANGEL_UNLOCK_KEY, '1'); } catch { /* backup still attempted */ } }
  return true;
}