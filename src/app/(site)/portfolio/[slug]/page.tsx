import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";
import { sharedCopy } from "@/data/pages";
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
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const path = `/portfolio/${project.slug}`;
  const title = `${project.title} — ${project.tagline}`;

  return (
    <>
      {/* Breadcrumb */}
      <section className="relative isolate overflow-hidden border-b border-ink-200 pt-28 pb-0 sm:pt-32 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
        />
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
              <li>
                <Link href="/" className="transition-colors hover:text-ink-800">
                  {sharedCopy.breadcrumb.home}
                </Link>
              </li>
              <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
              <li>
                <Link
                  href="/portfolio"
                  className="transition-colors hover:text-ink-800"
                >
                  {sharedCopy.breadcrumb.portfolio}
                </Link>
              </li>
              <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
              <li aria-current="page" className="text-ink-800">
                {project.title}
              </li>
            </ol>
          </nav>
        </Container>
      </section>

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
