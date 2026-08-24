import { NextResponse } from "next/server";

import { ENQUIRY_SCOPE } from "@/lib/agent-scopes";
import { siteConfig } from "@/data/site";

/**
 * Agent-registration metadata at the OAuth Authorization Server Metadata URL.
 *
 * The site has no protected endpoints or token issuer today, so endpoint fields
 * such as token, claim and revocation URLs are intentionally omitted instead
 * of advertising placeholders that do not exist. `agent_auth` points to the
 * real, manual provisioning path described in /auth.md, and `scopes_supported`
 * mirrors the protected-resource metadata so agents see one consistent story.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const metadata = {
    issuer: base,
    scopes_supported: [ENQUIRY_SCOPE],
    grant_types_supported: [],
    agent_auth: {
      skill: `${base}/auth.md`,
      register_uri: `${base}/api/contact`,
      identity_types_supported: ["anonymous"],
      anonymous: {
        credential_types_supported: ["none"],
      },
      /**
       * Required by the auth.md anonymous flow. With no credential issued,
       * claiming an anonymous registration amounts to following the published
       * guidance, so the claim URI points at the skill document itself rather
       * than at a token-issuing endpoint that does not exist.
       */
      claim_uri: `${base}/auth.md`,
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
