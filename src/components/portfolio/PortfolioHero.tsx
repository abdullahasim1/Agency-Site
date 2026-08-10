import { ProjectCollage } from "@/components/portfolio/ProjectCollage";
import { PageHero } from "@/components/ui/PageHero";
import { getProjects } from "@/data/projects";
import { industries } from "@/data/industries";
import { portfolioCopy } from "@/data/pages";
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
      eyebrow={portfolioCopy.hero.eyebrow}
      title={portfolioCopy.hero.title}
      description={portfolioCopy.hero.description}
      visual={<ProjectCollage />}
      meta={[
        {
          label: portfolioCopy.heroMeta.caseStudiesLabel,
          value: `${projects.length}`,
        },
        {
          label: portfolioCopy.heroMeta.industriesLabel,
          value: `${industries.length}`,
        },
        {
          label: portfolioCopy.heroMeta.technologiesLabel,
          value: `${technologyCount}`,
        },
        {
          label: portfolioCopy.heroMeta.disciplinesLabel,
          value: portfolioCopy.heroMeta.disciplinesValue,
        },
      ]}
    />
  );
}
