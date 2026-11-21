export interface VoiceRecognitionResult { isFinal: boolean; 0: { transcript: string } }
export interface VoiceRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<VoiceRecognitionResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}
export type VoiceRecognitionConstructor = new () => VoiceRecognition;

/** Own permission acquisition and recognition as one cancellable, single-utterance session. */
export function createVoiceRecognitionSession(options: {
  Constructor: VoiceRecognitionConstructor;
  acquireMicrophone: () => Promise<MediaStream>;
  language: string;
  onListening: () => void;
  onTranscript: (text: string, final: boolean) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}) {
  let ended = false;
  let stream: MediaStream | null = null;
  let recognition: VoiceRecognition | null = null;
  const release = () => { stream?.getTracks().forEach((track) => track.stop()); stream = null; };
  const stop = () => {
    if (ended) return;
    ended = true;
    const active = recognition;
    recognition = null;
    if (active) {
      active.onresult = null; active.onerror = null; active.onend = null;
      try { active.abort(); } catch { /* Already ended. */ }
    }
    release();
    options.onEnd();
  };
  const start = async () => {
    try {
      stream = await options.acquireMicrophone();
      if (ended) { release(); return; }
      recognition = new options.Constructor();
      recognition.lang = options.language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        if (ended) return;
        let text = "";
        let final = true;
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
          if (!event.results[i].isFinal) final = false;
        }
        if (!text.trim()) return;
        // Release the mic and resume the speaker BEFORE submitting the voice turn.
        if (final) stop();
        options.onTranscript(text.trim(), final);
      };
      recognition.onerror = ({ error }) => {
        if (ended) return;
        stop();
        if (error !== "aborted") options.onError(error);
      };
      recognition.onend = stop;
      recognition.start();
      if (!ended) options.onListening();
    } catch (error) {
      if (ended) return;
      stop();
      options.onError(error instanceof Error ? error.name : "unknown");
    }
  };
  return { start, stop };
}