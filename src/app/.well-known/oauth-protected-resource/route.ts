import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * OAuth Protected Resource Metadata (RFC 9728) — declares that the public
 * APIs on this origin do not currently require OAuth authorization.
 * If/when protected APIs are added, wire this to a real AS.
 */

export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const metadata = {
    resource: base,
    authorization_servers: [],
    scopes_supported: [],
    bearer_methods_supported: ["header"],
  };

  return new NextResponse(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}