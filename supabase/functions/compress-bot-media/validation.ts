export function validOffset(offset: unknown, total: number): offset is number {
  return typeof offset === "number" && Number.isInteger(offset) && offset >= 0 && offset < total;
}
export async function matchesCompressedCopy(bytes: Uint8Array, entry: { compressed_bytes: number; bytes: number; compressed_sha256: string }): Promise<boolean> {
  if (bytes.length !== entry.compressed_bytes || bytes.length >= entry.bytes) return false;
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hex = Array.from(digest, (v) => v.toString(16).padStart(2, "0")).join("");
  return hex === entry.compressed_sha256;
}