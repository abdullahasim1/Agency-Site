import { fields, singleton } from "@keystatic/core";
import { seoField } from "../helpers";

export const contactPage = singleton({
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
});

export const bookACallPage = singleton({
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
});

export const sharedCopy = singleton({
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
});

