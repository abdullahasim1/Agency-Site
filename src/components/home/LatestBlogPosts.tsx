import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPosts } from "@/data/posts";

/** Formats an ISO date (YYYY-MM-DD) for display, timezone-safe. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Top 3 recent blog posts shown on the homepage.
 *
 * Essential for SEO and fast search crawler discovery: passes high-priority
 * homepage link juice directly to blog articles.
 */
export async function LatestBlogPosts() {
  const posts = (await getPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="insights" className="section-y relative bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow="Insights & Guides"
          title="Latest from our engineering blog"
          description="Practical breakdowns on AI agents, automation architectures, and software engineering: what works, what it costs, and where it delivers ROI."
          action={
            <Button
              href="/blog"
              variant="secondary"
              trailingIcon={
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                  aria-hidden
                />
              }
            >
              Read All Articles
            </Button>
          }
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <StaggerItem as="li" key={post.slug} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between rounded-card border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-card sm:p-7"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs text-ink-500">
                    <Eyebrow>{post.category}</Eyebrow>
                  </div>
                  <h3 className="type-h4 mt-4 text-balance text-ink-950 transition-colors group-hover:text-brand-700">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[0.875rem] leading-relaxed text-ink-600">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-5 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {formatDate(post.publishedAt)} · {post.readingMinutes} min
                    read
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

        {/* Repeated on small screens */}
        <div className="mt-10 flex justify-center lg:hidden">
          <Button
            href="/blog"
            variant="secondary"
            size="lg"
            trailingIcon={<ArrowRight className="size-4" aria-hidden />}
          >
            Read All Articles
          </Button>
        </div>
      </Container>
    </section>
  );
}
