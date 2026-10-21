export function isReplyFailure(status: string): boolean {
  return ["stream_error", "gateway_error", "instruction_error", "provider_error"].includes(status);
}