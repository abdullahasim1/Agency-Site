import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414) — this origin does not
 * currently operate an authorization server. If/when protected APIs are added,
 * wire this to a real AS (e.g. WorkOS, Auth0, Keycloak) and publish the
 * issuer, endpoints, and JWKS here.
 *
 * Includes agent_auth block per auth.md spec for agent registration discovery.
 *
 * See also: /.well-known/oauth-protected-resource for the resource metadata.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const metadata = {
    issuer: base,
    authorization_endpoint: "",
    token_endpoint: "",
    jwks_uri: "",
    registration_endpoint: "",
    scopes_supported: [],
    response_types_supported: [],
    response_modes_supported: [],
    grant_types_supported: [],
    token_endpoint_auth_methods_supported: [],
    code_challenge_methods_supported: [],
    revocation_endpoint: "",
    introspection_endpoint: "",
    device_authorization_endpoint: "",
    userinfo_endpoint: "",
    // auth.md agent_auth block for agent registration discovery
    agent_auth: {
      register_uri: `${base}/.well-known/oauth-authorization-server/register`,
      supported_identity_types: ["service-account", "workload-identity"],
      supported_credential_types: ["client_secret_basic", "client_secret_post", "private_key_jwt"],
      claims_endpoint: "",
      revocation_endpoint: "",
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