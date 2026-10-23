import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validOffset, matchesCompressedCopy } from "./validation.ts";
Deno.test("compression batches cannot address objects outside the verified manifest", () => {
  assertEquals(validOffset(0, 847), true);
  assertEquals(validOffset(846, 847), true);
  for (const value of [-1, 847, 0.5, "0", null]) assertEquals(validOffset(value, 847), false);
});
Deno.test("replacement rejects corrupted or non-smaller copies", async () => {
  const bytes = new TextEncoder().encode("abc");
  const entry = { compressed_bytes: 3, bytes: 10, compressed_sha256: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" };
  assertEquals(await matchesCompressedCopy(bytes, entry), true);
  assertEquals(await matchesCompressedCopy(bytes, { ...entry, bytes: 3 }), false);
  assertEquals(await matchesCompressedCopy(new TextEncoder().encode("abd"), entry), false);
});