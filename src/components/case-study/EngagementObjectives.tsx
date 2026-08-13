import { CheckCircle2, Target } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Project } from "@/data/projects";

/** Objective checkpoint between the problem statement and the delivered solution. */
export function EngagementObjectives({ project }: { project: Project }) {
  const objectives = project.solution.points.slice(0, 6);

  if (objectives.length === 0) return null;

  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-14">
          <Reveal>
            <div className="rounded-panel border border-ink-200 bg-white p-6 shadow-soft lg:sticky lg:top-28">
              <span className="inline-flex size-12 items-center justify-center rounded-[0.875rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Target className="size-6" aria-hidden />
              </span>
              <p className="type-eyebrow mt-5 text-brand-600">
                Engagement objectives
              </p>
              <h2 className="type-h2 mt-3">What the build needed to achieve</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Before implementation, the work was reduced to clear objectives
                the team could validate during delivery.
              </p>
            </div>
          </Reveal>

          <Stagger as="ul" stagger={0.06} className="grid grid-cols-1 gap-3">
            {objectives.map((objective) => (
              <StaggerItem as="li" key={objective}>
                <div className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white p-4 shadow-soft sm:p-5">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-brand-600"
                    strokeWidth={2.1}
                    aria-hidden
                  />
                  <p className="text-[0.9375rem] leading-relaxed text-ink-700">
                    {objective}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
