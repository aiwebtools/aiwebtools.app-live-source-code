export function audioNotice(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || "");
  if (/credit|quota|balance|402|insufficient|payment/i.test(message)) return "Studio audio is temporarily unavailable because the audio provider has no credits left. No recording was created. Browsing and text chat still work; the site owner needs to restore audio credits.";
  if (/abort|timeout/i.test(message)) return "The audio service took too long. Nothing was played. Please try again later.";
  return "The studio could not create playable audio right now. Nothing was played. Please try again later.";
}