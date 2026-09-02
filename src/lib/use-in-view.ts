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

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

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
  callback: () => void;
};

const pendingByThreshold = new Map<number, WeakMap<Element, PendingEntry>>();

const observersByThreshold = new Map<number, IntersectionObserver>();

function getSharedObserver(threshold: number): IntersectionObserver {
  let observer = observersByThreshold.get(threshold);
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      const map = pendingByThreshold.get(threshold);
      if (!map) return;

      for (const entry of entries) {
        const pending = map.get(entry.target);
        if (!pending) continue;

        const rect = entry.boundingClientRect;
        const hasBox = rect.width > 0 || rect.height > 0;
        const scrolledPast =
          hasBox &&
          (entry.rootBounds
            ? rect.bottom <= entry.rootBounds.top
            : rect.bottom <= 0);

        if (entry.isIntersecting || scrolledPast) {
          map.delete(entry.target);
          observer?.unobserve(entry.target);
          pending.callback();
        }
      }
    },
    { threshold, rootMargin: "250px 0px 50px 0px" },
  );

  observersByThreshold.set(threshold, observer);
  return observer;
}

type ViewState = { inView: boolean; startedOffscreen: boolean };

/* ---------------------------------------------------------------------------
   Batched first measurement

   Every instance needs one answer at mount: am I on screen right now? Asking
   per instance is what made the page slow. A ref callback runs during React's
   commit, so the sequence per node was write DOM → getBoundingClientRect() →
   setState → React re-renders and writes DOM again → next node reads. Each read
   followed a write, so each one forced a synchronous layout, and with ~83
   Reveal/StaggerItem instances on the homepage that alone accounted for most of
   the 358 layouts Chrome reported for a single load.

   Splitting it into phases fixes it without changing what anyone observes.
   Callbacks only enqueue; one microtask then reads all the rects back to back
   (the browser resolves layout once, because nothing writes in between) and
   applies the states afterwards. React batches the setStates from that
   microtask into a single render, so the DOM is written once too.

   The microtask still runs before paint, so a below-fold node is hidden before
   the reader could ever see it — the flash this measurement exists to prevent
   stays prevented.
--------------------------------------------------------------------------- */

type BatchItem = {
  node: Element;
  amount: number;
  apply: (state: ViewState) => void;
};

const measureQueue: BatchItem[] = [];
let measureScheduled = false;

function flushMeasureQueue(): void {
  measureScheduled = false;
  if (measureQueue.length === 0) return;

  const items = measureQueue.splice(0, measureQueue.length);
  const viewportH = window.innerHeight || document.documentElement.clientHeight;

  /* Phase 1 — read only. */
  const rects = items.map((item) => item.node.getBoundingClientRect());

  /* Phase 2 — write only. */
  for (let i = 0; i < items.length; i += 1) {
    const { node, amount, apply } = items[i];
    const rect = rects[i];

    if (rect.bottom > 0 && rect.top < viewportH) {
      /* Already on screen: nothing to animate in, so never register it. */
      apply(VISIBLE_ON_MOUNT);
      continue;
    }

    apply(PENDING);

    let map = pendingByThreshold.get(amount);
    if (!map) {
      map = new WeakMap();
      pendingByThreshold.set(amount, map);
    }

    map.set(node, { callback: () => apply(REVEALED) });
    getSharedObserver(amount).observe(node);
  }
}

const INITIAL: ViewState = { inView: false, startedOffscreen: false };
const VISIBLE_ON_MOUNT: ViewState = { inView: true, startedOffscreen: false };
const PENDING: ViewState = { inView: false, startedOffscreen: true };
const REVEALED: ViewState = { inView: true, startedOffscreen: true };

/**
 * Calls back once when the node first enters the viewport.
 *
 * Returns a ref callback plus whether the node has been seen. The very first
 * callback also reports whether the node started *out* of view — callers use
 * that to decide whether hiding it for an entrance animation is safe (an
 * above-the-fold node must not be hidden post-paint, which would flash).
 *
 * The ref callback is referentially stable, and that is load-bearing rather
 * than tidiness. React re-invokes a ref whose identity changed on every
 * render, so an inline callback would re-register the node after every state
 * update. Holding the identity steady means each node is enqueued exactly
 * once, and the measurement itself is batched (see flushMeasureQueue) so the
 * whole page costs one layout instead of one per instance.
 */
export function useInViewOnce(
  amount = 0,
): [setNode: (node: Element | null) => void, inView: boolean, startedOffscreen: boolean] {
  const [state, setState] = useState<ViewState>(INITIAL);
  /* Guards one-time registration without putting the node in the dep list. */
  const registered = useRef<Element | null>(null);

  const setNode = useCallback(
    (node: Element | null) => {
      if (!node || registered.current === node) return;
      registered.current = node;

      measureQueue.push({ node, amount, apply: setState });

      if (!measureScheduled) {
        measureScheduled = true;
        queueMicrotask(flushMeasureQueue);
      }
    },
    [amount],
  );

  return [setNode, state.inView, state.startedOffscreen];
}
