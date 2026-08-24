import { siteConfig } from "@/data/site";

/**
 * ARD (Agentic Resource Discovery) catalog — serves the ai-catalog.json
 * per the Agentic Resource Discovery spec and the Agent Card ai-catalog.
 */

export async function GET(): Promise<Response> {
  const base = siteConfig.url;
  const origin = siteConfig.name;

  const entries = [
    {
      identifier: `urn:air:${new URL(base).hostname}:web:homepage`,
      displayName: `${origin} — Homepage`,
      type: "text/html",
      url: `${base}/`,
      representativeQueries: [
        "What services does DevRox offer?",
        "Who are the founders of DevRox?",
        "What is DevRox's mission and values?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:web:services`,
      displayName: `${origin} — Services Overview`,
      type: "text/html",
      url: `${base}/services`,
      representativeQueries: [
        "What AI services does DevRox provide?",
        "Does DevRox do process automation?",
        "What voice AI capabilities does DevRox have?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:web:portfolio`,
      displayName: `${origin} — Portfolio & Case Studies`,
      type: "text/html",
      url: `${base}/portfolio`,
      representativeQueries: [
        "Show me DevRox's case studies",
        "What projects has DevRox built?",
        "Has DevRox built a voice AI system?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:web:about`,
      displayName: `${origin} — About the Team & Mission`,
      type: "text/html",
      url: `${base}/about`,
      representativeQueries: [
        "Who works at DevRox?",
        "What are DevRox's core values?",
        "What is DevRox's mission statement?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:web:contact`,
      displayName: `${origin} — Contact & Enquiry`,
      type: "text/html",
      url: `${base}/contact`,
      representativeQueries: [
        "How do I contact DevRox for a project?",
        "What is DevRox's email address?",
        "Can I book a consultation with DevRox?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:api:contact`,
      displayName: "DevRox Contact API",
      type: "application/openapi+json",
      url: `${new URL("/api/contact/openapi.json", siteConfig.url).toString()}`,
      representativeQueries: [
        "How do I submit a project enquiry via the DevRox API?",
        "What fields does the contact API require?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:api:catalog`,
      displayName: "DevRox API Catalog",
      type: "application/linkset+json",
      url: `${siteConfig.url}/.well-known/api-catalog`,
      representativeQueries: [
        "What APIs does DevRox expose?",
        "Is there an OpenAPI spec for the contact endpoint?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:skill:portfolio`,
      displayName: "DevRox Portfolio Skill",
      type: "text/markdown",
      url: `${siteConfig.url}/.well-known/agent-skills/portfolio.md`,
      representativeQueries: [
        "How can an agent browse DevRox's portfolio programmatically?",
        "What project metadata is available?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:skill:contact`,
      displayName: "DevRox Contact Skill",
      type: "text/markdown",
      url: `${siteConfig.url}/.well-known/agent-skills/contact.md`,
      representativeQueries: [
        "How can an agent submit an enquiry on behalf of a user?",
      ],
    },
    {
      identifier: `urn:air:${new URL(base).hostname}:markdown:homepage`,
      displayName: "DevRox Homepage (Markdown)",
      type: "text/markdown",
      url: `${base}/index.md`,
      representativeQueries: [
        "Give me a markdown summary of DevRox's homepage",
      ],
    },
  ];

  const catalog = {
    specVersion: "1.0",
    host: {
      displayName: siteConfig.name,
      identifier: `did:web:${new URL(siteConfig.url).hostname}`,
    },
    entries,
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}