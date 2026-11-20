// meSpeak/eSpeak is GPL licensed; attribution and source are shipped with the site.
// @ts-ignore meSpeak has no published types.
import meSpeak from 'mespeak';
import config from 'mespeak/src/mespeak_config.json';
import english from 'mespeak/voices/en/en-us.json';
import spanish from 'mespeak/voices/es.json';
import french from 'mespeak/voices/fr.json';
import german from 'mespeak/voices/de.json';
meSpeak.loadConfig(config);
self.onmessage = (event: MessageEvent<{text:string;speed:number;language:string}>) => {
  try {
    const language=event.data.language;
    meSpeak.loadVoice(/Spanish/i.test(language)?spanish:/French/i.test(language)?french:/German/i.test(language)?german:english);
    const result: number[] = meSpeak.speak(event.data.text,{rawdata:'array',speed:Math.round(165*event.data.speed)});
    const bytes=new Uint8Array(result);
    if(bytes.length<44) throw Error('Local voice returned no audio.');
    self.postMessage({bytes:bytes.buffer}, {transfer:[bytes.buffer]});
  } catch { self.postMessage({error:'Local speech could not generate this text.'}); }
};