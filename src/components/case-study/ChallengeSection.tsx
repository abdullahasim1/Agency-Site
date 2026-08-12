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

            <Stagger as="ul" stagger={0.06} className="mt-8 space-y-3">
              {project.challenge.points.map((point) => (
                <StaggerItem as="li" key={point}>
                  <div className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white p-4 sm:p-5">
                    <AlertTriangle
                      className="mt-0.5 size-[1.125rem] shrink-0 text-amber-500"
                      strokeWidth={1.9}
                      aria-hidden
                    />
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
