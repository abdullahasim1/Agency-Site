import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";

import { ProjectCTA } from "@/components/case-study/ProjectCTA";
import { ProjectGallery } from "@/components/case-study/ProjectGallery";
import { TechStack } from "@/components/case-study/TechStack";
import { WorkflowDiagram } from "@/components/case-study/WorkflowDiagram";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TechBadge } from "@/components/ui/TechBadge";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Layout Option C — "Bento Grid".
 *
 * A compact hero and a dense grid of mixed tiles — prose, facts, checklists,
 * cards and stats — so a lot of substance fits above the fold.
 */
export function LayoutBento({ project }: { project: Project }) {
  const facts = [
    { label: "Client", value: project.overview.client },
    { label: "Industry", value: project.overview.industry },
    { label: "Timeline", value: project.overview.timeline },
    { label: "Platforms", value: project.overview.platforms.join(", ") },
    { label: "Team", value: project.overview.team },
    { label: "Year", value: project.overview.year },
  ];

  const copy = portfolioCopy.caseStudy;

  return (
    <div>
      <section className="section-y border-b border-ink-200 bg-ink-25">
        <Container>
          <nav aria-label="Breadcrumb" className="hidden">
            <Link href="/">Home</Link>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
            <Reveal y={16}>
              <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-panel border border-ink-200 bg-ink-50 shadow-card">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 96vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>

            <div>
              <Reveal y={12}>
                <Eyebrow>{`Case Study / ${project.category}`}</Eyebrow>
              </Reveal>
              <Reveal delay={0.08} y={14}>
                <h1 className="type-display mt-5">{project.tagline}</h1>
              </Reveal>
              <Reveal delay={0.16} y={14}>
                <p className="type-lead mt-5 text-ink-600">
                  {project.shortDescription}
                </p>
              </Reveal>
              <Reveal delay={0.22} y={14}>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech}>
                      <TechBadge name={tech} tone="neutral" />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            <Reveal y={16} className="md:col-span-4">
              <div className="flex h-full flex-col rounded-panel border border-ink-200 bg-white p-7 shadow-soft">
                <p className="type-eyebrow text-brand-600">
                  {copy.overview.eyebrow}
                </p>
                <h2 className="type-h2 mt-3">{copy.overview.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-ink-700">
                  {project.clientOverview || project.fullDescription}
                </p>
                <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
                  {project.overview.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-2 text-sm text-ink-700"
                    >
                      <span
                        aria-hidden
                        className="size-1 rounded-full bg-brand-500"
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.06} className="md:col-span-2">
              <dl className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-panel border border-ink-200 bg-ink-200">
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-white p-4">
                    <dt className="type-eyebrow text-ink-400">{fact.label}</dt>
                    <dd className="mt-1.5 text-sm font-medium leading-snug text-ink-900">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal y={16} delay={0.04} className="md:col-span-3">
              <div className="flex h-full flex-col rounded-panel border border-ink-200 bg-amber-50/40 p-7">
                <p className="type-eyebrow text-amber-700">
                  {copy.challenge.eyebrow}
                </p>
                <h2 className="type-h2 mt-3">{copy.challenge.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {project.challenge.summary}
                </p>
                <Stagger as="ul" stagger={0.05} className="mt-6 space-y-3">
                  {project.challenge.points.slice(0, 3).map((point) => (
                    <StaggerItem
                      as="li"
                      key={point.title}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <Icon name={point.icon} className="size-3.5" />
                      </span>
                      <p className="text-sm leading-relaxed text-ink-700">
                        <strong className="font-semibold text-ink-900">
                          {point.title}.
                        </strong>{" "}
                        {point.description}
                      </p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.08} className="md:col-span-3">
              <div className="flex h-full flex-col rounded-panel bg-ink-950 p-7" data-theme="dark">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25">
                  <Target className="size-5" aria-hidden />
                </span>
                <p className="type-eyebrow mt-5 text-brand-300">
                  {copy.objectives.eyebrow}
                </p>
                <h2 className="type-h2 mt-2 text-white">
                  {copy.objectives.title}
                </h2>
                <Stagger as="ul" stagger={0.05} className="mt-6 space-y-3.5">
                  {project.objectives.map((objective) => (
                    <StaggerItem as="li" key={objective}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          className="mt-0.5 size-4.5 shrink-0 text-brand-400"
                          strokeWidth={2.1}
                          aria-hidden
                        />
                        <p className="text-sm leading-relaxed text-ink-200">
                          {objective}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.04} className="md:col-span-6">
              <div className="rounded-panel border border-ink-200 bg-white p-7 shadow-soft">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-12">
                  <div>
                    <p className="type-eyebrow text-brand-600">
                      {copy.solution.eyebrow}
                    </p>
                    <h2 className="type-h2 mt-3">{copy.solution.title}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-600">
                      {copy.solution.description}
                    </p>
                    <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-700">
                      {project.solution.summary}
                    </p>
                  </div>
                  <Stagger
                    as="ul"
                    stagger={0.06}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    {project.solution.points.map((point) => (
                      <StaggerItem as="li" key={point.title} className="h-full">
                        <div className="h-full rounded-card border border-ink-200 bg-ink-25 p-5">
                          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-600 font-mono text-xs font-semibold text-white">
                            {String(
                              project.solution.points.indexOf(point) + 1,
                            ).padStart(2, "0")}
                          </span>
                          <h3 className="mt-3.5 text-[0.9375rem] font-semibold text-ink-900">
                            {point.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                            {point.description}
                          </p>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </div>
            </Reveal>

            {project.results.length > 0 ? (
              <Reveal y={16} delay={0.04} className="md:col-span-6">
                <div className="rounded-panel border border-ink-200 bg-white p-7 shadow-soft">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <p className="type-eyebrow text-brand-600">
                        {copy.results.eyebrow}
                      </p>
                      <h2 className="type-h2 mt-2">{copy.results.title}</h2>
                    </div>
                    <Button href="/book-a-call" variant="outline" size="md">
                      Book a call
                      <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                  <Stagger
                    as="ul"
                    stagger={0.07}
                    className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-ink-200 lg:grid-cols-4"
                  >
                    {project.results.map((result) => (
                      <StaggerItem as="li" key={result.label} className="bg-white">
                        <div className="flex h-full flex-col p-6">
                          <p className="nums-tabular type-h2 text-brand-600">
                            {result.value}
                          </p>
                          <p className="mt-2 text-sm font-medium text-ink-900">
                            {result.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-500">
                            {result.detail}
                          </p>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </Reveal>
            ) : null}

            <Reveal y={16} delay={0.04} className="md:col-span-6">
              <div className="rounded-panel border border-ink-200 bg-ink-25 p-7">
                <p className="type-eyebrow text-brand-600">
                  {copy.features.eyebrow}
                </p>
                <h2 className="type-h2 mt-2">
                  {copy.features.title.replace("{project}", project.title)}
                </h2>
                <Stagger
                  as="ul"
                  stagger={0.06}
                  className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {project.features.map((feature) => (
                    <StaggerItem as="li" key={feature.title} className="h-full">
                      <div className="flex h-full items-start gap-3.5 rounded-card border border-ink-200 bg-white p-5">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                          <Icon name={feature.icon} className="size-4.5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-ink-900">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-ink-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <WorkflowDiagram project={project} />
      <TechStack project={project} />
      <ProjectGallery project={project} />
      <ProjectCTA project={project} />
    </div>
  );
}