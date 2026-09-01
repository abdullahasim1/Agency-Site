"use client";

/**
 * Wraps a marquee track and pauses its CSS animation when the strip scrolls
 * out of the viewport. Saves compositor work and battery on long pages with
 * multiple marquee strips (homepage has two: tech + client logos).
 *
 * The animation resumes instantly on re-entry, so the user never notices.
 * Also respects `prefers-reduced-motion` to disable animations for users who
 * have requested reduced motion.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-in-view";

interface PauseableMarqueeProps {
  children: ReactNode;
  className?: string;
}

export function PauseableMarquee({
  children,
  className,
}: PauseableMarqueeProps) {
  const reduceMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      const container = containerRef.current;
      if (container) {
        const track = container.querySelector<HTMLElement>(".animate-marquee");
        if (track) {
          track.style.animationPlayState = "paused";
        }
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Find the animated child.
    const track = container.querySelector<HTMLElement>(".animate-marquee");
    if (!track) return;

    // Start paused if already off-screen.
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top > vh) {
      track.style.animationPlayState = "paused";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          track.style.animationPlayState = entry.isIntersecting
            ? "running"
            : "paused";
        }
      },
      { threshold: 0 },
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}