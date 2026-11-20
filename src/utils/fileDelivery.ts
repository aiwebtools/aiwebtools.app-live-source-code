export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename, rel: 'noopener' });
  a.style.display = 'none';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
/** Direct download on every device; share sheets could be dismissed and leave no file. */
export async function deliverFile(blob: Blob, filename: string) {
  downloadBlob(blob, filename);
}
