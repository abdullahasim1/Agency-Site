import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechTiles } from "@/components/ui/TechTiles";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/** Grouped technology stack for the case study. */
export function TechStack({ project }: { project: Project }) {
  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.techStack.eyebrow}
          title={portfolioCopy.caseStudy.techStack.title}
          description={portfolioCopy.caseStudy.techStack.description}
        />

        <Stagger as="ul" stagger={0.06} className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {project.techStack.map((group) => (
            <StaggerItem as="li" key={group.group} className="h-full">
              <div className="flex h-full flex-col rounded-card border border-ink-200 bg-white p-6">
                <h3 className="type-eyebrow text-ink-400">{group.group}</h3>
                <TechTiles items={group.items} className="mt-4 sm:grid-cols-2" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
