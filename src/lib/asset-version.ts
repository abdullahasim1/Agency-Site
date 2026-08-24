/**
 * Cache-busting URLs for static images.
 *
 * Appends the content hash produced by scripts/generate-asset-manifest.mjs
 * (runs in prebuild/predev) as a ?v= query:
 *
 *   /images/projects/x/cover.svg -> /images/projects/x/cover.svg?v=1a2b3c4d5e
 *
 * An admin replacing an image changes its bytes, so the next build publishes a
 * different URL and every visitor fetches the new file immediately. Untouched
 * images keep their exact URL, so they keep coming from the browser cache with
 * zero requests.
 *
 * Client-safe: the manifest is a plain JSON import, no node APIs. Unknown or
 * already-versioned paths pass through unchanged, so a stale or missing
 * manifest degrades to today's behaviour rather than breaking a page.
 */

import manifest from "@/content/asset-manifest.json";

const lookup = manifest as Record<string, string>;

export function v(path: string | undefined): string {
  if (!path) return "";
  const bare = path.split("?")[0];
  const hash = lookup[bare];
  return hash && !path.includes("?v=") ? `${bare}?v=${hash}` : path;
}
