import path from "node:path";

import sharp from "sharp";

/**
 * Intrinsic dimensions for a public image path.
 *
 * Case studies render screenshots at their natural aspect ratio (no forced
 * 16:9 crop), so every project image is measured at build time and shipped to
 * next/image as width/height. `public/` is served from the site root, so a
 * path like `/images/projects/x/cover.png` resolves to
 * `public/images/projects/x/cover.png` on disk.
 *
 * SVG artwork is measured too — sharp reads the declared width/height.
 * Unreadable or missing files fall back to 16:9 so a broken entry never takes
 * the build down.
 */
const cache = new Map<string, { width: number; height: number }>();

const FALLBACK = { width: 16, height: 9 };

export async function imageSize(src: string): Promise<{
  width: number;
  height: number;
}> {
  const cached = cache.get(src);
  if (cached) return cached;

  let size = FALLBACK;
  try {
    /* Versioned URLs (?v=hash from asset-version) must not leak into the
       filesystem lookup — the hash is cache metadata, not part of the path. */
    const bare = src.split("?")[0];
    const file = path.join(process.cwd(), "public", bare.replace(/^\//, ""));
    const metadata = await sharp(file).metadata();
    if (metadata.width && metadata.height) {
      size = { width: metadata.width, height: metadata.height };
    }
  } catch {
    size = FALLBACK;
  }

  cache.set(src, size);
  return size;
}