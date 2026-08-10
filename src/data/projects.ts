import type { IconName } from "./icons";
import { reader } from "./reader";

/**
 * Portfolio and case-study content.
 *
 * PLACEHOLDER CONTENT: client names, dates and result metrics below are
 * illustrative and exist so the layouts can be reviewed with realistic
 * material. Every figure must be replaced with a verified, attributable
 * outcome before this site goes live — do not publish an unsubstantiated
 * number.
 *
 * Content lives as one JSON file per project under `src/content/projects/` and
 * is edited from the Keystatic admin panel at `/keystatic` — adding, editing or
 * removing a project never requires a code change. This module keeps the shapes
 * and the selectors the pages read through.
 *
 * Because each project is its own file, entries are read via the Keystatic
 * Reader rather than a synchronous import, so every selector here is async.
 * All callers are Server Components or build-time functions, which can await.
 *
 * After adding a project in the panel, run `npm run art` to generate its
 * artwork.
 */

/** Filter buckets used by the portfolio page. A project may sit in several. */
export type ProjectCategory =
  | "AI"
  | "Automation"
  | "Web Apps"
  | "Mobile"
  | "SaaS";

export const projectCategories: readonly ProjectCategory[] = [
  "AI",
  "Automation",
  "Web Apps",
  "Mobile",
  "SaaS",
] as const;

export interface ProjectFeature {
  title: string;
  description: string;
  icon: IconName;
}

export interface ProjectResult {
  /** Headline figure, e.g. "68%". */
  value: string;
  label: string;
  detail: string;
}

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface TechStackGroup {
  group: string;
  items: string[];
}

export interface WorkflowNode {
  id: string;
  title: string;
  description: string;
  /** Short mono tag rendered on the node, e.g. "INGEST". */
  tag: string;
}

export interface ProjectOverviewMeta {
  client: string;
  industry: string;
  timeline: string;
  year: string;
  platforms: string[];
  services: string[];
  /** Team shape for the engagement. */
  team: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** Sub-title shown under the project name on the case-study page. */
  tagline: string;
  /** Human-readable category line shown on cards, e.g. "AI / Voice". */
  category: string;
  /** Machine-readable buckets driving the portfolio filters. */
  categories: ProjectCategory[];
  shortDescription: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  /** Flat badge list used on cards. */
  technologies: string[];
  /** Grouped stack shown on the case-study page. */
  techStack: TechStackGroup[];
  features: ProjectFeature[];
  challenge: { summary: string; points: string[] };
  solution: { summary: string; points: string[] };
  results: ProjectResult[];
  gallery: ProjectGalleryItem[];
  workflow: WorkflowNode[];
  overview: ProjectOverviewMeta;
  featured: boolean;
  accent: "brand" | "violet" | "cyan";
  /** Controls ordering in the grid; lower comes first. */
  order: number;
}


/* ---------------------------------------------------------------------------
   Selectors — components read through these rather than filtering inline.

   `getProjects()` is the single reader call; everything else derives from it.
   The result is cached for the lifetime of the build so rendering 10 case
   studies does not re-read the content directory 10 times.
--------------------------------------------------------------------------- */

let projectsPromise: Promise<Project[]> | undefined;

/** All projects in portfolio order (lowest `order` first). */
export function getProjects(): Promise<Project[]> {
  projectsPromise ??= reader.collections.projects.all().then((entries) =>
    entries
      .map(({ slug, entry }) => ({ ...entry, slug }) as unknown as Project)
      .sort((a, b) => a.order - b.order),
  );
  return projectsPromise;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}

export async function getProjectsByCategory(
  category: ProjectCategory | "All",
): Promise<Project[]> {
  const projects = await getProjects();
  if (category === "All") return projects;
  return projects.filter((project) => project.categories.includes(category));
}

/** Projects referenced by a service, preserving portfolio order. */
export async function getProjectsBySlugs(slugs: string[]): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => slugs.includes(project.slug));
}

/** Two other projects to show at the end of a case study. */
export async function getRelatedProjects(
  slug: string,
  limit = 2,
): Promise<Project[]> {
  const projects = await getProjects();
  const current = projects.find((project) => project.slug === slug);
  if (!current) return projects.slice(0, limit);

  const scored = projects
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      project,
      overlap: project.categories.filter((category) =>
        current.categories.includes(category),
      ).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || a.project.order - b.project.order);

  return scored.slice(0, limit).map((entry) => entry.project);
}
