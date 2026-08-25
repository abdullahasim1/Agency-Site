"use client";

/**
 * Minimal IntersectionObserver primitives that replace the framer-motion
 * equivalents used by the scroll-reveal components (useInView,
 * useReducedMotion). Same behaviour, a fraction of the runtime cost.
 *
 * The ref is a *callback* ref so callers can attach it to any intrinsic
 * element without fighting TypeScript's invariant RefObject types.
 */

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** True while the media query matches; updates live. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // Server snapshot: never hide content before hydration.
    () => false,
  );
}

/**
 * Calls back once when the node first enters the viewport.
 *
 * Returns a ref callback plus whether the node has been seen. The very first
 * callback also reports whether the node started *out* of view — callers use
 * that to decide whether hiding it for an entrance animation is safe (an
 * above-the-fold node must not be hidden post-paint, which would flash).
 */
export function useInViewOnce(
  amount = 0,
): [setNode: (node: Element | null) => void, inView: boolean, startedOffscreen: boolean] {
  const [inView, setInView] = useState(false);
  const [startedOffscreen, setStartedOffscreen] = useState(false);

  function setNode(node: Element | null) {
    if (!node || inView) return;

    // Decide visibility synchronously so a below-fold node is hidden in the
    // same frame it mounts (no visible flash of unhidden content).
    const rect = node.getBoundingClientRect();
    const offscreen =
      rect.bottom <= 0 ||
      rect.top >= (window.innerHeight || document.documentElement.clientHeight);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          setStartedOffscreen(offscreen);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(node);

    // Pre-populate the offscreen flag for callers that read it immediately.
    if (offscreen) setStartedOffscreen(true);
  }

  return [setNode, inView, startedOffscreen];
}
