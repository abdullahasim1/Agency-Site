/**
 * Page copy — headings, hero text, section intros and SEO metadata.
 *
 * Content lives in `src/content/pages/*.json`, one file per page, and is edited
 * from the Keystatic admin panel at `/keystatic`. This module keeps the shapes
 * and the exports that the routes and section components read through.
 *
 * A few strings need a value that is not fixed at authoring time (the studio
 * name, the service being viewed, the contact hours). Those are stored with a
 * `{placeholder}` and expanded by `fill()` at render time, so the editor sees
 * ordinary text in the panel rather than template syntax.
 */

import aboutRaw from "@/content/pages/about.json";
import bookACallRaw from "@/content/pages/book-a-call.json";
import contactRaw from "@/content/pages/contact.json";
import faqRaw from "@/content/pages/faq.json";
import homeRaw from "@/content/pages/home.json";
import portfolioRaw from "@/content/pages/portfolio.json";
import servicesRaw from "@/content/pages/services.json";
import sharedRaw from "@/content/pages/shared.json";

/** A section intro: small label above, heading, supporting line. */
export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface SeoCopy {
  title: string;
  description: string;
  keywords: string[];
}

export interface HomeCopy {
  heroHeadline: string;
  /** Rendered as the gradient second line of the h1. */
  heroHeadlineAccent: string;
  heroLead: string;
  heroCapabilitiesLabel: string;
  heroCapabilities: string[];
  services: SectionCopy;
  featuredProjects: SectionCopy;
  whyChooseUs: SectionCopy;
  process: SectionCopy;
  technologies: SectionCopy;
  testimonials: SectionCopy;
}

export interface AboutCopy {
  seo: SeoCopy;
  hero: SectionCopy;
  /** Labels for the facts strip; the figures themselves are counted. */
  heroMeta: {
    foundedLabel: string;
    teamLabel: string;
    teamSuffix: string;
    modelLabel: string;
    modelValue: string;
    engagementsLabel: string;
    engagementsValue: string;
  };
  story: { eyebrow: string; title: string; paragraphs: string[] };
  missionVision: SectionCopy;
  values: SectionCopy;
  capabilities: SectionCopy;
  whyUs: SectionCopy;
  team: SectionCopy;
  cta: SectionCopy;
}

export interface ServicesCopy {
  seo: SeoCopy;
  hero: SectionCopy;
  /** Labels for the facts strip; the counts themselves are derived. */
  heroMeta: {
    serviceLinesLabel: string;
    industriesLabel: string;
    engagementLabel: string;
    engagementValue: string;
    deliveryLabel: string;
    deliveryValue: string;
  };
  /** Screen-reader heading above the grid. */
  listHeading: string;
  industries: SectionCopy;
  cta: SectionCopy;
  /** Closing CTA on a single service page; `{service}` is the service title. */
  detailCta: SectionCopy;
  /** Section headings shared by every single service page. */
  detail: {
    overview: SectionCopy;
    deliverables: SectionCopy;
    useCases: SectionCopy;
    relatedWork: SectionCopy;
    relatedWorkAction: string;
    otherServices: SectionCopy;
  };
}

export interface PortfolioCopy {
  seo: SeoCopy;
  hero: SectionCopy;
  /** Labels for the facts strip; the counts themselves are derived. */
  heroMeta: {
    caseStudiesLabel: string;
    industriesLabel: string;
    technologiesLabel: string;
    disciplinesLabel: string;
    disciplinesValue: string;
  };
  grid: {
    /** Screen-reader heading above the grid. */
    heading: string;
    /** Label of the filter that clears the category. */
    allFilterLabel: string;
    filtersLabel: string;
    /** `{visible}` and `{total}` are the project counts. */
    countText: string;
    /** Screen-reader name of the grid; `{category}` is the active filter. */
    panelLabel: string;
    /** Shown when a category has no projects. */
    emptyText: string;
  };
  cta: SectionCopy;
  /** Section headings shared by every single project page. */
  caseStudy: {
    overview: SectionCopy;
    /** Labels for the facts panel; the values come from the project. */
    overviewFacts: {
      clientLabel: string;
      industryLabel: string;
      timelineLabel: string;
      yearLabel: string;
      platformsLabel: string;
      teamLabel: string;
      servicesHeading: string;
    };
    challenge: SectionCopy;
    solution: SectionCopy;
    /** `{project}` is the project title. */
    features: SectionCopy;
    workflow: SectionCopy;
    gallery: SectionCopy;
    techStack: SectionCopy;
    results: SectionCopy;
    related: SectionCopy;
    relatedAction: string;
    cta: SectionCopy;
  };
}

export interface FaqCopy {
  seo: SeoCopy;
  hero: SectionCopy;
  cta: SectionCopy;
}

/** Every label, placeholder and message in the enquiry form. */
export interface ContactFormCopy {
  heading: string;
  intro: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  projectTypeLabel: string;
  projectTypePlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  /** Read after the label of a required field; not shown on screen. */
  requiredHint: string;
  submitLabel: string;
  submittingLabel: string;
  /** Shown under a field when its value is missing or unusable. */
  errors: {
    fullName: string;
    emailMissing: string;
    emailInvalid: string;
    phone: string;
    projectType: string;
    message: string;
  };
  success: { heading: string; description: string; resetLabel: string };
  /** Split around the inline email link shown when sending fails. */
  failure: { before: string; after: string };
}

export interface ContactCopy {
  seo: SeoCopy;
  eyebrow: string;
  title: string;
  lead: string;
  secondaryParagraph: string;
  /** Split around the inline link so the markup stays in the component. */
  callout: { before: string; linkLabel: string; after: string };
  /** Labels for the details list; the values come from site settings. */
  details: {
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    hoursLabel: string;
  };
  form: ContactFormCopy;
}

export interface BookACallCopy {
  seo: SeoCopy;
  eyebrow: string;
  title: string;
  lead: string;
  assurances: string[];
  consultationHeading: string;
  /** Split around the inline email link. `{hours}` is the office hours. */
  fallback: { before: string; after: string };
  /** Copy for the booking panel, shown until a calendar is connected. */
  scheduler: {
    calendarTitle: string;
    placeholderHeading: string;
    placeholderDescription: string;
    emailButtonLabel: string;
    formButtonLabel: string;
  };
}

export interface SharedCopy {
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    secondaryLabel: string;
  };
  /** Line above the scrolling technology strip. */
  techMarqueeLabel: string;
  /** Keyboard-only link that jumps past the header. */
  skipLink: string;
  /** Button and link labels that repeat across several pages. */
  actions: {
    allServices: string;
    viewAllProjects: string;
    viewOurWork: string;
    learnMore: string;
    viewCaseStudy: string;
  };
  /** Names of the fixed pages in the "you are here" trail. */
  breadcrumb: { home: string; services: string; portfolio: string };
  /** Screen-reader heading above the figures strip. */
  statsHeading: string;
  footer: {
    companyTitle: string;
    servicesTitle: string;
    technologiesTitle: string;
    resourcesTitle: string;
    ctaText: string;
    ctaLinkLabel: string;
    /** `{year}` and `{legalName}` are filled in at render time. */
    copyright: string;
  };
}

export const homeCopy = homeRaw as unknown as HomeCopy;
export const aboutCopy = aboutRaw as unknown as AboutCopy;
export const servicesCopy = servicesRaw as unknown as ServicesCopy;
export const portfolioCopy = portfolioRaw as unknown as PortfolioCopy;
export const faqCopy = faqRaw as unknown as FaqCopy;
export const contactCopy = contactRaw as unknown as ContactCopy;
export const bookACallCopy = bookACallRaw as unknown as BookACallCopy;
export const sharedCopy = sharedRaw as unknown as SharedCopy;

/**
 * Expands `{placeholder}` tokens in editable copy.
 *
 * Unknown tokens are left as written rather than blanked, so a typo in the
 * panel shows up visibly instead of silently deleting part of a sentence.
 */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}
