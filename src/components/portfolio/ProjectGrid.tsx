"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import {
  PortfolioFilters,
  type PortfolioFilter,
} from "@/components/portfolio/PortfolioFilters";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import type { Project, ProjectCategory } from "@/data/projects";
import { gridItem } from "@/lib/motion";

interface ProjectGridProps {
  projects: Project[];
  categories: readonly ProjectCategory[];
}

/**
 * Filterable project grid.
 *
 * The only stateful part of the portfolio page. Projects arrive already
 * serialised from src/data/projects.ts via the server component, so filtering
 * is a synchronous array operation with no fetching and no loading state.
 */
export function ProjectGrid({ projects, categories }: ProjectGridProps) {
  const [active, setActive] = useState<PortfolioFilter>("All");
  const reduceMotion = useReducedMotion();

  const filters = useMemo<readonly PortfolioFilter[]>(
    () => ["All", ...categories],
    [categories],
  );

  const counts = useMemo(() => {
    const totals: Record<string, number> = { All: projects.length };
    for (const category of categories) {
      totals[category] = projects.filter((project) =>
        project.categories.includes(category),
      ).length;
    }
    return totals;
  }, [projects, categories]);

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((project) => project.categories.includes(active)),
    [projects, active],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PortfolioFilters
          filters={filters}
          active={active}
          onChange={setActive}
          counts={counts}
        />

        {/* Announced to screen readers as the filter changes. */}
        <p aria-live="polite" className="text-sm text-ink-500">
          Showing {visible.length} of {projects.length} projects
        </p>
      </div>

      <div
        id="portfolio-grid"
        role="tabpanel"
        aria-label={`${active} projects`}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => (
            <motion.article
              key={project.id}
              layout={!reduceMotion}
              variants={reduceMotion ? undefined : gridItem}
              initial={reduceMotion ? undefined : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              exit={reduceMotion ? undefined : "exit"}
              transition={
                reduceMotion ? undefined : { delay: Math.min(index, 5) * 0.035 }
              }
              className="h-full"
            >
              <ProjectCard
                project={project}
                as="h2"
                priority={index < 3}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-card border border-dashed border-ink-300 p-10 text-center text-sm text-ink-500">
          No projects in this category yet.
        </p>
      ) : null}
    </div>
  );
}
