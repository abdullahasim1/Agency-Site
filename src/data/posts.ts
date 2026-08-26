import { marked } from "marked";

import { reader } from "./reader";

/**
 * Blog post content.
 *
 * Content lives as one JSON file per post under `src/content/posts/` and is
 * edited from the Keystatic admin panel at `/keystatic`. Like projects, posts
 * are read through the async Keystatic Reader, so every selector here returns
 * a promise; all callers are Server Components or build-time functions.
 *
 * Markdown bodies are compiled to HTML at build time with `marked`. The input
 * is first-party (the site owner writes it in the panel), and `marked` runs
 * without raw-HTML pass-through being needed — but the output is still
 * rendered via React's dangerouslySetInnerHTML on a page only the owner can
 * author, which keeps the trust boundary at the CMS login.
 *
 * Draft posts never leave this module: every selector filters them out before
 * any page, card or sitemap entry can see them.
 */

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date (YYYY-MM-DD) from the publish-date field. */
  publishedAt: string;
  bodyHtml: string;
  /** Whole-minute read time, derived from the word count. */
  readingMinutes: number;
  /** Named human author — when set, emitted as Person schema instead of Organization. */
  authorName?: string;
  /** The author's role at the studio (e.g. "Head of AI Engineering"). */
  authorRole?: string;
  /** Absolute URL to the author's profile or bio section. */
  authorUrl?: string;
}

interface PostEntry {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  draft: boolean;
  body: string;
  authorName?: string;
  authorRole?: string;
  authorUrl?: string;
}

/** Markdown → HTML, once per build. Headings stay one level under the H1. */
const renderMarkdown = (markdown: string): string => {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(markdown, { async: false }) as string;
};

/** Reading time at 200 wpm, rounded up to whole minutes (minimum 1). */
const readingTime = (text: string): number =>
  Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));

let postsPromise: Promise<Post[]> | undefined;

export function getPosts(): Promise<Post[]> {
  // In development, bust the in-memory cache on every call so CMS edits
  // reflect immediately without restarting the dev server.
  if (process.env.NODE_ENV === "development") {
    postsPromise = undefined;
  }
  postsPromise ??= reader.collections.posts.all().then((entries) =>
    entries
      .filter(({ entry }) => !entry.draft)
      .map(({ slug, entry }) => {
        const post = entry as unknown as PostEntry;
        return {
          slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          publishedAt: post.publishedAt,
          bodyHtml: renderMarkdown(post.body),
          readingMinutes: readingTime(post.body),
          authorName: post.authorName,
          authorRole: post.authorRole,
          authorUrl: post.authorUrl,
        } satisfies Post;
      })
      .sort(
        (a, b) =>
          b.publishedAt.localeCompare(a.publishedAt) ||
          b.slug.localeCompare(a.slug),
      ),
  );
  return postsPromise;
}

export async function getPostBySlug(
  slug: string,
): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}
