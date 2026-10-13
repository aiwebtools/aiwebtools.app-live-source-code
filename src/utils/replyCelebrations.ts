export const REPLY_COMBOS = [
  "Confetti fanfare", "Matrix cascade", "Bubble melody", "Star chimes", "Ribbon flourish",
  "Pixel power-up", "Firework arpeggio", "Orbit bells", "Diamond sparkle", "Ripple sonar",
  "Confetti samba", "Matrix upload", "Bubble bloom", "Starlight harp", "Ribbon swoosh",
  "Pixel arcade", "Firework finale", "Orbit shimmer", "Diamond chorus", "Ripple echo",
] as const;

/** One short, bounded overlay; never interrupts conversation or adds provider usage. */
export function celebrateReply(index: number, sound: boolean, host: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => undefined;
  const variant = ((index % REPLY_COMBOS.length) + REPLY_COMBOS.length) % REPLY_COMBOS.length;
  const family = variant % 10;
  const canvas = document.createElement("canvas");
  canvas.className = "absolute inset-0 z-40 h-full w-full pointer-events-none";
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.replyCelebration = REPLY_COMBOS[variant];
  const box = host.getBoundingClientRect();
  canvas.width = Math.round(box.width); canvas.height = Math.round(box.height);
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return () => undefined; }
  const styles = getComputedStyle(host);
  const colors = [styles.getPropertyValue("--bot-accent").trim(), styles.getPropertyValue("--bot-accent-2").trim(), styles.color].filter(Boolean);
  let audio: AudioContext | undefined;
  if (sound) {
    try {
      audio = new AudioContext();
      const base = 220 * Math.pow(2, variant / 20);
      for (let n = 0; n < 4; n++) {
        const oscillator = audio.createOscillator(); const gain = audio.createGain();
        oscillator.type = variant % 3 === 0 ? "sine" : variant % 3 === 1 ? "triangle" : "sine";
        const start = audio.currentTime + n * (0.055 + variant * 0.002);
        oscillator.frequency.setValueAtTime(base * [1, 1.25, 1.5, 2][n], start);
        oscillator.frequency.exponentialRampToValueAtTime(base * (variant < 10 ? 2 : 0.75), start + 0.18);
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.018, start + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
        oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(start); oscillator.stop(start + 0.24);
      }
    } catch { /* Browser audio policy may require another user gesture. */ }
  }
  const particles = Array.from({ length: family === 1 ? 30 : 48 }, (_, i) => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 250, vy: -80 - Math.random() * 250,
    radius: 3 + Math.random() * 9, color: colors[i % colors.length],
  }));
  let frame = 0; let cleaned = false;
  const cleanup = () => { if (cleaned) return; cleaned = true; cancelAnimationFrame(frame); canvas.remove(); if (audio) void audio.close().catch(() => undefined); };
  const start = performance.now();
  const draw = (now: number) => {
    const elapsed = (now - start) / 1000;
    if (elapsed > 1.4 || !host.isConnected) { cleanup(); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = Math.max(0, 1 - elapsed / 1.4);
    particles.forEach((p, i) => {
      const x = p.x + p.vx * elapsed; const y = family === 1 ? p.y + elapsed * 280 : p.y + p.vy * elapsed + 250 * elapsed * elapsed;
      ctx.fillStyle = p.color; ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
      ctx.save(); ctx.translate(x, y); ctx.rotate(elapsed * (i % 2 ? 2 : -2));
      if (family === 1) { ctx.font = "16px monospace"; ctx.fillText(i % 2 ? "01" : "ア", 0, 0); }
      else if ([2, 7, 9].includes(family)) { ctx.beginPath(); ctx.arc(0, 0, p.radius * (1 + elapsed), 0, Math.PI * 2); ctx.stroke(); }
      else if ([3, 6].includes(family)) { ctx.beginPath(); ctx.moveTo(-p.radius, 0); ctx.lineTo(p.radius, 0); ctx.moveTo(0, -p.radius); ctx.lineTo(0, p.radius); ctx.stroke(); }
      else { ctx.fillRect(-p.radius / 2, -p.radius / 2, family === 4 ? 3 : p.radius, family === 4 ? p.radius * 3 : p.radius); }
      ctx.restore();
    });
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);
  return cleanup;
}