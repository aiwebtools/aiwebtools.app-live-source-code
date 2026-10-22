// Preserve terminal provider failures rather than treating them as empty deltas.
export function readChatStreamEvent(payload: string) {
  const event = JSON.parse(payload);
  if (event.choices?.[0]?.delta?.refusal || event.choices?.[0]?.finish_reason === "content_filter") {
    throw new Error("The provider declined this request. This reply has stopped.");
  }
  if (event.error) {
    const message = typeof event.error === "string" ? event.error : event.error.message;
    throw new Error(message || event.message || "The assistant could not finish this reply.");
  }
  return event.choices?.[0]?.delta;
}