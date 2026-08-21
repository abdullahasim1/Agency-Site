import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * OAuth Protected Resource Metadata (RFC 9728).
 *
 * Everything on this origin is currently public. We still publish the resource
 * metadata so an agent can discover the matching agent-registration guidance
 * before an authenticated service is introduced. The advertised issuer serves
 * metadata only; no token is needed for today's public endpoints.
 */

export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const metadata = {
    resource: base,
    authorization_servers: [base],
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
