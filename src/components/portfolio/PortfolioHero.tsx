import { ProjectCollage } from "@/components/portfolio/ProjectCollage";
import { PageHero } from "@/components/ui/PageHero";
import { getProjects } from "@/data/projects";
import { industries } from "@/data/industries";
import { techCategories } from "@/data/technologies";

/**
 * Portfolio page hero. Every figure here is derived from the data files rather
 * than typed in, so it cannot drift out of date as projects are added.
 */
export async function PortfolioHero() {
  const technologyCount = techCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );
  const projects = await getProjects();

  return (
    <PageHero
      eyebrow="Portfolio"
      title="Our Work"
      description="Real products. Real automation. Real business impact."
      visual={<ProjectCollage />}
      meta={[
        { label: "Case studies", value: `${projects.length}` },
        { label: "Industries", value: `${industries.length}` },
        { label: "Technologies", value: `${technologyCount}` },
        { label: "Disciplines", value: "AI · Automation · Product" },
      ]}
    />
  );
}
