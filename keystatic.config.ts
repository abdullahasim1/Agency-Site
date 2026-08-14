import { collection, config, fields, singleton } from "@keystatic/core";

import { iconRegistry } from "./src/data/icons";
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
 */

/** Icon dropdown options, derived from the one registry that bundles the icons. */
const iconOptions = Object.keys(iconRegistry).map((name) => ({
  label: name,
  value: name,
}));

const iconField = (label = "Icon") =>
  fields.select({
    label,
    description: "Icon shown alongside this item.",
    options: iconOptions,
    defaultValue: "Sparkles",
  });

const accentField = (label = "Accent colour") =>
  fields.select({
    label,
    options: [
      { label: "Brand (blue)", value: "brand" },
      { label: "Violet", value: "violet" },
      { label: "Cyan", value: "cyan" },
    ],
    defaultValue: "brand",
  });

/**
 * Shared validation for every machine key on the site (ids, slugs, references).
 *
 * The same pattern in `src/data/*.ts` selectors must match it, so keep them in
 * sync when either changes: lowercase letters, digits and hyphens only.
 */
const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const keyPatternValidation = {
  regex: KEY_PATTERN,
  message:
    "Use only lowercase letters, numbers and hyphens (e.g. my-project-1).",
};

/**
 * Marks a field as developer-only and explains why it must stay stable.
 * Every machine field on the site should be framed through this so editors
 * learn the pattern in one place.
 */
const devOnly = (reason: string) => `Developer field — ${reason}`;

/** Stable machine key for an entry. Changing one can break links, so it is explained. */
const idField = fields.text({
  label: "Internal ID",
  description: devOnly(
    "not shown on the site. Used as a stable key by the data layer — changing it breaks saved references.",
  ),
  validation: {
    isRequired: true,
    pattern: keyPatternValidation,
  },
});

/**
 * A section intro — the small label, the heading and the line underneath.
 *
 * Used throughout the page-copy singletons so every heading on the site is
 * editable without touching a component.
 */
const sectionField = (label: string, description?: string) =>
  fields.object(
    {
      eyebrow: fields.text({
        label: "Label",
        description: "Small line above the heading.",
      }),
      title: fields.text({
        label: "Heading",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Supporting text",
        multiline: true,
      }),
    },
    { label, description },
  );

/** Title, description and keywords for a page's search-engine listing. */
const seoField = (description?: string) =>
  fields.object(
    {
      title: fields.text({
        label: "Browser / search title",
        description: "The site name is appended automatically.",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Search description",
        description: "Aim for roughly 150–160 characters.",
        multiline: true,
        validation: { isRequired: true },
      }),
      keywords: fields.array(fields.text({ label: "Keyword" }), {
        label: "Keywords",
        itemLabel: (props) => props.value || "Keyword",
      }),
    },
    { label: "SEO", description },
  );

/** Header and search listing for a legal page; the body sections are separate. */
const legalPageField = (label: string) =>
  fields.object(
    {
      eyebrow: fields.text({ label: "Label" }),
      title: fields.text({
        label: "Heading",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Introduction",
        multiline: true,
      }),
      seoDescription: fields.text({
        label: "Search description",
        description: "Shown in search results. The heading is used as the title.",
        multiline: true,
      }),
    },
    { label },
  );

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
 * `KEY_PATTERN` above so every entry stays link-safe. Run `npm run typecheck`
 * after any schema change — the reader will surface shape mismatches.
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
     * Grouped for easy CRUD first. Collections are at the top because they are
     * the only content types editors add/delete often; the rest are one-form
     * settings pages.
     */
    navigation: {
      "➕ CRUD: add, edit, delete": ["services", "projects"],
      "✏️ Page text": [
        "homePage",
        "aboutPage",
        "servicesPage",
        "portfolioPage",
        "faqPage",
        "contactPage",
        "bookACallPage",
      ],
      "♻️ Reusable sections": [
        "stats",
        "why",
        "process",
        "about",
        "faq",
        "testimonials",
        "industries",
        "technologies",
      ],
      "📬 Forms & business info": ["contact", "site", "sharedCopy"],
      "📄 Legal": ["legal"],
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
    projects: collection({
      label: "Projects - add / edit / delete",
      path: "src/content/projects/*/",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "category", "featured", "order"],
      entryLayout: "form",
      schema: {
        title: fields.slug({
          name: {
            label: "Project title",
            description: "Project name, shown on the card and case-study page.",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL slug",
            description: devOnly(
              "This becomes /portfolio/slug. Avoid changing after publish — existing links break.",
            ),
            validation: {
              pattern: keyPatternValidation,
            },
          },
        }),
        basics: fields.object(
          {
            id: idField,
            tagline: fields.text({
              label: "Tagline",
              description:
                "Sub-title under the project name on the case-study page. A short promise, not a sentence.",
              validation: { length: { max: 60 } },
            }),
          },
          {
            label: "Basics",
            description:
              "The project's stable machine key and the tagline under the title.",
            layout: [6, 6],
          },
        ),
        category: fields.text({
          label: "Card category",
          description: 'Short line on cards, e.g. "AI / Voice".',
        }),
        categories: fields.multiselect({
          label: "Portfolio filters",
          description: "Choose where this project appears in the portfolio filters.",
          options: [
            { label: "AI", value: "AI" },
            { label: "Automation", value: "Automation" },
            { label: "Web Apps", value: "Web Apps" },
            { label: "Mobile", value: "Mobile" },
            { label: "SaaS", value: "SaaS" },
          ],
        }),
        listing: fields.object(
          {
            shortDescription: fields.text({
              label: "Card description",
              description: "Short copy shown on portfolio cards.",
              multiline: true,
              validation: { length: { max: 220 } },
            }),
            fullDescription: fields.text({
              label: "Full description",
              description:
                "Lead paragraph on the hero image panel. What the project is, in two or three sentences.",
              multiline: true,
            }),
          },
          {
            label: "Card & hero copy",
            description: "The short card text and the lead paragraph of the case study.",
            layout: [6, 6],
          },
        ),
        cover: fields.object(
          {
            image: fields.image({
              label: "Cover image",
              description:
                "Upload the card / hero image for this project. Stored under public/images/projects/<slug>/.",
              directory: "public/images/projects",
              publicPath: "/images/projects",
              validation: { isRequired: true },
            }),
            imageAlt: fields.text({
              label: "Cover image alt text",
              description: "Describes the image for screen readers and search engines.",
            }),
          },
          {
            label: "Cover image",
            description: "The artwork shown on the portfolio card and the case-study hero.",
            layout: [12, 12],
          },
        ),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technology badges",
          description: "Flat list shown on the card.",
          itemLabel: (props) => props.value || "Technology",
        }),
        techStack: fields.array(
          fields.object({
            group: fields.text({
              label: "Group",
              validation: { isRequired: true },
            }),
            items: fields.array(fields.text({ label: "Tool" }), {
              label: "Tools",
              itemLabel: (props) => props.value || "Tool",
            }),
          }),
          {
            label: "Grouped tech stack",
            description: "Shown on the case-study page.",
            itemLabel: (props) => props.fields.group.value || "Group",
          },
        ),
        features: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({ label: "Description", multiline: true }),
            icon: iconField(),
          }),
          {
            label: "Features",
            itemLabel: (props) => props.fields.title.value || "Feature",
          },
        ),
        challenge: fields.object(
          {
            summary: fields.text({
              label: "Summary",
              description:
                "One or two sentences on the situation before the engagement.",
              multiline: true,
            }),
            points: fields.array(
              fields.object({
                icon: iconField(),
                title: fields.text({
                  label: "Card title",
                  description: "Short heading, e.g. \"Fragmented customer data\".",
                  validation: { isRequired: true },
                }),
                description: fields.text({
                  label: "Description",
                  description: "One or two sentences expanding the card title.",
                  multiline: true,
                }),
              }),
              {
                label: "Challenge cards",
                description:
                  "Each card appears in the Business Challenge grid. 3–5 cards is the sweet spot.",
                itemLabel: (props) => props.fields.title.value || "Challenge card",
              },
            ),
          },
          { label: "Business Challenge", description: "The situation before the engagement, in the client's terms." },
        ),
        solution: fields.object(
          {
            summary: fields.text({
              label: "Summary",
              description: "One or two sentences on the approach taken.",
              multiline: true,
            }),
            points: fields.array(
              fields.object({
                icon: iconField(),
                title: fields.text({
                  label: "Card title",
                  description: "Short heading, e.g. \"Schema modelled on the real pipeline\".",
                  validation: { isRequired: true },
                }),
                description: fields.text({
                  label: "Description",
                  description: "One or two sentences expanding the card title.",
                  multiline: true,
                }),
              }),
              {
                label: "Solution cards",
                description:
                  "Each card appears in the Solution Design grid. Keep the same count as the challenge cards so the two sections read as a story.",
                itemLabel: (props) => props.fields.title.value || "Solution card",
              },
            ),
          },
          { label: "Solution Design", description: "What we built, mirroring the challenge cards above it." },
        ),
        objectives: fields.array(fields.text({ label: "Objective" }), {
          label: "Engagement objectives",
          description:
            "The goals the build needed to achieve. Shown as the checklist between Business Challenge and Solution Design. 4–6 items.",
          itemLabel: (props) => props.value || "Objective",
        }),
        closing: fields.object(
          {
            clientOverview: fields.text({
              label: "Client overview",
              description:
                "Lead paragraph of the Client Overview section — who the client is and what they do.",
              multiline: true,
            }),
            conclusion: fields.text({
              label: "Conclusion",
              description:
                "Closing paragraph shown at the end of the case study, before the related projects.",
              multiline: true,
            }),
          },
          {
            label: "Story opening & closing",
            description:
              "The lead-in paragraph before the challenge, and the closing paragraph of the case study.",
            layout: [12, 12],
          },
        ),
        results: fields.array(
          fields.object(
            {
              value: fields.text({
                label: "Figure",
                description: 'Headline number, e.g. "68%" or "3.4x".',
                validation: { isRequired: true },
              }),
              label: fields.text({
                label: "Label",
                description: "What the figure measures, e.g. \"Faster onboarding\".",
                validation: { isRequired: true },
              }),
              detail: fields.text({
                label: "Detail",
                description: "One or two sentences explaining the figure in context.",
                multiline: true,
              }),
            },
            {
              layout: [4, 8, 12],
            },
          ),
          {
            label: "Results",
            description:
              "Only publish figures the client has verified and agreed to. Never an estimate.",
            itemLabel: (props) =>
              props.fields.label.value || props.fields.value.value || "Result",
          },
        ),
        gallery: fields.array(
          fields.object(
            {
              src: fields.image({
                label: "Image",
                description:
                  "Upload a screenshot. Stored under public/images/projects/<slug>/.",
                directory: "public/images/projects",
                publicPath: "/images/projects",
                validation: { isRequired: true },
              }),
              alt: fields.text({ label: "Alt text" }),
              caption: fields.text({
                label: "Caption",
                description: "Short line under the image.",
                multiline: true,
              }),
            },
            {
              layout: [8, 4, 12],
            },
          ),
          {
            label: "Gallery",
            description: "Interface screens. The first image spans the full width.",
            itemLabel: (props) => props.fields.caption.value || "Image",
          },
        ),
        video: fields.object(
          {
            file: fields.file({
              label: "Video file",
              description:
                "Upload the project's own video (.mp4). Leave empty to hide the video section.",
              directory: "public/videos/projects",
              publicPath: "/videos/projects",
              validation: { isRequired: false },
            }),
            caption: fields.text({
              label: "Caption",
              description: "Short line under the video.",
              multiline: true,
            }),
          },
          {
            label: "Demo video",
            description:
              "Optional. Add a video to show a video section on the case-study page.",
          },
        ),
        workflow: fields.array(
          fields.object({
            id: fields.text({
              label: "ID",
              description: devOnly(
                'unique machine key, e.g. "INGEST-1". Used as the React key; not shown on the page.',
              ),
              validation: {
                isRequired: true,
                pattern: keyPatternValidation,
              },
            }),
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({
              label: "Description",
              description: "What happens at this step.",
              multiline: true,
            }),
            tag: fields.text({
              label: "Tag",
              description: 'Short mono label on the node, e.g. "INGEST".',
            }),
          }),
          {
            label: "Workflow diagram nodes",
            description: "The system flow, one node per step. 3–6 nodes reads best.",
            itemLabel: (props) => props.fields.title.value || "Node",
          },
        ),
        workflowLayout: fields.select({
          label: "Workflow diagram layout",
          description:
            "Linear: each step flows to the next. Loop: the final step returns to the first (daily cycles, retry loops, waitlist backfill).",
          options: [
            { label: "Linear — one step to the next", value: "linear" },
            { label: "Loop — returns to the start", value: "loop" },
          ],
          defaultValue: "linear",
        }),
        overview: fields.object(
          {
            client: fields.text({
              label: "Client",
              description: "Name, or \"Confidential\" if undisclosed.",
              validation: { isRequired: true },
            }),
            industry: fields.text({ label: "Industry" }),
            timeline: fields.text({
              label: "Timeline",
              description: 'e.g. "16 weeks".',
            }),
            year: fields.text({ label: "Year" }),
            platforms: fields.array(fields.text({ label: "Platform" }), {
              label: "Platforms",
              description: 'e.g. "Web application", "iOS + Android".',
              itemLabel: (props) => props.value || "Platform",
            }),
            services: fields.array(fields.text({ label: "Service" }), {
              label: "Services",
              description:
                "Use the service names from the Services pages so the lists match the rest of the site.",
              itemLabel: (props) => props.value || "Service",
            }),
            team: fields.text({
              label: "Team shape",
              description: 'e.g. "3 engineers, 1 designer, 1 delivery lead".',
            }),
          },
          {
            label: "Project brief",
            description: "The facts shown in the hero and the facts panel.",
            layout: [6, 6, 6, 6, 6, 6, 12],
          },
        ),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show this project on the home page.",
        }),
        accent: accentField(),
        order: fields.integer({
          label: "Display order",
          description: "Lower numbers show first.",
          defaultValue: 100,
        }),
      },
    }),

    services: collection({
      label: "Services - add / edit / delete",
      path: "src/content/services/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "featured", "order"],
      entryLayout: "form",
      schema: {
        title: fields.slug({
          name: {
            label: "Service title",
            description: "Card and page title.",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL slug",
            description: devOnly(
              "This becomes /services/slug. Avoid changing after publish — existing links break.",
            ),
            validation: {
              pattern: keyPatternValidation,
            },
          },
        }),
        basics: fields.object(
          {
            id: idField,
            navLabel: fields.text({
              label: "Short menu label",
              description: "Short name used in footer links and compact lists.",
            }),
            icon: iconField(),
          },
          {
            label: "Basics",
            description:
              "The service's stable machine key, the short menu label and the icon.",
            layout: [4, 4, 4],
          },
        ),
        listing: fields.object(
          {
            shortDescription: fields.text({
              label: "Card description",
              description: "One or two sentences for the card.",
              multiline: true,
            }),
            fullDescription: fields.text({
              label: "Full description",
              description: "Opening paragraph on the service page.",
              multiline: true,
            }),
          },
          {
            label: "Descriptions",
            description: "The short card text and the opening paragraph of the service page.",
            layout: [6, 6],
          },
        ),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technology badges",
          itemLabel: (props) => props.value || "Technology",
        }),
        deliverables: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Deliverables",
            description: "What the client actually receives.",
            itemLabel: (props) => props.fields.title.value || "Deliverable",
          },
        ),
        useCases: fields.array(fields.text({ label: "Use case" }), {
          label: "Use cases",
          itemLabel: (props) => props.value || "Use case",
        }),
        faq: fields.array(
          fields.object({
            question: fields.text({
              label: "Question",
              validation: { isRequired: true },
            }),
            answer: fields.text({
              label: "Answer",
              description:
                "Answer the question in the first sentence, then add the detail. Search engines and AI assistants quote the opening line.",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Questions & answers",
            description:
              "Questions buyers actually ask about this service. Shown as an FAQ section on the service page and published as structured data, so these are what a search engine or AI assistant can answer with. Leave empty and the section simply does not appear.",
            itemLabel: (props) => props.fields.question.value || "Question",
          },
        ),
        relatedProjects: fields.array(
          fields.text({
            label: "Project slug",
            validation: { pattern: keyPatternValidation },
          }),
          {
            label: "Related projects",
            description: devOnly(
              "use project URL slugs, e.g. verivoice. A slug that does not match a project in the Work collection renders no card and is silently skipped.",
            ),
            itemLabel: (props) => props.value || "Project slug",
          },
        ),
        accent: accentField(),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show this service on the home page.",
        }),
        order: fields.integer({
          label: "Display order",
          description: "Lower numbers show first.",
          defaultValue: 100,
        }),
      },
    }),
  },

  singletons: {
    /*
     * Page copy — one singleton per page, so an editor opens "Home page" and
     * finds every heading and paragraph on that page in one form. `{name}`,
     * `{service}`, `{hours}` and `{responseTime}` are placeholders filled in at
     * render time from Site settings; leaving them in place keeps the copy in
     * sync when those values change.
     */
    homePage: singleton({
      label: "Home page",
      path: "src/content/pages/home",
      format: { data: "json" },
      schema: {
        heroHeadline: fields.text({
          label: "Headline",
          description: "First line of the main heading.",
          validation: { isRequired: true },
        }),
        heroHeadlineAccent: fields.text({
          label: "Headline — highlighted line",
          description: "Second line, drawn in the brand gradient.",
          validation: { isRequired: true },
        }),
        heroLead: fields.text({
          label: "Introduction",
          multiline: true,
          validation: { isRequired: true },
        }),
        heroCapabilitiesLabel: fields.text({
          label: "Capabilities label",
          description: 'Sits above the list of what you build, e.g. "What we build".',
        }),
        heroCapabilities: fields.array(fields.text({ label: "Capability" }), {
          label: "Capabilities",
          description: "Short phrases shown under the introduction.",
          itemLabel: (props) => props.value || "Capability",
        }),
        services: sectionField("Services section"),
        featuredProjects: sectionField("Featured work section"),
        whyChooseUs: sectionField("Why choose us section"),
        process: sectionField("Process section"),
        technologies: sectionField("Technologies section"),
        testimonials: sectionField("Testimonials section"),
      },
    }),

    aboutPage: singleton({
      label: "About page",
      path: "src/content/pages/about",
      format: { data: "json" },
      schema: {
        seo: seoField(),
        hero: sectionField("Page header", "Uses {name} for the agency name."),
        heroMeta: fields.object(
          {
            foundedLabel: fields.text({ label: "Founded — label" }),
            teamLabel: fields.text({ label: "Team — label" }),
            teamSuffix: fields.text({
              label: "Team — word after the number",
              description: 'e.g. "specialists", giving "6 specialists".',
            }),
            modelLabel: fields.text({ label: "Model — label" }),
            modelValue: fields.text({ label: "Model — value" }),
            engagementsLabel: fields.text({ label: "Engagements — label" }),
            engagementsValue: fields.text({ label: "Engagements — value" }),
          },
          {
            label: "Header facts",
            description:
              "The four-box strip under the header. The founded year and team size are counted automatically, so only their labels are editable here.",
          },
        ),
        story: fields.object(
          {
            eyebrow: fields.text({ label: "Label" }),
            title: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            paragraphs: fields.array(
              fields.text({ label: "Paragraph", multiline: true }),
              {
                label: "Paragraphs",
                description: "Uses {name} for the agency name.",
                itemLabel: (props) => props.value.slice(0, 60) || "Paragraph",
              },
            ),
          },
          { label: "Our story" },
        ),
        missionVision: sectionField("Mission & vision section"),
        values: sectionField("How we operate section"),
        capabilities: sectionField("Capabilities section"),
        whyUs: sectionField("Why clients work with us section"),
        team: sectionField("Team section"),
        cta: sectionField("Closing call to action"),
      },
    }),

    servicesPage: singleton({
      label: "Services page",
      path: "src/content/pages/services",
      format: { data: "json" },
      schema: {
        seo: seoField(),
        hero: sectionField("Page header"),
        heroMeta: fields.object(
          {
            serviceLinesLabel: fields.text({ label: "Service lines — label" }),
            industriesLabel: fields.text({ label: "Industries — label" }),
            engagementLabel: fields.text({ label: "Engagement — label" }),
            engagementValue: fields.text({ label: "Engagement — value" }),
            deliveryLabel: fields.text({ label: "Delivery — label" }),
            deliveryValue: fields.text({ label: "Delivery — value" }),
          },
          {
            label: "Header facts",
            description:
              "The four-box strip under the header. The service and industry counts are worked out automatically, so only their labels are editable here.",
          },
        ),
        listHeading: fields.text({
          label: "Service list heading",
          description:
            "Read aloud by screen readers before the grid of services; not shown on screen.",
        }),
        industries: sectionField("Industries section"),
        cta: sectionField("Closing call to action"),
        detailCta: sectionField(
          "Single service — closing call to action",
          "Shown at the bottom of every individual service page. Use {service} where the service name should appear.",
        ),
        detail: fields.object(
          {
            overview: sectionField("Overview section"),
            deliverables: sectionField("Deliverables section"),
            useCases: sectionField("Use cases section"),
            faq: sectionField("Questions section"),
            relatedWork: sectionField(
              "Related work section",
              "Use {service} where the service name should appear.",
            ),
            relatedWorkAction: fields.text({
              label: "Related work — button label",
              description: "Links to the full portfolio.",
              validation: { isRequired: true },
            }),
            otherServices: sectionField("Other services section"),
          },
          {
            label: "Single service page",
            description:
              "Section headings shared by every individual service page.",
          },
        ),
      },
    }),

    portfolioPage: singleton({
      label: "Portfolio page",
      path: "src/content/pages/portfolio",
      format: { data: "json" },
      schema: {
        seo: seoField(),
        hero: sectionField("Page header"),
        heroMeta: fields.object(
          {
            caseStudiesLabel: fields.text({ label: "Case studies — label" }),
            industriesLabel: fields.text({ label: "Industries — label" }),
            technologiesLabel: fields.text({ label: "Technologies — label" }),
            disciplinesLabel: fields.text({ label: "Disciplines — label" }),
            disciplinesValue: fields.text({ label: "Disciplines — value" }),
          },
          {
            label: "Header facts",
            description:
              "The four-box strip under the header. The first three counts are worked out from the projects themselves, so only their labels are editable here.",
          },
        ),
        grid: fields.object(
          {
            heading: fields.text({
              label: "List heading",
              description:
                "Read aloud by screen readers before the grid; not shown on screen.",
            }),
            allFilterLabel: fields.text({
              label: '"Everything" filter label',
              description:
                "The first filter, which clears the category. The rest come from the categories on each project.",
            }),
            filtersLabel: fields.text({
              label: "Filter row description",
              description: "Announced to screen readers. Not shown on screen.",
            }),
            countText: fields.text({
              label: "Result count",
              description:
                "Use {visible} for how many are showing and {total} for how many exist.",
            }),
            panelLabel: fields.text({
              label: "Grid description",
              description:
                "Announced to screen readers. Use {category} for the chosen filter.",
            }),
            emptyText: fields.text({
              label: "Nothing-to-show message",
              description: "Shown when a category has no projects in it yet.",
            }),
          },
          { label: "Project grid" },
        ),
        cta: sectionField("Closing call to action"),
        caseStudy: fields.object(
          {
            overview: sectionField("Overview section"),
            overviewFacts: fields.object(
              {
                clientLabel: fields.text({ label: "Client — label" }),
                industryLabel: fields.text({ label: "Industry — label" }),
                timelineLabel: fields.text({ label: "Timeline — label" }),
                yearLabel: fields.text({ label: "Year — label" }),
                platformsLabel: fields.text({ label: "Platforms — label" }),
                teamLabel: fields.text({ label: "Team — label" }),
                servicesHeading: fields.text({
                  label: "Services provided — heading",
                }),
              },
              {
                label: "Overview facts panel",
                description:
                  "Labels for the facts box beside the overview. The values themselves are set on each project.",
              },
            ),
            challenge: sectionField("Challenge section"),
            solution: sectionField("Solution section"),
            objectives: sectionField(
              "Engagement objectives section",
              "The checklist between the challenge and the solution, set per project under the Work collection.",
            ),
            conclusion: sectionField(
              "Conclusion section",
              "Closing block of every case study, set per project under the Work collection.",
            ),
            features: sectionField(
              "Key features section",
              "Use {project} where the project name should appear.",
            ),
            workflow: sectionField("How it works section"),
            gallery: sectionField("Gallery section"),
            techStack: sectionField("Technology stack section"),
            results: sectionField("Results section"),
            related: sectionField("Related projects section"),
            relatedAction: fields.text({
              label: "Related projects button",
              description: "Links to the portfolio listing.",
            }),
            cta: sectionField("Closing call to action"),
          },
          {
            label: "Single project page",
            description:
              "Section headings shared by every individual project page. Sections with no supporting text simply do not show one.",
          },
        ),
      },
    }),

    faqPage: singleton({
      label: "FAQ page",
      path: "src/content/pages/faq",
      format: { data: "json" },
      schema: {
        seo: seoField(),
        hero: sectionField("Page header"),
        cta: sectionField("Closing call to action"),
      },
    }),

    contactPage: singleton({
      label: "Contact page",
      path: "src/content/pages/contact",
      format: { data: "json" },
      schema: {
        seo: seoField("Use {responseTime} to pull in the reply time from Site settings."),
        eyebrow: fields.text({ label: "Label" }),
        title: fields.text({
          label: "Heading",
          validation: { isRequired: true },
        }),
        lead: fields.text({
          label: "Introduction",
          multiline: true,
          validation: { isRequired: true },
        }),
        secondaryParagraph: fields.text({
          label: "Second paragraph",
          multiline: true,
        }),
        callout: fields.object(
          {
            before: fields.text({ label: "Text before the link" }),
            linkLabel: fields.text({ label: "Link text" }),
            after: fields.text({ label: "Text after the link" }),
          },
          {
            label: "Booking callout",
            description:
              "The boxed note beside the form. The link always points at the booking page.",
          },
        ),
        details: fields.object(
          {
            emailLabel: fields.text({ label: "Email — label" }),
            phoneLabel: fields.text({ label: "Phone — label" }),
            locationLabel: fields.text({ label: "Location — label" }),
            hoursLabel: fields.text({ label: "Hours — label" }),
          },
          {
            label: "Contact details panel",
            description:
              "Labels for the four-box strip. The details themselves come from Site settings, so they are only written once.",
          },
        ),
        form: fields.object(
          {
            heading: fields.text({
              label: "Form heading",
              validation: { isRequired: true },
            }),
            intro: fields.text({ label: "Form introduction", multiline: true }),
            fullNameLabel: fields.text({ label: "Full name — label" }),
            fullNamePlaceholder: fields.text({
              label: "Full name — placeholder",
            }),
            emailLabel: fields.text({ label: "Email — label" }),
            emailPlaceholder: fields.text({ label: "Email — placeholder" }),
            companyLabel: fields.text({ label: "Company — label" }),
            companyPlaceholder: fields.text({ label: "Company — placeholder" }),
            phoneLabel: fields.text({ label: "Phone — label" }),
            phonePlaceholder: fields.text({ label: "Phone — placeholder" }),
            projectTypeLabel: fields.text({ label: "Project type — label" }),
            projectTypePlaceholder: fields.text({
              label: "Project type — empty option",
              description:
                "The first, unselected option. The choices themselves are under Contact form options.",
            }),
            budgetLabel: fields.text({ label: "Budget — label" }),
            budgetPlaceholder: fields.text({
              label: "Budget — empty option",
              description:
                "The first, unselected option. The ranges themselves are under Contact form options.",
            }),
            messageLabel: fields.text({ label: "Message — label" }),
            messagePlaceholder: fields.text({
              label: "Message — placeholder",
              multiline: true,
            }),
            requiredHint: fields.text({
              label: "Required-field note",
              description:
                "Read out after the label of a required field. Not shown on screen.",
            }),
            submitLabel: fields.text({ label: "Send button" }),
            submittingLabel: fields.text({
              label: "Send button while sending",
            }),
            errors: fields.object(
              {
                fullName: fields.text({ label: "Name missing or too short" }),
                emailMissing: fields.text({ label: "Email left empty" }),
                emailInvalid: fields.text({ label: "Email does not look valid" }),
                phone: fields.text({ label: "Phone number too short" }),
                projectType: fields.text({ label: "No project type chosen" }),
                message: fields.text({
                  label: "Message too short",
                  multiline: true,
                }),
              },
              {
                label: "Validation messages",
                description:
                  "Shown under a field when someone submits without filling it in correctly.",
              },
            ),
            success: fields.object(
              {
                heading: fields.text({ label: "Heading" }),
                description: fields.text({
                  label: "Message",
                  multiline: true,
                }),
                resetLabel: fields.text({ label: "Send another button" }),
              },
              {
                label: "After a successful send",
                description: "Replaces the form once the enquiry goes through.",
              },
            ),
            failure: fields.object(
              {
                before: fields.text({
                  label: "Text before the email address",
                  multiline: true,
                }),
                after: fields.text({ label: "Text after the email address" }),
              },
              {
                label: "If sending fails",
                description:
                  "Shown above the send button. The email address comes from Site settings.",
              },
            ),
          },
          { label: "Enquiry form" },
        ),
      },
    }),

    bookACallPage: singleton({
      label: "Book a call page",
      path: "src/content/pages/book-a-call",
      format: { data: "json" },
      schema: {
        seo: seoField(),
        eyebrow: fields.text({ label: "Label" }),
        title: fields.text({
          label: "Heading",
          validation: { isRequired: true },
        }),
        lead: fields.text({
          label: "Introduction",
          multiline: true,
          validation: { isRequired: true },
        }),
        assurances: fields.array(fields.text({ label: "Assurance" }), {
          label: "Assurances",
          description: "The short reassuring points under the introduction.",
          itemLabel: (props) => props.value || "Assurance",
        }),
        consultationHeading: fields.text({
          label: "Consultation heading",
          description: "Above the list of what the call covers.",
        }),
        fallback: fields.object(
          {
            before: fields.text({ label: "Text before the email address" }),
            after: fields.text({
              label: "Text after the email address",
              description: "Use {hours} to pull in the office hours.",
              multiline: true,
            }),
          },
          {
            label: "No suitable time note",
            description:
              "The boxed note under the scheduler. The email address comes from Site settings.",
          },
        ),
        scheduler: fields.object(
          {
            calendarTitle: fields.text({
              label: "Calendar frame title",
              description:
                "Names the embedded calendar for screen readers. Not shown on screen.",
            }),
            placeholderHeading: fields.text({ label: "Heading" }),
            placeholderDescription: fields.text({
              label: "Message",
              multiline: true,
            }),
            emailButtonLabel: fields.text({ label: "Email button" }),
            formButtonLabel: fields.text({ label: "Contact form button" }),
          },
          {
            label: "Scheduler panel",
            description:
              "Shown while no booking calendar is connected. Once one is set up, the calendar replaces everything except the frame title.",
          },
        ),
      },
    }),

    sharedCopy: singleton({
      label: "Shared page copy",
      path: "src/content/pages/shared",
      format: { data: "json" },
      schema: {
        finalCta: fields.object(
          {
            eyebrow: fields.text({ label: "Label" }),
            title: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            description: fields.text({
              label: "Supporting text",
              multiline: true,
            }),
            secondaryLabel: fields.text({
              label: "Second button text",
              description: "The outlined button; it always links to Contact.",
            }),
          },
          {
            label: "Default closing call to action",
            description:
              "Used on any page that does not set its own — the home page and single project pages. Editing it changes all of them at once.",
          },
        ),
        techMarqueeLabel: fields.text({
          label: "Tools strip label",
          description:
            "Above the scrolling strip of tools on the home, services and FAQ pages. The tools themselves are under Technologies.",
        }),
        skipLink: fields.text({
          label: "Skip-to-content link",
          description:
            "The first thing a keyboard user reaches on every page; it jumps past the navigation.",
        }),
        actions: fields.object(
          {
            allServices: fields.text({
              label: "Home → all services",
              description: "Button beside the services heading on the home page.",
            }),
            viewAllProjects: fields.text({
              label: "Home → all projects",
              description:
                "Button beside the featured work on the home page, and under it on small screens.",
            }),
            viewOurWork: fields.text({
              label: "Service page → portfolio",
              description:
                "Second button in the header of a single service page.",
            }),
            learnMore: fields.text({
              label: "Service card link",
              description: "The link at the bottom of every service card.",
            }),
            viewCaseStudy: fields.text({
              label: "Project card link",
              description: "The link at the bottom of every project card.",
            }),
          },
          {
            label: "Shared buttons and links",
            description:
              "Labels that repeat on several pages. Editing one changes it everywhere it appears.",
          },
        ),
        breadcrumb: fields.object(
          {
            home: fields.text({ label: "Home" }),
            services: fields.text({ label: "Services" }),
            portfolio: fields.text({ label: "Portfolio" }),
          },
          {
            label: "Breadcrumb names",
            description:
              "The “you are here” trail at the top of single service and project pages. The last item is the page's own title.",
          },
        ),
        statsHeading: fields.text({
          label: "Figures strip heading",
          description:
            "Read aloud by screen readers before the counters; not shown on screen. The figures are under Stats.",
        }),
        footer: fields.object(
          {
            companyTitle: fields.text({ label: "Company column heading" }),
            servicesTitle: fields.text({
              label: "Services column heading",
              description: "The links below it come from the services you add.",
            }),
            technologiesTitle: fields.text({
              label: "Technologies column heading",
            }),
            resourcesTitle: fields.text({ label: "Resources column heading" }),
            ctaText: fields.text({ label: "Footer strip — text" }),
            ctaLinkLabel: fields.text({
              label: "Footer strip — link",
              description: "Always points at the booking page.",
            }),
            copyright: fields.text({
              label: "Copyright line",
              description:
                "Use {year} for the current year and {legalName} for the legal name from Site settings.",
            }),
          },
          { label: "Footer" },
        ),
      },
    }),

    site: singleton({

      label: "Site settings",
      path: "src/content/site",
      format: { data: "json" },
      schema: {
        name: fields.text({
          label: "Agency name",
          validation: { isRequired: true },
        }),
        legalName: fields.text({
          label: "Legal name",
          description: "Used in the footer copyright and structured data.",
          validation: { isRequired: true },
        }),
        tagline: fields.text({ label: "Tagline" }),
        description: fields.text({
          label: "Description",
          description: "Used for search-engine and social previews.",
          multiline: true,
        }),
        shortDescription: fields.text({
          label: "Short description",
          description: "Shown in the footer.",
          multiline: true,
        }),
        url: fields.url({
          label: "Site URL",
          description:
            "Canonical address, e.g. https://thedevrox.com. Overridden by NEXT_PUBLIC_SITE_URL on preview deploys.",
          validation: { isRequired: true },
        }),
        contact: fields.object(
          {
            email: fields.text({ label: "Email" }),
            salesEmail: fields.text({ label: "Sales email" }),
            phone: fields.text({
              label: "Phone",
              description: "As displayed, e.g. +1 (415) 555-0142",
            }),
            phoneHref: fields.text({
              label: "Phone link",
              description: "Dial link, e.g. tel:+14155550142",
            }),
            location: fields.text({ label: "Location line" }),
            address: fields.object(
              {
                line1: fields.text({ label: "Address line" }),
                city: fields.text({ label: "City" }),
                region: fields.text({ label: "Region / state" }),
                country: fields.text({ label: "Country" }),
              },
              { label: "Address" },
            ),
            hours: fields.text({ label: "Opening hours" }),
            responseTime: fields.text({ label: "Response-time promise" }),
          },
          { label: "Contact details" },
        ),
        social: fields.object(
          {
            linkedin: fields.text({ label: "LinkedIn URL" }),
            github: fields.text({ label: "GitHub URL" }),
            x: fields.text({ label: "X URL" }),
          },
          { label: "Social links" },
        ),
        twitterHandle: fields.text({
          label: "X / Twitter handle",
          description: "Including the @, e.g. @devrox",
        }),
        foundedYear: fields.integer({
          label: "Founded year",
          validation: { isRequired: true },
        }),
        /*
         * Kept separate from the contact details above because these are
         * *claims made to search engines*, not display copy. The contact block
         * can hold a placeholder while the site is being built; this block
         * cannot — a fictional phone number or a social link that 404s is read
         * as a low-trust signal. Anything left blank is simply left out of the
         * markup, so filling these in is what switches the extra detail on.
         */
        schema: fields.object(
          {
            telephone: fields.text({
              label: "Phone number",
              description:
                "In international format, e.g. +14155550142. Must be a number that really answers — leave blank otherwise.",
            }),
            foundingDate: fields.text({
              label: "Founding date",
              description: "YYYY or YYYY-MM-DD. Leave blank if unconfirmed.",
            }),
            sameAs: fields.array(fields.text({ label: "Profile URL" }), {
              label: "Verified profiles",
              description:
                "Links to profiles that exist and are yours — LinkedIn, GitHub, X, Crunchbase. A link that 404s does more harm than no link.",
              itemLabel: (props) => props.value || "Profile URL",
            }),
            address: fields.object(
              {
                streetAddress: fields.text({ label: "Street address" }),
                addressLocality: fields.text({ label: "City" }),
                addressRegion: fields.text({ label: "Region / state" }),
                postalCode: fields.text({ label: "Postal code" }),
                addressCountry: fields.text({
                  label: "Country code",
                  description: "Two letters, e.g. PK, US, GB.",
                }),
              },
              { label: "Registered address" },
            ),
          },
          {
            label: "Structured data (verified details only)",
          },
        ),
      },
    }),

    stats: singleton({
      label: "Statistics",
      path: "src/content/stats",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: idField,
            value: fields.integer({
              label: "Number",
              description: "The figure the counter animates towards.",
              defaultValue: 0,
              validation: { isRequired: true },
            }),
            prefix: fields.text({
              label: "Prefix",
              description: 'Shown before the number, e.g. "$". Optional.',
            }),
            suffix: fields.text({
              label: "Suffix",
              description: 'Shown after the number, e.g. "+". Optional.',
            }),
            label: fields.text({
              label: "Label",
              validation: { isRequired: true },
            }),
            detail: fields.text({ label: "Detail line", multiline: true }),
            icon: iconField(),
          }),
          {
            label: "Statistics",
            description:
              "Only publish figures the agency can substantiate if asked.",
            itemLabel: (props) => props.fields.label.value || "Statistic",
          },
        ),
      },
    }),

    why: singleton({
      label: "Why choose us",
      path: "src/content/why",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: idField,
            number: fields.text({
              label: "Number",
              description: 'Two digits, e.g. "01".',
            }),
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({ label: "Description", multiline: true }),
            detail: fields.text({
              label: "Detail",
              description: "Longer supporting line used on the About page.",
              multiline: true,
            }),
            icon: iconField(),
          }),
          {
            label: "Differentiators",
            itemLabel: (props) => props.fields.title.value || "Differentiator",
          },
        ),
      },
    }),

    process: singleton({
      label: "Process steps",
      path: "src/content/process",
      format: { data: "json" },
      schema: {
        outputLabel: fields.text({
          label: "Output prefix",
          description:
            'Introduces each step\'s output, e.g. "Output: " gives "Output: A written problem definition."',
        }),
        items: fields.array(
          fields.object({
            id: idField,
            number: fields.text({
              label: "Number",
              description: 'Two digits, e.g. "01".',
            }),
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            summary: fields.text({ label: "Summary", multiline: true }),
            icon: iconField(),
            activities: fields.array(fields.text({ label: "Activity" }), {
              label: "Activities",
              itemLabel: (props) => props.value || "Activity",
            }),
            output: fields.text({
              label: "Output",
              description: "What exists at the end of the step.",
              multiline: true,
            }),
          }),
          {
            label: "Steps",
            itemLabel: (props) => props.fields.title.value || "Step",
          },
        ),
      },
    }),

    about: singleton({
      label: "Team, values & capabilities",
      path: "src/content/about",
      format: { data: "json" },
      schema: {
        team: fields.array(
          fields.object({
            id: idField,
            name: fields.text({
              label: "Name",
              validation: { isRequired: true },
            }),
            role: fields.text({ label: "Role" }),
            initials: fields.text({
              label: "Initials",
              description: "Two letters — drawn as the monogram avatar.",
            }),
            bio: fields.text({ label: "Biography", multiline: true }),
            focus: fields.array(fields.text({ label: "Focus area" }), {
              label: "Focus areas",
              itemLabel: (props) => props.value || "Focus area",
            }),
            accent: accentField(),
          }),
          {
            label: "Team",
            description:
              "Real people only. Avatars are generated monograms, never stock photography.",
            itemLabel: (props) => props.fields.name.value || "Team member",
          },
        ),
        missionVision: fields.array(
          fields.object({
            id: idField,
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            body: fields.text({ label: "Body", multiline: true }),
            icon: iconField(),
          }),
          {
            label: "Mission & vision",
            itemLabel: (props) => props.fields.title.value || "Pillar",
          },
        ),
        values: fields.array(
          fields.object({
            id: idField,
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            body: fields.text({ label: "Body", multiline: true }),
            icon: iconField(),
          }),
          {
            label: "Values",
            itemLabel: (props) => props.fields.title.value || "Value",
          },
        ),
        capabilities: fields.array(
          fields.object({
            id: idField,
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({ label: "Description", multiline: true }),
            icon: iconField(),
          }),
          {
            label: "Capabilities",
            itemLabel: (props) => props.fields.title.value || "Capability",
          },
        ),
      },
    }),

    faq: singleton({
      label: "FAQ questions",
      path: "src/content/faq",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: idField,
            question: fields.text({
              label: "Question",
              validation: { isRequired: true },
            }),
            answer: fields.text({ label: "Answer", multiline: true }),
            category: fields.select({
              label: "Category",
              options: [
                { label: "Engagement", value: "Engagement" },
                { label: "Technology", value: "Technology" },
                { label: "Delivery", value: "Delivery" },
                { label: "Commercial", value: "Commercial" },
              ],
              defaultValue: "Engagement",
            }),
          }),
          {
            label: "Questions",
            itemLabel: (props) => props.fields.question.value || "Question",
          },
        ),
      },
    }),

    testimonials: singleton({
      label: "Testimonials",
      path: "src/content/testimonials",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: idField,
            quote: fields.text({
              label: "Quote",
              multiline: true,
              validation: { isRequired: true },
            }),
            name: fields.text({ label: "Name" }),
            role: fields.text({ label: "Role" }),
            company: fields.text({ label: "Company" }),
            initials: fields.text({
              label: "Initials",
              description: "Two letters — drawn as the monogram avatar.",
            }),
            accent: accentField(),
            projectSlug: fields.text({
              label: "Related project slug",
              description:
                "Optional. Must match a project slug, e.g. verivoice.",
            }),
          }),
          {
            label: "Testimonials",
            description:
              "Publish real, attributable client feedback only — quotes here are shown as genuine.",
            itemLabel: (props) => props.fields.name.value || "Testimonial",
          },
        ),
      },
    }),

    industries: singleton({
      label: "Industries",
      path: "src/content/industries",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: idField,
            name: fields.text({
              label: "Name",
              validation: { isRequired: true },
            }),
            icon: iconField(),
            description: fields.text({ label: "Description", multiline: true }),
            applications: fields.array(fields.text({ label: "Application" }), {
              label: "Applications",
              itemLabel: (props) => props.value || "Application",
            }),
          }),
          {
            label: "Industries",
            itemLabel: (props) => props.fields.name.value || "Industry",
          },
        ),
      },
    }),

    technologies: singleton({
      label: "Technologies",
      path: "src/content/technologies",
      format: { data: "json" },
      schema: {
        categories: fields.array(
          fields.object({
            id: idField,
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            icon: iconField(),
            description: fields.text({ label: "Description", multiline: true }),
            accent: accentField(),
            items: fields.array(
              fields.object({
                name: fields.text({
                  label: "Name",
                  validation: { isRequired: true },
                }),
                note: fields.text({ label: "Note", multiline: true }),
              }),
              {
                label: "Tools",
                itemLabel: (props) => props.fields.name.value || "Tool",
              },
            ),
          }),
          {
            label: "Categories",
            description:
              "Tools the team actually works with. This is not a partner or certification list.",
            itemLabel: (props) => props.fields.title.value || "Category",
          },
        ),
      },
    }),

    contact: singleton({
      label: "Contact form options",
      path: "src/content/contact",
      format: { data: "json" },
      schema: {
        projectTypes: fields.array(fields.text({ label: "Project type" }), {
          label: "Project types",
          description:
            "Options in the enquiry form's project-type dropdown. These values are submitted with the form, so keep them stable.",
          itemLabel: (props) => props.value || "Project type",
        }),
        budgetRanges: fields.array(fields.text({ label: "Budget range" }), {
          label: "Budget ranges",
          itemLabel: (props) => props.value || "Budget range",
        }),
        consultationPoints: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Consultation points",
            description: "Bullets shown next to the scheduler on Book a Call.",
            itemLabel: (props) => props.fields.title.value || "Point",
          },
        ),
      },
    }),

    legal: singleton({
      label: "Legal pages",
      path: "src/content/legal",
      format: { data: "json" },
      schema: {
        disclaimer: fields.text({
          label: "Disclaimer",
          description:
            "Shown at the top of both legal documents while the copy is placeholder text.",
          multiline: true,
        }),
        effectiveDate: fields.text({
          label: "Effective date",
          description: 'Written out, e.g. "1 January 2026".',
        }),
        effectiveDateLabel: fields.text({
          label: "Effective date prefix",
          description:
            'Introduces the date above each document, e.g. "Effective" gives "Effective 1 January 2026".',
        }),
        privacyPage: legalPageField("Privacy policy — page header"),
        termsPage: legalPageField("Terms of service — page header"),
        privacySections: fields.array(
          fields.object({
            heading: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            paragraphs: fields.array(
              fields.text({ label: "Paragraph", multiline: true }),
              {
                label: "Paragraphs",
                itemLabel: (props) => props.value || "Paragraph",
              },
            ),
          }),
          {
            label: "Privacy policy sections",
            description:
              "Boilerplate, not legal advice — have counsel review before launch.",
            itemLabel: (props) => props.fields.heading.value || "Section",
          },
        ),
        termsSections: fields.array(
          fields.object({
            heading: fields.text({
              label: "Heading",
              validation: { isRequired: true },
            }),
            paragraphs: fields.array(
              fields.text({ label: "Paragraph", multiline: true }),
              {
                label: "Paragraphs",
                itemLabel: (props) => props.value || "Paragraph",
              },
            ),
          }),
          {
            label: "Terms of service sections",
            itemLabel: (props) => props.fields.heading.value || "Section",
          },
        ),
      },
    }),
  },
});
