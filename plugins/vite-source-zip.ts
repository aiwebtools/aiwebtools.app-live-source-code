import fs from "fs";
import path from "path";
import crypto from "crypto";
import { zipSync, strToU8 } from "fflate";
import type { Plugin } from "vite";

/**
 * Builds a fresh, complete open-source copy of the site on every production build
 * (dist/downloads/AIWebTools-Source-Code.zip). Code ships inside the ZIP; every
 * picture, video, voice clip and archive ("website assets") is listed in
 * website-assets-manifest.json and fetched to its exact original path by
 * `node scripts/download-website-assets.mjs`, so the project builds and looks
 * identical when handed to any vibe coder. Secrets (.env) are never included.
 */
const LIVE = "https://aiwebtools.app";
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".lovable", "mem", ".memory", ".workspace", ".agents", ".claude"]);
const MEDIA_EXT = /\.(png|jpe?g|webp|gif|avif|ico|mp4|webm|mov|mp3|wav|zip|pdf|docx|woff2?|ttf|otf)$/i;
const SKIP_FILES = new Set([".env", ".env.local", ".env.production"]);
const sha = (b: Buffer) => crypto.createHash("sha1").update(b).digest("hex");

type Entry = { path: string; url: string; size: number; rewritePointer?: string };

const DOWNLOAD_SCRIPT = `// Downloads every AIWebTools website asset to its original path.
// Usage: node scripts/download-website-assets.mjs   (Node 18+)
import fs from "fs"; import path from "path";
const manifest = JSON.parse(fs.readFileSync("website-assets-manifest.json", "utf8"));
const queue = [...manifest.files]; let done = 0, failed = 0;
async function worker() {
  while (queue.length) {
    const f = queue.shift();
    if (fs.existsSync(f.path) && fs.statSync(f.path).size === f.size) { done++; continue; }
    try {
      const res = await fetch(manifest.base + f.url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      fs.mkdirSync(path.dirname(f.path), { recursive: true });
      fs.writeFileSync(f.path, Buffer.from(await res.arrayBuffer()));
      if (f.rewritePointer) {
        const p = JSON.parse(fs.readFileSync(f.rewritePointer, "utf8"));
        p.url = "/" + f.path.replace(/^public\\//, "");
        fs.writeFileSync(f.rewritePointer, JSON.stringify(p, null, 2));
      }
      done++;
    } catch (e) { failed++; console.warn("Failed:", f.path, e.message); }
    if ((done + failed) % 100 === 0) console.log(done + failed, "/", manifest.files.length);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log("Website assets ready:", done, "downloaded,", failed, "failed. Re-run to retry failures.");
`;

export function viteSourceZip(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "aiwebtools-source-zip",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = path.resolve(c.root, c.build.outDir);
    },
    closeBundle() {
      try {
        const files: Record<string, Uint8Array> = {};
        const assets: Entry[] = [];
        const rel = (full: string) => path.relative(root, full).split(path.sep).join("/");
        const add = (r: string, data: Uint8Array) => (files["AIWebTools-Source-Code/" + r] = data);

        // Hash built files so original media can be fetched from the live site.
        const built = new Map<string, string>();
        const distAssets = path.join(outDir, "assets");
        if (fs.existsSync(distAssets)) {
          for (const n of fs.readdirSync(distAssets)) {
            const full = path.join(distAssets, n);
            if (fs.statSync(full).isFile() && MEDIA_EXT.test(n)) built.set(sha(fs.readFileSync(full)), "/assets/" + n);
          }
        }

        const walk = (dir: string) => {
          for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) {
              if (!SKIP_DIRS.has(e.name)) walk(full);
              continue;
            }
            if (!e.isFile() || SKIP_FILES.has(e.name)) continue;
            const r = rel(full);
            const data = fs.readFileSync(full);
            if (r.endsWith(".asset.json")) {
              add(r, data);
              try {
                const p = JSON.parse(data.toString("utf8"));
                const file = `public/website-assets/${p.asset_id}/${p.original_filename || path.basename(p.url)}`;
                assets.push({ path: file, url: p.url, size: p.size ?? 0, rewritePointer: r });
              } catch { /* not a pointer */ }
            } else if (!MEDIA_EXT.test(e.name)) {
              add(r, data);
            } else if (r.startsWith("public/")) {
              assets.push({ path: r, url: "/" + r.slice(7).split("/").map(encodeURIComponent).join("/"), size: data.length });
            } else {
              const url = built.get(sha(data));
              if (url) assets.push({ path: r, url, size: data.length });
              else add(r, data); // small/inlined media ships directly
            }
          }
        };
        walk(root);

        const total = assets.reduce((s, a) => s + a.size, 0);
        add("website-assets-manifest.json", strToU8(JSON.stringify({ base: LIVE, generated: new Date().toISOString(), totalBytes: total, files: assets })));
        add("scripts/download-website-assets.mjs", strToU8(DOWNLOAD_SCRIPT));
        add(
          "OPEN-SOURCE-README.txt",
          strToU8(
            `AIWebTools.ai — Complete Open Source Code\n=========================================\nGenerated automatically on ${new Date().toUTCString()} from the live site.\n\nThis ZIP holds all the code (React + Vite + TypeScript, plus backend functions\nand database migrations). The website assets — ${assets.length} pictures, videos,\nvoice clips and archives (~${Math.round(total / 1e6)} MB) — are listed in\nwebsite-assets-manifest.json and download to their exact original folders:\n\n  1. npm install\n  2. node scripts/download-website-assets.mjs   (fetches all website assets)\n  3. npm run dev\n\nCDN-hosted media is saved under public/website-assets/ and its .asset.json\npointers are updated automatically, so the site works on any host.\nAdd your own backend keys in a .env file (not included for security).\n\nhttps://aiwebtools.ai — Use AI for good.\n`,
          ),
        );
        const zipped = zipSync(files, { level: 9 });
        const dest = path.join(outDir, "downloads");
        fs.mkdirSync(dest, { recursive: true });
        fs.writeFileSync(path.join(dest, "AIWebTools-Source-Code.zip"), zipped);
        console.log(`[source-zip] ${Object.keys(files).length} files, ${(zipped.length / 1e6).toFixed(1)} MB, ${assets.length} website assets`);
      } catch (err) {
        console.warn("[source-zip] skipped:", err);
      }
    },
  };
}
