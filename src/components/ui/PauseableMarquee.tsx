"use client";

/**
 * Wraps a marquee track and pauses its CSS animation when the strip scrolls
 * out of the viewport. Saves compositor work and battery on long pages with
 * multiple marquee strips (homepage has two: tech + client logos).
 *
 * The animation resumes instantly on re-entry, so the user never notices.
 */

import { useEffect, useRef, type ReactNode } from "react";

interface PauseableMarqueeProps {
  children: ReactNode;
  className?: string;
}

export function PauseableMarquee({
  children,
  className,
}: PauseableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
