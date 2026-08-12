import { FinalCTA } from "@/components/home/FinalCTA";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import { getRelatedProjects, type Project } from "@/data/projects";

/**
 * Case-study closer: two related projects, then the shared closing CTA.
 *
 * `FinalCTA` is reused with case-study wording rather than reimplemented, so
 * the conversion block stays identical everywhere it appears.
 */
export async function ProjectCTA({ project }: { project: Project }) {
  const related = await getRelatedProjects(project.slug, 2);

  return (
    <>
      {related.length > 0 ? (
        <section className="section-y-sm">
          <Container>
            <SectionHeading
              eyebrow={portfolioCopy.caseStudy.related.eyebrow}
              title={portfolioCopy.caseStudy.related.title}
              description={portfolioCopy.caseStudy.related.description}
              action={
                <Button href="/portfolio" variant="outline" size="md">
                  {portfolioCopy.caseStudy.relatedAction}
                </Button>
              }
            />

            <Stagger
              as="ul"
              stagger={0.08}
              className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              {related.map((item) => (
                <StaggerItem as="li" key={item.id} className="h-full">
                  <ProjectCard
                    project={item}
                    sizes="(min-width: 1024px) 45vw, (min-width: 640px) 45vw, 92vw"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ) : null}

      <FinalCTA
        eyebrow={portfolioCopy.caseStudy.cta.eyebrow}
        title={portfolioCopy.caseStudy.cta.title}
        description={portfolioCopy.caseStudy.cta.description}
      />
    </>
  );
}
