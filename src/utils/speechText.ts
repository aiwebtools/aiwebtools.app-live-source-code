/** Preserve every word while keeping each voice request within its character budget. */
export const splitSpeechText = (text: string, budget = 3500): string[] => {
  const chunks: string[] = [];
  let rest = text.trim();
  while (rest.length > budget) {
    const candidate = rest.slice(0, budget);
    const sentence = Math.max(candidate.lastIndexOf('. '), candidate.lastIndexOf('? '), candidate.lastIndexOf('! '), candidate.lastIndexOf('\n'));
    const space = candidate.lastIndexOf(' ');
    const boundary = sentence > budget / 2 ? sentence + 1 : space > 0 ? space : budget;
    chunks.push(rest.slice(0, boundary));
    rest = rest.slice(boundary).trimStart();
  }
  if (rest) chunks.push(rest);
  return chunks;
};