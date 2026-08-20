import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { ZoomableImage } from "@/components/ui/Lightbox";
import { TechBadge } from "@/components/ui/TechBadge";
import { sharedCopy } from "@/data/pages";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** `true` for the first row, so the cover is not lazy-loaded above the fold. */
  priority?: boolean;
  /** Heading level, so the card fits the surrounding document outline. */
  as?: "h2" | "h3";
  className?: string;
  /** Passed to next/image for correct responsive candidates. */
  sizes?: string;
}

/**
 * Portfolio card, shared by the homepage Featured Work grid and the /portfolio
 * listing. All content comes from src/data/projects.ts.
 */
export function ProjectCard({
  project,
  priority = false,
  as: Tag = "h3",
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 35vw, 80vw",
}: ProjectCardProps) {
  return (
    <GlowCard
      as="article"
      accent={project.accent}
      padding="none"
      className={cn("flex h-full flex-col", className)}
    >
      <ZoomableImage
        images={[{ src: project.image, alt: project.imageAlt }]}
        index={0}
        className="relative z-10 aspect-[16/10] w-full overflow-hidden border-b border-ink-200 bg-ink-50"
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={project.imageWidth}
          height={project.imageHeight}
          quality={90}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/card:scale-[1.03]"
        />
      </ZoomableImage>

      <div className="flex flex-1 flex-col p-6">
        <p className="type-eyebrow text-brand-600">{project.category}</p>

        <Tag className="type-h4 mt-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-card after:content-['']"
          >
            {project.title}
          </Link>
        </Tag>

        <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
          {project.shortDescription}
        </p>

        <ul
          className="mt-5 flex flex-wrap gap-1.5"
          aria-label={`Technologies used in ${project.title}`}
        >
          {project.technologies.slice(0, 4).map((tech) => (
            <li key={tech}>
              <TechBadge name={tech} tone={project.accent} />
            </li>
          ))}
          {project.technologies.length > 4 ? (
            <li>
              <Badge tone="neutral">+{project.technologies.length - 4}</Badge>
            </li>
          ) : null}
        </ul>

        <p className="mt-6 flex items-center gap-1.5 pt-1 text-sm font-medium text-brand-700 transition-colors group-hover/card:text-brand-600">
          {sharedCopy.actions.viewCaseStudy}
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
            aria-hidden
          />
        </p>
      </div>
    </GlowCard>
  );
}
