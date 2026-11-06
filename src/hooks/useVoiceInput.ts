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

const getConstructor = (): RecognitionConstructor | undefined => {
  if (typeof window === "undefined") return undefined;
  const browser = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
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
  const recognitionRef = useRef<Recognition | null>(null);
  const startingRef = useRef(false);
  const Constructor = getConstructor();

  const notify = useCallback((title: string, description: string) => { setMessage(description); toast({ title, description }); }, [toast]);

  const stop = useCallback(() => {
    const active = recognitionRef.current;
    recognitionRef.current = null;
    if (active) { active.onend = null; active.onerror = null; try { active.abort(); } catch { /* already stopped */ } }
    setListening(false);
    endRef.current();
  }, []);

  const toggle = useCallback(async () => {
    if (recognitionRef.current) { stop(); return; }
    if (startingRef.current) return;
    const Ctor = getConstructor();
    if (!Ctor) {
      notify("Voice input unavailable", "This browser doesn't support speech typing. Try Chrome, Edge or Safari, or type your message.");
      return;
    }
    setMessage("");
    startingRef.current = true;
    setListening(true);
    // Trigger the browser's normal microphone permission prompt first.
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        startingRef.current = false;
        setListening(false);
        const name = (error as { name?: string })?.name;
        notify(name === "NotFoundError" ? "No microphone found" : "Microphone permission needed", name === "NotFoundError" ? "Connect a microphone, then tap Speak again — or type your message." : DENIED);
        return;
      }
    }
    startRef.current();
    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let text = "";
      let final = true;
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
        if (!event.results[i].isFinal) final = false;
      }
      if (text.trim()) callbackRef.current(text.trim(), final);
    };
    recognition.onerror = ({ error }) => {
      if (error !== "aborted") {
        if (error === "not-allowed" || error === "service-not-allowed") notify("Microphone permission needed", DENIED);
        else if (error === "no-speech") notify("Didn't catch that", "No speech was heard. Tap Speak and talk once “Listening…” appears.");
        else if (error === "network") notify("Speech typing is offline", "Your browser's speech service couldn't be reached. Check your connection and try again, or type your message.");
        else notify("Let's try that again", "Your voice couldn't be picked up. Tap Speak to try again.");
      }
      recognitionRef.current = null;
      setListening(false);
      endRef.current();
    };
    recognition.onend = () => { recognitionRef.current = null; setListening(false); endRef.current(); };
    try { recognition.start(); }
    catch { recognitionRef.current = null; setListening(false); endRef.current(); notify("Let's try that again", "The microphone was busy. Tap Speak again in a moment."); }
    finally { startingRef.current = false; }
  }, [notify, stop]);

  useEffect(() => () => { const active = recognitionRef.current; recognitionRef.current = null; try { active?.abort(); } catch { /* noop */ } }, []);
  return { listening, message, clearMessage: () => setMessage(""), toggle: () => { void toggle(); }, stop, supported: Boolean(Constructor) };
}
