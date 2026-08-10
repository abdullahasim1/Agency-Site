import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "violet" | "cyan" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
  /** Small leading dot, used to mark category badges. */
  dot?: boolean;
}

const tones: Record<BadgeTone, string> = {
  neutral:
    "border-ink-200 bg-ink-50 text-ink-600 " +
    "dark:border-white/10 dark:bg-white/[0.06] dark:text-ink-200",
  brand:
    "border-brand-200 bg-brand-50 text-brand-700 " +
    "dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-200",
  violet:
    "border-accent-violet/25 bg-accent-violet/10 text-[#6d3fd4] " +
    "dark:border-accent-violet/30 dark:bg-accent-violet/15 dark:text-accent-violet-soft",
  cyan:
    "border-accent-cyan/30 bg-accent-cyan/10 text-[#0b7285] " +
    "dark:border-accent-cyan/30 dark:bg-accent-cyan/15 dark:text-accent-cyan-soft",
  outline:
    "border-ink-200 bg-transparent text-ink-600 " +
    "dark:border-white/15 dark:bg-transparent dark:text-ink-300",
};

const dotTones: Record<BadgeTone, string> = {
  neutral: "bg-ink-400",
  brand: "bg-brand-500",
  violet: "bg-accent-violet",
  cyan: "bg-accent-cyan",
  outline: "bg-ink-400",
};

const sizes: Record<BadgeSize, string> = {
  sm: "h-[1.375rem] gap-1.5 px-2 text-[0.6875rem]",
  md: "h-7 gap-2 px-2.5 text-xs",
};

export function Badge({
  children,
  tone = "neutral",
  size = "sm",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border font-medium leading-none tracking-tight",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", dotTones[tone])}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
