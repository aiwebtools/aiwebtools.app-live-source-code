import { useState } from "react";
import timeMachineImage from "@/assets/og-time-machine-hero.jpg";

export default function BotPortrait({ src, name, themeKey, emblem, className = "" }: { src: string; name: string; themeKey: string; emblem: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const image = themeKey === "time-machine" && name.toLowerCase().includes("time machine") ? timeMachineImage : src;
  if (failed) return <span role="img" aria-label={`${name} emblem`} className={`gpt-room-avatar studio-portrait-fallback ${className}`}>{emblem}</span>;
  return <img src={image} alt={`${name} avatar`} className={className} onError={() => setFailed(true)} />;
}