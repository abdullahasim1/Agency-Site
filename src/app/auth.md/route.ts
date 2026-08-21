import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * Auth.md (https://workos.com/auth.md) — agent registration and authentication
 * metadata. This documents how AI agents can authenticate to access protected
 * resources on this origin.
 *
 * Currently, DevRox has no protected APIs requiring agent authentication. This
 * file is published for discovery purposes and will be updated if/when
 * authenticated endpoints are added.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const markdown = `# DevRox Agent Authentication

This document describes how AI agents can authenticate to access protected resources on **${siteConfig.name}** (${base}).

## Current Status

**No protected APIs currently require agent authentication.** All public endpoints (contact form, health check, MCP server) are accessible without authentication.

If/when protected APIs are added, this document will be updated with:

- OAuth 2.0 / OIDC flows supported
- Token acquisition endpoints
- Required scopes and permissions
- Agent registration process

## Discovery Endpoints

| Endpoint | Purpose |
|----------|---------|
| [\`/.well-known/oauth-authorization-server\`](${base}/.well-known/oauth-authorization-server) | OAuth 2.0 Authorization Server Metadata (RFC 8414) |
| [\`/.well-known/oauth-protected-resource\`](${base}/.well-known/oauth-protected-resource) | OAuth Protected Resource Metadata (RFC 9728) |
| [\`/.well-known/api-catalog\`](${base}/.well-known/api-catalog) | API Catalog with service descriptions (RFC 9727) |
| [\`/.well-known/mcp/server-card.json\`](${base}/.well-known/mcp/server-card.json) | MCP Server Card (SEP-1649) |

## Agent Registration (Future)

When agent authentication is enabled, registration will follow the **auth.md** specification:

1. Agent submits registration request to \`register_uri\` (TBD)
2. Supported identity types: \`service-account\`, \`workload-identity\`
3. Supported credential types: \`client_secret_basic\`, \`client_secret_post\`, \`private_key_jwt\`
4. Upon approval, agent receives \`client_id\` and credentials
5. Agent uses OAuth 2.0 Client Credentials flow to obtain access tokens

## Contact

For questions about agent access or to request API credentials:
- Email: ${siteConfig.contact.email}
- Website: ${base}/contact

---

*This document follows the [auth.md specification](https://workos.com/auth.md).*
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}