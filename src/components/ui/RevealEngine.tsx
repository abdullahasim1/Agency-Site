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
   not "pending" is visible. */
const PENDING = "pending";
const REVEALED = "in";

const seen = new WeakSet<Element>();
const pending = new Set<Element>();

let observer: IntersectionObserver | null = null;

function reveal(node: Element): void {
  pending.delete(node);
  observer?.unobserve(node);
  node.setAttribute("data-reveal", REVEALED);
}

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!pending.has(entry.target)) continue;

        const rect = entry.boundingClientRect;
        const hasBox = rect.width > 0 || rect.height > 0;
        const scrolledPast =
          hasBox &&
          (entry.rootBounds
            ? rect.bottom <= entry.rootBounds.top
            : rect.bottom <= 0);

        if (entry.isIntersecting || scrolledPast) {
          reveal(entry.target);
        }
      }
    },
    {
      rootMargin: "250px 0px 50px 0px",
      threshold: 0,
    },
  );

  return observer;
}

/**
 * Classifies candidates using a single batched read pass followed by a write pass.
 */
function scan(): void {
  if (typeof window === "undefined") return;

  const fresh: Element[] = [];
  for (const node of document.querySelectorAll("[data-reveal]")) {
    if (seen.has(node)) continue;
    seen.add(node);
    fresh.push(node);
  }

  if (fresh.length === 0) return;

  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const rects = fresh.map((node) => node.getBoundingClientRect());

  const obs = getObserver();

  for (let i = 0; i < fresh.length; i += 1) {
    const rect = rects[i];
    const node = fresh[i];

    // Already on screen or within top margin: stays visible
    if (rect.bottom > 0 && rect.top < viewportH + 200) {
      node.setAttribute("data-reveal", REVEALED);
      continue;
    }

    node.setAttribute("data-reveal", PENDING);
    pending.add(node);
    obs.observe(node);
  }
}

/**
 * Renders nothing. Mounted once in the (site) layout.
 */
export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    // Run after initial paint so it doesn't block hydration or FCP
    const timer = requestAnimationFrame(() => {
      scan();
    });

    return () => {
      cancelAnimationFrame(timer);
      for (const node of pending) {
        if (node.isConnected) continue;
        pending.delete(node);
        observer?.unobserve(node);
      }
    };
  }, [pathname]);

  return null;
}
