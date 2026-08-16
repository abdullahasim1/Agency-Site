import { config } from "@keystatic/core";

import { projects } from "./keystatic/collections/projects";
import { services } from "./keystatic/collections/services";
import {
  aboutPage,
  faqPage,
  homePage,
  portfolioPage,
  servicesPage,
} from "./keystatic/singletons/page-copy";
import {
  bookACallPage,
  contactPage,
  sharedCopy,
} from "./keystatic/singletons/contact-pages";
import { site } from "./keystatic/singletons/site";
import {
  about,
  contact,
  faq,
  industries,
  legal,
  process,
  stats,
  technologies,
  testimonials,
  why,
} from "./keystatic/singletons/content";
import { keystaticMode, keystaticRepo } from "./src/lib/keystatic-mode";

/**
 * Keystatic — the DevRox admin panel, served at /keystatic.
 *
 * Everything editable from the panel is stored as JSON under `src/content/`.
 * The matching module in `src/data/` imports that JSON and keeps the TypeScript
 * shape plus any derived helpers, so pages and components never change when
 * content does.
 *
 * `format: { data: 'json' }` is required on every entry: Keystatic writes YAML
 * by default, and the data modules import JSON synchronously so the site stays
 * fully static.
 *
 * Storage is `local` in development (writes straight to the working tree) and
 * `github` in production, where saving commits to the repo and the existing
 * CI/CD pipeline redeploys the site.
 *
 * This file only assembles the config. The schemas live in `keystatic/`:
 * shared field builders in `helpers.ts`, the two collections under
 * `collections/`, and the per-page singletons under `singletons/`.
 */

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * DEVELOPER GUIDE — adding or changing a field
 *
 * A field in this schema is half of a contract. The other half lives in
 * `src/data/`. Before adding a field, trace the whole path:
 *
 *   1. Schema        — add the field here (label, description, validation).
 *   2. Defaults      — existing entries load with the field's default value,
 *                      so pick defaults that render a sensible page. Optional
 *                      fields that can be empty should be handled gracefully
 *                      by the component (early-return, fallback copy).
 *   3. Type          — update the matching interface in `src/data/*.ts`
 *                      (e.g. Project, Service) so pages see the new shape.
 *   4. Component     — render the field where it belongs; follow the
 *                      existing early-return / fallback patterns.
 *
 * For machine fields (ids, slugs, references) use `devOnly()` and the shared
 * `KEY_PATTERN` in `keystatic/helpers.ts` so every entry stays link-safe. Run
 * `npm run typecheck` after any schema change — the reader will surface shape
 * mismatches.
 *
 * Content lives in JSON under `src/content/`; the panel writes it straight to
 * the working tree in local mode, and commits through GitHub in production.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default config({
  /*
   * `local` writes to the working tree and has no sign-in, so it is only ever
   * used in development; `github` signs the editor in and commits on their
   * behalf. This file is imported by the panel, which is a client component,
   * so this expression is evaluated in the browser too — `keystaticMode` is
   * built purely from `NEXT_PUBLIC_` variables for exactly that reason. The
   * server-side credential check lives in `isKeystaticEnabled`, which gates
   * whether the routes are mounted at all (see src/lib/keystatic-mode.ts).
   */
  storage:
    keystaticMode === "github"
      ? {
          kind: "github",
          repo: keystaticRepo,
          /*
           * main is branch-protected (PR required), so Keystatic prompts for a
           * new branch on every save instead of committing to main directly.
           * This prefix keeps those panel-created branches recognisable.
           */
          branchPrefix: "edit/",
        }
      : { kind: "local" },

  ui: {
    brand: { name: "DevRox" },
    /*
     * Grouped by PAGE, not by data type. Open a page's group and everything on
     * that page is listed in the order it appears — a table of contents you can
     * edit. To add a project, open "Portfolio page" → Projects → New; to add a
     * service, open "Services page" → Services → New.
     *
     * A block that appears on several pages (Technologies, Process, Statistics,
     * the projects/services lists…) is listed under EVERY page it shows on. It
     * is the same entry each time, so editing it in one place updates it on all
     * of those pages at once. Keystatic renders each reference independently,
     * which is why a key can repeat across groups.
     */
    navigation: {
      "🏠 Home page": [
        "homePage",
        "stats",
        "services",
        "technologies",
        "process",
        "projects",
        "why",
        "testimonials",
      ],
      "👤 About page": [
        "aboutPage",
        "about",
        "why",
        "stats",
        "process",
        "technologies",
      ],
      "🧰 Services page": [
        "servicesPage",
        "services",
        "industries",
        "process",
        "technologies",
      ],
      "💼 Portfolio page": ["portfolioPage", "projects"],
      "❓ FAQ page": ["faqPage", "faq", "technologies"],
      "✉️ Contact page": ["contactPage", "contact", "site"],
      "📞 Book a call page": ["bookACallPage", "contact", "site"],
      "📄 Legal pages (Privacy & Terms)": ["legal"],
      "⚙️ Site-wide settings & footer": ["site", "sharedCopy"],
    },
  },

  /*
   * Projects and services are collections, not singletons: they are the two
   * things editors add and remove most, and a collection gives each entry its
   * own file plus a real list-with-create UI. Per-entry files also keep git
   * diffs readable — adding a project touches one new file instead of one
   * enormous shared one.
   */
  collections: {
    projects,
    services,
  },

  singletons: {
    /*
     * Page copy — one singleton per page, so an editor opens "Home page" and
     * finds every heading and paragraph on that page in one form. `{name}`,
     * `{service}`, `{hours}` and `{responseTime}` are placeholders filled in at
     * render time from Site settings; leaving them in place keeps the copy in
     * sync when those values change.
     */
    homePage,
    aboutPage,
    servicesPage,
    portfolioPage,
    faqPage,
    contactPage,
    bookACallPage,
    sharedCopy,
    site,
    stats,
    why,
    process,
    about,
    faq,
    testimonials,
    industries,
    technologies,
    contact,
    legal,
  },
});