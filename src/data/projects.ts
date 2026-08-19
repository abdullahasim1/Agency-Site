import type { IconName } from "./icons";
import { imageSize } from "@/lib/image-size";
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

interface ProjectFeature {
  title: string;
  description: string;
  icon: IconName;
}

/** An icon card — used by Business Challenge and Solution Design grids. */
interface ProjectCardItem {
  icon: IconName;
  title: string;
  description: string;
}

interface ProjectResult {
  /** Headline figure, e.g. "68%". */
  value: string;
  label: string;
  detail: string;
}

interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption: string;
  /** Intrinsic pixel size, read from the file at build time. */
  width: number;
  height: number;
}

interface TechStackGroup {
  group: string;
  items: string[];
}

interface WorkflowNode {
  id: string;
  title: string;
  description: string;
  /** Short mono tag rendered on the node, e.g. "INGEST". */
  tag: string;
}

interface ProjectOverviewMeta {
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
  /** Intrinsic pixel size of the cover, read from the file at build time. */
  imageWidth: number;
  imageHeight: number;
  /** Flat badge list used on cards. */
  technologies: string[];
  /** Grouped stack shown on the case-study page. */
  techStack: TechStackGroup[];
  features: ProjectFeature[];
  challenge: { summary: string; points: ProjectCardItem[] };
  solution: { summary: string; points: ProjectCardItem[] };
  /** Checklist between challenge and solution, shown on the case study. */
  objectives: string[];
  /** Lead paragraph of the Client Overview section. */
  clientOverview: string;
  /** Closing paragraph shown at the end of the case study. */
  conclusion: string;
  results: ProjectResult[];
  gallery: ProjectGalleryItem[];
  /** Optional demo video file. When `file` is empty the section is hidden. */
  video?: { file: string; caption: string } | null;
  workflow: WorkflowNode[];
  /** How the workflow diagram is drawn: linear steps or a looping cycle. */
  workflowLayout: "linear" | "loop";
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

/**
 * The Keystatic form groups the flat project fields into collapsible sections
 * (`basics`, `listing`, `cover`, `closing`) so the panel stays manageable. The
 * stored JSON is nested accordingly, so it is flattened back here — pages and
 * components only ever see the flat `Project` shape.
 */
const flatten = (entry: Record<string, unknown>): Omit<Project, "slug"> => {
  const { basics, listing, cover, closing, advanced: _advanced, ...rest } = entry as Record<
    string,
    Record<string, unknown>
  >;
  return {
    ...rest,
    ...basics,
    ...listing,
    ...cover,
    ...closing,
  } as unknown as Omit<Project, "slug">;
};

/**
 * Resolves a project entry to its final shape:
 *
 * 1. If the panel's "Raw JSON (advanced)" field holds valid JSON, that JSON
 *    becomes the entire entry — a power-user override for everything above.
 * 2. Any lines in "Bulk gallery images" are appended to the gallery as extra
 *    items, so many images can be added in one paste.
 */
const resolveEntry = (entry: Record<string, unknown>) => {
  const raw = entry.advanced as Record<string, unknown> | undefined;
  const rawJson = typeof raw?.rawJson === "string" ? raw.rawJson.trim() : "";

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as Record<string, unknown>;
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      // Invalid JSON — fall through to the structured form fields.
    }
  }
  return entry;
};

/** Gallery item appended from the "Bulk gallery images" field. */
const bulkGalleryItems = (entry: Record<string, unknown>) => {
  const raw = entry.advanced as Record<string, unknown> | undefined;
  const urls =
    typeof raw?.galleryUrls === "string" ? raw.galleryUrls.split("\n") : [];

  return urls
    .map((line) => line.trim())
    .filter(Boolean)
    .map((src, index) => ({ src, alt: `Gallery image ${index + 1}`, caption: "" }));
};

/** All projects in portfolio order (lowest `order` first). */
export function getProjects(): Promise<Project[]> {
  // In development, bust the in-memory cache on every call so CMS edits
  // reflect immediately without restarting the dev server.
  if (process.env.NODE_ENV === "development") {
    projectsPromise = undefined;
  }
  projectsPromise ??= reader.collections.projects.all().then(async (entries) => {
    const projects: Project[] = [];

    for (const { slug, entry } of entries) {
      const resolved = resolveEntry(entry);
      const project = {
        ...flatten(resolved),
        gallery: [...flatten(resolved).gallery, ...bulkGalleryItems(entry)],
        slug,
      } as unknown as Project;
      const cover = await imageSize(project.image);
      project.imageWidth = cover.width;
      project.imageHeight = cover.height;

      const gallery = await Promise.all(
        project.gallery.map(async (item) => {
          const { width, height } = await imageSize(item.src);
          return { ...item, width, height };
        }),
      );
      project.gallery = gallery;

      projects.push(project);
    }

    return projects.sort((a, b) => a.order - b.order);
  });
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

  const others = projects.filter((project) => project.slug !== slug);

  const sharedCategories = (project: Project) =>
    project.categories.filter((category) =>
      current.categories.includes(category),
    ).length;

  const ranked = others.sort(
    (a, b) =>
      sharedCategories(b) - sharedCategories(a) || a.order - b.order,
  );

  return ranked.slice(0, limit);
}
