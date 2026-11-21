import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createVoiceRecognitionSession, type VoiceRecognitionConstructor } from "@/utils/voiceRecognition";

const getConstructor = (): VoiceRecognitionConstructor | undefined => {
  if (typeof window === "undefined") return undefined;
  const browser = window as unknown as { SpeechRecognition?: VoiceRecognitionConstructor; webkitSpeechRecognition?: VoiceRecognitionConstructor };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
};

const DENIED = "Microphone access is off. Allow the microphone for this site in your browser settings, then tap Speak again — or just type your message.";

/** One utterance per turn prevents the bot's speaker audio becoming user input. */
export function useVoiceInput(onTranscript: (text: string, final: boolean) => void, onStart: () => void, onEnd: () => void) {
  const { toast } = useToast();
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  // Refs keep callbacks stable so re-renders never abort an active recognition.
  const callbackRef = useRef(onTranscript);
  const startRef = useRef(onStart);
  const endRef = useRef(onEnd);
  callbackRef.current = onTranscript;
  startRef.current = onStart;
  endRef.current = onEnd;
  const sessionRef = useRef<ReturnType<typeof createVoiceRecognitionSession> | null>(null);
  const Constructor = getConstructor();

  const notify = useCallback((title: string, description: string) => { setMessage(description); toast({ title, description }); }, [toast]);

  const stop = useCallback(() => {
    sessionRef.current?.stop();
  }, []);

  const toggle = useCallback(async () => {
    if (sessionRef.current) { stop(); return; }
    const Ctor = getConstructor();
    if (!Ctor) {
      notify("Voice input unavailable", "This browser doesn't support speech typing. Try Chrome, Edge or Safari, or type your message.");
      return;
    }
    setMessage("");
    // Pause bot audio while requesting permission, not after the visitor starts speaking.
    startRef.current();
    setListening(true);
    const session = createVoiceRecognitionSession({
      Constructor: Ctor, language: navigator.language || "en-US",
      acquireMicrophone: () => navigator.mediaDevices?.getUserMedia
        ? navigator.mediaDevices.getUserMedia({ audio: true })
        : Promise.reject(Object.assign(new Error("Microphone unavailable"), { name: "NotSupportedError" })),
      onListening: () => setListening(true),
      onTranscript: (text, final) => callbackRef.current(text, final),
      onEnd: () => { sessionRef.current = null; setListening(false); endRef.current(); },
      onError: (error) => {
        if (["not-allowed", "service-not-allowed", "NotAllowedError", "SecurityError"].includes(error)) notify("Microphone permission needed", DENIED);
        else if (error === "NotFoundError") notify("No microphone found", "Connect a microphone, then tap Speak again — or type your message.");
        else if (error === "no-speech") notify("Didn't catch that", "No speech was heard. Tap Speak and talk once “Listening…” appears.");
        else if (error === "network") notify("Speech typing is offline", "Your browser's speech service couldn't be reached. Check your connection and try again, or type your message.");
        else notify("Let's try that again", "Your microphone couldn't start. Check microphone access and tap Speak again, or type your message.");
      },
    });
    sessionRef.current = session;
    await session.start();
  }, [notify, stop]);

  useEffect(() => () => { sessionRef.current?.stop(); }, []);
  return { listening, message, clearMessage: () => setMessage(""), toggle: () => { void toggle(); }, stop, supported: Boolean(Constructor) };
}
