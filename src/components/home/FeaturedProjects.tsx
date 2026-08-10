import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedProjects } from "@/data/projects";

/** Six featured projects. The portfolio is the visual centre of the site. */
export async function FeaturedProjects() {
  const projects = (await getFeaturedProjects()).slice(0, 6);

  return (
    <section id="work" className="section-y relative bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Work"
          description="Explore some of the digital products, AI systems and automation solutions we've built."
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
              View All Projects
            </Button>
          }
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <StaggerItem as="li" key={project.id} className="h-full">
              <ProjectCard project={project} priority={index < 3} />
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
