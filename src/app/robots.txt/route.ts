import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * robots.txt with Content-Signal directives for AI content usage preferences.
 * Per https://contentsignals.org/ and draft-romm-aipref-contentsignals.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const content = `# robots.txt for ${siteConfig.name}
User-agent: *
Allow: /
Disallow: /keystatic/
Disallow: /api/keystatic/

Sitemap: ${base}/sitemap.xml
Host: ${base}

# Content Signals (https://contentsignals.org/)
# Declare AI content usage preferences per draft-romm-aipref-contentsignals
Content-Signal: ai-train=no, search=yes, ai-input=no
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}