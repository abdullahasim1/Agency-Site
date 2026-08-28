import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, Clock } from "lucide-react";

import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPostBySlug, getPostSlugs } from "@/data/posts";
import { PRIMARY_CTA } from "@/data/navigation";
import { sharedCopy } from "@/data/pages";
import { articleAuthorNode, articleSchema, buildMetadata, pageGraph } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Every published post is known at build time, so all of them prerender. */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This article is no longer available.",
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: [post.category],
  });
}

/** Formats an ISO date (YYYY-MM-DD) for display, timezone-safe by construction. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-200 pt-28 pb-14 sm:pt-32 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
        />
        <Container>
          <div className="max-w-3xl">
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Eyebrow>{post.category}</Eyebrow>
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Clock className="size-3.5" aria-hidden />
                {formatDate(post.publishedAt)} · {post.readingMinutes} min read
              </p>
              {post.authorName ? (
                <p className="text-xs text-ink-500">
                  Written by {" "}
                  <span className="font-medium text-ink-700">
                    {post.authorName}
                  </span>
                  {post.authorRole ? (
                    <> · {post.authorRole}</>
                  ) : null}
                </p>
              ) : null}
            </div>
            <h1 className="type-display mt-4 text-balance">{post.title}</h1>
            <p className="type-lead mt-5 max-w-2xl text-ink-600">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container>
          {/* The compiled Markdown body. Styles live in .prose (globals.css). */}
          <div
            className="prose mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          <div className="mx-auto mt-14 max-w-3xl border-t border-ink-200 pt-10">
            <div className="flex flex-col gap-6 rounded-panel border border-ink-200 bg-ink-25 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="type-h4 text-ink-950">
                  Want this working in your business?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600">
                  We help teams scope and ship AI and automation projects like
                  this one. The first consultation is free.
                </p>
              </div>
              <Button href={PRIMARY_CTA.href} className="shrink-0">
                {PRIMARY_CTA.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <FinalCTA />

      <JsonLd
        data={pageGraph({
          path,
          title: post.title,
          description: post.excerpt,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ],
          nodes: [
            articleSchema({
              title: post.title,
              description: post.excerpt,
              path,
              datePublished: post.publishedAt,
              keywords: [post.category],
              authorName: post.authorName,
              authorUrl: post.authorUrl,
            }),
            articleAuthorNode({
              authorName: post.authorName,
              authorUrl: post.authorUrl,
            }),
          ].filter((n): n is NonNullable<typeof n> => n != null),
        })}
      />
    </>
  );
}
