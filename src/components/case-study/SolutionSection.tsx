import { Check } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** What we built, mirroring the challenge points above it. */
export function SolutionSection({ project }: { project: Project }) {
  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
          <SectionHeading
            eyebrow={portfolioCopy.caseStudy.solution.eyebrow}
            title={portfolioCopy.caseStudy.solution.title}
            description={portfolioCopy.caseStudy.solution.description}
          />

          <div>
            <Reveal>
              <p className="type-lead text-ink-600">
                {project.solution.summary}
              </p>
            </Reveal>

            <Stagger as="ul" stagger={0.06} className="mt-8 space-y-3">
              {project.solution.points.map((point) => (
                <StaggerItem as="li" key={point}>
                  <div className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white p-4 sm:p-5">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                    >
                      <Check className="size-3.5" strokeWidth={2.4} />
                    </span>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-700">
                      {point}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
