import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Business Challenge — the situation before the engagement, in the client's
 * terms. Each point is an icon card with a short title and a supporting line,
 * mirroring the Solution Design section below it so the two read as a story.
 */
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
          </div>
        </div>

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {project.challenge.points.map((point) => (
            <StaggerItem as="li" key={point.title} className="h-full">
              <div className="group h-full rounded-card border border-ink-200 bg-white p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-amber-200 hover:shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-amber-50 text-amber-600 ring-1 ring-amber-100 transition-colors duration-300 group-hover:bg-amber-100">
                    <Icon name={point.icon} className="size-5" aria-hidden />
                  </span>
                  <span className="nums-tabular font-mono text-xs font-medium text-ink-300">
                    {String(
                      project.challenge.points.indexOf(point) + 1,
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
