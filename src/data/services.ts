/**
 * Service catalogue.
 *
 * Content lives as one JSON file per service under `src/content/services/` and
 * is edited from the Keystatic admin panel at `/keystatic` — adding, editing or
 * removing a service never requires a code change. This module keeps the shapes
 * and the selectors the pages read through.
 *
 * Each service is its own file, so entries are read via the Keystatic Reader
 * rather than a synchronous import, which makes every selector here async. All
 * callers are Server Components or build-time functions.
 */

import type { IconName } from "./icons";
import { reader } from "./reader";

interface ServiceDeliverable {
  title: string;
  description: string;
}

interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  /** Card + page title. */
  title: string;
  /** Short label used in the footer and compact lists. */
  navLabel: string;
  icon: IconName;
  /** One or two sentences for the card. */
  shortDescription: string;
  /** Opening paragraph on the service detail page. */
  fullDescription: string;
  /** Technology badges shown on the card. */
  technologies: string[];
  /** What the client actually receives. */
  deliverables: ServiceDeliverable[];
  /** Concrete situations this service is the right fit for. */
  useCases: string[];
  /**
   * Buying questions for this service, written in the Keystatic panel.
   *
   * Optional on purpose: an empty list renders no FAQ section and emits no
   * FAQPage markup, so a service without real questions never ships invented
   * ones. This is the surface answer engines quote from, which is why it is
   * per-service rather than only on /faq.
   */
  faq?: ServiceFaq[];
  /** Slugs from projects.ts used to cross-link real work. */
  relatedProjects: string[];
  accent: "brand" | "violet" | "cyan";
  featured: boolean;
  /** Controls ordering on the services page; lower comes first. */
  order: number;
}

/* ---------------------------------------------------------------------------
   Selectors — pages read through these rather than filtering inline.

   `getServices()` is the single reader call; everything else derives from it,
   and the result is cached for the lifetime of the build.
--------------------------------------------------------------------------- */

let servicesPromise: Promise<Service[]> | undefined;

/**
 * The Keystatic form groups the flat service fields into collapsible sections
 * (`basics`, `listing`) so the panel stays manageable. The stored JSON is
 * nested accordingly, so it is flattened back here — pages and components only
 * ever see the flat `Service` shape.
 */
const flatten = (entry: Record<string, unknown>): Omit<Service, "slug"> => {
  const { basics, listing, ...rest } = entry as Record<
    string,
    Record<string, unknown>
  >;
  return {
    ...rest,
    ...basics,
    ...listing,
  } as unknown as Omit<Service, "slug">;
};

/** All services in catalogue order (lowest `order` first). */
export function getServices(): Promise<Service[]> {
  servicesPromise ??= reader.collections.services.all().then((entries) =>
    entries
      .map(({ slug, entry }) => ({ ...flatten(entry), slug }) as unknown as Service)
      .sort((a, b) => a.order - b.order),
  );
  return servicesPromise;
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices();
  return services.filter((service) => service.featured);
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((service) => service.slug === slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((service) => service.slug);
}
