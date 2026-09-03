"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The one client component behind every scroll reveal on the site.
 * Pure zero-rerender engine: uses module-level Sets so React never re-renders.
 */

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

        if (entry.isIntersecting) {
          reveal(entry.target);
        } else {
          const rect = entry.boundingClientRect;
          const hasBox = rect.width > 0 || rect.height > 0;
          const scrolledPast =
            hasBox &&
            (entry.rootBounds
              ? rect.bottom <= entry.rootBounds.top
              : rect.bottom <= 0);

          if (scrolledPast) {
            reveal(entry.target);
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

  return observer;
}

function scan(): void {
  if (typeof window === "undefined") return;

  const fresh: Element[] = [];
  for (const node of document.querySelectorAll("[data-reveal]")) {
    if (seen.has(node)) continue;
    seen.add(node);
    fresh.push(node);
  }

  if (fresh.length === 0) return;

  const obs = getObserver();
  for (const node of fresh) {
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