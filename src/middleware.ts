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

function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/markdown");
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
  if (!wantsMarkdown(request)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

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
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/services/:path*",
    "/portfolio",
    "/about",
    "/contact",
    "/book-a-call",
    "/faq",
    "/privacy",
    "/terms",
  ],
};