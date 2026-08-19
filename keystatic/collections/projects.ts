import { collection, fields } from "@keystatic/core";
import { galleryField } from "../fields/gallery";
import {
  accentField,
  devOnly,
  iconField,
  idField,
  keyPatternValidation,
} from "../helpers";

export const projects = collection({
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
      description:
        "Technologies are drawn from the master list (Frontend, Backend, Database, AI, Automation, Communication, Cloud / Deployment). Type the exact name as it appears, e.g. “React”, “OpenAI”, “PostgreSQL”.",
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
    gallery: galleryField({
      label: "Gallery",
      description:
        "Interface screens. The first image spans the full width. Pick several files at once with Upload — each image gets its own alt text and caption beside the preview.",
    }),
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
    advanced: fields.object(
      {
        rawJson: fields.text({
          label: "Raw JSON (advanced)",
          description:
            "Paste the complete project JSON here to override every field in this form. Leave empty to use the form values. Malformed JSON is ignored and the form is used instead.",
          multiline: true,
        }),
        galleryUrls: fields.text({
          label: "Bulk gallery images",
          description:
            "Optional. Add several gallery images at once — one image URL or /images/... path per line. Appended to the gallery above when saved.",
          multiline: true,
        }),
      },
      {
        label: "Advanced — JSON & bulk images",
        description:
          "Power-user options: override the entry with raw JSON, or add many gallery images in one paste.",
        layout: [12, 12],
      },
    ),
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
});
