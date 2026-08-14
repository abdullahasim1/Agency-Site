import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Layers,
} from "lucide-react";

import { ChallengeSection } from "@/components/case-study/ChallengeSection";
import { EngagementObjectives } from "@/components/case-study/EngagementObjectives";
import { FeaturesGrid } from "@/components/case-study/FeaturesGrid";
import { ProjectCTA } from "@/components/case-study/ProjectCTA";
import { ProjectGallery } from "@/components/case-study/ProjectGallery";
import { ProjectOverview } from "@/components/case-study/ProjectOverview";
import { ResultsSection } from "@/components/case-study/ResultsSection";
import { SolutionSection } from "@/components/case-study/SolutionSection";
import { TechStack } from "@/components/case-study/TechStack";
import { WorkflowDiagram } from "@/components/case-study/WorkflowDiagram";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TechBadge } from "@/components/ui/TechBadge";
import { sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

const briefIcons = [Building2, Briefcase, Calendar, Layers] as const;

/**
 * Case-study template — "Split Sidebar".
 *
 * A dark editorial hero, then a persistent sticky brief column that scrolls
 * with the reader while the story sections flow beside it. Agency-style.
 */
export function CaseStudyLayout({ project }: { project: Project }) {
  const brief = [
    { label: "Client", value: project.overview.client },
    { label: "Industry", value: project.overview.industry },
    { label: "Timeline", value: project.overview.timeline },
    { label: "Year", value: project.overview.year },
    { label: "Platform", value: project.overview.platforms.join(", ") },
    { label: "Team", value: project.overview.team },
  ];

  return (
    <div>
      <section
        className="relative isolate overflow-hidden bg-ink-950 pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36"
        data-theme="dark"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/10 blur-[140px]"
        />
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
              <li>
                <Link href="/" className="transition-colors hover:text-ink-300">
                  {sharedCopy.breadcrumb.home}
                </Link>
              </li>
              <ChevronRight className="size-3.5 text-ink-700" aria-hidden />
              <li>
                <Link
                  href="/portfolio"
                  className="transition-colors hover:text-ink-300"
                >
                  {sharedCopy.breadcrumb.portfolio}
                </Link>
              </li>
              <ChevronRight className="size-3.5 text-ink-700" aria-hidden />
              <li aria-current="page" className="text-ink-300">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div>
              <Reveal y={12}>
                <Eyebrow>{`Case Study / ${project.category}`}</Eyebrow>
              </Reveal>
              <Reveal delay={0.08} y={14}>
                <h1 className="type-display mt-6 text-white">
                  {project.tagline}
                </h1>
              </Reveal>
              <Reveal delay={0.16} y={14}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
                  {project.shortDescription}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2} y={16}>
              <p className="border-l-2 border-brand-400 pl-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-400">
                {project.title} · {project.overview.timeline}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <div className="border-b border-ink-200 bg-ink-25">
        <Container>
          <Reveal y={14}>
            <figure className="relative -mb-10 mt-10 aspect-[21/9] max-h-[32rem] w-full overflow-hidden rounded-panel border border-ink-800/40 shadow-card lg:-mt-2">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 96vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </Container>
      </div>

      <div className="pt-14 lg:pt-16">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
            <div className="min-w-0 space-y-4">
              <ProjectOverview project={project} />
              <ChallengeSection project={project} />
              <EngagementObjectives project={project} />
              <SolutionSection project={project} />
              <FeaturesGrid project={project} />
              <WorkflowDiagram project={project} />
              <ResultsSection project={project} />
              <ProjectGallery project={project} />
              <TechStack project={project} />
            </div>

            <aside className="lg:order-first">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card">
                  <div className="border-b border-ink-200 bg-ink-25 px-5 py-4">
                    <p className="type-eyebrow text-ink-400">Project brief</p>
                  </div>
                  <dl className="grid grid-cols-1 divide-y divide-ink-200">
                    {brief.map((item, index) => {
                      const BriefIcon = briefIcons[index] ?? Building2;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-4 px-5 py-4"
                        >
                          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                            <BriefIcon className="size-4" aria-hidden />
                          </span>
                          <div>
                            <dt className="type-eyebrow text-ink-400">
                              {item.label}
                            </dt>
                            <dd className="mt-0.5 text-sm font-medium text-ink-900">
                              {item.value}
                            </dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                </div>

                <div className="rounded-panel border border-ink-200 bg-ink-25 p-5">
                  <p className="type-eyebrow text-ink-400">Built with</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <TechBadge name={tech} tone="neutral" />
                      </li>
                    ))}
                  </ul>
                </div>

                {project.results.length > 0 ? (
                  <div className="rounded-panel border border-ink-200 bg-white p-5 shadow-soft">
                    <p className="type-eyebrow text-ink-400">Headline results</p>
                    <ul className="mt-4 space-y-3">
                      {project.results.slice(0, 3).map((result) => (
                        <li
                          key={result.label}
                          className="flex items-baseline gap-2.5"
                        >
                          <span className="nums-tabular type-h3 text-brand-600">
                            {result.value}
                          </span>
                          <span className="text-sm font-medium text-ink-800">
                            {result.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Button href="/book-a-call" size="lg" className="w-full">
                  Book a call
                  <ArrowRight className="size-4" aria-hidden />
                </Button>

                <ul className="space-y-2.5" aria-label="Key outcomes">
                  {project.results.slice(0, 2).map((outcome) => (
                    <li key={outcome.label} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-brand-600"
                        aria-hidden
                      />
                      <span className="text-sm leading-relaxed text-ink-600">
                        {outcome.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>

        <div className="mt-4">
          <ProjectCTA project={project} />
        </div>
      </div>
    </div>
  );
}