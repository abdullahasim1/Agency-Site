import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Solution Design — what we built, mirroring the challenge cards above it.
 * Each card pairs an icon with a short title and a supporting line, so the
 * challenge and solution sections line up as a before/after story.
 */
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
          </div>
        </div>

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {project.solution.points.map((point) => (
            <StaggerItem as="li" key={point.title} className="h-full">
              <div className="group h-full rounded-card border border-ink-200 bg-white p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors duration-300 group-hover:bg-brand-100">
                    <Icon name={point.icon} className="size-5" aria-hidden />
                  </span>
                  <span className="nums-tabular font-mono text-xs font-medium text-ink-300">
                    {String(
                      project.solution.points.indexOf(point) + 1,
                    ).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-ink-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {point.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
