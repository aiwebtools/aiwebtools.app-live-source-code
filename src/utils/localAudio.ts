export function encodeWav(samples: Float32Array, rate = 22050): Blob {
  const bytes = new ArrayBuffer(44 + samples.length * 2), view = new DataView(bytes);
  const text = (offset:number,value:string) => { for(let i=0;i<value.length;i++) view.setUint8(offset+i,value.charCodeAt(i)); };
  text(0,'RIFF'); view.setUint32(4,36+samples.length*2,true); text(8,'WAVE'); text(12,'fmt ');
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,rate,true); view.setUint32(28,rate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,samples.length*2,true);
  samples.forEach((sample,i) => view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true));
  return new Blob([bytes],{type:'audio/wav'});
}
/** Deterministic local sound design, never described as the provider's AI output. */
export function synthesizeSound(prompt:string,duration:number): Blob {
  const rate=22050, seconds=Math.min(22,Math.max(.5,duration)), samples=new Float32Array(Math.round(seconds*rate));
  const chime=/chime|bell|spark|ping|notification/i.test(prompt), rain=/rain|water|wind|ocean|noise/i.test(prompt);
  let seed=Array.from(prompt).reduce((n,c)=> (n*31+c.charCodeAt(0))>>>0,12345), smooth=0;
  for(let i=0;i<samples.length;i++) {
    const t=i/rate, progress=t/seconds;
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const noise=(seed/4294967296)*2-1; smooth=.94*smooth+.06*noise;
    const envelope=Math.min(1,t*12)*Math.min(1,(seconds-t)*8);
    const tone=chime ? (Math.sin(2*Math.PI*660*t)+.5*Math.sin(2*Math.PI*990*t))*Math.exp(-3*progress) : Math.sin(2*Math.PI*(65*t+100*t*t/seconds))*.4;
    samples[i]=envelope*(rain ? smooth*1.8 : chime ? tone*.35 : smooth*1.3+tone*.3);
  }
  return encodeWav(samples,rate);
}
export function localSpeech(text:string,speed=1,language=''): Promise<Blob> {
  return new Promise((resolve,reject) => {
    const worker=new Worker(new URL('./localSpeech.worker.ts',import.meta.url),{type:'module'});
    const timer=setTimeout(()=>{worker.terminate();reject(Error('Local speech could not start. Please try again.'));},30000);
    worker.onmessage=event=>{clearTimeout(timer);worker.terminate();if(event.data.error) reject(Error(event.data.error));else resolve(new Blob([event.data.bytes],{type:'audio/wav'}));};
    worker.onerror=()=>{clearTimeout(timer);worker.terminate();reject(Error('Local speech is unavailable in this browser.'));};
    worker.postMessage({text:text.slice(0,5000),speed,language});
  });
}