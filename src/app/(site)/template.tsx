"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { EASE_OUT_SOFT } from "@/lib/motion";

/**
 * Page transition.
 *
 * template.tsx re-mounts on every navigation, which is exactly what a route
 * transition needs. Kept to a short opacity fade with no transform: anything
 * larger would delay the largest contentful paint on entry.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: EASE_OUT_SOFT }}
    >
      {children}
    </motion.div>
  );
}
