import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-reveal primitives.
 *
 * These are deliberately *server* components. They used to be client
 * components holding an IntersectionObserver and a piece of React state each,
 * and the site renders 87 of them — every one a client boundary whose children
 * React had to serialise into the RSC flight payload and then hydrate on the
 * other side. All that machinery ever did was toggle one attribute.
 *
 * So the attribute ships empty — "candidate, not yet decided", and visible —
 * and one client component (RevealEngine) measures every candidate in a single
 * batch, marks only the ones below the fold "pending", and flips them to "in"
 * as they arrive. Same behaviour, no client boundary here.
 *
 * Nothing is hidden before that measurement, which is the point: content above
 * the fold is never invisible while the bundle loads, and a page whose
 * JavaScript never runs stays fully readable.
 */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay, used to hand-tune small sequences. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
}

/** Fades and lifts its children in when they first reach the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: RevealProps) {
  const Tag = as;

  return (
    <Tag
      data-reveal=""
      style={
        {
          "--reveal-y": `${y}px`,
          /* Set only when non-zero: an inline `0s` would beat the stagger rule
             in globals.css, which is where a StaggerItem's delay comes from. */
          ...(delay ? { "--reveal-delay": `${delay}s` } : null),
        } as CSSProperties
      }
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child. */
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
}

/**
 * Parent for staggered lists. Pair with <StaggerItem> children.
 *
 * Carries the timing variables; globals.css derives each child's delay from its
 * `nth-child` position, so the sequence costs no JavaScript at all.
 */
export function Stagger({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = "div",
}: StaggerProps) {
  const Tag = as;

  return (
    <Tag
      data-stagger=""
      style={
        {
          "--stagger-step": `${stagger}s`,
          "--stagger-delay": `${delay}s`,
        } as CSSProperties
      }
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article";
}

/** One animated child inside a <Stagger>. */
export function StaggerItem({
  children,
  className,
  y = 14,
  as = "div",
}: StaggerItemProps) {
  const Tag = as;

  return (
    <Tag
      data-reveal=""
      style={{ "--reveal-y": `${y}px` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
