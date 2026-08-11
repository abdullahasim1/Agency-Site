/**
 * Whether to serve the admin panel and its API at all.
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
 * Development is always allowed: local mode is the normal way to work, and
 * GitHub mode has to be servable *before* the credentials exist, because the
 * only thing that creates them is the setup wizard inside this very panel.
 *
 * The public site never reads this — pages read content from the files on
 * disk, so a missing variable can switch the panel off without touching the
 * site itself.
 */
import { keystaticMode } from "./keystatic-mode";

export const isKeystaticEnabled =
  process.env.NODE_ENV === "development"
    ? true
    : keystaticMode === "github" &&
      Boolean(
        process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
          process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
          process.env.KEYSTATIC_SECRET,
      );
