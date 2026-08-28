"use client";

/**
 * Lightweight parallax wrapper.
 *
 * Moves its child at a fraction of the scroll speed, creating a depth effect.
 * Uses only `transform: translateY()` — a compositor-only property that never
 * triggers layout or paint — so the effect costs zero main-thread work per
 * frame after the initial observe.
 *
 * The element is wrapped in a container whose overflow is clipped, so the
 * parallaxed child never causes the page to grow taller.
 *
 * Respects `prefers-reduced-motion: reduce` — the child renders at its
 * natural position with no transform.
 */

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** Pixels of travel per 1px of scroll. 0.3 = gentle, 0.6 = noticeable. */
  speed?: number;
  /** Extra class on the outer clip container. */
  className?: string;
  /** Inline style on the outer clip container. */
  style?: CSSProperties;
}

export function Parallax({
  children,
  speed = 0.3,
  className,
  style,
}: ParallaxProps) {
  const clipRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const clip = clipRef.current;
    const inner = innerRef.current;
    if (!clip || !inner) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = clip.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Element is fully above or below viewport — skip the transform.
        if (rect.bottom < 0 || rect.top > vh) {
          ticking = false;
          return;
        }

        // Progress: 0 when the element's top hits the viewport bottom,
        // 1 when the element's bottom leaves the viewport top.
        const progress = 1 - (rect.top + rect.height) / (vh + rect.height);

        // Map progress (0→1) to a pixel offset centred around 0.
        const maxTravel = rect.height * speed;
        setOffset((progress - 0.5) * maxTravel);

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once to set initial position.
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion, speed]);

  // Apply the transform directly — React batches state updates so this
  // only repaints once per rAF frame.
  const transform = reduceMotion
    ? undefined
    : `translateY(${offset}px)`;

  return (
    <div
      ref={clipRef}
      className={cn("overflow-hidden", className)}
      style={style}
    >
      <div
        ref={innerRef}
        style={{
          transform,
          willChange: reduceMotion ? undefined : "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
