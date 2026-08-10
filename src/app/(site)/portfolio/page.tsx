import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { Container } from "@/components/ui/Container";
import { portfolioCopy } from "@/data/pages";
import { getProjects, projectCategories } from "@/data/projects";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: portfolioCopy.seo.title,
  description: portfolioCopy.seo.description,
  path: "/portfolio",
  keywords: portfolioCopy.seo.keywords,
});

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PortfolioHero />

      <section className="section-y">
        <Container>
          <h2 className="sr-only">{portfolioCopy.grid.heading}</h2>
          <ProjectGrid projects={projects} categories={projectCategories} />
        </Container>
      </section>

      <FinalCTA
        eyebrow={portfolioCopy.cta.eyebrow}
        title={portfolioCopy.cta.title}
        description={portfolioCopy.cta.description}
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
