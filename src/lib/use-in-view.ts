"use client";

/**
 * Minimal IntersectionObserver primitives that replace the framer-motion
 * equivalents used by the scroll-reveal components (useInView,
 * useReducedMotion). Same behaviour, a fraction of the runtime cost.
 *
 * The ref is a *callback* ref so callers can attach it to any intrinsic
 * element without fighting TypeScript's invariant RefObject types.
 *
 * Optimization: a single shared IntersectionObserver is reused across all
 * useInViewOnce callers (one per threshold bucket), and a WeakMap tracks
 * pending nodes. This replaces the previous one-observer-per-element pattern
 * which created dozens of observers on the homepage alone.
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

/* ---------------------------------------------------------------------------
   Shared IntersectionObserver pool

   Observers are keyed by threshold so elements with different amounts of
   visibility required still get accurate callbacks. A WeakMap stores the
   pending callbacks so once an element fires, it is automatically cleaned up
   when the node is garbage-collected.
--------------------------------------------------------------------------- */

type PendingEntry = {
  callback: (entry: IntersectionObserverEntry) => void;
  offscreen: boolean;
};

const pendingByThreshold = new Map<number, WeakMap<Element, PendingEntry>>();

function getSharedObserver(
  threshold: number,
): IntersectionObserver {
  let observer = observersByThreshold.get(threshold);
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      const map = pendingByThreshold.get(threshold);
      if (!map) return;

      for (const entry of entries) {
        const pending = map.get(entry.target);
        if (!pending) continue;

        if (entry.isIntersecting) {
          pending.callback(entry);
          map.delete(entry.target);
        }
      }
    },
    { threshold },
  );

  observersByThreshold.set(threshold, observer);
  return observer;
}

const observersByThreshold = new Map<number, IntersectionObserver>();

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
    const viewportH =
      typeof window !== "undefined"
        ? window.innerHeight || document.documentElement.clientHeight
        : 0;
    const offscreen = rect.bottom <= 0 || rect.top >= viewportH;

    // Pre-populate the offscreen flag for callers that read it immediately.
    if (offscreen) setStartedOffscreen(true);

    // Register with the shared observer.
    let map = pendingByThreshold.get(amount);
    if (!map) {
      map = new WeakMap();
      pendingByThreshold.set(amount, map);
    }

    map.set(node, {
      callback: () => {
        setInView(true);
        if (offscreen) setStartedOffscreen(true);
      },
      offscreen,
    });

    getSharedObserver(amount).observe(node);
  }

  return [setNode, inView, startedOffscreen];
}
