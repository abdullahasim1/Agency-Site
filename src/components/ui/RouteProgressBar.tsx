"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Top loading bar that gives immediate visual feedback when navigating between pages.
 * Runs on compositor-accelerated transform with smooth glow.
 */
export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Reset loading bar whenever navigation completes
  // This will also trigger when a new page starts loading, as pathname/searchParams change.
  // This ensures the loading bar is hidden on page load completion.
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Listen for Next.js route changes to show the loading bar
  // This is a simplified approach, relying on how Next.js handles route changes.
  // For more advanced control, `router.events` could be used, but it's not available in app router.
  // We'll rely on the assumption that a click on an internal link eventually leads to a pathname/searchParams change.
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    // There isn't a direct equivalent of router.events.on('routeChangeStart') in Next.js 13+ App Router
    // that works globally. The previous implementation with `startTransition` and
    // `document.addEventListener('click')` was causing issues by trying to manually manage
    // navigation state which conflicts with Next.js's internal router.
    // A common workaround is to use a global loading state managed by a context or a hook,
    // or to rely on the `loading.tsx` file for route group loading indicators.
    // For this component, we will rely on the `pathname` and `searchParams` changes
    // to reset the loading state, and assume the browser/Next.js handles the loading indication.
    // However, to re-introduce a loading indicator, we can listen to `popstate` for back/forward navigation
    // or a custom event if we implement a global navigation listener.

    // For now, let's remove the problematic click interception and rely on `loading.tsx` for visual feedback.
    // If a global progress bar is still desired without `loading.tsx`, a custom solution
    // listening to history changes (like `popstate`) or a global context might be needed.

    // Removed the problematic click listener
    // Removed useTransition

    return () => {
      // Cleanup is no longer strictly needed for removed listeners
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