import { fields, singleton } from "@keystatic/core";
import { sectionField, seoField } from "../helpers";

export const homePage = singleton({
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
});

export const aboutPage = singleton({
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
});

export const servicesPage = singleton({
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
    team: fields.object(
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
        platforms: fields.array(
          fields.object({
            name: fields.text({
              label: "Platform name",
              description:
                "Brand name — the logo is matched automatically (e.g. AWS, Microsoft Azure, Claude, n8n). An unknown name shows a lettered chip instead.",
              validation: { isRequired: true },
            }),
            capability: fields.text({
              label: "What the team does with it",
              multiline: true,
            }),
          }),
          {
            label: "Platforms",
            description:
              "The platforms your team specialises in. Each one shows its logo, name and a short line.",
            itemLabel: (props) => props.fields.name.value || "Platform",
          },
        ),
      },
      {
        label: "Our team section",
        description:
          "The band under the services grid — the platforms your team works across.",
      },
    ),
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
});

export const portfolioPage = singleton({
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
});

export const faqPage = singleton({
  label: "FAQ page",
  path: "src/content/pages/faq",
  format: { data: "json" },
  schema: {
    seo: seoField(),
    hero: sectionField("Page header"),
    cta: sectionField("Closing call to action"),
  },
});

