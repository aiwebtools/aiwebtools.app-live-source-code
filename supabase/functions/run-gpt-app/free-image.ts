/** Anonymous, watermarked best-effort fallback; never used for denials/refusals. */
export async function generateFreeImage(prompt:string):Promise<Uint8Array> {
 if(!prompt.trim() || prompt.length>6000)throw new Error('Please shorten the picture description.');
 const url=new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
 url.search=new URLSearchParams({width:'1024',height:'1024',seed:String(Math.floor(Math.random()*1000000)),safe:'true',nofeed:'true'}).toString();
 const res=await fetch(url,{signal:AbortSignal.timeout(55000),redirect:'error'});
 if(!res.ok)throw new Error(`The free picture backup is unavailable (${res.status}). It is rate-limited; please try again later.`);
 const type=res.headers.get('Content-Type')||'';
 if(!type.startsWith('image/'))throw new Error('The free picture backup did not return an image.');
 if(Number(res.headers.get('Content-Length')||0)>10*1024*1024)throw new Error('The backup picture is too large.');
 const bytes=new Uint8Array(await res.arrayBuffer());
 if(bytes.length<1000 || bytes.length>10*1024*1024 || !(bytes[0]===255&&bytes[1]===216))throw new Error('The free picture backup returned an invalid image.');
 const text=new TextDecoder().decode(bytes.slice(0,4096));
 if(/rate.?limit triggered|buy pollen|upgrade your plan/i.test(text))throw new Error('The free picture backup is busy. Please try again later.');
 return bytes;
}