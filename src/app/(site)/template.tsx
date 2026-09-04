import type { ReactNode } from "react";

/**
 * Page transition.
 *
 * Uses a CSS animation instead of framer-motion to avoid shipping the
 * animation library on every page navigation. The animation is a short
 * opacity fade that doesn't delay LCP.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}