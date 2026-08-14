import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * The project's own demo video (uploaded through the Keystatic panel).
 * Hidden entirely when no video file is set on the project.
 */
export function ProjectVideo({ project }: { project: Project }) {
  if (!project.video?.file) return null;

  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.video.eyebrow}
          title={portfolioCopy.caseStudy.video.title}
          description={portfolioCopy.caseStudy.video.description}
        />

        <Stagger as="ul" stagger={0.08} className="mt-10">
          <StaggerItem as="li">
            <figure className="overflow-hidden rounded-card border border-ink-200 bg-white">
              <div className="relative aspect-video w-full bg-ink-950">
                <video
                  src={project.video.file}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              {project.video.caption && (
                <figcaption className="border-t border-ink-200 px-5 py-4 text-sm leading-relaxed text-ink-600">
                  {project.video.caption}
                </figcaption>
              )}
            </figure>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}