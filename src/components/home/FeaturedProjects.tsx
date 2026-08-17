import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy, sharedCopy } from "@/data/pages";
import { getFeaturedProjects } from "@/data/projects";

/** Six featured projects. The portfolio is the visual centre of the site. */
export async function FeaturedProjects() {
  const projects = (await getFeaturedProjects()).slice(0, 6);

  return (
    <section id="work" className="section-y relative bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow={homeCopy.featuredProjects.eyebrow}
          title={homeCopy.featuredProjects.title}
          description={homeCopy.featuredProjects.description}
          action={
            <Button
              href="/portfolio"
              variant="secondary"
              trailingIcon={
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                  aria-hidden
                />
              }
            >
              {sharedCopy.actions.viewAllProjects}
            </Button>
          }
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <StaggerItem as="li" key={project.id} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Repeated on small screens, where the heading action is far above. */}
        <div className="mt-10 flex justify-center lg:hidden">
          <Button
            href="/portfolio"
            variant="secondary"
            size="lg"
            trailingIcon={<ArrowRight className="size-4" aria-hidden />}
          >
            View All Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}
