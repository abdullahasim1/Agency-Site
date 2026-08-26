import { collection, fields } from "@keystatic/core";

/**
 * Blog posts — the content-marketing engine of the site.
 *
 * One JSON file per post under `src/content/posts/`, edited from the Keystatic
 * panel at /keystatic. The body is raw Markdown in a multiline field, rendered
 * at build time with `marked` (see src/data/posts.ts), so the published pages
 * stay fully static.
 *
 * Set "Draft" while a post is being written: drafts are invisible to the site,
 * the sitemap and every selector. Clear it to publish.
 */
export const posts = collection({
  label: "Posts - add / edit / delete",
  path: "src/content/posts/*/",
  slugField: "title",
  format: { data: "json" },
  columns: ["title", "category", "publishedAt", "draft"],
  entryLayout: "form",
  schema: {
    title: fields.slug({
      name: {
        label: "Post title",
        description:
          'Shown on cards, the article page, search results and social cards. Write for the reader\'s search, e.g. "How much does it cost to build an AI agent?".',
        validation: { isRequired: true },
      },
      slug: {
        label: "URL slug",
        description:
          "This becomes /blog/slug. Lowercase letters, numbers and hyphens. Avoid changing after publish — existing links break.",
      },
    }),
    excerpt: fields.text({
      label: "Excerpt",
      description:
        "One or two sentences shown on blog cards, search results and social previews. Aim for 140–180 characters.",
      multiline: true,
      validation: { isRequired: true, length: { max: 220 } },
    }),
    category: fields.select({
      label: "Category",
      options: [
        { label: "AI & Automation", value: "AI & Automation" },
        { label: "Engineering", value: "Engineering" },
        { label: "Strategy", value: "Strategy" },
      ],
      defaultValue: "AI & Automation",
    }),
    publishedAt: fields.date({
      label: "Publish date",
      description:
        "Shown on the card and the article, and used to order the listing (newest first).",
      validation: { isRequired: true },
    }),
    draft: fields.checkbox({
      label: "Draft",
      description:
        "Drafts are hidden from the site, the sitemap and search engines until unticked.",
      defaultValue: false,
    }),
    body: fields.text({
      label: "Body (Markdown)",
      description:
        "The full article in Markdown: ## headings, paragraphs, - lists, > quotes, `code`, [links](https://…). The first ## becomes the start of the article body.",
      multiline: true,
      validation: { isRequired: true },
    }),
  },
});
