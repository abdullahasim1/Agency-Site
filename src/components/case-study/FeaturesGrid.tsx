import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fill, portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** Key features of the delivered system. */
export function FeaturesGrid({ project }: { project: Project }) {
  return (
    <section className="section-y-sm">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.features.eyebrow}
          title={portfolioCopy.caseStudy.features.title}
          description={fill(portfolioCopy.caseStudy.features.description, {
            project: project.title,
          })}
        />

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {project.features.map((feature) => (
            <StaggerItem as="li" key={feature.title} className="h-full">
              <GlowCard
                accent={project.accent}
                padding="md"
                className="flex h-full flex-col"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={feature.icon} className="size-5" />
                </span>
                <h3 className="type-h4 mt-4">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {feature.description}
                </p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
