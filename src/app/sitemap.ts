import type { MetadataRoute } from "next";

import { getProjectSlugs } from "@/data/projects";
import { getPostSlugs } from "@/data/posts";
import { getServiceSlugs } from "@/data/services";
import { siteConfig } from "@/data/site";
import { getLocationPaths } from "@/data/locations";

/**
 * One timestamp for the whole sitemap, captured when the module is first
 * evaluated — i.e. at build time.
 *
 * This is honest rather than arbitrary. Keystatic commits every content change
 * to `main`, and every commit to `main` triggers a Vercel build, so "when this
 * build ran" really is "when the content last changed". File mtimes would be
 * worse: Vercel clones fresh, which stamps every file with checkout time.
 */
const lastModified = new Date();

/**
 * The sitemap is built from the same data that drives the routes, so adding a
 * project or service picks it up automatically. Priorities and change
 * frequencies are rough hints for crawlers, not guarantees.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/book-a-call", priority: 0.8, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ].map((entry) => ({
    url: url(entry.path),
    lastModified,
    changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: entry.priority,
  }));

  const [serviceSlugs, projectSlugs, postSlugs] = await Promise.all([
    getServiceSlugs(),
    getProjectSlugs(),
    getPostSlugs(),
  ]);

  const locationPaths = getLocationPaths();

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: url(`/services/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: url(`/portfolio/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: url(`/blog/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locationPaths.map(
    ({ city, service }) => ({
      url: url(`/locations/${city}/${service}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...locationRoutes,
  ];
}
