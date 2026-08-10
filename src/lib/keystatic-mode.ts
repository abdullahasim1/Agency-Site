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

/** Set on deployed environments; also switches the panel to GitHub mode. */
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

/**
 * True in `next dev`. Keystatic itself only tolerates missing GitHub secrets
 * in development, so this is the same line it draws internally.
 */
const isDev = process.env.NODE_ENV === "development";

/**
 * The GitHub App credentials. `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is
 * checked too — it is what builds the sign-in link, so without it an editor
 * reaches a dead end.
 */
const hasGithubCredentials = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
    process.env.KEYSTATIC_SECRET &&
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
);

/**
 * `local` in development, `github` when fully configured, otherwise off.
 *
 * The one exception is the first-run setup wizard. Keystatic's built-in
 * `/keystatic/setup` flow creates the GitHub App and writes the credentials
 * for you, but it only appears in development *and* in GitHub mode — which is
 * a chicken-and-egg problem, because GitHub mode is exactly what the
 * credentials are for. Setting NEXT_PUBLIC_KEYSTATIC_SETUP=1 in .env.local
 * breaks the tie for that one run; unset it once the wizard has finished.
 *
 * The flag has to be NEXT_PUBLIC_ because the panel is a client component: it
 * evaluates this same module in the browser, and if the two disagree about the
 * mode the client routes `/keystatic/setup` to a 404. It is only honoured in
 * development, so publishing it to the bundle costs nothing.
 *
 * Note this is deliberately not "github if a repo is set": a half-configured
 * deployment must not silently serve the unauthenticated local API.
 */
export const keystaticMode: "local" | "github" | "disabled" = isDev
  ? repo &&
    (hasGithubCredentials || process.env.NEXT_PUBLIC_KEYSTATIC_SETUP === "1")
    ? "github"
    : "local"
  : repo && hasGithubCredentials
    ? "github"
    : "disabled";

/** The `owner/name` repo, narrowed to the shape Keystatic's config expects. */
export const keystaticRepo = (repo ?? "") as `${string}/${string}`;

/** Whether to serve the panel and its API at all. */
export const isKeystaticEnabled = keystaticMode !== "disabled";
