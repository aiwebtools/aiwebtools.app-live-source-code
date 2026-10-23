import { useEffect, useState } from "react";

const STAGES = ["Reading your message", "Thinking carefully", "Writing your reply"];

/** Short spoken "still here" lines so a slow first token never feels like a freeze. */
export const STALL_PHRASES = [
  "Checking on that now.",
  "On it, one moment.",
  "Let me look into that for you.",
  "Good question, thinking it through.",
  "Pulling that together now.",
  "Hang tight, working on it.",
  "Give me just a second.",
  "Digging into that right now.",
  "Almost there, putting it together.",
];

const pick = (used: Set<number>) => {
  if (used.size >= STALL_PHRASES.length) used.clear();
  let i = Math.floor(Math.random() * STALL_PHRASES.length);
  while (used.has(i)) i = (i + 1) % STALL_PHRASES.length;
  used.add(i);
  return STALL_PHRASES[i];
};

export const ThinkingStatus = ({ avatar, name, voice = false }: { avatar: string; name: string; voice?: boolean }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Free device voice only; first line after 1.4s, then a fresh one every ~7s.
  useEffect(() => {
    if (!voice || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const used = new Set<number>();
    let mine: SpeechSynthesisUtterance | null = null;
    const say = () => {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) return;
      mine = new SpeechSynthesisUtterance(pick(used));
      mine.rate = 1.05; mine.volume = 0.85;
      synth.speak(mine);
    };
    const first = window.setTimeout(say, 1400);
    const again = window.setInterval(say, 7000);
    return () => {
      window.clearTimeout(first); window.clearInterval(again);
      if (mine && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    };
  }, [voice]);

  const stage = STAGES[Math.min(Math.floor(seconds / 4), STAGES.length - 1)];

  return (
    <div className="gpt-thinking" role="status" aria-live="polite">
      <span className="gpt-thinking-orb" aria-hidden="true">
        <img src={avatar} alt="" className="gpt-thinking-avatar" />
        <span className="gpt-thinking-ring" /><span className="gpt-thinking-ring gpt-thinking-ring-2" />
      </span>
      <span><strong>{name}</strong> · {stage}</span>
      <span className="gpt-thinking-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="tabular-nums opacity-70">{seconds}s</span>
    </div>
  );
};
