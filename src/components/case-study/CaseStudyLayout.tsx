import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ProjectCTA } from "@/components/case-study/ProjectCTA";
import { TechStack } from "@/components/case-study/TechStack";
import { WorkflowDiagram } from "@/components/case-study/WorkflowDiagram";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy, sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Case-study template — "Narrative Editorial".
 *
 * A quiet, typographic story: centered title and meta bar, numbered challenge
 * and solution rows instead of cards, a dark results band, and roomy gallery
 * shots. Prose sections keep a reading measure; fact-heavy sections go full
 * width.
 */
export function CaseStudyLayout({ project }: { project: Project }) {
  const meta = [
    { label: "Client", value: project.overview.client },
    { label: "Industry", value: project.overview.industry },
    { label: "Timeline", value: project.overview.timeline },
    { label: "Platforms", value: project.overview.platforms.join(" · ") },
  ];

  const objectives =
    project.objectives.length > 0
      ? project.objectives
      : project.solution.points.map((point) => point.title).slice(0, 6);

  const copy = portfolioCopy.caseStudy;

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-ink-200 pt-28 sm:pt-32 lg:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 -z-10 size-[30rem] rounded-full bg-brand-500/[0.06] blur-[130px]"
        />

        <Container>
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
                  href="/portfolio"
                  className="transition-colors hover:text-ink-800"
                >
                  {sharedCopy.breadcrumb.portfolio}
                </Link>
              </li>
              <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
              <li aria-current="page" className="text-ink-800">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="mx-auto mt-12 max-w-4xl text-center lg:mt-16">
            <Reveal y={12}>
              <Eyebrow>{`Case Study / ${project.category}`}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08} y={14}>
              <h1 className="type-display mt-6">{project.tagline}</h1>
            </Reveal>
            <Reveal delay={0.16} y={14}>
              <p className="type-lead mx-auto mt-7 max-w-2xl text-ink-600">
                {project.shortDescription}
              </p>
            </Reveal>
            <Reveal delay={0.22} y={14}>
              <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 divide-x divide-ink-200 border-y border-ink-200 sm:grid-cols-4">
                {meta.map((item) => (
                  <div key={item.label} className="px-4 py-5 sm:px-6">
                    <dt className="type-eyebrow text-ink-400">{item.label}</dt>
                    <dd className="mt-1.5 text-sm font-medium leading-snug text-ink-900">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.18} y={20} className="mt-12 lg:mt-16">
            <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-panel border border-ink-200 bg-ink-50 shadow-card sm:aspect-[21/10] lg:aspect-[21/9]">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 96vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-ink-950/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-white backdrop-blur">
                {project.title} · {project.overview.timeline}
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="section-y">
        <Container width="prose">
          <Reveal>
            <p className="type-eyebrow text-brand-600">
              {copy.overview.eyebrow}
            </p>
            <p className="type-lead mt-5 text-ink-800">
              {project.clientOverview || project.fullDescription}
            </p>
          </Reveal>
          {project.overview.services.length > 0 ? (
            <Reveal delay={0.08}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {project.overview.services.map((service) => (
                  <li
                    key={service}
                    className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm text-ink-700"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-brand-500"
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <section className="section-y bg-ink-25">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
            <SectionHeading
              eyebrow={copy.challenge.eyebrow}
              title={copy.challenge.title}
              description={copy.challenge.description}
            />
            <div>
              <Reveal>
                <p className="type-lead text-ink-600">
                  {project.challenge.summary}
                </p>
              </Reveal>
              <Stagger as="ul" stagger={0.07} className="mt-10">
                {project.challenge.points.map((point, index) => (
                  <StaggerItem
                    as="li"
                    key={point.title}
                    className="border-t border-ink-200 transition-colors duration-300 last:border-b hover:bg-white"
                  >
                    <div className="flex items-start gap-6 px-2 py-6 sm:px-4">
                      <span className="nums-tabular mt-1.5 font-mono text-sm font-medium text-ink-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold leading-snug text-ink-900">
                          {point.title}
                        </h3>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container width="prose">
          <Reveal>
            <p className="type-eyebrow text-brand-600">
              {copy.objectives.eyebrow}
            </p>
            <h2 className="type-h2 mt-3">{copy.objectives.title}</h2>
            <p className="mt-4 text-ink-600">{copy.objectives.description}</p>
          </Reveal>
          <Stagger as="ul" stagger={0.05} className="mt-8 space-y-4">
            {objectives.map((objective) => (
              <StaggerItem as="li" key={objective} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-500"
                />
                <p className="text-[1.0625rem] leading-relaxed text-ink-800">
                  {objective}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="section-y bg-ink-25">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
            <SectionHeading
              eyebrow={copy.solution.eyebrow}
              title={copy.solution.title}
              description={copy.solution.description}
            />
            <div>
              <Reveal>
                <p className="type-lead text-ink-600">
                  {project.solution.summary}
                </p>
              </Reveal>
              <Stagger as="ol" stagger={0.07} className="mt-10">
                {project.solution.points.map((point, index) => (
                  <StaggerItem
                    as="li"
                    key={point.title}
                    className="relative flex gap-6 pb-10 pl-1 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <span className="nums-tabular flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-mono text-xs font-semibold text-white shadow-soft">
                        {index + 1}
                      </span>
                      {index < project.solution.points.length - 1 ? (
                        <span
                          aria-hidden
                          className="mt-2 w-px flex-1 bg-brand-200"
                        />
                      ) : null}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="text-lg font-semibold leading-snug text-ink-900">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                        {point.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      {project.results.length > 0 ? (
        <section className="section-y bg-ink-950" data-theme="dark">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="type-eyebrow text-brand-300">
                {copy.results.eyebrow}
              </p>
              <h2 className="type-h2 mt-3 text-white">
                {copy.results.title}
              </h2>
              <p className="mt-4 text-ink-400">{copy.results.description}</p>
            </div>
            <Stagger
              as="ul"
              stagger={0.08}
              className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-ink-800 bg-ink-800/50 lg:grid-cols-4"
            >
              {project.results.map((result) => (
                <StaggerItem
                  as="li"
                  key={result.label}
                  className="bg-ink-950 px-6 py-10 text-center"
                >
                  <p className="nums-tabular type-display text-brand-400">
                    {result.value}
                  </p>
                  <p className="mt-3 text-base font-medium text-white">
                    {result.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                    {result.detail}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ) : null}

      <section className="section-y">
        <Container>
          <SectionHeading
            eyebrow={copy.features.eyebrow}
            title={copy.features.title}
            description={copy.features.description.replace(
              "{project}",
              project.title,
            )}
          />
          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3"
          >
            {project.features.map((feature) => (
              <StaggerItem as="li" key={feature.title} className="bg-white">
                <div className="flex h-full gap-4 p-6 transition-colors duration-300 hover:bg-ink-25">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={feature.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold leading-snug text-ink-900">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <WorkflowDiagram project={project} />
      <TechStack project={project} />

      {project.gallery.length > 0 ? (
        <section className="section-y bg-ink-25">
          <Container>
            <SectionHeading
              eyebrow={copy.gallery.eyebrow}
              title={copy.gallery.title}
              description={copy.gallery.description}
            />
            <Reveal y={16} className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {project.gallery.map((item, index) => (
                  <figure
                    key={item.src}
                    className={
                      index === 0 || index === project.gallery.length - 1
                        ? "sm:col-span-2"
                        : undefined
                    }
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card border border-ink-200 bg-ink-50">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1280px) 1152px, 96vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
                      {item.caption}
                    </p>
                  </figure>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <ProjectCTA project={project} />
    </div>
  );
}