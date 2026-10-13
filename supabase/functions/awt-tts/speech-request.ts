export type SpeechConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
  format: "openai" | "gemini" | "elevenlabs";
  voice: string;
};

export function speechBody(config: SpeechConfig, text: string, download = false) {
  switch (config.format) {
    case "gemini":
      return {
        model: config.model,
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voice } } },
        },
        stream_format: download ? "audio" : "sse",
      };
    case "elevenlabs":
      return { model: config.model, text, voice_id: config.voice, output_format: "mp3_44100_128" };
    case "openai":
      return {
        model: config.model,
        input: text,
        voice: config.voice,
        stream_format: download ? "audio" : "sse",
        response_format: download ? "mp3" : "pcm",
      };
  }
}

export async function requestSpeech(config: SpeechConfig, text: string, download = false, signal?: AbortSignal) {
  return fetch(`${config.baseURL}/v1/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(speechBody(config, text, download)),
    ...(signal ? { signal } : {}),
  });
}
