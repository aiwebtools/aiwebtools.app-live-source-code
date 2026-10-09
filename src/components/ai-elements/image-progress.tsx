import { useEffect, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

/** Marker the server streams while a picture is being drawn. */
export const IMAGE_PLACEHOLDER = "_Creating your image…_";

export const splitImageProgress = (content: string) => {
  const index = content.lastIndexOf(IMAGE_PLACEHOLDER);
  if (index === -1) return { text: content, working: false };
  const before = content.slice(0, index);
  const after = content.slice(index + IMAGE_PLACEHOLDER.length);
  const finished = /!\[[^\]]*\]\([^)]+\)/.test(after) || /(?:could not|couldn't|failed|unavailable|unable|error|paused)/i.test(after);
  return { text: (before.split(IMAGE_PLACEHOLDER).join("") + after).trim(), working: !finished };
};

export const ImageProgress = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="gpt-image-progress" role="status" aria-live="polite">
      <span className="gpt-image-progress-ring" aria-hidden="true">
        <Loader2 className="h-5 w-5 animate-spin" />
        <ImageIcon className="absolute h-2.5 w-2.5" />
      </span>
      <span className="font-semibold">Drawing your picture…</span>
      <span className="tabular-nums opacity-70">{seconds}s</span>
      <span className="opacity-70">Detailed pictures can take up to a minute.</span>
    </div>
  );
};

export default ImageProgress;
