import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Layers,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

const briefIcons = [Building2, Briefcase, Calendar, Layers] as const;

/**
 * Case-study hero.
 *
 * Shared by all ten projects — nothing here is project-specific beyond the data
 * passed in, which is what keeps /portfolio/[slug] a single template.
 */
export function ProjectHero({ project }: { project: Project }) {
  const brief = [
    { label: "Client", value: project.overview.client },
    { label: "Industry", value: project.overview.industry },
    { label: "Timeline", value: project.overview.timeline },
    { label: "Platform", value: project.overview.platforms.join(", ") },
  ];
  const outcomes = project.results.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden border-b border-ink-200 pt-28 pb-12 sm:pt-32 lg:pt-40 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-32 -z-10 size-[36rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
      />

      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-ink-800"
              >
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

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-start lg:gap-14">
          <div>
            <Reveal y={12}>
              <Eyebrow>{`Case Study / ${project.category}`}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} y={14}>
              <p className="mt-5 font-mono text-sm font-medium uppercase tracking-[0.18em] text-brand-600">
                {project.title} / {project.overview.timeline}
              </p>
            </Reveal>

            <Reveal delay={0.14} y={14}>
              <h1 className="type-display mt-4">{project.tagline}</h1>
            </Reveal>

            <Reveal delay={0.2} y={14}>
              <p className="type-lead mt-6 text-ink-600">
                {project.shortDescription}
              </p>
            </Reveal>

            <Reveal delay={0.26} y={14}>
              <ul className="mt-8 space-y-3" aria-label="Key outcomes">
                {outcomes.map((outcome) => (
                  <li key={outcome.label} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                    >
                      <CheckCircle2 className="size-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-700">
                      <strong className="font-semibold text-ink-950">
                        {outcome.value} {outcome.label}.
                      </strong>{" "}
                      {outcome.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.32} y={14}>
              <ul
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Technologies used"
              >
                {project.technologies.map((tech) => (
                  <li key={tech}>
                    <Badge tone="neutral" size="md">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.18} y={18}>
            <aside className="overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card">
              <div className="border-b border-ink-200 bg-ink-25 px-5 py-4 sm:px-6">
                <p className="type-eyebrow text-ink-400">Project brief</p>
              </div>
              <dl className="grid grid-cols-1 divide-y divide-ink-200">
                {brief.map((item, index) => {
                  const BriefIcon = briefIcons[index] ?? Building2;
                  return (
                    <div key={item.label} className="flex gap-4 px-5 py-4 sm:px-6">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <BriefIcon className="size-4.5" aria-hidden />
                      </span>
                      <div>
                        <dt className="type-eyebrow text-ink-400">
                          {item.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium leading-relaxed text-ink-900">
                          {item.value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </aside>
          </Reveal>
        </div>

        <Reveal delay={0.24} y={20} className="mt-10 lg:mt-14">
          <figure className="relative overflow-hidden rounded-panel border border-ink-200 bg-ink-50 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="relative aspect-[16/9] min-h-[18rem] w-full lg:min-h-[30rem]">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 816px, (min-width: 1024px) 64vw, 96vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex flex-col justify-center border-t border-ink-200 bg-white p-6 lg:border-l lg:border-t-0 lg:p-8">
                <p className="type-eyebrow text-brand-600">Case study focus</p>
                <p className="mt-3 text-base leading-relaxed text-ink-700">
                  {project.fullDescription}
                </p>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
