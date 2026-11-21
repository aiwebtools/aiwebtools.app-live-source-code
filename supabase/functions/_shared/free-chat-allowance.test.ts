// @ts-ignore Bun test runtime
import { expect,test } from 'bun:test';
import { DAILY_FREE_RUNS,freeAllowanceReached } from './free-chat-allowance';
test('bots have unlimited daily runs, including the eleventh and later runs',()=>{
  expect(DAILY_FREE_RUNS).toBeNull();
  expect(freeAllowanceReached(9)).toBe(false);
  expect(freeAllowanceReached(10)).toBe(false);
  expect(freeAllowanceReached(11)).toBe(false);
  expect(freeAllowanceReached(10000)).toBe(false);
});