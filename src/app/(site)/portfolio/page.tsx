import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { portfolioCopy } from "@/data/pages";
import { getProjects, projectCategories } from "@/data/projects";
import { buildMetadata, pageGraph } from "@/lib/seo";

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

      <section id="projects" className="section-y">
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

      <JsonLd
        data={pageGraph({
          path: "/portfolio",
          title: portfolioCopy.seo.title,
          description: portfolioCopy.seo.description,
          type: "CollectionPage",
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ],
        })}
      />
    </>
  );
}
