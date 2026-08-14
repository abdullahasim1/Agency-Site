import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { TechBadge } from "@/components/ui/TechBadge";
import { sharedCopy } from "@/data/pages";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  /** `h3` inside a section that already has an h2. */
  as?: "h3" | "h2";
  className?: string;
}

const iconTones = {
  brand: "bg-brand-50 text-brand-600 ring-brand-100",
  violet: "bg-accent-violet/10 text-[#6d3fd4] ring-accent-violet/15",
  cyan: "bg-accent-cyan/10 text-[#0b7285] ring-accent-cyan/20",
} as const;

/**
 * Service card, shared by the homepage grid and the /services listing.
 *
 * The whole card is a link target via an inset overlay, so the hit area is the
 * full card while the accessible name stays on a single anchor.
 */
export function ServiceCard({
  service,
  as: Tag = "h3",
  className,
}: ServiceCardProps) {
  return (
    <GlowCard
      as="article"
      accent={service.accent}
      padding="md"
      className={cn("flex h-full flex-col", className)}
    >
      <span
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-[0.875rem] ring-1",
          iconTones[service.accent],
        )}
      >
        <Icon name={service.icon} className="size-[1.375rem]" />
      </span>

      <Tag className="type-h4 mt-5">
        <Link
          href={`/services/${service.slug}`}
          className="after:absolute after:inset-0 after:rounded-card after:content-['']"
        >
          {service.title}
        </Link>
      </Tag>

      <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
        {service.shortDescription}
      </p>

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
        {service.technologies.slice(0, 4).map((tech) => (
          <li key={tech}>
            <TechBadge name={tech} tone={service.accent} />
          </li>
        ))}
        {service.technologies.length > 4 ? (
          <li>
            <Badge tone="neutral">
              +{service.technologies.length - 4}
            </Badge>
          </li>
        ) : null}
      </ul>

      <p className="mt-6 flex items-center gap-1.5 pt-1 text-sm font-medium text-brand-700 transition-colors group-hover/card:text-brand-600">
        {sharedCopy.actions.learnMore}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover/card:translate-x-1"
          aria-hidden
        />
      </p>
    </GlowCard>
  );
}
