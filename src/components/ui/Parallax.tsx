"use client";

/**
 * Lightweight parallax wrapper.
 *
 * Moves its child at a fraction of the scroll speed, creating a depth effect.
 *
 * All active instances share a single scroll handler: one requestAnimationFrame
 * reads every clip rect in one batch (one layout reflow), then writes every
 * transform in one batch (no forced layout between reads and writes). This
 * replaces the previous per-instance pattern where 6 elements each called
 * getBoundingClientRect() independently, causing 6 layout reads per frame.
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

/* -----------------------------------------------------------------------
   Shared scroll handler

   Every instance reads getBoundingClientRect(), which forces a layout
   reflow. Six instances doing that independently = six layout reads per
   scroll frame. One shared handler reads all rects in a single batch
   (browser resolves layout once) and writes all transforms in a second
   batch. Total: 1 layout + N compositor-only writes per frame.
----------------------------------------------------------------------- */

type Instance = {
  clip: HTMLElement;
  inner: HTMLElement;
  speed: number;
  lastOffset: number;
};

const active = new Set<Instance>();
let frame = 0;

function applyAll(): void {
  frame = 0;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  /* Phase 1 — read all rects in one pass (single layout). */
  const rects: DOMRect[] = [];
  const items: Instance[] = [];
  for (const inst of active) {
    rects.push(inst.clip.getBoundingClientRect());
    items.push(inst);
  }

  /* Phase 2 — write all transforms (no layout reads between). */
  for (let i = 0; i < items.length; i++) {
    const inst = items[i];
    const rect = rects[i];

    /* Fully above or below the viewport — leave the transform where it is. */
    if (rect.bottom < 0 || rect.top > vh) continue;

    const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
    const offset = (progress - 0.5) * rect.height * inst.speed;

    /* Sub-pixel changes are invisible but still cost a composite. */
    if (Math.abs(offset - inst.lastOffset) < 0.5) continue;
    inst.lastOffset = offset;

    /* translate3d keeps the layer on the compositor. */
    inst.inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

function onScroll(): void {
  if (frame || active.size === 0) return;
  frame = requestAnimationFrame(applyAll);
}

function startListening(): void {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}

function stopListening(): void {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
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

    const inst: Instance = { clip, inner, speed, lastOffset: Number.NaN };

    let visible = false;

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
            if (!active.has(inst)) {
              active.add(inst);
              if (active.size === 1) startListening();
            }
          } else {
            inner.style.willChange = "";
            active.delete(inst);
            if (active.size === 0) stopListening();
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
      active.delete(inst);
      if (active.size === 0) stopListening();
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
