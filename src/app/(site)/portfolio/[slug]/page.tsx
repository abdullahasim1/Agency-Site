import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { ChallengeSection } from "@/components/case-study/ChallengeSection";
import { EngagementObjectives } from "@/components/case-study/EngagementObjectives";
import { FeaturesGrid } from "@/components/case-study/FeaturesGrid";
import { ProjectCTA } from "@/components/case-study/ProjectCTA";
import { ProjectGallery } from "@/components/case-study/ProjectGallery";
import { ProjectHero } from "@/components/case-study/ProjectHero";
import { ProjectOverview } from "@/components/case-study/ProjectOverview";
import { ProjectVideo } from "@/components/case-study/ProjectVideo";
import { ResultsSection } from "@/components/case-study/ResultsSection";
import { SolutionSection } from "@/components/case-study/SolutionSection";
import { TechStack } from "@/components/case-study/TechStack";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

import { JsonLd } from "@/components/seo/JsonLd";
import {
  getProjectBySlug,
  getProjectSlugs,
  getProjects,
} from "@/data/projects";
import { buildMetadata, caseStudySchema, pageGraph } from "@/lib/seo";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

/** Every case study is known at build time, so all of them prerender. */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "This case study is no longer available.",
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: `${project.title} — ${project.tagline}`,
    description: project.shortDescription,
    path: `/portfolio/${project.slug}`,
    type: "article",
    keywords: [
      project.title,
      project.tagline,
      ...project.categories,
      ...project.technologies,
    ],
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  // Pick up to 3 related projects in same categories or adjacent projects
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aOverlap = a.categories.some((c) => project.categories.includes(c))
        ? 1
        : 0;
      const bOverlap = b.categories.some((c) => project.categories.includes(c))
        ? 1
        : 0;
      return bOverlap - aOverlap;
    })
    .slice(0, 3);

  const path = `/portfolio/${project.slug}`;
  const title = `${project.title} — ${project.tagline}`;

  return (
    <>
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ChallengeSection project={project} />
      <EngagementObjectives project={project} />
      <SolutionSection project={project} />
      <FeaturesGrid project={project} />
      <TechStack project={project} />
      <ResultsSection project={project} />
      <ProjectGallery project={project} />
      <ProjectVideo project={project} />

      {relatedProjects.length > 0 && (
        <section className="section-y border-t border-ink-200 bg-ink-25">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="type-eyebrow text-brand-600">Explore More Work</p>
                <h2 className="type-h2 mt-2 text-ink-950">
                  Related Case Studies
                </h2>
              </div>
              <Button
                href="/portfolio"
                variant="secondary"
                trailingIcon={
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                    aria-hidden
                  />
                }
              >
                All Projects
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rel) => (
                <ProjectCard key={rel.id} project={rel} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <ProjectCTA project={project} />

      <JsonLd
        data={pageGraph({
          path,
          title,
          description: project.shortDescription,
          image: project.image,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path },
          ],
          nodes: [
            caseStudySchema({
              title,
              description: project.shortDescription,
              path,
              image: project.image,
              datePublished: `${project.overview.year}-01-01`,
              keywords: [project.category, ...project.technologies],
            }),
          ],
        })}
      />
    </>
  );
}
