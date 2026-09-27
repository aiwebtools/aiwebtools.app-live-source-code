import fs from "fs";
import path from "path";
import { zipSync, strToU8 } from "fflate";
import type { Plugin } from "vite";

/**
 * Builds a fresh open-source copy of the site's code on every production build
 * (dist/downloads/AIWebTools-Source-Code.zip), so visitors always get the
 * latest version. Photos/videos/archives are left out to keep it downloadable;
 * secrets (.env) are never included.
 */
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "downloads", ".lovable", "mem", ".memory", ".workspace", ".agents", ".claude"]);
const SKIP_EXT = /\.(png|jpe?g|webp|gif|avif|ico|mp4|webm|mov|mp3|wav|zip|pdf|docx|woff2?|ttf|otf)$/i;
const SKIP_FILES = new Set([".env", ".env.local", ".env.production"]);

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
        const walk = (dir: string) => {
          for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.isDirectory()) {
              if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name));
            } else if (e.isFile() && !SKIP_FILES.has(e.name) && !SKIP_EXT.test(e.name)) {
              const full = path.join(dir, e.name);
              files["AIWebTools-Source-Code/" + path.relative(root, full).split(path.sep).join("/")] = fs.readFileSync(full);
            }
          }
        };
        walk(root);
        files["AIWebTools-Source-Code/OPEN-SOURCE-README.txt"] = strToU8(
          `AIWebTools.ai — Open Source Code\n================================\nGenerated automatically on ${new Date().toUTCString()} from the live site.\nThis is the complete code (React + Vite + TypeScript). Photos, videos and large\ndownload archives are not included to keep this file small.\n\nSetup: npm install  then  npm run dev\nYou will need your own backend keys in a .env file (not included).\n\nhttps://aiwebtools.ai — Use AI for good.\n`,
        );
        const zipped = zipSync(files, { level: 9 });
        const dest = path.join(outDir, "downloads");
        fs.mkdirSync(dest, { recursive: true });
        fs.writeFileSync(path.join(dest, "AIWebTools-Source-Code.zip"), zipped);
        console.log(`[source-zip] ${Object.keys(files).length} files, ${(zipped.length / 1e6).toFixed(1)} MB`);
      } catch (err) {
        console.warn("[source-zip] skipped:", err);
      }
    },
  };
}
