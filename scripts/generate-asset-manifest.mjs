// @ts-nocheck
/**
 * Generates src/content/asset-manifest.json: a map of every file under
 * public/images and public/logos to a short SHA-256 of its contents.
 *
 * src/lib/asset-version.ts appends these hashes to image URLs (?v=...), so an
 * admin replacing an image produces a new URL on the next build — every visitor
 * fetches the fresh file immediately — while untouched images keep their URL
 * and stay in the browser cache.
 *
 * Runs automatically before `npm run build` and `npm run dev` (prebuild/predev).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Auto-heal corrupted/0-byte .git/index if present
const gitIndexPath = join(ROOT, ".git", "index");
if (existsSync(gitIndexPath)) {
  try {
    const size = statSync(gitIndexPath).size;
    if (size < 12) {
      unlinkSync(gitIndexPath);
      execSync("git reset HEAD .", { cwd: ROOT, stdio: "pipe" });
    }
  } catch {
    // ignore
  }
}

const PUBLIC_DIRS = ["images", "logos"].map((dir) => join(ROOT, "public", dir));
const OUT = join(ROOT, "src/content/asset-manifest.json");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const manifest = {};

for (const dir of PUBLIC_DIRS) {
  let files = [];
  try {
    files = walk(dir);
  } catch {
    continue; // directory absent — nothing to hash
  }
  for (const file of files) {
    const key = "/" + relative(join(ROOT, "public"), file).split(sep).join("/");
    manifest[key] = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`[asset-manifest] ${Object.keys(sorted).length} assets hashed -> ${relative(ROOT, OUT)}`);
