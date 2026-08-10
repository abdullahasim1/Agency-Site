import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CardAccent = "brand" | "violet" | "cyan" | "none";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  accent?: CardAccent;
  /** Adds the hover lift and border brightening. Off for static panels. */
  interactive?: boolean;
  /** Renders the thin accent rule along the top edge on hover. */
  accentRule?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * The single card surface used across the whole site.
 *
 * "Glow" here is a restrained accent rule and a soft shadow lift on hover, not
 * a neon halo — the hover state is pure CSS, so cards cost no client JS.
 */
const accentRules: Record<CardAccent, string> = {
  brand: "from-brand-500/0 via-brand-500 to-brand-500/0",
  violet: "from-accent-violet/0 via-accent-violet to-accent-violet/0",
  cyan: "from-accent-cyan/0 via-accent-cyan to-accent-cyan/0",
  none: "from-ink-300/0 via-ink-300 to-ink-300/0",
};

const paddings = {
  none: "",
  sm: "p-5",
  md: "p-6 sm:p-7",
  lg: "p-7 sm:p-9",
} as const;

export function GlowCard({
  children,
  className,
  as: Tag = "div",
  accent = "brand",
  interactive = true,
  accentRule = true,
  padding = "md",
}: GlowCardProps) {
  return (
    <Tag
      className={cn(
        "group/card relative isolate overflow-hidden rounded-card border",
        "border-ink-200 bg-white",
        "dark:border-white/10 dark:bg-white/[0.04]",
        interactive && [
          "transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)]",
          "hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift",
          "dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
          "focus-within:-translate-y-1 focus-within:border-ink-300 focus-within:shadow-lift",
        ],
        paddings[padding],
        className,
      )}
    >
      {accentRule ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0",
            "transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100",
            accentRules[accent],
          )}
        />
      ) : null}
      {children}
    </Tag>
  );
}
