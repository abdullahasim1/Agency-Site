import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion primitives.
 *
 * The house style is short, small-distance and easing-out: entrances move no
 * more than 16px and never exceed 0.6s. Reduced-motion users are handled twice
 * over — globals.css neutralises durations, and every animated component also
 * checks useReducedMotion() so no transform is applied at all.
 */

export const EASE_OUT_SOFT: Transition["ease"] = [0.22, 1, 0.36, 1];

export const baseTransition: Transition = {
  duration: 0.55,
  ease: EASE_OUT_SOFT,
};

/** Standard scroll-reveal: fade with a small rise. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: baseTransition },
};

/** Parent wrapper that staggers its children's reveal. */
export function staggerContainer(stagger = 0.07, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/**
 * Viewport config used for every scroll reveal, so timing feels consistent.
 *
 * `amount: 0` fires as soon as any part of the element enters the viewport.
 * A percentage threshold (e.g. 0.25) is dangerous on mobile: tall sections
 * like the Services grid can be taller than the viewport itself, so 25% of
 * the element may never be visible at once and the reveal never triggers —
 * leaving the content permanently invisible.
 */
export const revealViewport = { once: true, amount: 0 } as const;

/** Grid item entrance used by portfolio filtering and card grids. */
export const gridItem: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT_SOFT },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.985,
    transition: { duration: 0.25, ease: EASE_OUT_SOFT },
  },
};
