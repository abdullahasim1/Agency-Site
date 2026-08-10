import { collection, config, fields, singleton } from "@keystatic/core";

import { iconRegistry } from "./src/data/icons";

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

/** Stable machine key for an entry. Changing one can break links, so it is explained. */
const idField = fields.text({
  label: "ID",
  description:
    "Stable internal key. Leave it alone unless you know it is unused — it is not shown on the site.",
  validation: { isRequired: true },
});

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

export default config({
  /*
   * GitHub mode needs a repo, and it is only set in deployed environments.
   * Falling back to local storage keeps `npm run dev` working with no env file
   * and means a missing variable can never silently point the panel at the
   * wrong repository.
   */
  storage:
    process.env.NODE_ENV === "production" && repo
      ? { kind: "github", repo: repo as `${string}/${string}` }
      : { kind: "local" },

  ui: {
    brand: { name: "DevRox" },
    navigation: {
      "Work": ["projects", "services"],
      "Site content": ["site", "stats", "why", "process"],
      "Pages": ["about", "faq", "testimonials", "industries", "technologies"],
      "Forms & legal": ["contact", "legal"],
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
      label: "Projects",
      path: "src/content/projects/*/",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "category"],
      entryLayout: "form",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "Project name, shown on the card and case-study page.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Slug",
            description:
              "The URL segment, e.g. verivoice → /portfolio/verivoice. Changing it breaks existing links.",
          },
        }),
        id: idField,
        tagline: fields.text({
          label: "Tagline",
          description: "Sub-title under the project name.",
        }),
        category: fields.text({
          label: "Category line",
          description: 'Human-readable, e.g. "AI / Voice".',
        }),
        categories: fields.multiselect({
          label: "Filter categories",
          description: "Buckets driving the portfolio filters.",
          options: [
            { label: "AI", value: "AI" },
            { label: "Automation", value: "Automation" },
            { label: "Web Apps", value: "Web Apps" },
            { label: "Mobile", value: "Mobile" },
            { label: "SaaS", value: "SaaS" },
          ],
        }),
        shortDescription: fields.text({
          label: "Short description",
          description: "Card copy.",
          multiline: true,
        }),
        fullDescription: fields.text({
          label: "Full description",
          description: "Opening paragraph of the case study.",
          multiline: true,
        }),
        image: fields.text({
          label: "Cover image path",
          description:
            "Path under /public, e.g. /images/projects/verivoice/cover.svg. Run `npm run art` to generate artwork for a new project.",
        }),
        imageAlt: fields.text({ label: "Cover image alt text" }),
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
            summary: fields.text({ label: "Summary", multiline: true }),
            points: fields.array(fields.text({ label: "Point" }), {
              label: "Points",
              itemLabel: (props) => props.value || "Point",
            }),
          },
          { label: "Challenge" },
        ),
        solution: fields.object(
          {
            summary: fields.text({ label: "Summary", multiline: true }),
            points: fields.array(fields.text({ label: "Point" }), {
              label: "Points",
              itemLabel: (props) => props.value || "Point",
            }),
          },
          { label: "Solution" },
        ),
        results: fields.array(
          fields.object({
            value: fields.text({
              label: "Figure",
              description: 'Headline number, e.g. "68%".',
              validation: { isRequired: true },
            }),
            label: fields.text({ label: "Label" }),
            detail: fields.text({ label: "Detail", multiline: true }),
          }),
          {
            label: "Results",
            description:
              "Only publish figures the client has verified and agreed to. Never an estimate.",
            itemLabel: (props) => props.fields.label.value || "Result",
          },
        ),
        gallery: fields.array(
          fields.object({
            src: fields.text({
              label: "Image path",
              description: "Path under /public.",
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: "Alt text" }),
            caption: fields.text({ label: "Caption", multiline: true }),
          }),
          {
            label: "Gallery",
            itemLabel: (props) => props.fields.caption.value || "Image",
          },
        ),
        workflow: fields.array(
          fields.object({
            id: fields.text({
              label: "ID",
              validation: { isRequired: true },
            }),
            title: fields.text({ label: "Title" }),
            description: fields.text({ label: "Description", multiline: true }),
            tag: fields.text({
              label: "Tag",
              description: 'Short mono label on the node, e.g. "INGEST".',
            }),
          }),
          {
            label: "Workflow diagram nodes",
            itemLabel: (props) => props.fields.title.value || "Node",
          },
        ),
        overview: fields.object(
          {
            client: fields.text({ label: "Client" }),
            industry: fields.text({ label: "Industry" }),
            timeline: fields.text({ label: "Timeline" }),
            year: fields.text({ label: "Year" }),
            platforms: fields.array(fields.text({ label: "Platform" }), {
              label: "Platforms",
              itemLabel: (props) => props.value || "Platform",
            }),
            services: fields.array(fields.text({ label: "Service" }), {
              label: "Services",
              itemLabel: (props) => props.value || "Service",
            }),
            team: fields.text({ label: "Team shape" }),
          },
          { label: "Overview" },
        ),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show this project on the home page.",
        }),
        accent: accentField(),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers come first in the portfolio grid.",
          defaultValue: 100,
        }),
      },
    }),

    services: collection({
      label: "Services",
      path: "src/content/services/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "navLabel"],
      entryLayout: "form",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "Card and page title.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Slug",
            description:
              "The URL segment, e.g. ai-agents → /services/ai-agents. Changing it breaks existing links.",
          },
        }),
        id: idField,
        navLabel: fields.text({
          label: "Navigation label",
          description: "Short form used in the footer and compact lists.",
        }),
        icon: iconField(),
        shortDescription: fields.text({
          label: "Short description",
          description: "One or two sentences for the card.",
          multiline: true,
        }),
        fullDescription: fields.text({
          label: "Full description",
          description: "Opening paragraph on the service page.",
          multiline: true,
        }),
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
        relatedProjects: fields.array(
          fields.text({ label: "Project slug" }),
          {
            label: "Related projects",
            description:
              "Project slugs used to cross-link real work, e.g. verivoice.",
            itemLabel: (props) => props.value || "Project slug",
          },
        ),
        accent: accentField(),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show this service on the home page.",
        }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers come first on the services page.",
          defaultValue: 100,
        }),
      },
    }),
  },

  singletons: {
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
            "Canonical address, e.g. https://www.devrox.com. Overridden by NEXT_PUBLIC_SITE_URL on preview deploys.",
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
        foundedYear: fields.integer({ label: "Founded year" }),
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
      label: "About page",
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
      label: "FAQ",
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
