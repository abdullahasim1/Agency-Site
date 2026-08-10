import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

/**
 * robots.txt is generated from the site config so the host stays in sync with
 * the canonical URL used everywhere else. The API route is disallowed because
 * it has no crawlable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
