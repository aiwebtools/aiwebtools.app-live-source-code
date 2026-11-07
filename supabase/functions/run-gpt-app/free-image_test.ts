import {assertEquals,assertRejects} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import {generateFreeImage} from './free-image.ts';
Deno.test('free fallback accepts bounded JPEG only and preserves service errors',async()=>{
 const original=globalThis.fetch;
 try{
  const bytes=new Uint8Array(2000);bytes[0]=255;bytes[1]=216;
  globalThis.fetch=()=>Promise.resolve(new Response(bytes,{headers:{'Content-Type':'image/jpeg'}}));
  assertEquals((await generateFreeImage('a tree')).length,2000);
  globalThis.fetch=()=>Promise.resolve(new Response('busy',{status:429}));
  await assertRejects(()=>generateFreeImage('a tree'),Error,'429');
  globalThis.fetch=()=>Promise.resolve(new Response('not an image',{headers:{'Content-Type':'text/html'}}));
  await assertRejects(()=>generateFreeImage('a tree'),Error,'did not return an image');
 }finally{globalThis.fetch=original;}
});