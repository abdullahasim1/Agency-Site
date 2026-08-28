import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { siteConfig } from "@/data/site";

const MARKDOWN_ROUTES = new Set([
  "/",
  "/services",
  "/services/ai-agents",
  "/services/process-automation",
  "/services/voice-ai",
  "/services/custom-software",
  "/portfolio",
  "/about",
  "/contact",
  "/book-a-call",
  "/faq",
  "/privacy",
  "/terms",
]);

/**
 * Route handlers whose URL genuinely ends in .md — these are real endpoints,
 * not markdown twins of an HTML page, so the `<path>.md` rewrite below must
 * leave them alone.
 */
const REAL_MD_ROUTES = new Set(["/auth.md"]);

function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/markdown");
}

/*
 * Discovery relations every agent-facing response carries, per RFC 8288.
 * These moved here from next.config.ts because a middleware-set Link header
 * replaces a configured one rather than merging with it — emitting both sets
 * from one place keeps them consistent.
 */
const GLOBAL_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/ai-catalog.json>; rel="https://agenticresourcediscovery.org/rel/ai-catalog"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"; type="application/json"',
  '</.well-known/oauth-authorization-server>; rel="http://openid.net/specs/connect/1.0/issuer"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="http://ietf.org/rfc/rfc9728"; type="application/json"',
  /* llmstxt.org v2: describedby names the llms.txt covering this origin. */
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  "</contact>; rel=\"service-doc\"",
];

/** Pages with a clean-markdown twin at `<path>.md`, served below. */
function hasMarkdownTwin(pathname: string): boolean {
  return (
    pathname === "/" ||
    MARKDOWN_ROUTES.has(pathname) ||
    pathname.startsWith("/services/") ||
    pathname.startsWith("/portfolio/")
  );
}

/** The full Link header for a resource at `pathname` (llmstxt v2 aware). */
function agentLinkHeader(pathname: string): string {
  const links = [...GLOBAL_LINKS];
  if (hasMarkdownTwin(pathname)) {
    const markdownUrl = pathname === "/" ? "/index.md" : `${pathname}.md`;
    links.push(`<${markdownUrl}>; rel="alternate"; type="text/markdown"`);
  }
  return links.join(", ");
}

/** Link header for a markdown twin: like above, minus the self-reference. */
function markdownTwinLinkHeader(): string {
  return GLOBAL_LINKS.join(", ");
}

/** Serves the clean-markdown twin of a marketing page at `<path>.md`. */
function markdownResponse(request: NextRequest, basePath: string): NextResponse {
  const markdown = generateMarkdown(basePath);

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      /* The HTML original is this document's alternate representation;
         describedby names the llms.txt index that covers it. */
      "Link": [
        `<${new URL(basePath === "/" ? "/" : basePath, request.nextUrl.origin)}>; rel="alternate"; type="text/html"`,
        markdownTwinLinkHeader(),
      ].join(", "),
    },
  });
}

function generateMarkdown(pathname: string): string {
  const base = siteConfig.url;
  const url = (p: string) => new URL(p, base).toString();

  switch (pathname) {
    case "/":
      return `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} (${siteConfig.legalName}) is an AI, automation and software engineering studio.
Focus: ${siteConfig.tagline}.
Working model: ${siteConfig.contact.location}.
Contact: ${siteConfig.contact.email}.

## Quick Links

- [Services](${url("/services")}): Every service line, with deliverables.
- [Portfolio](${url("/portfolio")}): Case studies, filterable by category.
- [About](${url("/about")}): How the studio works, and who does the work.
- [Contact](${url("/contact")}): Enquiry form and contact details.
- [Book a call](${url("/book-a-call")}): Schedule the consultation directly.
- [FAQ](${url("/faq")}): Engagement, technology, delivery and commercial questions.

## Discovery

- [llms.txt index](${url("/llms.txt")}) — llmstxt.org v2 overview of this site
- [API Catalog](${url("/.well-known/api-catalog")}) — RFC 9727 linkset+json
- [AI Catalog (ARD)](${url("/.well-known/ai-catalog.json")}) — Agentic Resource Discovery
- [Agent Skills Index](${url("/.well-known/agent-skills/index.json")}) — Agent Skills Discovery
- [MCP Server Card](${url("/.well-known/mcp/server-card.json")}) — SEP-1649
- [Auth.md](${url("/auth.md")}) — Agent authentication metadata
- [OAuth Auth Server](${url("/.well-known/oauth-authorization-server")}) — RFC 8414
- [OAuth Protected Resource](${url("/.well-known/oauth-protected-resource")}) — RFC 9728
`;

    case "/services":
      return `# Services

${siteConfig.name} offers the following service lines:

- [AI Agents](${url("/services/ai-agents")}) — Autonomous agents that plan, act and iterate.
- [Process Automation](${url("/services/process-automation")}) — Eliminate manual work with workflows that run themselves.
- [Voice AI](${url("/services/voice-ai")}) — Conversational voice agents for support, sales and operations.
- [Custom Software](${url("/services/custom-software")}) — Full-cycle product engineering from architecture to deployment.

Each service page includes deliverables, technologies, use cases and related case studies.
`;

    case "/portfolio":
      return `# Portfolio & Case Studies

Explore ${siteConfig.name}'s work across AI, automation and software engineering.

Visit [${url("/portfolio")}](${url("/portfolio")}) for the full filterable portfolio with categories including:
- AI Agents
- Process Automation
- Voice AI
- Custom Software
- Generative AI
`;

    case "/about":
      return `# About ${siteConfig.name}

${siteConfig.description}

## Mission

${siteConfig.tagline}

## Contact

- Email: ${siteConfig.contact.email}
- Location: ${siteConfig.contact.location}
- LinkedIn: ${siteConfig.social.linkedin}
- GitHub: ${siteConfig.social.github}
`;

    case "/contact":
      return `# Contact ${siteConfig.name}

Ready to start a project? Get in touch.

## Enquiry Form

Submit a project enquiry at [${url("/contact")}](${url("/contact")}).

## Direct Contact

- Email: ${siteConfig.contact.email}
- WhatsApp: ${siteConfig.contact.whatsapp} (${siteConfig.contact.whatsappHref})
- Location: ${siteConfig.contact.location}
- Hours: ${siteConfig.contact.hours}
- Typical response: ${siteConfig.contact.responseTime}

## API Access

The contact form is also available via API:
- Endpoint: \`POST ${url("/api/contact")}\`
- OpenAPI Spec: ${url("/api/contact/openapi.json")}
- Rate limit: 5 requests per 10 minutes per IP
`;

    default:
      return `# ${siteConfig.name}

${siteConfig.description}

This page is available in markdown for AI agents. Visit the [HTML version](${url(pathname)}) for the full experience.

## Navigation

- [Home](${url("/")})
- [Services](${url("/services")})
- [Portfolio](${url("/portfolio")})
- [About](${url("/about")})
- [Contact](${url("/contact")})
`;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * `<path>.md` always serves markdown, regardless of Accept — the llmstxt v2
   * "extension replaced by .md" convention. Any marketing path works; unknown
   * ones fall through to the generic summary in generateMarkdown.
   */
  if (pathname.endsWith(".md") && !REAL_MD_ROUTES.has(pathname)) {
    const basePath = pathname.slice(0, -3) || "/";
    return markdownResponse(request, basePath);
  }

  if (!wantsMarkdown(request)) {
    const response = NextResponse.next();
    response.headers.set("Link", agentLinkHeader(pathname));
    // Ensure stale-while-revalidate is preserved for HTML pages
    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("text/html")) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=0, must-revalidate, stale-while-revalidate=3600"
      );
    }
    return response;
  }

  if (!MARKDOWN_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const markdown = generateMarkdown(pathname);

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Vary": "Accept",
      "x-markdown-tokens": "estimated",
      "Link": agentLinkHeader(pathname),
    },
  });
}

export const config = {
  /*
   * Everything except assets and machine plumbing: marketing pages (plus
   * their .md twins), the well-known documents, auth.md, the API routes and
   * the MCP endpoint all carry the agent-discovery Link header. Keystatic,
   * build output and media are skipped.
   */
  matcher: [
    "/((?!_next|images|logos|videos|agent-skills|keystatic|api/keystatic|favicon.ico|icon.png|icon.svg|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml|og|vercel.svg).*)",
  ],
};
