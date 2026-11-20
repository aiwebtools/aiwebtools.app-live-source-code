// @ts-ignore Bun test runtime
import { expect,test } from 'bun:test';
import { synthesizeSound } from './localAudio';
test('free sound fallback produces actual non-silent five-second mono WAV',async()=>{
  const blob=synthesizeSound('soft chime',5),bytes=await blob.arrayBuffer(),view=new DataView(bytes);
  expect(new TextDecoder().decode(bytes.slice(0,4))).toBe('RIFF');
  expect(blob.type).toBe('audio/wav');
  expect(view.getUint32(40,true)/(view.getUint32(24,true)*2)).toBe(5);
  expect(new Int16Array(bytes.slice(44)).some(value=>Math.abs(value)>100)).toBe(true);
});