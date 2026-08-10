import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy } from "@/data/pages";
import { getProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";

/**
 * Client testimonials.
 *
 * A grid rather than a carousel: every quote stays readable, indexable and
 * keyboard-reachable without shipping a slider. Quotes are placeholders held in
 * src/data/testimonials.ts and are paired with monogram avatars, never with a
 * photograph of someone who did not say them.
 */
export async function Testimonials() {
  const projects = await getProjects();

  return (
    <section className="section-y relative bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow={homeCopy.testimonials.eyebrow}
          title={homeCopy.testimonials.title}
          description={homeCopy.testimonials.description}
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => {
            const project = testimonial.projectSlug
              ? projects.find(
                  (entry) => entry.slug === testimonial.projectSlug,
                )
              : undefined;

            return (
              <StaggerItem as="li" key={testimonial.id} className="h-full">
                <figure className="group relative flex h-full flex-col rounded-card border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift sm:p-7">
                  <Quote
                    className="size-6 shrink-0 text-brand-200 transition-colors duration-300 group-hover:text-brand-300"
                    aria-hidden
                  />

                  <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-700">
                    {testimonial.quote}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-ink-100 pt-5">
                    <Avatar
                      initials={testimonial.initials}
                      name={testimonial.name}
                      src={testimonial.avatar}
                      accent={testimonial.accent}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-950">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </figcaption>

                  {project ? (
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 transition-colors hover:text-brand-600"
                    >
                      Read the {project.title} case study
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  ) : null}
                </figure>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
