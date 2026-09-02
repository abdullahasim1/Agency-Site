"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

/**
 * Top loading bar that gives immediate visual feedback when navigating between pages.
 * Runs on compositor-accelerated transform with smooth glow.
 */
export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Reset loading bar whenever navigation completes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger the loading bar immediately
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (
        !anchor ||
        !anchor.href ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        // Only trigger for internal page transitions to different URLs
        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname ||
            targetUrl.search !== currentUrl.search)
        ) {
          startTransition(() => {
            setLoading(true);
          });
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2.5px] overflow-hidden bg-brand-500/10"
    >
      <div className="animate-progress-indeterminate h-full w-full bg-gradient-to-r from-brand-500 via-accent-cyan to-brand-600 shadow-[0_0_10px_rgba(61,99,255,0.7)]" />
    </div>
  );
}
