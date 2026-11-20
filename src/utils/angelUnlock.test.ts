// @ts-ignore Bun test runtime
import { expect, test } from 'bun:test';
import { hasAngelUnlock, saveAngelUnlock, ANGEL_UNLOCK_KEY } from './angelUnlock';
const store = () => { const values = new Map<string,string>(); return { getItem: (key:string) => values.get(key) || null, setItem: (key:string,value:string) => values.set(key,value) }; };
test('1111 persists unlock across reloads and sessions; other codes fail', () => {
  const local = store(), session = store();
  expect(saveAngelUnlock('1234',local,session)).toBe(false);
  expect(hasAngelUnlock(local,session)).toBe(false);
  expect(saveAngelUnlock('1111',local,session)).toBe(true);
  expect(local.getItem(ANGEL_UNLOCK_KEY)).toBe('1');
  expect(hasAngelUnlock(local,store())).toBe(true);
});
test('session unlock survives blocked local storage', () => {
  const blocked = { getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('blocked'); } }, session=store();
  saveAngelUnlock('1111',blocked,session);
  expect(hasAngelUnlock(blocked,session)).toBe(true);
});