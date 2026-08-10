import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Case-study hero.
 *
 * Shared by all ten projects — nothing here is project-specific beyond the data
 * passed in, which is what keeps /portfolio/[slug] a single template.
 */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-40 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-blueprint mask-fade-b opacity-60"
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

        <div className="mt-10 max-w-3xl">
          <Reveal y={12}>
            <Eyebrow>{project.category}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08} y={14}>
            <h1 className="type-display mt-6">{project.title}</h1>
          </Reveal>

          <Reveal delay={0.14} y={14}>
            <p className="type-h3 mt-4 font-normal text-ink-600">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.2} y={14}>
            <p className="type-lead mt-6 text-ink-600">
              {project.shortDescription}
            </p>
          </Reveal>

          <Reveal delay={0.26} y={14}>
            <ul
              className="mt-7 flex flex-wrap gap-2"
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

        <Reveal delay={0.2} y={20} className="mt-12 lg:mt-14">
          <figure className="relative overflow-hidden rounded-panel border border-ink-200 bg-ink-50 shadow-card">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 768px) 92vw, 96vw"
                className="object-cover"
              />
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
