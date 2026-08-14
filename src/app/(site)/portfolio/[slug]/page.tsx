import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";
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
      <CaseStudyLayout project={project} />

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
