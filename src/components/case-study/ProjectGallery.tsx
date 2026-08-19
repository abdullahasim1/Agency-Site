import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { ZoomableImage } from "@/components/ui/Lightbox";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Interface / system screens.
 *
 * Every screenshot is shown full-width at its own aspect ratio, so images
 * render as large as the container allows without cropping or downscaling.
 */
export function ProjectGallery({ project }: { project: Project }) {
  if (project.gallery.length === 0) return null;

  return (
    <section className="section-y-sm bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.gallery.eyebrow}
          title={portfolioCopy.caseStudy.gallery.title}
          description={portfolioCopy.caseStudy.gallery.description}
        />

        <Stagger
          as="ul"
          stagger={0.08}
          className="mt-10 grid grid-cols-1 gap-6"
        >
          {project.gallery.map((item, index) => (
            <StaggerItem as="li" key={item.src}>
              <figure className="overflow-hidden rounded-card border border-ink-200 bg-white">
                <ZoomableImage
                  images={project.gallery.map(({ src, alt, caption }) => ({
                    src,
                    alt,
                    caption,
                  }))}
                  index={index}
                  className="relative w-full bg-ink-50"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 1280px) 1152px, (min-width: 640px) 92vw, 96vw"
                    className="h-auto w-full"
                  />
                </ZoomableImage>
                <figcaption className="border-t border-ink-200 px-5 py-4 text-sm leading-relaxed text-ink-600">
                  {item.caption}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
