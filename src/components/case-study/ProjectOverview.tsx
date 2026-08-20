import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** Overview paragraph plus the services list. */
export function ProjectOverview({ project }: { project: Project }) {
  const { overview } = project;
  const labels = portfolioCopy.caseStudy.overviewFacts;

  return (
    <section className="section-y-sm">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.overview.eyebrow}
          title={portfolioCopy.caseStudy.overview.title}
          description={portfolioCopy.caseStudy.overview.description}
        />

        <Reveal delay={0.08}>
          <p className="type-lead mt-6 text-ink-600">
            {project.clientOverview || project.fullDescription}
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
      </Container>
    </section>
  );
}
