import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * RFC 9727 API Catalog — advertises the site's APIs with links to their
 * OpenAPI descriptions, human documentation and health endpoints.
 */

export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const catalog = {
    linkset: [
      {
        anchor: `${base}/api/contact`,
        "service-desc": [
          {
            href: `${base}/api/contact/openapi.json`,
            type: "application/openapi+json",
            title: "Contact API — OpenAPI 3.1",
          },
        ],
        "service-doc": [
          {
            href: `${base}/contact`,
            type: "text/html",
            title: "Contact form (human documentation)",
          },
        ],
        status: [
          {
            href: `${base}/api/health`,
            type: "application/json",
            title: "Health check",
          },
        ],
        linkset: [],
      },
      {
        anchor: `${base}/api/health`,
        "service-doc": [
          {
            href: `${base}/api/health`,
            type: "application/json",
            title: "Health endpoint documentation",
          },
        ],
        status: [
          {
            href: `${base}/api/health`,
            type: "application/json",
            title: "Health check",
          },
        ],
        linkset: [],
      },
    ],
  };

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}