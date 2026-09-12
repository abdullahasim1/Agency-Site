import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock } from "lucide-react";

import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPostBySlug, getPostSlugs, getPosts } from "@/data/posts";
import { PRIMARY_CTA } from "@/data/navigation";
import {
  articleAuthorNode,
  articleSchema,
  buildMetadata,
  pageGraph,
} from "@/lib/seo";

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
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPosts()]);

  if (!post) notFound();

  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);
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
          className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[80px]"
        />
        <Container>
          <div className="max-w-3xl">
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Eyebrow>{post.category}</Eyebrow>
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Clock className="size-3.5" aria-hidden />
                {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                {post.updatedAt ? (
                  <span className="text-ink-400">
                    (updated {formatDate(post.updatedAt)})
                  </span>
                ) : null}
              </p>
              {post.authorName ? (
                <p className="text-xs text-ink-500">
                  Written by{" "}
                  <span className="font-medium text-ink-700">
                    {post.authorName}
                  </span>
                  {post.authorRole ? <> · {post.authorRole}</> : null}
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
          {/* Article body + sticky outline. The outline comes from the same
              render pass as the heading ids, so the two cannot disagree. */}
          <div className="mx-auto grid max-w-3xl gap-10 lg:max-w-none lg:grid-cols-[minmax(0,16rem)_minmax(0,48rem)] lg:justify-center">
            {post.toc.length > 1 ? (
              <nav
                aria-label="Table of contents"
                className="hidden lg:block"
              >
                <div className="sticky top-28 border-l border-ink-200 pl-5">
                  <p className="type-eyebrow text-ink-400">On this page</p>
                  <ol className="mt-4 space-y-2.5">
                    {post.toc.map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={`#${entry.id}`}
                          className="block text-sm leading-snug text-ink-600 transition-colors hover:text-brand-700"
                        >
                          {entry.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            ) : null}

            {/* The compiled Markdown body. Styles live in .prose (globals.css). */}
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </div>

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

          {/* Related Articles — Keeps crawlers moving and readers engaged */}
          {relatedPosts.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl border-t border-ink-200 pt-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="type-eyebrow text-brand-600">More Insights</p>
                  <h2 className="type-h3 mt-1 text-ink-950">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-600 transition-colors"
                >
                  View all posts
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col justify-between rounded-card border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-card"
                  >
                    <div>
                      <div className="text-xs text-ink-500">
                        <Eyebrow>{related.category}</Eyebrow>
                      </div>
                      <h3 className="type-h4 mt-3 text-ink-950 group-hover:text-brand-700 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-600">
                        {related.excerpt}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs text-ink-500 border-t border-ink-100 pt-4">
                      <span>
                        {formatDate(related.publishedAt)} ·{" "}
                        {related.readingMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-brand-700 transition-colors group-hover:text-brand-600">
                        Read
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
              dateModified: post.updatedAt,
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
