import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/data/projects";

/** Overview paragraph plus the client / industry facts panel. */
export function ProjectOverview({ project }: { project: Project }) {
  const { overview } = project;

  const facts = [
    { label: "Client", value: overview.client },
    { label: "Industry", value: overview.industry },
    { label: "Timeline", value: overview.timeline },
    { label: "Year", value: overview.year },
    { label: "Platforms", value: overview.platforms.join(", ") },
    { label: "Team", value: overview.team },
  ];

  return (
    <section className="section-y-sm">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Overview" title="Project Overview" />

            <Reveal delay={0.08}>
              <p className="type-lead mt-6 text-ink-600">
                {project.fullDescription}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8">
                <h3 className="type-eyebrow text-ink-400">Services provided</h3>
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
