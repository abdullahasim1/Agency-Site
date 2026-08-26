import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** Absolute URL from a site-relative path. */
function abs(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  /** Defaults to the route's generated Open Graph image. */
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}

/**
 * Single place that assembles page metadata, so canonical URLs, Open Graph and
 * Twitter cards stay consistent across every route.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
}: BuildMetadataOptions): Metadata {
  const url = abs(path);
  const ogImage = image ?? ogImageUrl(title, path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
      images: [{ url: ogImage, width: OG_WIDTH, height: OG_HEIGHT, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [ogImage],
    },
  };
}

/** First path segment ("services", "portfolio", …) becomes the card's label. */
function sectionLabel(path: string): string {
  const segment = path.split("/").filter(Boolean)[0];
  return segment ? segment.replace(/-/g, " ") : "Studio";
}

/** Absolute URL for the shared dynamic Open Graph image at /og. */
function ogImageUrl(title: string, path: string): string {
  const url = new URL("/og", siteConfig.url);
  url.searchParams.set("title", title);
  url.searchParams.set("label", sectionLabel(path));
  return url.toString();
}

/* ------------------------------------------------------------------------- *
 * Structured data
 *
 * Everything below builds *nodes* — objects with a stable `@id` and no
 * `@context` of their own. The two wrappers, siteGraph() and pageGraph(), are
 * what get serialised into a <script type="application/ld+json">, each as a
 * single `@graph`.
 *
 * The point of the `@id`s is that a crawler can join the pieces up: the page
 * node says `isPartOf` the website, the website says its `publisher` is the
 * organisation, and the service or case study on the page points back at the
 * same organisation rather than repeating a second, unrelated copy of it.
 * ------------------------------------------------------------------------- */

const SCHEMA_CONTEXT = "https://schema.org";

/** Stable identifiers. These strings are the join keys of the whole graph. */
const ID = {
  organization: `${siteConfig.url}/#organization`,
  website: `${siteConfig.url}/#website`,
  logo: `${siteConfig.url}/#logo`,
  page: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  faq: (path: string) => `${abs(path)}#faq`,
  service: (path: string) => `${abs(path)}#service`,
  work: (path: string) => `${abs(path)}#work`,
} as const;

type Node = Record<string, unknown>;

/** A reference to another node in the same graph. */
const ref = (id: string) => ({ "@id": id });

/** Drops keys whose value is empty, so a blank config field emits no claim. */
function present(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }),
  );
}

/**
 * The organisation.
 *
 * `telephone`, `address`, `sameAs` and `foundingDate` come from
 * `siteConfig.schema`, which is empty until real details are entered in the
 * Keystatic panel — see the comment on `SiteConfig.schema` in src/data/site.ts
 * for why the placeholders on the page are deliberately not repeated here.
 */
export function organizationSchema(): Node {
  const { schema } = siteConfig;
  const address = present(schema.address);

  return present({
    "@type": ["Organization", "ProfessionalService"],
    "@id": ID.organization,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.legalName,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    areaServed: "Worldwide",
    logo: {
      "@type": "ImageObject",
      "@id": ID.logo,
      url: abs("/icon.svg"),
      contentUrl: abs("/icon.svg"),
      caption: siteConfig.name,
    },
    image: ref(ID.logo),
    knowsAbout: [
      "Artificial Intelligence",
      "AI Automation",
      "AI Agents",
      "Voice AI",
      "Workflow Automation",
      "Web Application Development",
      "Mobile Application Development",
      "Custom Software Development",
      "CRM Automation",
      "API Integration",
    ],
    telephone: schema.telephone,
    foundingDate: schema.foundingDate,
    sameAs: schema.sameAs,
    address:
      Object.keys(address).length > 0
        ? { "@type": "PostalAddress", ...address }
        : undefined,
  });
}

/** The site itself, so pages have something to be `isPartOf`. */
function websiteSchema(): Node {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: ref(ID.organization),
  };
}

/**
 * Site-wide graph, emitted once from the (site) layout. Every page's own graph
 * refers back into it by `@id`, so these two nodes are stated in one place.
 */
export function siteGraph() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [organizationSchema(), websiteSchema()],
  };
}

/** Breadcrumb node, joined into the page graph. */
function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
  path = crumbs[crumbs.length - 1]?.path ?? "/",
): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": ID.breadcrumb(path),
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

/** FAQ node, joined into the page graph. */
function faqSchema(
  items: Array<{ question: string; answer: string }>,
  path = "/faq",
): Node {
  return {
    "@type": "FAQPage",
    "@id": ID.faq(path),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Service node for /services/[slug]. */
export function serviceSchema(options: {
  title: string;
  description: string;
  path: string;
  /** Becomes an OfferCatalog — these are the service's own deliverables. */
  deliverables?: string[];
  serviceType?: string;
}): Node {
  return present({
    "@type": "Service",
    "@id": ID.service(options.path),
    name: options.title,
    description: options.description,
    url: abs(options.path),
    serviceType: options.serviceType,
    provider: ref(ID.organization),
    areaServed: "Worldwide",
    mainEntityOfPage: ref(ID.page(options.path)),
    hasOfferCatalog: options.deliverables?.length
      ? {
          "@type": "OfferCatalog",
          name: `${options.title} deliverables`,
          itemListElement: options.deliverables.map((deliverable) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: deliverable },
          })),
        }
      : undefined,
  });
}

/** Case-study node for /portfolio/[slug]. */
export function caseStudySchema(options: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
}): Node {
  return present({
    "@type": "CreativeWork",
    "@id": ID.work(options.path),
    name: options.title,
    headline: options.title,
    description: options.description,
    url: abs(options.path),
    image: abs(options.image),
    inLanguage: "en",
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    keywords: options.keywords,
    author: ref(ID.organization),
    publisher: ref(ID.organization),
    isPartOf: ref(ID.website),
    mainEntityOfPage: ref(ID.page(options.path)),
  });
}

/**
 * Blog-posting node for /blog/[slug]. Uses the dynamic /og card as the post
 * image so every article ships a valid image without needing artwork.
 */
export function articleSchema(options: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  keywords?: string[];
}): Node {
  return present({
    "@type": "BlogPosting",
    "@id": `${abs(options.path)}#article`,
    name: options.title,
    headline: options.title,
    description: options.description,
    url: abs(options.path),
    image: ogImageUrl(options.title, options.path),
    inLanguage: "en",
    datePublished: options.datePublished,
    dateModified: options.datePublished,
    keywords: options.keywords,
    author: ref(ID.organization),
    publisher: ref(ID.organization),
    isPartOf: ref(ID.website),
    mainEntityOfPage: ref(ID.page(options.path)),
  });
}

/** WebPage subtypes we use. FAQPage is itself a WebPage in schema.org. */
type PageType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "FAQPage";

interface PageGraphOptions {
  path: string;
  title: string;
  description: string;
  type?: PageType;
  crumbs?: Array<{ name: string; path: string }>;
  /** Question/answer pairs. Omitted entirely when the list is empty. */
  faq?: Array<{ question: string; answer: string }>;
  /** Page-specific nodes — the Service, the case study, and so on. */
  nodes?: Node[];
  image?: string;
}

/**
 * Per-page graph: the WebPage node, its breadcrumb, and whatever the route
 * itself is about. Emitted as the page's single JSON-LD block.
 */
export function pageGraph({
  path,
  title,
  description,
  type = "WebPage",
  crumbs,
  faq,
  nodes = [],
  image,
}: PageGraphOptions) {
  const hasFaq = Boolean(faq && faq.length > 0);
  /* On /faq the questions *are* the page, so they hang off the page node
     directly. Elsewhere they are one section of a larger page, which is a
     separate FAQPage node the page node declares as a part. */
  const faqIsThePage = type === "FAQPage" && hasFaq;

  const page = present({
    "@type": type,
    "@id": ID.page(path),
    url: abs(path),
    name: title,
    description,
    inLanguage: "en",
    isPartOf: ref(ID.website),
    about: ref(ID.organization),
    primaryImageOfPage: image
      ? { "@type": "ImageObject", url: abs(image) }
      : undefined,
    breadcrumb: crumbs?.length ? ref(ID.breadcrumb(path)) : undefined,
    mainEntity: faqIsThePage
      ? faq!.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        }))
      : undefined,
    hasPart: hasFaq && !faqIsThePage ? ref(ID.faq(path)) : undefined,
  });

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      page,
      ...(crumbs?.length ? [breadcrumbSchema(crumbs, path)] : []),
      ...(hasFaq && !faqIsThePage ? [faqSchema(faq!, path)] : []),
      ...nodes,
    ],
  };
}
