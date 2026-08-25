"use client";

import { useEffect, useRef, useState } from "react";

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
  const spanRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      // Jump straight to the final value on the next frame — no tween, and no
      // synchronous state update inside the effect body.
      const settle = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(settle);
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(value * easeOutCubic(progress));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduceMotion]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      ref={(node: HTMLSpanElement | null) => {
        spanRef.current = node;
        setNode(node);
      }}
      className={cn("nums-tabular", className)}
    >
      {/* The accessible value is always the final number, never the tween. */}
      <span aria-hidden>
        {prefix}
        {formatted}
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
