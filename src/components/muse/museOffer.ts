export const MUSE_CODE = "PI0DS6";
export const MUSE_JOIN_URL = "https://muse.ai/join?via=aiwebtools";

/** Copies the Muse code; falls back to execCommand for older phones. */
export async function copyMuseCode(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(MUSE_CODE);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = MUSE_CODE;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      el.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
