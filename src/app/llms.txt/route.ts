import { faqs } from "@/data/faq";
import { getProjects } from "@/data/projects";
import { getServices } from "@/data/services";
import { siteConfig } from "@/data/site";

/*
 * /llms.txt — the llmstxt.org convention.
 *
 * A single plain-text index an answer engine or coding agent can read in one
 * request instead of crawling eleven pages: what this company does, what it
 * sells, what it has built, and the questions it already answers, each with an
 * absolute URL to the page that says more.
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

const section = (heading: string, lines: string[]) =>
  lines.length > 0 ? `## ${heading}\n\n${lines.join("\n")}` : "";

export async function GET() {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);

  const body = [
    `# ${siteConfig.name}`,
    `> ${oneLine(siteConfig.description)}`,
    [
      `${siteConfig.name} (${siteConfig.legalName}) is an AI, automation and software engineering studio.`,
      `Focus: ${oneLine(siteConfig.tagline)}.`,
      `Working model: ${oneLine(siteConfig.contact.location)}.`,
      `Contact: ${siteConfig.contact.email}.`,
      `Engagements begin with a consultation call, then a paid discovery that produces an architecture and a fixed scope before any build work is committed.`,
    ].join("\n"),

    section(
      "Services",
      services.map((service) =>
        link(
          service.title,
          `/services/${service.slug}`,
          service.shortDescription,
        ),
      ),
    ),

    section(
      "Case studies",
      projects.map((project) =>
        link(
          `${project.title} — ${project.tagline}`,
          `/portfolio/${project.slug}`,
          `${project.category}. ${project.shortDescription}`,
        ),
      ),
    ),

    /* Questions, not answers. The answers are on /faq, which is where a citation
       should point — repeating them here would create a second copy to keep in
       sync with the panel. */
    section(
      "Questions answered on the FAQ page",
      faqs.map((item) => link(item.question, "/faq", item.category)),
    ),

    section("Pages", [
      link("Home", "/", oneLine(siteConfig.shortDescription)),
      link("Services", "/services", "Every service line, with deliverables."),
      link("Portfolio", "/portfolio", "Case studies, filterable by category."),
      link("About", "/about", "How the studio works, and who does the work."),
      link("Contact", "/contact", "Enquiry form and contact details."),
      link("Book a call", "/book-a-call", "Schedule the consultation directly."),
      link("FAQ", "/faq", "Engagement, technology, delivery and commercial questions."),
      link("Privacy policy", "/privacy"),
      link("Terms of service", "/terms"),
    ]),
  ]
    .filter(Boolean)
    .join("\n\n");

  return new Response(`${body}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
