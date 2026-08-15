import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TechBadge } from "@/components/ui/TechBadge";
import { sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Case-study hero.
 *
 * Shared by all eleven projects — nothing here is project-specific beyond the
 * data passed in, which is what keeps /portfolio/[slug] a single template.
 */
export function ProjectHero({ project }: { project: Project }) {
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
                    <TechBadge name={tech} tone="neutral" />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.18} y={18} className="lg:sticky lg:top-28">
            <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-panel border border-ink-200 bg-ink-50 shadow-card">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
