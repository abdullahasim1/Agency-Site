import { ProjectCollage } from "@/components/portfolio/ProjectCollage";
import { PageHero } from "@/components/ui/PageHero";
import { getProjects } from "@/data/projects";
import { industries } from "@/data/industries";
import { portfolioCopy } from "@/data/pages";
import { techCategories } from "@/data/technologies";

interface PortfolioHeroProps {
  /** Pre-loaded project count — avoids a redundant getProjects() call. */
  projectCount: number;
}

/**
 * Portfolio page hero. Stats are derived from data files rather than typed in,
 * so they cannot drift out of date as projects are added.
 */
export function PortfolioHero({ projectCount }: PortfolioHeroProps) {
  const technologyCount = techCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
    <PageHero
      eyebrow={portfolioCopy.hero.eyebrow}
      title={portfolioCopy.hero.title}
      description={portfolioCopy.hero.description}
      visual={<ProjectCollage />}
      meta={[
        {
          label: portfolioCopy.heroMeta.caseStudiesLabel,
          value: `${projectCount}`,
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
