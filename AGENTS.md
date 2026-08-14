<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git workflow

`main` is branch-protected (pull request required — set up so CMS saves from
the Keystatic panel land on `edit/` branches instead of touching main
directly). PRs from `edit/*` branches are merged automatically by the
`.github/workflows/auto-merge.yml` workflow — do not merge those manually. So
after finishing any task that changes files:

1. Commit locally with a short, descriptive message in the repo's style, and
   stage only files that belong to the task (no secrets, no unrelated changes).
2. Push to a new branch: `git push -u origin <short-name>`.
3. Open and merge the pull request: `gh pr create --fill && gh pr merge --merge --delete-branch`.
4. Never try to push to `main` directly — the remote rejects it.

