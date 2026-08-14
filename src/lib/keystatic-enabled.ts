/**
 * Whether to serve the admin panel and its API for a given request.
 *
 * **Server-only, and that is the whole reason this is its own file.** It reads
 * `KEYSTATIC_*` secrets, which Next only defines on the server; in a browser
 * bundle they are `undefined`, so this would quietly evaluate to `false` there
 * instead of failing loudly. Its sibling `keystatic-mode.ts` *is* client-safe
 * and is imported by the panel, so keeping the two apart is what stops the
 * secrets from being read on the wrong side — a mistake that does not throw,
 * it just gives a wrong answer.
 *
 * A deployment must be in GitHub mode *and* have all three server-side
 * secrets. If any is missing the panel is not configured, and the safe answer
 * is to serve nothing rather than fall back to the unauthenticated local API,
 * which would let anyone rewrite the site's content by calling it directly.
 *
 * Development is allowed only when the request arrives on a loopback host
 * (`localhost` / `127.0.0.1`). Local mode has no sign-in — the API writes
 * straight to the working tree — so a dev server exposed beyond the machine
 * (a tunnel, `--hostname 0.0.0.0`, a LAN share) answers 404 to everything
 * from any other host. That keeps `next dev` workable while closing the
 * "anyone who can reach the dev server owns the content" hole.
 *
 * The public site never reads this — pages read content from the files on
 * disk, so a missing variable can switch the panel off without touching the
 * site itself.
 */
import { keystaticMode } from "./keystatic-mode";

/** Loopback only: the only hosts a dev server should ever answer to. */
function isLoopbackHost(host: string): boolean {
  try {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    );
  } catch {
    return false;
  }
}

export function isKeystaticEnabled(host = ""): boolean {
  if (process.env.NODE_ENV === "development") {
    return isLoopbackHost(host);
  }

  return (
    keystaticMode === "github" &&
    Boolean(
      process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
        process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
        process.env.KEYSTATIC_SECRET,
    )
  );
}
