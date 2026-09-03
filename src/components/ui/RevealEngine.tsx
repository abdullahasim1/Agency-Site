"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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

function reveal(
  node: Element,
  setPending: (value: (prev: Set<Element>) => Set<Element>) => void,
): void {
  setPending((prev) => {
    const newPending = new Set(prev);
    newPending.delete(node);
    return newPending;
  });
  node.setAttribute("data-reveal", REVEALED);
}

/**
 * Non-blocking scan: registers elements with the IntersectionObserver
 * without calling getBoundingClientRect() on the main thread.
 */
function scan(
  seen: WeakSet<Element>,
  setPending: (value: (prev: Set<Element>) => Set<Element>) => void,
  observerRef: React.RefObject<IntersectionObserver | null>,
): void {
  if (typeof window === "undefined") return;

  const fresh: Element[] = [];
  for (const node of document.querySelectorAll("[data-reveal]")) {
    if (seen.has(node)) continue;
    seen.add(node);
    fresh.push(node);
  }

  if (fresh.length === 0) return;

  const observer = observerRef.current;
  if (!observer) return;

  for (const node of fresh) {
    setPending((prev) => {
      const newPending = new Set(prev);
      newPending.add(node);
      return newPending;
    });
    observer.observe(node);
  }
}

/**
 * Renders nothing. Mounted once in the (site) layout.
 */
export function RevealEngine() {
  const pathname = usePathname();
  const [seen, setSeen] = useState<WeakSet<Element>>(() => new WeakSet());
  const [pending, setPending] = useState<Set<Element>>(() => new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const previousPathnameRef = useRef<string>(pathname);

  // Create observer once and reuse
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!pending.has(entry.target)) return;

            if (entry.isIntersecting) {
              reveal(entry.target, setPending);
              observerRef.current?.unobserve(entry.target);
            } else {
              // Asynchronously calculated bounding box provided by browser compositor
              const rect = entry.boundingClientRect;
              const hasBox = rect.width > 0 || rect.height > 0;
              const scrolledPast =
                hasBox &&
                (entry.rootBounds
                  ? rect.bottom <= entry.rootBounds.top
                  : rect.bottom <= 0);

              if (scrolledPast) {
                reveal(entry.target, setPending);
                observerRef.current?.unobserve(entry.target);
              } else {
                entry.target.setAttribute("data-reveal", PENDING);
              }
            }
          }
        },
        {
          rootMargin: "250px 0px 50px 0px",
          threshold: 0,
        },
      );
    }

    return () => {
      // Cleanup observer on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Reset state when pathname changes to prevent memory leaks
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      // Schedule state reset for next render to avoid synchronous state updates
      setSeen(new WeakSet());
      setPending(new Set());
    }
  }, [pathname]);

  // Schedule scanning during idle callback
  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 1);

    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : window.clearTimeout;

    const handle = schedule(() => {
      scan(seen, setPending, observerRef);
    });

    return () => {
      cancel(handle);
      // Clean up pending nodes that are no longer connected
      // Use state updater function for safe cleanup
      setPending((prev) => {
        const newPending = new Set(prev);
        for (const node of newPending) {
          if (!node.isConnected) {
            newPending.delete(node);
            observerRef.current?.unobserve(node);
          }
        }
        return newPending;
      });
    };
  }, [pathname, seen, pending, observerRef]);

  return null;
}