import { useState } from "react";
import timeMachineImage from "@/assets/og-time-machine-hero.jpg";
import academyImage from "@/assets/college-professor-gpt-hero.jpg";
import blueprintImage from "@/assets/construction-gpt-hero.jpg";
import chambersImage from "@/assets/perplexity-bot-legal-hero.jpg";
import clinicImage from "@/assets/dental-gpt-hero.jpg";
import fieldImage from "@/assets/agronomus-farming-gpt-hero.jpg";
import forgeImage from "@/assets/diy-repair-gpt-hero.jpg";
import ledgerImage from "@/assets/bull-bear-gpt-hero.jpg";
import matrixImage from "@/assets/architect-matrix-hero.jpg";
import observatoryImage from "@/assets/carl-sagan-gpt-hero.jpg";
import oracleImage from "@/assets/emerald-thoth-gpt-hero.jpg";
import sentinelImage from "@/assets/cipher-encrypt-gpt-hero.jpg";
import soundstageImage from "@/assets/movie-maker-studio-gpt-hero.jpg";
import studioImage from "@/assets/coloring-book-gpt-hero.jpg";

const subjectImages: Record<string, string> = { academy: academyImage, blueprint: blueprintImage, chambers: chambersImage, clinic: clinicImage, field: fieldImage, forge: forgeImage, ledger: ledgerImage, matrix: matrixImage, observatory: observatoryImage, oracle: oracleImage, sentinel: sentinelImage, soundstage: soundstageImage, studio: studioImage, "time-machine": timeMachineImage };

export default function BotPortrait({ src, name, themeKey, emblem, className = "" }: { src: string; name: string; themeKey: string; emblem: string; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const image = themeKey === "time-machine" && name.toLowerCase().includes("time machine") ? timeMachineImage : src;
  const fallback = subjectImages[themeKey] || matrixImage;
  const resolved = failedSource === image ? fallback : image;
  return <span className={`relative z-10 inline-block overflow-hidden ${className}`} title={name}>
    <img src={fallback} alt="" aria-hidden="true" width={80} height={80} className="absolute inset-0 h-full w-full object-cover" />
    <img src={resolved} alt={`${name} avatar`} width={80} height={80} loading="lazy" decoding="async"
      className={`relative h-full w-full object-cover ${loadedSource === resolved ? "opacity-100" : "opacity-0"}`}
      onLoad={() => setLoadedSource(resolved)} onError={() => setFailedSource(image)} />
  </span>;
}