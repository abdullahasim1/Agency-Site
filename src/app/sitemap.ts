import type { MetadataRoute } from "next";

import { getProjects } from "@/data/projects";
import { getPosts } from "@/data/posts";
import { getServices } from "@/data/services";
import { siteConfig } from "@/data/site";

function parseDate(val?: string, fallback = "2026-08-15T00:00:00.000Z"): Date {
  if (!val) return new Date(fallback);
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
}

/**
 * The sitemap is built from the same data that drives the routes, so adding a
 * project or service picks it up automatically.
 *
 * Rather than stamping every URL with `new Date()` (which search engines ignore
 * as untrustworthy when all pages change every build), we supply authentic
 * content modification dates:
 * - Posts: their actual publishedAt date
 * - Projects: their case-study timeline / year
 * - Home & Blog index: the date of the latest published article
 * - Services & Static: stable site update timestamps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const latestPostDate = posts[0]?.publishedAt
    ? parseDate(posts[0].publishedAt)
    : new Date("2026-09-01T00:00:00.000Z");

  const siteLaunchDate = new Date("2026-08-15T00:00:00.000Z");
  const servicesUpdateDate = new Date("2026-08-25T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
      lastModified: latestPostDate,
    },
    {
      path: "/services",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: servicesUpdateDate,
    },
    {
      path: "/portfolio",
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: latestPostDate,
    },
    {
      path: "/blog",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: latestPostDate,
    },
    {
      path: "/about",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: siteLaunchDate,
    },
    {
      path: "/contact",
      priority: 0.8,
      changeFrequency: "yearly",
      lastModified: siteLaunchDate,
    },
    {
      path: "/book-a-call",
      priority: 0.8,
      changeFrequency: "yearly",
      lastModified: siteLaunchDate,
    },
    {
      path: "/faq",
      priority: 0.5,
      changeFrequency: "monthly",
      lastModified: siteLaunchDate,
    },
    {
      path: "/privacy",
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: siteLaunchDate,
    },
    {
      path: "/terms",
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: siteLaunchDate,
    },
  ].map((entry) => ({
    url: url(entry.path),
    lastModified: entry.lastModified,
    changeFrequency:
      entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: entry.priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: url(`/services/${service.slug}`),
    lastModified: servicesUpdateDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: url(`/portfolio/${project.slug}`),
    lastModified: parseDate(
      project.overview?.year ? `${project.overview.year}-01-01` : undefined,
    ),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: parseDate(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...postRoutes];
}
