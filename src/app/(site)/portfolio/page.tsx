import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { Container } from "@/components/ui/Container";
import { getProjects, projectCategories } from "@/data/projects";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Work",
  description:
    "Real products. Real automation. Real business impact. Explore case studies covering AI agents, voice automation, workflow systems, web platforms and mobile applications.",
  path: "/portfolio",
  keywords: [
    "AI case studies",
    "automation case studies",
    "software development portfolio",
    "AI agent projects",
    "voice AI projects",
  ],
});

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PortfolioHero />

      <section className="section-y">
        <Container>
          <h2 className="sr-only">All projects</h2>
          <ProjectGrid projects={projects} categories={projectCategories} />
        </Container>
      </section>

      <FinalCTA
        eyebrow="Start a project"
        title="Want a system like these built for your business?"
        description="Tell us what the process looks like today and we will tell you honestly what is worth automating."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Portfolio", path: "/portfolio" },
            ]),
          ),
        }}
      />
    </>
  );
}
