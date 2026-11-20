// @ts-ignore -- Bun runs the shipped worker's regressions.
import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const rows = JSON.parse(readFileSync(new URL('../../../public/search-catalog.json', import.meta.url), 'utf8'));
const worker = readFileSync(new URL('../../../public/global-search-worker.js', import.meta.url), 'utf8');

async function search(query: string, catalog = rows): Promise<{ title: string }[]> {
 const messages: { id?: number; results?: { title: string }[] }[] = [];
 const scope = { onmessage: null as null | ((event: { data: unknown }) => Promise<void>), postMessage: (message: typeof messages[number]) => messages.push(message) };
 runInNewContext(worker, { self: scope, fetch: async () => ({ ok: true, json: async () => catalog }) });
 if (!scope.onmessage) throw new Error('Search worker did not initialize');
 await scope.onmessage({ data: { id: 1, query } });
 const result = messages.find(message => message.id === 1);
 if (!result?.results) throw new Error('Search worker did not return a result');
 return result.results;
}

test('the shipped catalog ranks Resurrection GPT first for both requested spellings', async () => {
 for (const query of ['resurrection', 'ressurection']) expect((await search(query))[0].title).toBe('Resurrection GPT');
});
test('long queries cannot match an unrelated one-letter title word', async () => {
 const catalog = [['Command R+', 'AI Models', [], null, null, null, null, null, 0, 0, true, 'Language model']];
 expect(await search('resurrection', catalog)).toEqual([]);
});
test('history and spirituality misspellings retain their correct query results', async () => {
 for (const [query, corrected] of [['hisotery', 'history'], ['spirtuality', 'spirituality']]) {
  const expected = (await search(corrected)).map(tool => tool.title);
  expect(expected.length).toBeGreaterThan(0);
  expect((await search(query)).map(tool => tool.title)).toEqual(expected);
 }
});