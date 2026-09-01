"use client";

/**
 * Lightweight parallax wrapper.
 *
 * Moves its child at a fraction of the scroll speed, creating a depth effect.
 *
 * The offset is written straight to the node's `style.transform` inside a
 * requestAnimationFrame callback. It deliberately does *not* live in React
 * state: `setState` on every scroll frame put a full render, reconcile and
 * commit between the scroll event and the paint, at 60fps, for every instance
 * on the page — and the children here are `blur(130px)` washes, so React was
 * being asked to re-render around the most expensive paint on the site. Writing
 * the transform directly keeps the whole effect on the compositor.
 *
 * A shared IntersectionObserver suspends the work entirely while the container
 * is off-screen, so a parallax layer in the footer costs nothing while the user
 * reads the hero.
 *
 * Respects `prefers-reduced-motion: reduce` — the child renders at its natural
 * position with no transform and no scroll listener.
 */

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (reduceMotion) return;

    const clip = clipRef.current;
    const inner = innerRef.current;
    if (!clip || !inner) return;

    let frame = 0;
    let visible = false;
    let lastOffset = Number.NaN;

    const apply = () => {
      frame = 0;

      const rect = clip.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      /* Fully above or below the viewport — leave the transform where it is. */
      if (rect.bottom < 0 || rect.top > vh) return;

      /*
       * Progress: 0 when the element's top hits the viewport bottom,
       * 1 when the element's bottom leaves the viewport top.
       */
      const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
      const offset = (progress - 0.5) * rect.height * speed;

      /* Sub-pixel changes are invisible but still cost a composite. */
      if (Math.abs(offset - lastOffset) < 0.5) return;
      lastOffset = offset;

      /* translate3d keeps the layer on the compositor. */
      inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame || !visible) return;
      frame = requestAnimationFrame(apply);
    };

    /*
     * Only listen while the container can actually be seen. Attaching and
     * detaching around visibility is cheaper than running the rect read for
     * every instance on every frame of a long scroll.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting === visible) continue;
          visible = entry.isIntersecting;

          if (visible) {
            inner.style.willChange = "transform";
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
          } else {
            window.removeEventListener("scroll", onScroll);
            /* Release the compositor layer while the effect is idle. */
            inner.style.willChange = "";
          }
        }
      },
      /* Start a little before the element scrolls in so the first frame of
         movement is already correct rather than snapping into place. */
      { rootMargin: "200px 0px" },
    );

    observer.observe(clip);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      inner.style.willChange = "";
    };
  }, [reduceMotion, speed]);

  return (
    <div
      ref={clipRef}
      className={cn("overflow-hidden", className)}
      style={style}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
