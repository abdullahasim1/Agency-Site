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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
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

            <Stagger
              as="ol"
              stagger={0.06}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {project.solution.points.map((point, index) => (
                <StaggerItem as="li" key={point}>
                  <div className="h-full rounded-card border border-ink-200 bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        aria-hidden
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                      >
                        <Check className="size-5" strokeWidth={2.4} />
                      </span>
                      <span className="nums-tabular font-mono text-xs font-medium text-ink-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700">
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
