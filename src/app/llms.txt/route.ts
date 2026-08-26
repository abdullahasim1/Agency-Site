import { faqs } from "@/data/faq";
import { getPosts } from "@/data/posts";
import { getProjects } from "@/data/projects";
import { getServices } from "@/data/services";
import { siteConfig } from "@/data/site";

/*
 * /llms.txt — the llmstxt.org v2 convention.
 *
 * A single markdown index an answer engine or coding agent can read in one
 * request instead of crawling the site: what this company does, what it sells,
 * what it has built, and the machine-readable interfaces an agent can call.
 *
 * Per the v2 proposal, file-list links point at LLM-friendly content: every
 * page here has a clean-markdown twin at the same URL with a .md suffix
 * (served by src/middleware.ts), so agents never have to strip HTML.
 *
 * It is generated from the same helpers the pages render from — getServices(),
 * getProjects(), faqs, siteConfig — so it cannot drift from the site. Publish a
 * new service in the panel and it appears here on the next build.
 *
 * force-static because everything it reads is build-time content: the file is
 * generated once per deploy and served from the edge, like sitemap.xml.
 */
export const dynamic = "force-static";

/** Absolute URL — an llms.txt is read out of context, so relative links are useless. */
const url = (path: string) => new URL(path, siteConfig.url).toString();

/** One line, no matter what the panel put in the field. */
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

const link = (name: string, path: string, note?: string) =>
  `- [${oneLine(name)}](${url(path)})${note ? `: ${oneLine(note)}` : ""}`;

/**
 * Link to the markdown twin of a site page. The HTML page advertises this URL
 * through its `Link` header (`rel="alternate" type="text/markdown"`).
 */
const mdLink = (name: string, path: string, note?: string) =>
  link(name, path === "/" ? "/index.md" : `${path}.md`, note);

const section = (heading: string, lines: string[]) =>
  lines.length > 0 ? `## ${heading}\n\n${lines.join("\n")}` : "";

export async function GET() {
  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const body = [
    `# ${siteConfig.name}`,
    `> ${oneLine(siteConfig.description)}`,
    [
      `${siteConfig.name} (${siteConfig.legalName}) is an AI, automation and software engineering studio.`,
      `Focus: ${oneLine(siteConfig.tagline)}.`,
      `Working model: ${oneLine(siteConfig.contact.location)}.`,
      `Contact: ${siteConfig.contact.email}.`,
      `Engagements begin with a consultation call, then a paid discovery that produces an architecture and a fixed scope before any build work is committed.`,
      `Every page below is also available as clean markdown at the same URL with a .md suffix.`,
    ].join("\n"),

    section(
      "Services",
      services.map((service) =>
        mdLink(
          service.title,
          `/services/${service.slug}`,
          service.shortDescription,
        ),
      ),
    ),

    section(
      "Case studies",
      projects.map((project) =>
        mdLink(
          `${project.title} — ${project.tagline}`,
          `/portfolio/${project.slug}`,
          `${project.category}. ${project.shortDescription}`,
        ),
      ),
    ),

    section(
      "Articles",
      posts.map((post) =>
        mdLink(post.title, `/blog/${post.slug}`, post.excerpt),
      ),
    ),

    /* Questions, not answers. The answers are on /faq.md, which is where a
       citation should point — repeating them here would create a second copy
       to keep in sync with the panel. */
    section(
      "Questions answered on the FAQ page",
      faqs.map((item) => mdLink(item.question, "/faq", item.category)),
    ),

    section("Pages", [
      mdLink("Home", "/", oneLine(siteConfig.shortDescription)),
      mdLink("Services", "/services", "Every service line, with deliverables."),
      mdLink("Portfolio", "/portfolio", "Case studies, filterable by category."),
      mdLink("Blog", "/blog", "Practical articles on AI, automation and software engineering."),
      mdLink("About", "/about", "How the studio works, and who does the work."),
      mdLink("Contact", "/contact", "Enquiry form and contact details."),
      mdLink("Book a call", "/book-a-call", "Schedule the consultation directly."),
      mdLink("FAQ", "/faq", "Engagement, technology, delivery and commercial questions."),
    ]),

    section("Agent interfaces", [
      link(
        "MCP server",
        "/mcp",
        "JSON-RPC endpoint; tools/call and tools/list over Streamable HTTP.",
      ),
      link(
        "MCP Server Card",
        "/.well-known/mcp/server-card.json",
        "SEP-1649 description of the MCP server and its tools.",
      ),
      link(
        "API Catalog",
        "/.well-known/api-catalog",
        "RFC 9727 linkset of callable APIs.",
      ),
      link(
        "AI Catalog",
        "/.well-known/ai-catalog.json",
        "Agentic Resource Discovery manifest.",
      ),
      link(
        "Agent Skills index",
        "/.well-known/agent-skills/index.json",
        "agentskills.io skills index with digests.",
      ),
      link(
        "Contact API OpenAPI document",
        "/api/contact/openapi.json",
        "Machine schema for POST /api/contact enquiries.",
      ),
      link(
        "auth.md",
        "/auth.md",
        "Agent access and provisioning guidance; anonymous enquiry flow.",
      ),
      link(
        "OAuth authorization server metadata",
        "/.well-known/oauth-authorization-server",
        "RFC 8414 metadata with agent_auth registration block.",
      ),
      link(
        "OAuth protected resource metadata",
        "/.well-known/oauth-protected-resource",
        "RFC 9728 metadata for this origin.",
      ),
      link(
        "Health check",
        "/api/health",
        "Liveness probe returning JSON status.",
      ),
    ]),

    /* Secondary information an agent can skip when a shorter context suffices. */
    section("Optional", [
      mdLink("Privacy policy", "/privacy"),
      mdLink("Terms of service", "/terms"),
      link(
        "Sitemap",
        "/sitemap.xml",
        "Full list of indexable pages for crawlers.",
      ),
      link(
        "Open Graph image generator",
        "/og",
        "Renders a 1200x630 PNG; pass ?title= to customise.",
      ),
    ]),
  ]
    .filter(Boolean)
    .join("\n\n");

  return new Response(`${body}\n`, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
