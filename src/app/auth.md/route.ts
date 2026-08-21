import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * Auth.md (https://workos.com/auth.md) — agent registration and authentication
 * discovery. The site is currently public, so this is deliberately explicit
 * about the one agent action that creates a side effect (an enquiry) and does
 * not pretend that an OAuth credential can be issued when it cannot.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const markdown = `# auth.md

Agent access and provisioning guidance for **${siteConfig.name}** (${base}).

## Audience and access

${siteConfig.name} is a public agency website. Its public pages, portfolio data,
service catalogue, health check and MCP server do **not** require a user account,
OAuth token or bearer credential.

Agents can use the read-only discovery tools without registration. An agent may
submit a project enquiry only with the end user's confirmation.

## Registration and provisioning

There is no automated account or OAuth-client registration flow today. To request
a consultation or future service access, submit a project enquiry to
\`POST ${base}/api/contact\` using the [published OpenAPI document](${base}/api/contact/openapi.json).

- **Identity type:** \`anonymous\` — no identity assertion is required for the
  public service.
- **Credential type:** \`none\` — this request does not create an account or
  issue a bearer token.
- **User confirmation:** required before sending an enquiry, because it delivers
  the supplied contact details and message to ${siteConfig.name}.
- **Claim and revocation:** not applicable; there is no credential to claim or
  revoke.

Required enquiry fields are \`fullName\`, \`email\`, \`projectType\` and
\`message\`. The endpoint validates requests, applies a rate limit and returns
JSON. Do not submit speculative or automated enquiries.

## Discovery Endpoints

| Endpoint | Purpose |
|----------|---------|
| [\`/.well-known/oauth-authorization-server\`](${base}/.well-known/oauth-authorization-server) | Agent-registration metadata issuer; no token endpoint is currently available |
| [\`/.well-known/oauth-protected-resource\`](${base}/.well-known/oauth-protected-resource) | OAuth Protected Resource Metadata (RFC 9728) |
| [\`/.well-known/api-catalog\`](${base}/.well-known/api-catalog) | API Catalog with service descriptions (RFC 9727) |
| [\`/.well-known/mcp/server-card.json\`](${base}/.well-known/mcp/server-card.json) | MCP Server Card (SEP-1649) |

## Contact

For access questions or a manual provisioning request:
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
