// @ts-ignore -- Bun test runtime import
import { expect, test } from 'bun:test';
import { exactEnterTarget, prioritizeDiscoveryResults } from './enterTarget';
test('exact typed name wins over unrelated suggestions',()=>{expect(exactEnterTarget('Muse',[{title:'Muse Prompt Coach'},{title:'Muse'}])).toEqual({title:'Muse'});});
test('partial task remains a search',()=>{expect(exactEnterTarget('write my book',[{title:'Book Writer GPT'}])).toBeUndefined();});
test('spacing preserves exact identity',()=>{expect(exactEnterTarget(' Time   Machine GPT ',[{title:'Time Machine GPT'}])?.title).toBe('Time Machine GPT');});
test('resurrection intent remains first after community suggestions merge', () => {
 const results = [{ title: 'Prison to Prosperity Re-Entry Companion GPT' }, { title: 'Resurection PERPLEXITY BOT' }, { title: 'Resurrection GPT' }];
 for (const query of ['resurrection', 'ressurection', 'resurection']) {
  expect(prioritizeDiscoveryResults(query, results)[0].title).toBe('Resurrection GPT');
 }
 expect(results[0].title).toBe('Prison to Prosperity Re-Entry Companion GPT');
});
test('an exact tool name outranks community recommendations without changing Enter semantics', () => {
 const results = [{ title: 'Muse Prompt Coach' }, { title: 'Muse' }];
 expect(prioritizeDiscoveryResults('Muse', results)[0].title).toBe('Muse');
 expect(exactEnterTarget('ressurection', [{ title: 'Resurrection GPT' }])).toBeUndefined();
});