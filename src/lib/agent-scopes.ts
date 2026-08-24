/**
 * OAuth scopes advertised across the agent-discovery documents.
 *
 * The site is public and issues no tokens, but RFC 9728 protected-resource
 * metadata is validated by agents with a non-empty `scopes_supported`, so the
 * single capability an agent can exercise here — submitting a project enquiry
 * through `POST /api/contact` — is named explicitly. Presenting the scope
 * grants nothing extra today; `/auth.md` documents the flow end to end.
 */
export const ENQUIRY_SCOPE = "enquiries:write";
