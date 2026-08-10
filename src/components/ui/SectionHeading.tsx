import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  /** h2 by default; use h1 only for a page's single top-level heading. */
  as?: "h1" | "h2" | "h3";
  /** Rendered to the right on wide screens, typically a link or button. */
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

/**
 * Every section opens with this, which is what keeps the vertical rhythm and
 * type hierarchy identical across nine different section components.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  as: Tag = "h2",
  action,
  className,
  tone = "light",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        action && "lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className,
      )}
    >
      <Reveal className={cn("max-w-3xl", centered && "mx-auto text-center")}>
        {eyebrow ? (
          <Eyebrow
            align={centered ? "center" : "start"}
            tone={tone === "dark" ? "brand" : "brand"}
            className="mb-4"
          >
            {eyebrow}
          </Eyebrow>
        ) : null}

        <Tag
          className={cn(
            Tag === "h1" ? "type-display" : "type-h2",
            tone === "dark" && "text-white",
          )}
        >
          {title}
        </Tag>

        {description ? (
          <p
            className={cn(
              "type-lead mt-5 max-w-2xl",
              centered && "mx-auto",
              tone === "dark" ? "text-ink-300" : "text-ink-600",
            )}
          >
            {description}
          </p>
        ) : null}
      </Reveal>

      {action ? (
        <Reveal delay={0.1} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
