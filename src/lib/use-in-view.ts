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

/* ---------------------------------------------------------------------------
   Safety-net sweep

   An IntersectionObserver is the only thing that can move a node out of
   `data-reveal="pending"`, and `pending` means `opacity: 0`. So any path where
   the observer never delivers an entry leaves content permanently invisible —
   a correctness bug, not a missed animation.

   Two such paths exist here, both created by the per-section
   `content-visibility: auto` on the homepage:

   1. A skipped subtree has no boxes, so its descendants produce no entries at
      all. If the reader scrolls past a section faster than the browser decides
      to render it, its cards are never observed — not intersecting, and not
      "scrolled past" either, because there was nothing to report.
   2. Even when the section does render, doing so costs a layout of ~1,600px of
      grid. On a slow device the intersection sample can land after the reader
      has already moved on.

   The sweep closes both. It runs when scrolling *stops* — not per frame — and
   reveals anything still pending that is no longer below the fold. The listener
   is attached only while nodes are pending and removed as soon as the set
   empties, so a fully-revealed page pays nothing.
--------------------------------------------------------------------------- */

const pendingNodes = new Set<Element>();
let sweepListening = false;
let sweepTimer = 0;

function revealNode(node: Element): void {
  for (const [threshold, map] of pendingByThreshold) {
    const entry = map.get(node);
    if (!entry) continue;
    map.delete(node);
    observersByThreshold.get(threshold)?.unobserve(node);
    entry.callback();
    return;
  }
}

function sweepPending(): void {
  const viewportH = window.innerHeight || document.documentElement.clientHeight;

  for (const node of pendingNodes) {
    /* Unmounted before it was ever seen — drop it rather than measure it. */
    if (!node.isConnected) {
      pendingNodes.delete(node);
      continue;
    }

    const rect = node.getBoundingClientRect();

    /* A zero-height rect means an ancestor is still skipping its contents;
       there is nothing to reveal yet and no reason to guess. */
    if (rect.width === 0 && rect.height === 0) continue;

    /* Still below the fold: the observer will handle it normally. */
    if (rect.top >= viewportH) continue;

    pendingNodes.delete(node);
    revealNode(node);
  }

  if (pendingNodes.size === 0) stopSweeping();
}

function onScrollEnd(): void {
  if (sweepTimer) return;
  /* Coalesce: one sweep per settle, on an idle-ish tick after the scroll. */
  sweepTimer = window.setTimeout(() => {
    sweepTimer = 0;
    sweepPending();
  }, 150);
}

function startSweeping(): void {
  if (sweepListening) return;
  sweepListening = true;
  /* `scrollend` where available; the debounced `scroll` covers the rest and is
     harmless where both fire, because onScrollEnd coalesces. */
  window.addEventListener("scrollend", onScrollEnd, { passive: true });
  window.addEventListener("scroll", onScrollEnd, { passive: true });
  window.addEventListener("resize", onScrollEnd, { passive: true });
}

function stopSweeping(): void {
  if (!sweepListening) return;
  sweepListening = false;
  window.removeEventListener("scrollend", onScrollEnd);
  window.removeEventListener("scroll", onScrollEnd);
  window.removeEventListener("resize", onScrollEnd);
  if (sweepTimer) {
    clearTimeout(sweepTimer);
    sweepTimer = 0;
  }
}

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

        /*
         * `isIntersecting` alone is not a sufficient trigger.
         *
         * An IntersectionObserver only reports what was true at a frame it
         * actually sampled. A fast flick — or a jump straight to an anchor —
         * can move a node from below the viewport to above it between two
         * samples, so it is never *observed* intersecting and the callback
         * never runs. The node then keeps `data-reveal="pending"`, which means
         * `opacity: 0` forever: content silently missing from the page.
         *
         * So also fire when the node has ended up *above* the viewport. There
         * is no entrance left to animate at that point; the goal is only to
         * guarantee the element is never left invisible.
         */
        const scrolledPast = entry.rootBounds
          ? entry.boundingClientRect.bottom <= entry.rootBounds.top
          : entry.boundingClientRect.bottom <= 0;

        if (entry.isIntersecting || scrolledPast) {
          map.delete(entry.target);
          pendingNodes.delete(entry.target);
          observer?.unobserve(entry.target);
          pending.callback();
        }
      }

      if (pendingNodes.size === 0) stopSweeping();
    },
    { threshold },
  );

  observersByThreshold.set(threshold, observer);
  return observer;
}

const observersByThreshold = new Map<number, IntersectionObserver>();

type ViewState = { inView: boolean; startedOffscreen: boolean };

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
 * render, so an inline callback that measures the node meant a fresh
 * getBoundingClientRect() after every state update — and because those reads
 * interleave with React's DOM writes, each one forces a synchronous layout.
 * With ~83 Reveal/StaggerItem instances on the homepage that was ~166 forced
 * layouts during hydration, and it was the bulk of the 4.7s Lighthouse
 * attributed to Style & Layout. Holding the identity steady collapses that to
 * one measurement per node, all inside a single commit, so the browser flushes
 * layout once.
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

      /*
       * Decide visibility synchronously so a below-fold node is hidden in the
       * same commit it mounts (no visible flash of unhidden content). This is
       * the only layout read in the hook, and it happens once per node.
       */
      const rect = node.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.bottom > 0 && rect.top < viewportH) {
        /* Already on screen: there is nothing to animate in, so skip the
           observer entirely rather than registering a node that would fire
           immediately. */
        setState(VISIBLE_ON_MOUNT);
        return;
      }

      setState(PENDING);

      let map = pendingByThreshold.get(amount);
      if (!map) {
        map = new WeakMap();
        pendingByThreshold.set(amount, map);
      }

      map.set(node, { callback: () => setState(REVEALED) });
      pendingNodes.add(node);
      getSharedObserver(amount).observe(node);
      startSweeping();
    },
    [amount],
  );

  return [setNode, state.inView, state.startedOffscreen];
}
