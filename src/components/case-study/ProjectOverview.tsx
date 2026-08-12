import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** Overview paragraph plus the client / industry facts panel. */
export function ProjectOverview({ project }: { project: Project }) {
  const { overview } = project;
  const labels = portfolioCopy.caseStudy.overviewFacts;

  const facts = [
    { label: labels.clientLabel, value: overview.client },
    { label: labels.industryLabel, value: overview.industry },
    { label: labels.timelineLabel, value: overview.timeline },
    { label: labels.yearLabel, value: overview.year },
    { label: labels.platformsLabel, value: overview.platforms.join(", ") },
    { label: labels.teamLabel, value: overview.team },
  ];

  return (
    <section className="section-y-sm">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow={portfolioCopy.caseStudy.overview.eyebrow}
              title={portfolioCopy.caseStudy.overview.title}
              description={portfolioCopy.caseStudy.overview.description}
            />

            <Reveal delay={0.08}>
              <p className="type-lead mt-6 text-ink-600">
                {project.fullDescription}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8">
                <h3 className="type-eyebrow text-ink-400">
                  {labels.servicesHeading}
                </h3>
                <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
                  {overview.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-2 text-sm text-ink-700"
                    >
                      <span
                        aria-hidden
                        className="size-1 rounded-full bg-brand-500"
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-white p-5">
                  <dt className="type-eyebrow text-ink-400">{fact.label}</dt>
                  <dd className="mt-2 text-sm font-medium leading-relaxed text-ink-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
