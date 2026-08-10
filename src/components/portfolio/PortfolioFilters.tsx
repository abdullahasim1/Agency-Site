"use client";

import { motion, useReducedMotion } from "framer-motion";

import { portfolioCopy } from "@/data/pages";
import type { ProjectCategory } from "@/data/projects";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** `"All"` is the internal sentinel; its visible label is editable copy. */
export type PortfolioFilter = ProjectCategory | "All";

interface PortfolioFiltersProps {
  filters: readonly PortfolioFilter[];
  active: PortfolioFilter;
  onChange: (filter: PortfolioFilter) => void;
  /** Project count per filter, rendered beside each label. */
  counts: Record<string, number>;
}

/**
 * Category filters.
 *
 * Implemented as a tablist so arrow keys move between filters, which is what a
 * keyboard user expects from a single-select control of this kind. The active
 * pill is a shared layout element, so it slides rather than jumping.
 */
export function PortfolioFilters({
  filters,
  active,
  onChange,
  counts,
}: PortfolioFiltersProps) {
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    if (delta === 0) return;
    event.preventDefault();

    const next = (index + delta + filters.length) % filters.length;
    onChange(filters[next]);

    const buttons = event.currentTarget.parentElement?.querySelectorAll(
      "[role='tab']",
    );
    (buttons?.[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={portfolioCopy.grid.filtersLabel}
      className="-mx-1 flex flex-wrap items-center gap-1.5 px-1"
    >
      {filters.map((filter, index) => {
        const isActive = filter === active;

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            id={`portfolio-tab-${filter.replace(/\s+/g, "-").toLowerCase()}`}
            aria-selected={isActive}
            aria-controls="portfolio-grid"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(filter)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-medium",
              "transition-colors duration-200",
              isActive
                ? "text-white"
                : "border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-950",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={reduceMotion ? undefined : "portfolio-filter-pill"}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-pill bg-ink-950"
                transition={{ duration: 0.32, ease: EASE_OUT_SOFT }}
              />
            ) : null}
            <span className="relative">
              {filter === "All" ? portfolioCopy.grid.allFilterLabel : filter}
            </span>
            <span
              className={cn(
                "relative nums-tabular text-xs",
                isActive ? "text-ink-400" : "text-ink-400",
              )}
            >
              {counts[filter] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
