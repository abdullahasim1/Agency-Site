import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

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
  const url = new URL(path, siteConfig.url).toString();
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

/** Organisation JSON-LD, emitted once from the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    areaServed: "Worldwide",
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.x,
    ],
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
  };
}

/** Case-study JSON-LD for /portfolio/[slug]. */
export function caseStudySchema(options: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: options.title,
    description: options.description,
    url: new URL(options.path, siteConfig.url).toString(),
    image: new URL(options.image, siteConfig.url).toString(),
    datePublished: options.datePublished,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

/** Service JSON-LD for /services/[slug]. */
export function serviceSchema(options: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.title,
    description: options.description,
    url: new URL(options.path, siteConfig.url).toString(),
    provider: { "@type": "Organization", name: siteConfig.name },
    areaServed: "Worldwide",
  };
}

/** FAQ JSON-LD for /faq. */
export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Breadcrumb JSON-LD used on nested pages. */
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, siteConfig.url).toString(),
    })),
  };
}
