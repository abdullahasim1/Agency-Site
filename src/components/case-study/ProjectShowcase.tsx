import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/data/projects";

/**
 * Project showcase — the project image presented full-width after the story,
 * in the spot the workflow diagram used to occupy.
 */
export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <Reveal y={16}>
          <figure className="overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card">
            <div className="relative aspect-[16/9] w-full min-h-[18rem] lg:aspect-[21/10]">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1280px) 1152px, 96vw"
                className="object-cover"
              />
            </div>
            <figcaption className="grid grid-cols-1 gap-4 border-t border-ink-200 p-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12 lg:py-7">
              <p className="type-eyebrow text-brand-600">Case study focus</p>
              <p className="text-base leading-relaxed text-ink-700">
                {project.fullDescription}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}