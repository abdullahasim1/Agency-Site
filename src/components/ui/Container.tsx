import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** `wide` for full-bleed grids, `prose` for long-form reading measure. */
  width?: "default" | "wide" | "prose";
}

const widths = {
  default: "max-w-[80rem]",
  wide: "max-w-[90rem]",
  prose: "max-w-[46rem]",
} as const;

/**
 * The only place horizontal page padding is defined. Every section uses this so
 * content stays aligned from 320px to 1920px.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
  width = "default",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        widths[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
