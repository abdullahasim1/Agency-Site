import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { getPosts } from "@/data/posts";
import { buildMetadata, pageGraph } from "@/lib/seo";

const BLOG_TITLE = "Blog — AI, Automation & Software Engineering Insights";
const BLOG_DESCRIPTION =
  "Practical guides on AI agents, automation and software engineering: what works, what it costs and where it pays off. Written by the DevRox team.";

export const metadata: Metadata = buildMetadata({
  title: "AI & Automation Blog",
  description: BLOG_DESCRIPTION,
  path: "/blog",
  keywords: [
    "AI agency blog",
    "AI automation insights",
    "AI agent development",
    "software engineering guides",
  ],
});

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

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ideas that ship"
        description={BLOG_DESCRIPTION}
      />

      <section className="section-y">
        <Container>
          {posts.length === 0 ? (
            /* No published posts yet — keep the page honest rather than empty-looking. */
            <p className="mx-auto max-w-xl text-center text-ink-500">
              New articles are on the way. In the meantime,{" "}
              <Link
                href="/faq"
                className="font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                our FAQ
              </Link>{" "}
              answers the questions clients ask most.
            </p>
          ) : (
            <Stagger
              as="ul"
              stagger={0.06}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-2"
            >
              {posts.map((post) => (
                <StaggerItem as="li" key={post.slug} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-card border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift sm:p-7"
                  >
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      <Eyebrow>{post.category}</Eyebrow>
                    </div>
                    <h2 className="type-h3 mt-4 text-balance text-ink-950 transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-5 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDate(post.publishedAt)} · {post.readingMinutes}{" "}
                        min read
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-brand-700 transition-colors group-hover:text-brand-600">
                        Read
                        <ArrowUpRight
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </section>

      <FinalCTA />

      <JsonLd
        data={pageGraph({
          path: "/blog",
          title: BLOG_TITLE,
          description: BLOG_DESCRIPTION,
          type: "CollectionPage",
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ],
        })}
      />
    </>
  );
}
