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
  default: "max-w-[80rem] 2xl:max-w-[88rem] 3xl:max-w-[96rem] 4xl:max-w-[110rem]",
  wide: "max-w-[90rem] 2xl:max-w-[100rem] 3xl:max-w-[112rem] 4xl:max-w-[128rem]",
  prose: "max-w-[46rem] 2xl:max-w-[52rem]",
} as const;

/**
 * The only place horizontal page padding is defined. Every section uses this so
 * content stays aligned from 320px mobile to 5K Ultra-HD monitors.
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
        "mx-auto w-full px-5 sm:px-6 lg:px-8 2xl:px-12 4xl:px-16",
        widths[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
