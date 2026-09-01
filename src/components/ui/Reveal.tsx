"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Read a CSS custom property from an element's inline style.
 * Unlike getComputedStyle(), this does not trigger a style recalculation.
 * Falls back to a default when the property is absent or non-numeric.
 */
function readInlineCSSVar(
  element: Element | null,
  name: string,
  fallback: number,
): number {
  if (!element) return fallback;
  const raw = (element as HTMLElement).style.getPropertyValue(name);
  if (!raw) return fallback;
  // Strip trailing units ("s", "px") — we only need the number.
  const num = parseFloat(raw);
  return Number.isFinite(num) ? num : fallback;
}

import { useInViewOnce, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay, used to hand-tune small sequences. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
}

/**
 * Scroll-triggered entrance.
 *
 * CSS-driven twin of the original framer-motion variant: the node is marked
 * data-reveal="pending" only when it starts below the viewport and the user
 * has not asked for reduced motion — entering view removes the attribute and
 * globals.css animates the rest. Children are passed in from a server
 * component, so the markup itself stays server-rendered; without JavaScript
 * (or for crawlers) the content renders plainly visible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: RevealProps) {
  const [setNode, inView, startedOffscreen] = useInViewOnce();
  const reduceMotion = usePrefersReducedMotion();

  const Tag = as;
  const pending = !reduceMotion && !inView && startedOffscreen;

  /*
   * Three states, not two. Dropping the attribute entirely once the element is
   * in view also drops the `transition` declared on `[data-reveal]`, so opacity
   * and transform snapped to their final values instead of animating — the
   * reveal was a pop, not a fade. Keeping the attribute with a different value
   * preserves the transition. Nodes that were never pending (above the fold)
   * still get no attribute at all, so `contain: layout style` is not applied to
   * content whose layout was never deferred.
   */
  const revealState = pending ? "pending" : startedOffscreen ? "in" : undefined;

  return (
    <Tag
      ref={setNode}
      data-reveal={revealState}
      style={
        {
          "--reveal-y": `${y}px`,
          transitionDelay: revealState ? `${delay}s` : undefined,
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
 * The container carries the timing variables; each StaggerItem reads its own
 * sibling position at mount to derive the same sequential delay the old
 * framer-motion staggerChildren produced.
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

const MAX_STAGGER_STEPS = 8;
const DEFAULT_STAGGER_STEP_S = 0.07;

/** One animated child inside a <Stagger>. */
export function StaggerItem({
  children,
  className,
  y = 14,
  as = "div",
}: StaggerItemProps) {
  const [setNode, inView, startedOffscreen] = useInViewOnce();
  const reduceMotion = usePrefersReducedMotion();
  const nodeRef = useRef<HTMLElement | null>(null);

  /*
   * Sibling index × parent step reproduces staggerChildren's sequencing.
   *
   * Written straight to the node's style rather than through state: the delay
   * is derived once from a value React does not own, so routing it through a
   * setState only bought an extra render per item — 27 of them on the homepage,
   * each one a commit React had to reconcile. Reads the parent's *inline* style
   * for the CSS variables, which avoids a getComputedStyle() call and the
   * layout flush that comes with it.
   */
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const parent = node.parentElement;
    if (!parent) return;
    const index = Array.prototype.indexOf.call(parent.children, node);
    if (index < 0) return;

    const step = readInlineCSSVar(parent, "--stagger-step", DEFAULT_STAGGER_STEP_S);
    const base = readInlineCSSVar(parent, "--stagger-delay", 0);

    node.style.transitionDelay = `${base + Math.min(index, MAX_STAGGER_STEPS) * step}s`;
  }, []);

  const Tag = as;
  const pending = !reduceMotion && !inView && startedOffscreen;
  const revealState = pending ? "pending" : startedOffscreen ? "in" : undefined;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        nodeRef.current = node;
        setNode(node);
      }}
      data-reveal={revealState}
      style={{ "--reveal-y": `${y}px` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
