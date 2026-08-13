import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** The situation before the engagement, in the client's terms. */
export function ChallengeSection({ project }: { project: Project }) {
  return (
    <section className="section-y-sm">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
          <SectionHeading
            eyebrow={portfolioCopy.caseStudy.challenge.eyebrow}
            title={portfolioCopy.caseStudy.challenge.title}
            description={portfolioCopy.caseStudy.challenge.description}
          />

          <div>
            <Reveal>
              <p className="type-lead text-ink-600">
                {project.challenge.summary}
              </p>
            </Reveal>

            <Stagger
              as="ul"
              stagger={0.06}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {project.challenge.points.map((point, index) => (
                <StaggerItem as="li" key={point}>
                  <div className="group h-full rounded-card border border-ink-200 bg-white p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-amber-200 hover:shadow-card">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex size-10 items-center justify-center rounded-[0.75rem] bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                        <AlertTriangle
                          className="size-5"
                          strokeWidth={1.9}
                          aria-hidden
                        />
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
