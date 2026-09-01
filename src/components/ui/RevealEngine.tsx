"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The one client component behind every scroll reveal on the site.
 *
 * <Reveal>/<StaggerItem> are server components (see Reveal.tsx) that ship a
 * bare `data-reveal` attribute and nothing else. This engine is the only
 * JavaScript involved: it finds those candidates, decides which ones start
 * below the fold, hides just those, and reveals them as they arrive.
 *
 * Two properties matter more than the animation itself:
 *
 * 1. Nothing is hidden until it has been measured, and a node already on
 *    screen is never touched. So the hero — the LCP element — cannot be blanked
 *    out waiting for this bundle, and a page whose JavaScript fails stays
 *    readable rather than becoming a column of invisible boxes.
 * 2. Every measurement happens in one batched read pass. Reading a rect after
 *    writing the DOM forces a synchronous layout; the previous per-instance
 *    implementation did that ~83 times on the homepage and it was the single
 *    largest source of the 358 layouts Chrome reported for one load.
 */

/* `in` is only a marker: the CSS styles the hidden state, so anything that is
   not "pending" is visible. Using a value rather than removing the attribute
   keeps a revealed node out of the next scan's candidate set. */
const PENDING = "pending";
const REVEALED = "in";

/* Module scope, not component state: the engine mounts once, and none of this
   should be re-created by a re-render. `seen` is weak so detached nodes are
   collectable; `pending` has to be strong to be iterable, and is pruned. */
const seen = new WeakSet<Element>();
const pending = new Set<Element>();

let observer: IntersectionObserver | null = null;

function reveal(node: Element): void {
  pending.delete(node);
  observer?.unobserve(node);
  node.setAttribute("data-reveal", REVEALED);
  if (pending.size === 0) stopSweeping();
}

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!pending.has(entry.target)) continue;

      /*
       * `isIntersecting` alone is not a sufficient trigger.
       *
       * An observer only reports what was true at a frame it sampled. A fast
       * flick, or a jump straight to an anchor, can move a node from below the
       * viewport to above it between two samples — never observed intersecting,
       * so the callback never runs and the node keeps `pending`, which means
       * `opacity: 0` forever. That is missing content, not a missed animation.
       *
       * So fire when the node has ended up *above* the viewport too. There is
       * no entrance left to animate there; the point is only that nothing is
       * left invisible.
       *
       * The area test is what keeps that from firing for everything at once: a
       * node inside a `content-visibility`-skipped section has no boxes, so its
       * rect is 0×0 at the origin, which satisfies "bottom is above the top of
       * the viewport" while actually being thousands of pixels below it. The
       * sweep handles those once they have a box.
       */
      const rect = entry.boundingClientRect;
      const hasBox = rect.width > 0 || rect.height > 0;
      const scrolledPast =
        hasBox &&
        (entry.rootBounds
          ? rect.bottom <= entry.rootBounds.top
          : rect.bottom <= 0);

      if (entry.isIntersecting || scrolledPast) reveal(entry.target);
    }
  });

  return observer;
}

/* ---------------------------------------------------------------------------
   Safety-net sweep

   The observer is the only thing that can clear `pending`, and the homepage's
   per-section `content-visibility: auto` gives it two blind spots:

   1. A skipped subtree has no boxes, so its descendants produce no entries at
      all. Scroll past a section faster than the browser decides to render it
      and its cards were never observed — not intersecting, and not "scrolled
      past" either, because there was nothing to report.
   2. Even when the section does render, that costs a layout of ~1,600px of
      grid; on a slow device the sample can land after the reader moved on.

   The sweep closes both. It runs when scrolling *stops*, not per frame, and
   reveals anything still pending that is no longer below the fold. Listeners
   are attached only while nodes are pending, so a fully-revealed page pays
   nothing.
--------------------------------------------------------------------------- */

let sweepListening = false;
let sweepTimer = 0;

function sweepPending(): void {
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const due: Element[] = [];

  /* Read phase. Revealing writes an attribute, and a write between two reads
     forces a fresh layout for the second, so collect first and write after. */
  for (const node of pending) {
    /* Unmounted before it was ever seen — drop it rather than measure it. */
    if (!node.isConnected) {
      pending.delete(node);
      observer?.unobserve(node);
      continue;
    }

    const rect = node.getBoundingClientRect();

    /* A zero-area rect means an ancestor is still skipping its contents. There
       is nothing to reveal yet and no reason to guess. */
    if (rect.width === 0 && rect.height === 0) continue;

    /* Still below the fold: the observer will handle it normally. */
    if (rect.top >= viewportH) continue;

    due.push(node);
  }

  /* Write phase. */
  for (const node of due) reveal(node);

  if (pending.size === 0) stopSweeping();
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

/**
 * Classifies every candidate that has not been classified yet.
 *
 * Strictly two phases. Phase one only reads, so the browser resolves layout
 * once for the whole page instead of once per element; phase two only writes.
 */
function scan(): void {
  const fresh: Element[] = [];

  for (const node of document.querySelectorAll("[data-reveal]")) {
    if (seen.has(node)) continue;
    seen.add(node);
    fresh.push(node);
  }

  if (fresh.length === 0) return;

  /* Phase 1 — read only. */
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const rects = fresh.map((node) => node.getBoundingClientRect());

  /* Phase 2 — write only. */
  for (let i = 0; i < fresh.length; i += 1) {
    const rect = rects[i];

    /* Already on screen: it shipped visible and stays visible. There is no
       entrance to play for something the reader is already looking at. */
    if (rect.bottom > 0 && rect.top < viewportH) continue;

    const node = fresh[i];
    node.setAttribute("data-reveal", PENDING);
    pending.add(node);
    getObserver().observe(node);
  }

  if (pending.size > 0) startSweeping();
}

/**
 * Renders nothing. Mounted once in the (site) layout.
 *
 * Re-scans on navigation because a client-side route change swaps in a whole
 * new set of candidates while this component stays mounted. `seen` makes the
 * rescan idempotent, so nodes that survive the transition are not re-measured.
 */
export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    scan();

    /* Hidden nodes left behind by the outgoing page would otherwise sit in
       `pending` forever, keeping the sweep listeners alive. */
    return () => {
      for (const node of pending) {
        if (node.isConnected) continue;
        pending.delete(node);
        observer?.unobserve(node);
      }
      if (pending.size === 0) stopSweeping();
    };
  }, [pathname]);

  return null;
}

