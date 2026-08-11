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
 * Everything here is **client-safe** and reads only `NEXT_PUBLIC_` variables,
 * because the panel imports it in the browser. The credential check that
 * decides whether the panel is served at all lives in `keystatic-enabled.ts`,
 * which is server-only for that reason.
 */

/**
 * Set on deployed environments; also switches the panel to GitHub mode.
 *
 * Both this and the app slug are `NEXT_PUBLIC_` on purpose — see the note on
 * `keystaticMode` for why the browser has to be able to reach this decision on
 * its own.
 *
 * Both are trimmed, because these are typed into a hosting dashboard by hand
 * and a space or tab pasted along with the value is invisible everywhere it
 * matters: in the dashboard field, in the built page, and in the panel's own
 * error message. This is not hypothetical — Vercel held a leading tab on the
 * repo, so Keystatic asked GitHub for the owner `\tabdullahasim1`, GitHub
 * correctly said no such repo, and the panel bounced every editor back to
 * sign-in, while the identical panel worked locally where the value was clean.
 *
 * Trimming the slug here only fixes *our* mode decision: `@keystatic/next`
 * reads that variable straight from `process.env` for the sign-in and install
 * links, so whitespace on it would still break those. The dashboard values are
 * still worth keeping clean; this only stops one byte from taking the panel
 * down.
 */
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO?.trim();
const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG?.trim();

/**
 * True in `next dev`. Safe to read on both sides: Next inlines `NODE_ENV` into
 * the browser bundle, unlike the `KEYSTATIC_*` secrets.
 */
const isDev = process.env.NODE_ENV === "development";

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
 * still required, and are enforced by `isKeystaticEnabled` in the sibling
 * file, which only ever runs on the server.
 *
 * Note this is deliberately not "github if anything is set": a half-configured
 * deployment must not silently serve the unauthenticated local API.
 */
export const keystaticMode: "local" | "github" =
  repo && (appSlug || (isDev && process.env.NEXT_PUBLIC_KEYSTATIC_SETUP === "1"))
    ? "github"
    : "local";

/** The `owner/name` repo, narrowed to the shape Keystatic's config expects. */
export const keystaticRepo = (repo ?? "") as `${string}/${string}`;

/*
 * Whether the panel is served at all is a separate, **server-only** decision,
 * because it depends on secrets: see `keystatic-enabled.ts`. Nothing in this
 * file may read those, or it would resolve to the wrong value in the browser
 * without ever throwing.
 */
