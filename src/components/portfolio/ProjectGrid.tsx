"use client";

import { useMemo, useState } from "react";

import {
  PortfolioFilters,
  type PortfolioFilter,
} from "@/components/portfolio/PortfolioFilters";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { fill, portfolioCopy } from "@/data/pages";
import type { Project, ProjectCategory } from "@/data/projects";

interface ProjectGridProps {
  projects: Project[];
  categories: readonly ProjectCategory[];
}

/**
 * Filterable project grid.
 *
 * Uses CSS animations instead of framer-motion for better performance.
 */
export function ProjectGrid({ projects, categories }: ProjectGridProps) {
  const [active, setActive] = useState<PortfolioFilter>("All");

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
          {fill(portfolioCopy.grid.countText, {
            visible: String(visible.length),
            total: String(projects.length),
          })}
        </p>
      </div>

      <div
        id="portfolio-grid"
        role="tabpanel"
        aria-label={fill(portfolioCopy.grid.panelLabel, {
          category:
            active === "All" ? portfolioCopy.grid.allFilterLabel : active,
        })}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3"
      >
        {visible.map((project, index) => (
          <article
            key={project.id}
            className="h-full animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}
          >
            <ProjectCard
              project={project}
              as="h2"
              priority={index < 3}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            />
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-card border border-dashed border-ink-300 p-10 text-center text-sm text-ink-500">
          {portfolioCopy.grid.emptyText}
        </p>
      ) : null}
    </div>
  );
}
