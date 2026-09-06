import { collection, fields } from "@keystatic/core";
import { galleryField } from "../fields/gallery";
import {
  accentField,
  devOnly,
  iconField,
  keyPatternValidation,
} from "../helpers";

const SAMPLE_PROJECT_JSON = `{
  "title": "Project Name Here",
  "basics": {
    "id": "prj-example",
    "tagline": "Short compelling tagline describing the project"
  },
  "category": "AI / Automation",
  "categories": [
    "AI",
    "Automation"
  ],
  "listing": {
    "shortDescription": "1-2 sentence description shown on the portfolio card grid.",
    "fullDescription": "2-3 sentences lead paragraph on the hero case-study page explaining what the project is and what was delivered."
  },
  "technologies": [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "OpenAI"
  ],
  "techStack": [
    {
      "group": "Frontend",
      "items": [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS"
      ]
    },
    {
      "group": "AI & Automation",
      "items": [
        "OpenAI",
        "n8n",
        "Python"
      ]
    }
  ],
  "features": [
    {
      "title": "Smart Automation Flow",
      "description": "Automates lead ingestion and processing end-to-end.",
      "icon": "Sparkles"
    },
    {
      "title": "Real-time Processing",
      "description": "Processes data through webhooks with sub-second latency.",
      "icon": "Zap"
    }
  ],
  "challenge": {
    "summary": "The client spent 20+ hours a week manually copying and routing records across platforms, leading to errors and delays.",
    "points": [
      {
        "icon": "Layers",
        "title": "Manual bottlenecks",
        "description": "Manual entry caused delays and missed customer follow-ups."
      },
      {
        "icon": "Puzzle",
        "title": "Fragmented data",
        "description": "Customer data was scattered across 4 different platforms."
      }
    ]
  },
  "solution": {
    "summary": "We engineered an automated pipeline that connects all platforms, parses incoming data with AI, and syncs status in real time.",
    "points": [
      {
        "icon": "Webhook",
        "title": "Unified pipeline",
        "description": "Automated webhook handlers ingest and validate incoming data."
      },
      {
        "icon": "Brain",
        "title": "AI routing",
        "description": "AI models categorize and prioritize records automatically."
      }
    ]
  },
  "objectives": [
    "Eliminate manual data entry across departments",
    "Reduce processing time from 48 hours to under 5 minutes",
    "Ensure 99.9% data accuracy with automated validation"
  ],
  "closing": {
    "clientOverview": "B2B SaaS startup scaling from seed to Series A with an expanding customer base.",
    "conclusion": "The automated system completely eliminated manual bottlenecks, giving the team their time back to focus on high-value client relationships."
  },
  "results": [
    {
      "value": "85%",
      "label": "Time saved",
      "detail": "Over 20 hours saved weekly across the operations team."
    },
    {
      "value": "< 5m",
      "label": "Processing speed",
      "detail": "Tasks that took 2 days now complete in under 5 minutes."
    }
  ],
  "workflow": [
    {
      "id": "w1",
      "tag": "INGEST",
      "title": "Data Received",
      "description": "Webhook catches new records from external tools."
    },
    {
      "id": "w2",
      "tag": "PROCESS",
      "title": "AI Classification",
      "description": "AI analyzes content and assigns correct routing tags."
    },
    {
      "id": "w3",
      "tag": "SYNC",
      "title": "CRM Sync",
      "description": "Cleaned data is pushed directly to the client database."
    }
  ],
  "workflowLayout": "linear",
  "overview": {
    "client": "Confidential Client",
    "industry": "SaaS / AI Automation",
    "timeline": "8 weeks",
    "year": "2026",
    "platforms": [
      "Web Application",
      "API"
    ],
    "services": [
      "AI Automation",
      "Custom Software Development"
    ],
    "team": "2 engineers, 1 lead"
  },
  "featured": true,
  "accent": "brand",
  "order": 50
}`;

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
        description:
          "Project name, shown on the card and case-study page. Not required if you're using Raw JSON.",
        validation: { isRequired: false },
      },
      slug: {
        label: "URL slug",
        description: devOnly(
          "This becomes /portfolio/slug. Avoid changing after publish — existing links break.",
        ),
      },
    }),
    basics: fields.object(
      {
        id: fields.text({
          label: "Internal ID",
          description: devOnly(
            "not shown on the site. Used as a stable key by the data layer — changing it breaks saved references.",
          ),
          validation: {
            isRequired: false,
            pattern: keyPatternValidation,
          },
        }),
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
          "The project's stable machine key and the tagline under the title. Not required if using Raw JSON.",
        layout: [6, 6],
      },
    ),
    category: fields.text({
      label: "Card category",
      description: 'Short line on cards, e.g. "AI / Voice".',
    }),
    categories: fields.multiselect({
      label: "Portfolio filters",
      description:
        "Choose where this project appears in the portfolio filters.",
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
        description:
          "The short card text and the lead paragraph of the case study.",
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
          validation: { isRequired: false },
        }),
        imageAlt: fields.text({
          label: "Cover image alt text",
          description:
            "Describes the image for screen readers and search engines.",
        }),
      },
      {
        label: "Cover image",
        description:
          "The artwork shown on the portfolio card and the case-study hero.",
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
              description: 'Short heading, e.g. "Fragmented customer data".',
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
      {
        label: "Business Challenge",
        description:
          "The situation before the engagement, in the client's terms.",
      },
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
              description:
                'Short heading, e.g. "Schema modelled on the real pipeline".',
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
      {
        label: "Solution Design",
        description: "What we built, mirroring the challenge cards above it.",
      },
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
            description: 'What the figure measures, e.g. "Faster onboarding".',
            validation: { isRequired: true },
          }),
          detail: fields.text({
            label: "Detail",
            description:
              "One or two sentences explaining the figure in context.",
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
        description:
          "The system flow, one node per step. 3–6 nodes reads best.",
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
        sampleTemplate: fields.text({
          label: "📋 Sample JSON Template (Copy from here)",
          description:
            "COPY THIS TEMPLATE to create your project JSON. Notice: You DO NOT need to add any image path in the JSON! Simply select & upload your image in the 'Cover image' section above, and it will be linked automatically.",
          multiline: true,
          defaultValue: SAMPLE_PROJECT_JSON,
        }),
        rawJson: fields.text({
          label: "Raw JSON (Paste your project JSON here)",
          description:
            "Paste your customized project JSON here to populate the project. You DO NOT need any image path inside this JSON — the cover image you upload in the 'Cover image' section above is automatically linked! Leave empty to use form fields.",
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
        label: "Advanced — JSON Import & Sample Template",
        description:
          "Copy the sample JSON template, customize your project data, and paste it into Raw JSON. Upload your cover image in the Cover image section above — no manual image paths needed!",
        layout: [12, 12, 12],
      },
    ),
    overview: fields.object(
      {
        client: fields.text({
          label: "Client",
          description: 'Name, or "Confidential" if undisclosed.',
          validation: { isRequired: false },
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
