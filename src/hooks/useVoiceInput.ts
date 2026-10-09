import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RecognitionResult { isFinal: boolean; 0: { transcript: string } }
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<RecognitionResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}
type RecognitionConstructor = new () => Recognition;

/** One utterance per turn prevents the bot's speaker audio becoming user input. */
export function useVoiceInput(onTranscript: (text: string) => void, onStart: () => void) {
  const { toast } = useToast();
  const [listening, setListening] = useState(false);
  const callbackRef = useRef(onTranscript);
  const recognitionRef = useRef<Recognition | null>(null);
  callbackRef.current = onTranscript;
  const browser = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
  const stop = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
  }, []);
  const toggle = useCallback(() => {
    if (listening) { stop(); return; }
    if (!Constructor) {
      toast({ title: "Voice input unavailable", description: "This browser does not support microphone dictation. Try Chrome or Safari, or type your message." });
      return;
    }
    onStart();
    const recognition = new Constructor();
    recognitionRef.current = recognition;
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) text += event.results[i][0].transcript;
      }
      if (text.trim()) callbackRef.current(text.trim());
    };
    recognition.onerror = ({ error }) => {
      if (error !== "aborted") toast({ title: "Microphone paused", description: error === "not-allowed" ? "Allow microphone access to speak with this bot." : "Your voice could not be heard. Tap the microphone to try again." });
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    try { recognition.start(); setListening(true); }
    catch { stop(); toast({ title: "Microphone unavailable", description: "Please check microphone access and try again." }); }
  }, [Constructor, listening, onStart, stop, toast]);
  useEffect(() => stop, [stop]);
  return { listening, toggle, stop, supported: Boolean(Constructor) };
}