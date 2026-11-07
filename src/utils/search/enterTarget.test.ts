import { expect, test } from 'bun:test';
import { exactEnterTarget } from './enterTarget';
test('exact typed name wins over unrelated suggestions',()=>{expect(exactEnterTarget('Muse',[{title:'Muse Prompt Coach'},{title:'Muse'}])).toEqual({title:'Muse'});});
test('partial task remains a search',()=>{expect(exactEnterTarget('write my book',[{title:'Book Writer GPT'}])).toBeUndefined();});
test('spacing preserves exact identity',()=>{expect(exactEnterTarget(' Time   Machine GPT ',[{title:'Time Machine GPT'}])?.title).toBe('Time Machine GPT');});