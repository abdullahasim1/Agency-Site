"use client";

import { useEffect, useRef } from "react";

import { useInViewOnce, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Milliseconds for the full count-up. */
  duration?: number;
  className?: string;
  decimals?: number;
}

/** Ease-out cubic: fast start, gentle settle. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts up when scrolled into view.
 *
 * Implemented on requestAnimationFrame rather than a spring so the final value
 * is exact and the number never overshoots. Reduced-motion users and any
 * no-JavaScript render see the final value immediately.
 */
export function AnimatedCounter({
  value,
  prefix,
  suffix,
  duration = 1600,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const [setNode, inView] = useInViewOnce(0.5);
  const reduceMotion = usePrefersReducedMotion();
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || reduceMotion || !textRef.current) return;

    let frame = 0;
    let start: number | null = null;
    const target = textRef.current;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = value * easeOutCubic(progress);

      target.textContent = current.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduceMotion, decimals]);

  const initialFormatted = (reduceMotion ? value : 0).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      ref={(node: HTMLSpanElement | null) => {
        containerRef.current = node;
        setNode(node);
      }}
      className={cn("nums-tabular", className)}
    >
      {/* The accessible value is always the final number, never the tween. */}
      <span aria-hidden>
        {prefix}
        <span ref={textRef}>{initialFormatted}</span>
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-US")}
        {suffix}
      </span>
    </span>
  );
}
