/**
 * Which storage mode the admin panel runs in, decided in one place.
 *
 * The panel has two modes and they have very different security properties:
 *
 * - **local** — the API writes straight to the working tree with no sign-in.
 *   That is exactly what you want on a developer's machine and must never be
 *   reachable on a deployed site, where it would let anyone rewrite the
 *   content by calling the API directly.
 * - **github** — the editor signs in with GitHub and saves commit on their
 *   behalf, so only repo collaborators can change anything.
 *
 * GitHub mode needs four values. If any one of them is missing the panel is
 * not configured, and the safe answer is to serve no panel at all rather than
 * fall back to the unauthenticated local API. The public site is unaffected
 * either way: pages read content from the files on disk, never through this.
 */

/**
 * Set on deployed environments; also switches the panel to GitHub mode.
 *
 * Both this and the app slug are `NEXT_PUBLIC_` on purpose — see the note on
 * `keystaticMode` for why the browser has to be able to reach this decision on
 * its own.
 */
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;
const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;

/**
 * Which mode the panel runs in.
 *
 * **This has to evaluate identically on the server and in the browser.** The
 * panel is a client component that imports `keystatic.config.ts`, which reads
 * this module, so the config is compiled into the browser bundle as well as
 * the server one. The two modes drive completely different API shapes — local
 * mode calls `/api/keystatic/tree`, GitHub mode talks to GitHub's GraphQL API
 * — so if the two sides disagree the panel loads and then fails on the first
 * request, because it is asking for endpoints the server never mounted.
 *
 * That is why the decision is made only from `NEXT_PUBLIC_` variables. The
 * server-only credentials (`KEYSTATIC_GITHUB_CLIENT_ID` and friends) inline as
 * `undefined` in the browser, so including them here would silently resolve to
 * `local` on the client while the server sat in `github` mode — every
 * collection then failing with `Unexpected token 'N', "Not Found" is not valid
 * JSON`, which is the 404 body being parsed as JSON. Those credentials are
 * still required, and are enforced by `isKeystaticEnabled` below, which only
 * ever runs on the server.
 *
 * Note this is deliberately not "github if anything is set": a half-configured
 * deployment must not silently serve the unauthenticated local API.
 */
export const keystaticMode: "local" | "github" =
  repo && appSlug ? "github" : "local";

/** The `owner/name` repo, narrowed to the shape Keystatic's config expects. */
export const keystaticRepo = (repo ?? "") as `${string}/${string}`;

/**
 * Whether to serve the panel and its API at all. **Server-only** — this reads
 * secrets, so it must never be called from a client component.
 *
 * GitHub mode additionally needs the three server-side secrets. If any is
 * missing the panel is not configured, and the safe answer is to serve no
 * panel rather than fall back to the unauthenticated local API, which would
 * let anyone rewrite the site's content by calling the API directly.
 *
 * Local mode is only ever allowed in `next dev`. Keystatic draws that same
 * line internally.
 */
export const isKeystaticEnabled =
  keystaticMode === "github"
    ? Boolean(
        process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
          process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
          process.env.KEYSTATIC_SECRET,
      )
    : process.env.NODE_ENV === "development";
