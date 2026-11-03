// Only suppress identical repeated intake paragraphs, never screenplay scenes or dialogue.
export function createScreenplayIntakeFilter(enabled: boolean) {
  let pending = "";
  const seen = new Set<string>();
  const accept = (paragraph: string) => {
    const key = paragraph.replace(/[*_#]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    const intake = /\?/.test(key) && /\b(?:how many scenes|how many segments|premise|genre|tone|title|screenwriter credit|author name)\b/.test(key);
    if (!intake) return paragraph;
    if (seen.has(key)) return "";
    seen.add(key);
    return paragraph;
  };
  return {
    push(text: string): string {
      if (!enabled) return text;
      pending += text;
      let output = "";
      let end = pending.indexOf("\n\n");
      while (end >= 0) {
        output += accept(pending.slice(0, end + 2));
        pending = pending.slice(end + 2);
        end = pending.indexOf("\n\n");
      }
      // Bound buffering so unbroken prose continues streaming promptly.
      if (pending.length > 1600) { output += pending; pending = ""; }
      return output;
    },
    flush(): string {
      const output = accept(pending);
      pending = "";
      return output;
    },
  };
}