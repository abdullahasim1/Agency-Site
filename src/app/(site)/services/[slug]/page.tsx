import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, Check } from "lucide-react";

import { FinalCTA } from "@/components/home/FinalCTA";
import { Process } from "@/components/home/Process";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceHeroVisual } from "@/components/services/ServiceHeroVisual";
import { TechBadge } from "@/components/ui/TechBadge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FaqList } from "@/components/ui/FaqList";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRIMARY_CTA } from "@/data/navigation";
import { fill, servicesCopy, sharedCopy } from "@/data/pages";
import { getProjectsBySlugs } from "@/data/projects";
import { getServices } from "@/data/services";
import { buildMetadata, pageGraph, serviceSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const iconTones = {
  brand: "bg-brand-50 text-brand-600 ring-brand-100",
  violet: "bg-accent-violet/10 text-[#6d3fd4] ring-accent-violet/15",
  cyan: "bg-accent-cyan/10 text-[#0b7285] ring-accent-cyan/20",
} as const;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((entry) => entry.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "This service page is no longer available.",
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    keywords: [service.title, ...service.technologies],
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((entry) => entry.slug === slug);

  if (!service) notFound();

  const relatedProjects = await getProjectsBySlugs(service.relatedProjects);
  const otherServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  const path = `/services/${service.slug}`;
  const faq = service.faq ?? [];

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
          className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
        />

        <Container>
          <Reveal y={12}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink-800">
                    {sharedCopy.breadcrumb.home}
                  </Link>
                </li>
                <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
                <li>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-ink-800"
                  >
                    {sharedCopy.breadcrumb.services}
                  </Link>
                </li>
                <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
                <li aria-current="page" className="text-ink-800">
                  {service.title}
                </li>
              </ol>
            </nav>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className="max-w-3xl">
            <Reveal y={12}>
              <span
                className={cn(
                  "inline-flex size-14 items-center justify-center rounded-[1rem] ring-1",
                  iconTones[service.accent],
                )}
              >
                <Icon name={service.icon} className="size-7" />
              </span>
            </Reveal>

            <Reveal delay={0.08} y={14}>
              <h1 className="type-display mt-6">{service.title}</h1>
            </Reveal>

            <Reveal delay={0.16} y={14}>
              <p className="type-lead mt-5 text-ink-600">
                {service.shortDescription}
              </p>
            </Reveal>

            <Reveal delay={0.24} y={14}>
              <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Technologies">
                {service.technologies.map((tech) => (
                  <li key={tech}>
                    <TechBadge name={tech} />
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.32} y={14}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={PRIMARY_CTA.href} size="lg">
                  {PRIMARY_CTA.label}
                </Button>
                <Button href="/portfolio" size="lg" variant="secondary">
                  {sharedCopy.actions.viewOurWork}
                </Button>
              </div>
            </Reveal>
            </div>

            <Reveal delay={0.18} y={18} className="min-w-0">
              <ServiceHeroVisual slug={service.slug} accent={service.accent} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="section-y-sm">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
            <SectionHeading
              eyebrow={servicesCopy.detail.overview.eyebrow}
              title={servicesCopy.detail.overview.title}
              description={servicesCopy.detail.overview.description}
            />
            <Reveal>
              <p className="type-lead text-ink-600">{service.fullDescription}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Deliverables */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow={servicesCopy.detail.deliverables.eyebrow}
            title={servicesCopy.detail.deliverables.title}
            description={servicesCopy.detail.deliverables.description}
          />

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {service.deliverables.map((deliverable) => (
              <StaggerItem as="li" key={deliverable.title} className="h-full">
                <GlowCard
                  accent={service.accent}
                  padding="md"
                  className="flex h-full flex-col"
                >
                  <h3 className="type-h4">{deliverable.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                    {deliverable.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Use cases */}
      <section className="section-y-sm">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
            <SectionHeading
              eyebrow={servicesCopy.detail.useCases.eyebrow}
              title={servicesCopy.detail.useCases.title}
              description={servicesCopy.detail.useCases.description}
            />

            <Stagger as="ul" stagger={0.06} className="space-y-3">
              {service.useCases.map((useCase) => (
                <StaggerItem as="li" key={useCase}>
                  <div className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white p-4 sm:p-5">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                    >
                      <Check className="size-3.5" strokeWidth={2.4} />
                    </span>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-700">
                      {useCase}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <Process />

      {/* Related work */}
      {relatedProjects.length > 0 ? (
        <section className="section-y-sm bg-ink-25">
          <Container>
            <SectionHeading
              eyebrow={servicesCopy.detail.relatedWork.eyebrow}
              title={servicesCopy.detail.relatedWork.title}
              description={fill(servicesCopy.detail.relatedWork.description, {
                service: service.title.toLowerCase(),
              })}
              action={
                <Button href="/portfolio" variant="outline" size="md">
                  {servicesCopy.detail.relatedWorkAction}
                </Button>
              }
            />

            <Stagger
              as="ul"
              stagger={0.08}
              className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              {relatedProjects.map((project) => (
                <StaggerItem as="li" key={project.id} className="h-full">
                  <ProjectCard
                    project={project}
                    sizes="(min-width: 640px) 45vw, 92vw"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ) : null}

      {/* Questions — rendered only when this service has any written. */}
      {faq.length > 0 ? (
        <section className="section-y-sm bg-ink-25">
          <Container>
            <SectionHeading
              eyebrow={servicesCopy.detail.faq.eyebrow}
              title={servicesCopy.detail.faq.title}
              description={servicesCopy.detail.faq.description}
            />

            <div className="mt-10 max-w-3xl">
              <FaqList items={faq} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* Other services */}
      <section className="section-y-sm">
        <Container>
          <Reveal>
            <Eyebrow>{servicesCopy.detail.otherServices.eyebrow}</Eyebrow>
            <h2 className="type-h3 mt-4">
              {servicesCopy.detail.otherServices.title}
            </h2>
          </Reveal>

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-3"
          >
            {otherServices.map((item) => (
              <StaggerItem as="li" key={item.id} className="bg-white">
                <Link
                  href={`/services/${item.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-ink-25"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="type-h4 text-[1.0625rem]">
                      {item.title}
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-ink-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-600">
                    {item.shortDescription}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <FinalCTA
        eyebrow={servicesCopy.detailCta.eyebrow}
        title={fill(servicesCopy.detailCta.title, { service: service.title })}
        description={servicesCopy.detailCta.description}
      />

      <JsonLd
        data={pageGraph({
          path,
          title: service.title,
          description: service.shortDescription,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ],
          /* Empty for a service with no questions written yet, in which case
             pageGraph leaves the FAQPage node out entirely. */
          faq: faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
          nodes: [
            serviceSchema({
              title: service.title,
              description: service.shortDescription,
              path,
              serviceType: service.title,
              deliverables: service.deliverables.map(
                (deliverable) => deliverable.title,
              ),
            }),
          ],
        })}
      />
    </>
  );
}
