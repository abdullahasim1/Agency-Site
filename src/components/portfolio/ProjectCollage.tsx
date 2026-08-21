import Image from "next/image";

import { BrandLogo } from "@/components/ui/LogoMark";
import { getFeaturedProjects } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Portfolio hero collage.
 *
 * Shows three of DevRox's own project covers fanned as physical cards, so the
 * /portfolio index opens on the actual work rather than an abstract graphic.
 * These are our generated case-study covers — not client logos — which is why
 * the two rear cards are marked decorative and only the front one carries alt
 * text. No client JavaScript: the fan is static CSS transforms.
 */

interface ProjectCollageProps {
  className?: string;
}

/** Rear card placement, back to front. Widths are a share of the stage. */
const rearCardPlacement = [
  "sm:left-0 sm:top-[4%] sm:w-[56%] sm:rotate-[-4deg]",
  "sm:right-0 sm:top-[1%] sm:w-[56%] sm:rotate-[6deg]",
] as const;

export async function ProjectCollage({ className }: ProjectCollageProps) {
  const [front, ...rear] = (await getFeaturedProjects()).slice(0, 3);

  if (!front) return null;

  return (
    <div className={cn("relative isolate px-4 py-6 sm:px-8", className)}>
      {/* Engineering grid + a single soft brand wash, matching the hero panels. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-blueprint mask-fade-b opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-4 -z-10 size-72 -translate-x-1/2 rounded-full bg-brand-500/10 blur-[100px] sm:size-96"
      />

      <div className="relative w-full sm:aspect-[16/9]">
        {rear.map((project, index) => (
          <div
            key={project.id}
            aria-hidden
            className={cn(
              "absolute z-0 hidden aspect-[16/9] overflow-hidden rounded-panel border border-ink-200 bg-ink-25 shadow-card sm:block",
              rearCardPlacement[index],
            )}
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 34vw, 40vw"
              loading="eager"
              className="object-cover"
            />
          </div>
        ))}

        <div className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-panel border border-ink-200 bg-ink-25 shadow-card sm:absolute sm:left-1/2 sm:top-[22%] sm:w-[64%] sm:-translate-x-1/2 sm:rotate-[2deg]">
          <Image
            src={front.image}
            alt={front.imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 92vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          {/* Watermark logo - bottom right */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-2 z-20 opacity-5"
          >
            <BrandLogo tone="inverse" className="h-6 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
