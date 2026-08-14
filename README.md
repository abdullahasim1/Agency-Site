# DevRox

Marketing site for DevRox — an AI, automation and software‑development studio.
Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript and
Tailwind CSS v4.

## Getting Started

Use the Node version in [`.nvmrc`](.nvmrc) (Node 22). Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), and the content admin panel
at [http://localhost:3000/keystatic](http://localhost:3000/keystatic).

## Scripts

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)                  |
| `npm run build`     | Production build                                  |
| `npm run start`     | Serve the production build                        |
| `npm run lint`      | ESLint                                            |
| `npm run typecheck` | `tsc --noEmit` — type check without emitting      |
| `npm run art`       | Regenerate the first‑party project artwork (SVGs) |

## Content editing

Every piece of content on this site is edited from the built‑in admin panel — no
code changes, no redeploy by hand. It runs on [Keystatic](https://keystatic.com),
a git‑based CMS: the panel is part of this app, and each save is a commit.

### Where it is

| Environment | URL                                       | Who can edit                 |
| ----------- | ----------------------------------------- | ---------------------------- |
| Local       | `http://localhost:3000/keystatic`         | anyone with the repo checked out |
| Production  | `https://<your-domain>/keystatic`         | GitHub users with **write** access to the repo |

Locally the panel writes straight to the files in your working tree. In
production it signs the editor in with GitHub and commits on their behalf, so
only repo collaborators can change anything — there is no separate password to
manage, and every edit is attributed to a real person.

### What you can edit

The sidebar has five groups:

| Group              | Contents                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Work**           | Projects and Services — full add / edit / delete                                                   |
| **Page copy**      | Per‑page headings, hero text, section intros, button labels, form labels and SEO titles/descriptions — one entry per page, plus **Shared copy** for the footer, closing call‑to‑action and other text that repeats sitewide |
| **Site content**   | Site settings, stats, why‑choose‑us, process steps                                                 |
| **Page sections**  | About (mission, values, capabilities, team), FAQ, testimonials, industries, technologies            |
| **Forms & legal**  | Contact form options, privacy policy and terms                                                     |

**Projects** and **Services** are *collections* — a list with an **Add** button
and a delete option on each entry, like WordPress posts. Everything else is a
*singleton*: one form per section, because those sections exist exactly once.

A few fields contain a word in curly braces, like `Showing {visible} of {total}
projects` or `© {year} DevRox`. Those are filled in automatically when the page
renders — edit the words around them freely, and leave the braced words in place.

Counts and figures that the site can work out for itself (how many case studies,
how many industries) are not editable, only their labels are. That way a number
on the page can never drift out of step with the content behind it.

Two things stay in code on purpose:

- **Icons** (`src/data/icons.ts`) — each icon is a React component that has to be
  bundled, so the panel offers a dropdown of the registered names instead. To add
  a *new* icon a developer registers it once, and it then appears in every dropdown.
- **Navigation** (`src/data/navigation.ts`) — menu links are tied to real routes;
  editing them freely would produce 404s.

### How publishing works

```
edit in /keystatic  →  Save  →  commit to main  →  CI (lint, typecheck, build)  →  Vercel deploy  →  live
```

Save **is** publish — there is no separate publish button. The change is live
once the pipeline finishes, typically **1–2 minutes**. That delay is the trade‑off
for having no database: the site stays fully static and fast, and every edit is
versioned in git.

Because content is just files in git, a bad edit is easy to undo — revert the
commit and the previous copy is restored.

### Adding an editor

Add the person as a **collaborator with write access** on the GitHub repo. They
open `/keystatic`, sign in with GitHub, and can edit immediately. Removing their
repo access removes their ability to edit.

### Setting up the panel in production

Production needs a GitHub App so editors can sign in. Keystatic has a wizard
that creates it and writes the credentials for you — there is no CLI to run.
It only appears in development *and* in GitHub mode, so switch modes for one
run:

1. Create `.env.local` with the repo and the setup flag:

   ```bash
   NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo
   NEXT_PUBLIC_KEYSTATIC_SETUP=1
   ```

2. `npm run dev`, then open
   [http://localhost:3000/keystatic/setup](http://localhost:3000/keystatic/setup).
   Two optional fields: **Deployed App URL** (your production domain — it adds a
   second OAuth callback so the same app works live; you can add it on GitHub
   later) and **GitHub organization** (leave blank to create the app under your
   own account). Continue, name the app, and install it on the repo.
3. The wizard writes the credentials to **`.env`** (not `.env.local`). Move the
   four lines it added into `.env.local` alongside the repo variable, delete
   `.env`, and remove `NEXT_PUBLIC_KEYSTATIC_SETUP=1`.
4. Restart the dev server. The panel is now in GitHub mode and asks you to sign
   in.

Both files are gitignored, so no credential is ever committed.

If the wizard page will not load, the same app can be created by hand at
**GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**:
callback URL `http://localhost:3000/api/keystatic/github/oauth/callback` (add
one for the production domain too), **Request user authorization (OAuth) during
installation** on, webhook off, and repository permissions **Contents:
read & write**, **Metadata: read-only**, **Pull requests: read-only**. Then
install it on the repo, generate a client secret, and fill the four variables
yourself — the app slug is the last segment of its settings URL, and
`KEYSTATIC_SECRET` is any random string (`openssl rand -hex 32`).

These five variables must also be added to the Vercel project
(**Settings → Environment Variables**), or the panel will not be served on the
deployed site. Tick both **Production** and **Preview** — a variable set only on
Production is missing on every pull‑request preview, so the panel 404s there:

| Variable                                | Purpose                                  |
| --------------------------------------- | ---------------------------------------- |
| `KEYSTATIC_GITHUB_CLIENT_ID`            | GitHub App client ID                     |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`        | GitHub App client secret                 |
| `KEYSTATIC_SECRET`                      | Signs the editor session cookie          |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Used to build the sign‑in link           |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`     | `owner/repo` — switches the panel to GitHub mode |

`NEXT_PUBLIC_KEYSTATIC_SETUP` is a local, one‑time flag. Never set it in Vercel.

**The panel is off unless all five are present.** A deployment missing any one
of them serves `/keystatic` and its API as 404 rather than falling back to
local mode — local mode writes files with no sign‑in at all, which would let
anyone rewrite the site's content. The public pages are unaffected either way,
so a missing variable can never break the site itself.

**Paste the values carefully.** These are hand-typed into a web form, and a
stray space or tab pasted along with a value is invisible in the Vercel field,
in the built page and in Keystatic's own error text. It cost an afternoon here:
Vercel held a leading tab on the repo, so the panel asked GitHub for the owner
`<tab>abdullahasim1`, GitHub said no such repo, and every editor was bounced
back to sign-in — while the identical panel worked locally, where the value was
clean. `src/lib/keystatic-mode.ts` now trims the repo, but the app slug is read
straight from the environment by `@keystatic/next`, so whitespace on that one
still breaks the sign-in link.

Remember that the three `NEXT_PUBLIC_*` values are **baked in at build time**.
Editing one in Vercel changes nothing until you **Redeploy** — the deployed
bundle still holds the old string.

### If the live panel keeps asking you to sign in

The panel loops back to sign-in whenever GitHub answers "no such repo", because
from its side an editor without repo access and a misspelled repo look the same.
Check, in this order:

1. **Is the GitHub App installed on this repo?** GitHub → **Settings →
   Applications → Installed GitHub Apps** → the Keystatic app → **Repository
   access**. Selecting the repo is not enough — the **Save** button has to be
   pressed.
2. **Is the repo string exactly `owner/name`?** Read it out of the deployed
   bundle rather than trusting the dashboard field, which hides whitespace:

   ```bash
   curl -s https://<your-domain>/keystatic \
     | grep -oE '/_next/static/[^"]+\.js' | sort -u \
     | while read -r c; do curl -s "https://<your-domain>$c"; done \
     | grep -oaP '"[^"]*/Agency-Site"' | sort -u | cat -A
   ```

   `cat -A` makes the invisible visible: `^I` is a tab, a trailing `$` follows
   the last real character. Anything between the quote and the owner name is a
   bug.
3. **Is the editor a collaborator with write access?** Read-only collaborators
   can sign in but cannot commit, so saving fails later rather than sooner.

### Where the content lives

| Content              | Files                                       |
| -------------------- | ------------------------------------------- |
| Projects             | `src/content/projects/<slug>/index.json`    |
| Services             | `src/content/services/<slug>.json`          |
| Page copy            | `src/content/pages/<page>.json`             |
| Everything else      | `src/content/<section>.json`                |

`src/data/*.ts` keeps the TypeScript types and the helpers the pages read
through; it no longer holds the content itself. `src/data/pages.ts` also exports
`fill()`, which is what expands the `{braced}` words described above.

> **Careful with slugs.** A project or service slug is its URL
> (`/portfolio/<slug>`). Renaming one breaks existing links to that page.

## CI/CD

Checks run on **GitHub Actions**; deploys are handled by **Vercel's own GitHub
integration**, not by a workflow in this repo.

### CI — [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Runs on every pull request and on pushes to `main`, as three parallel jobs so
each is its own required status check:

- **Lint** — `npm run lint`
- **Typecheck** — `npm run typecheck`
- **Build** — `npm run build` (with the Next.js build cache restored between runs)

Superseded runs on the same branch are cancelled automatically.

### Deploys — Vercel

The repo is connected to a Vercel project through Vercel's GitHub integration,
so Vercel builds and deploys by itself. There is no deploy workflow and no
Vercel token in this repo:

- **Push to `main`** → a **production** deploy.
- **Pull request** → a **preview** deploy, with the URL posted on the PR.

The site has server‑rendered routes (`/api/contact`, `/og`), so it cannot be a
static export — it needs Node/serverless hosting, which is what Vercel provides.

> **Vercel does not wait for CI.** The two run side by side. Vercel runs
> `next build` itself, so a broken build still fails the deploy — but a lint or
> typecheck failure will not stop it. If you want CI to be a real gate, add the
> three CI jobs as required status checks on `main` under **Settings → Branches**.

### Site URL

`NEXT_PUBLIC_SITE_URL` sets the canonical origin — it is what canonical tags,
`og:` tags, `sitemap.xml` and `robots.txt` are built from. Set it in Vercel to
whatever the deployment actually answers on:

```bash
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

When it is unset the site falls back to `url` in `src/content/site.json`. That
fallback is a placeholder, so **a deploy without this variable advertises a
domain nobody is serving** — search engines follow the canonical away from the
real site and social previews fetch their image from the wrong host. Point it at
the vercel.app URL now and change it to the custom domain later; it is the only
place the origin needs updating.

### Dependency updates

[`.github/dependabot.yml`](.github/dependabot.yml) opens weekly PRs for npm
dependencies (minor/patch grouped into one) and for the GitHub Actions used in
the workflows. These PRs run through the same CI before they can be merged.


<!-- v3 run test -->
