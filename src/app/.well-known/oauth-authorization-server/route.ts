import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * Agent-registration metadata at the OAuth Authorization Server Metadata URL.
 *
 * The site has no protected endpoints or token issuer today, so endpoint fields
 * such as token, claim and revocation URLs are intentionally omitted instead
 * of advertising placeholders that do not exist. `agent_auth` points to the
 * real, manual provisioning path described in /auth.md.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const metadata = {
    issuer: base,
    scopes_supported: [],
    grant_types_supported: [],
    agent_auth: {
      skill: `${base}/auth.md`,
      register_uri: `${base}/api/contact`,
      identity_types_supported: ["anonymous"],
      anonymous: {
        credential_types_supported: ["none"],
      },
    },
  };

  return new NextResponse(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
