import { fields, singleton } from "@keystatic/core";
import { accentField, iconField, idField, legalPageField } from "../helpers";

export const stats = singleton({
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
});

export const why = singleton({
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
});

export const process = singleton({
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
});

export const about = singleton({
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
});

export const faq = singleton({
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
});

export const testimonials = singleton({
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
});

export const industries = singleton({
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
});

export const technologies = singleton({
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
});

export const contact = singleton({
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
});

export const legal = singleton({
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
});

