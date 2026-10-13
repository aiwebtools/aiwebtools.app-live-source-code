// Preserve terminal provider failures rather than treating them as empty deltas.
export function readChatStreamEvent(payload: string) {
  const event = JSON.parse(payload);
  if (event.error) {
    const message = typeof event.error === "string" ? event.error : event.error.message;
    throw new Error(message || event.message || "The assistant could not finish this reply.");
  }
  return event.choices?.[0]?.delta;
}