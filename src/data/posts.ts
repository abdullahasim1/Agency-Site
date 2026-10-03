import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import { reader } from "./reader";

/**
 * DOMPurify needs a DOM. In Node 22 we can use the native JSDOM environment
 * for server-side sanitization — the same instance is reused across all posts.
 */
const window = new JSDOM("").window;
const purify = DOMPurify(window);

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

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date (YYYY-MM-DD) from the publish-date field. */
  publishedAt: string;
  /** ISO date set only when a published post is meaningfully revised. */
  updatedAt?: string;
  bodyHtml: string;
  /**
   * H2 outline of the article, derived from the markdown at build time.
   * Drives the table of contents; empty when a post has no ## headings.
   */
  toc: TocEntry[];
  /** Whole-minute read time, derived from the word count. */
  readingMinutes: number;
  /** Named human author — when set, emitted as Person schema instead of Organization. */
  authorName?: string;
  /** The author's role at the studio (e.g. "Head of AI Engineering"). */
  authorRole?: string;
  /** Absolute URL to the author's profile or bio section. */
  authorUrl?: string;
  /**
   * FAQ pairs extracted from the body's FAQ section at build time.
   * Emitted as FAQPage structured data on the article page.
   */
  faq?: Array<{ question: string; answer: string }>;
}

interface TocEntry {
  /** Anchor id — matches the id given to the rendered <h2>. */
  id: string;
  text: string;
}

interface PostEntry {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  draft: boolean;
  body: string;
  authorName?: string;
  authorRole?: string;
  authorUrl?: string;
}

/** Anchor id from heading text — lowercase, hyphenated, punctuation stripped. */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Markdown → HTML, once per build, sanitized against XSS.
 *
 * The custom heading renderer gives every h2 a stable id (built from its
 * text), which is what makes the table of contents and #anchor deep links
 * work. H3+ are left unadorned to keep the TOC a flat outline. The entries
 * are collected in the same render pass, so the TOC cannot drift from the
 * body it describes.
 */
const renderMarkdown = (markdown: string): { html: string; toc: TocEntry[] } => {
  const toc: TocEntry[] = [];

  const renderer = new marked.Renderer();
  const baseHeading = renderer.heading.bind(renderer);
  renderer.heading = (heading) => {
    const html = baseHeading(heading);
    if (heading.depth === 2) {
      const id = slugifyHeading(heading.text);
      toc.push({ id, text: heading.text });
      return html.replace(/^<h2/, `<h2 id="${id}"`);
    }
    return html;
  };

  marked.setOptions({ gfm: true, breaks: false, renderer });
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  const html = purify.sanitize(rawHtml, {
    ADD_ATTR: ["id"],
  });
  return { html, toc };
};

/** Reading time at 200 wpm, rounded up to whole minutes (minimum 1). */
const readingTime = (text: string): number =>
  Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));

/** Markdown fragment → plain text, for FAQPage structured data. */
const stripMarkdown = (text: string): string =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * FAQ pairs from the body's "Frequently asked questions" section: each ###
 * question plus its answer paragraphs, as plain text. Emitted as FAQPage
 * JSON-LD on the article page; empty when the post has no FAQ section.
 */
const extractFaq = (
  markdown: string,
): Array<{ question: string; answer: string }> => {
  const faq: Array<{ question: string; answer: string }> = [];
  let inFaq = false;
  let current: { question: string; answer: string[] } | null = null;

  const flush = () => {
    if (current && current.answer.length) {
      const answer = stripMarkdown(current.answer.join(" "));
      if (answer) faq.push({ question: current.question, answer });
    }
    current = null;
  };

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      flush();
      inFaq = /frequently asked questions/i.test(h2[1]);
      continue;
    }
    if (!inFaq) continue;
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      flush();
      current = { question: stripMarkdown(h3[1]), answer: [] };
      continue;
    }
    if (current && line) current.answer.push(line);
  }
  flush();
  return faq;
};

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
        const { html, toc } = renderMarkdown(post.body);
        return {
          slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          bodyHtml: html,
          toc,
          readingMinutes: readingTime(post.body),
          authorName: post.authorName,
          authorRole: post.authorRole,
          authorUrl: post.authorUrl,
          faq: extractFaq(post.body),
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
