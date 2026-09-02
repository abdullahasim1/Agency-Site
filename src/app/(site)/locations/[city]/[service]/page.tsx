import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin, Building2, Globe } from "lucide-react";

import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRIMARY_CTA } from "@/data/navigation";
import { sharedCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";
import {
  locations,
  locationServices,
  resolveLocationTemplate,
  getLocationPaths,
} from "@/data/locations";
import { buildMetadata, pageGraph, serviceSchema } from "@/lib/seo";

interface LocationPageProps {
  params: Promise<{ city: string; service: string }>;
}

export async function generateStaticParams() {
  return getLocationPaths().map(({ city, service }) => ({ city, service }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { city, service } = await params;
  const cityData = locations.find((c) => c.slug === city);
  const serviceData = locationServices[service];

  if (!cityData || !serviceData) {
    return {
      title: "Page Not Found",
      description: "This page is no longer available.",
      robots: { index: false, follow: true },
    };
  }

  const title = resolveLocationTemplate(
    `${serviceData.title} in ${cityData.name}, ${cityData.stateCode} | DevRox`,
    cityData,
  );
  const description = resolveLocationTemplate(
    serviceData.metaDescription,
    cityData,
  );

  return buildMetadata({
    title,
    description,
    path: `/locations/${city}/${service}`,
    keywords: [
      serviceData.title.toLowerCase(),
      `${serviceData.title.toLowerCase()} ${cityData.name.toLowerCase()}`,
      `${serviceData.title.toLowerCase()} ${cityData.name.toLowerCase()} ${cityData.stateCode.toLowerCase()}`,
      `AI agency ${cityData.name.toLowerCase()}`,
      `software development ${cityData.name.toLowerCase()}`,
      `${cityData.state.toLowerCase()} tech services`,
    ],
  });
}

export default async function LocationServicePage({ params }: LocationPageProps) {
  const { city, service } = await params;
  const cityData = locations.find((c) => c.slug === city);
  const serviceData = locationServices[service];

  if (!cityData || !serviceData) notFound();

  const r = (template: string) => resolveLocationTemplate(template, cityData);
  const path = `/locations/${city}/${service}`;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-ink-200 pt-28 pb-14 sm:pt-32 lg:pt-40 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[80px]"
        />

        <Container>
          <div className="max-w-4xl">
            <Reveal y={12}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                <MapPin className="size-3.5" />
                {r(serviceData.heroEyebrow)}
              </span>
            </Reveal>

            <Reveal delay={0.08} y={14}>
              <h1 className="type-display mt-6">
                {r(serviceData.heroTitle)}
              </h1>
            </Reveal>

            <Reveal delay={0.16} y={14}>
              <p className="type-lead mt-5 max-w-3xl text-ink-600">
                {r(serviceData.heroDescription)}
              </p>
            </Reveal>

            <Reveal delay={0.24} y={14}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={PRIMARY_CTA.href} size="lg">
                  {PRIMARY_CTA.label}
                </Button>
                <Button href={`/services/${serviceData.serviceSlug}`} size="lg" variant="secondary">
                  {sharedCopy.actions.learnMore}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Local context */}
      <section className="section-y-sm">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
            <SectionHeading
              eyebrow={`About ${cityData.name}`}
              title={`Why ${cityData.name} Businesses Choose DevRox`}
              description={r(serviceData.localProblem)}
            />
            <Reveal>
              <p className="type-lead text-ink-600">
                {r(serviceData.localSolution)}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <Reveal>
            <Eyebrow>Proven Results</Eyebrow>
            <h2 className="type-h3 mt-4">
              {serviceData.title} Results That Matter
            </h2>
          </Reveal>

          <Stagger
            as="ul"
            stagger={0.08}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {serviceData.localStats.map((stat) => (
              <StaggerItem as="li" key={stat.label} className="h-full">
                <GlowCard accent="brand" padding="lg" className="text-center">
                  <div className="type-display text-brand-600">{stat.value}</div>
                  <p className="mt-2 text-sm text-ink-600">{stat.label}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Tech sectors */}
      <section className="section-y-sm">
        <Container>
          <Reveal>
            <Eyebrow>Industries We Serve</Eyebrow>
            <h2 className="type-h3 mt-4">
              {serviceData.title} for {cityData.name}&apos;s Key Industries
            </h2>
            <p className="type-lead mt-4 max-w-2xl text-ink-600">
              {cityData.localContext}
            </p>
          </Reveal>

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cityData.techSectors.map((sector) => (
              <StaggerItem as="li" key={sector} className="h-full">
                <div className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white p-5">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                  >
                    <Building2 className="size-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-800">{sector}</h3>
                    <p className="mt-1 text-sm text-ink-600">
                      Custom {serviceData.title.toLowerCase()} solutions tailored to {sector.toLowerCase()} workflows.
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Nearby areas */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <Reveal>
            <Eyebrow>Service Area</Eyebrow>
            <h2 className="type-h3 mt-4">
              Also Serving the Greater {cityData.name} Area
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-3">
            {cityData.nearbyAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700"
              >
                <MapPin className="size-3.5 text-brand-500" />
                {area}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title={`Frequently Asked Questions About ${serviceData.title} in ${cityData.name}`}
            description={`Common questions from ${cityData.name} businesses about our ${serviceData.title.toLowerCase()} services.`}
          />

          <div className="mt-10 max-w-3xl space-y-4">
            {serviceData.faq.map((item) => (
              <Reveal key={item.question}>
                <details className="group rounded-card border border-ink-200 bg-white p-5 sm:p-6">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink-800">
                    {r(item.question)}
                    <ArrowUpRight className="size-4 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {r(item.answer)}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Location info */}
      <section className="section-y-sm">
        <Container>
          <div className="rounded-card border border-ink-200 bg-white p-8 sm:p-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="type-h4">DevRox {cityData.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {cityData.description}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 size-4 text-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-ink-800">Serving</p>
                    <p className="text-sm text-ink-600">
                      {cityData.name}, {cityData.state} and surrounding areas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-4 text-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-ink-800">Industries</p>
                    <p className="text-sm text-ink-600">
                      {cityData.techSectors.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button href={PRIMARY_CTA.href} size="md">
                    {`Talk to a ${cityData.name} Expert`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Ready to Start?"
        title={`Let's Build Something Great for Your ${cityData.name} Business`}
        description={`Book a free consultation and discover how ${serviceData.title.toLowerCase()} can transform your ${cityData.name} operations.`}
      />

      <JsonLd
        data={pageGraph({
          path,
          title: r(serviceData.heroTitle),
          description: resolveLocationTemplate(
            serviceData.metaDescription,
            cityData,
          ),
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Locations", path: "/#locations" },
            { name: `${cityData.name}, ${cityData.stateCode}`, path },
          ],
          faq: serviceData.faq.map((item) => ({
            question: r(item.question),
            answer: r(item.answer),
          })),
          nodes: [
            serviceSchema({
              title: r(serviceData.heroTitle),
              description: resolveLocationTemplate(
                serviceData.metaDescription,
                cityData,
              ),
              path,
              serviceType: serviceData.title,
            }),
            localBusinessSchema(cityData, serviceData.serviceSlug),
          ],
        })}
      />
    </>
  );
}

/**
 * LocalBusiness schema for the specific location — signals to Google that
 * DevRox serves businesses in this geographic area.
 */
function localBusinessSchema(
  city: (typeof locations)[0],
  serviceSlug: string,
) {
  return {
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/locations/${city.slug}/${serviceSlug}#localbusiness`,
    name: `DevRox — ${city.name}`,
    description: `AI automation, custom software development, and web application services for ${city.name}, ${city.state} businesses.`,
    url: `${siteConfig.url}/locations/${city.slug}/${serviceSlug}`,
    email: siteConfig.contact.email,
    telephone: siteConfig.schema.telephone,
    areaServed: [
      {
        "@type": "City",
        name: city.name,
        containedInPlace: {
          "@type": "State",
          name: city.state,
        },
      },
      ...city.nearbyAreas.map((area) => ({
        "@type": "City",
        name: area,
      })),
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${city.name} Services`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Automation",
            url: `${siteConfig.url}/services/ai-automation`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Software Development",
            url: `${siteConfig.url}/services/custom-software-development`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Application Development",
            url: `${siteConfig.url}/services/web-application-development`,
          },
        },
      ],
    },
  };
}
