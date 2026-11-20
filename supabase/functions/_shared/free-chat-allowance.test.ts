// @ts-ignore Bun test runtime
import { expect,test } from 'bun:test';
import { DAILY_FREE_RUNS,freeAllowanceReached } from './free-chat-allowance';
test('allow exactly ten daily free runs and reject the eleventh',()=>{
  expect(DAILY_FREE_RUNS).toBe(10);
  expect(freeAllowanceReached(9)).toBe(false);
  expect(freeAllowanceReached(10)).toBe(true);
});