// @ts-ignore Bun regression runner
import { expect,test } from 'bun:test';
import {modelIsAvailable} from './studioModelAvailability';
test('exhausted Lovable models cannot be selected while Bionic stays available',()=>{
 const a={lovable:false,bionic:true};
 expect(modelIsAvailable('openai/gpt-6-luna',a)).toBe(false);
 expect(modelIsAvailable('google/gemini-3-flash-preview',a)).toBe(false);
 expect(modelIsAvailable('bionic/glm-5.3-flash',a)).toBe(true);
 expect(modelIsAvailable('default',a)).toBe(true);
 expect(modelIsAvailable('default',null)).toBe(false);
});