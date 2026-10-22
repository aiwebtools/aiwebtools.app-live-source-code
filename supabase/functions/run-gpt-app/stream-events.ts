// Preserve terminal provider failures rather than treating them as empty deltas.
export class ChatStreamFailure extends Error {
  constructor(message: string, public status?: number) { super(message); }
}
export function readChatStreamEvent(payload: string) {
  const event = JSON.parse(payload);
  if (event.choices?.[0]?.delta?.refusal || event.choices?.[0]?.finish_reason === "content_filter") {
    throw new Error("The provider declined this request. This reply has stopped.");
  }
  if (event.error) {
    const message = typeof event.error === "string" ? event.error : event.error.message;
    const status = Number(event.status || event.error.status || event.error.status_code);
    throw new ChatStreamFailure(message || event.message || "The assistant could not finish this reply.", Number.isFinite(status) && status > 0 ? status : undefined);
  }
  return event.choices?.[0]?.delta;
}