import { collection, fields } from "@keystatic/core";
import {
  accentField,
  devOnly,
  iconField,
  idField,
  keyPatternValidation,
} from "../helpers";

export const services = collection({
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
      description:
        "Technologies are drawn from the master list (Frontend, Backend, Database, AI, Automation, Communication, Cloud / Deployment). Type the exact name as it appears, e.g. “React”, “OpenAI”, “PostgreSQL”.",
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
});
