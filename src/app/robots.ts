import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

/**
 * Crawlers that answer engines and AI assistants use, listed explicitly.
 *
 * `User-agent: *` already allows all of them, so on the surface this is
 * redundant — but it is not, for two reasons. Naming an agent records the
 * decision, so a later tightening of the `*` group (a staging lock, a scraper
 * block) cannot silently take the answer engines down with it. And
 * `Google-Extended` is not covered by `*` in the way the others are: it is not
 * a crawler at all but the opt-out switch for whether already-indexed pages may
 * ground Gemini and AI Overviews. Listing it with `Allow: /` states the answer.
 *
 * Two families per vendor is normal and deliberate: the training/indexing
 * crawler (GPTBot, ClaudeBot) and the live retrieval fetcher that runs when a
 * user asks a question (ChatGPT-User, Claude-User, Perplexity-User). Blocking
 * the second is what makes a site un-citable in a live answer.
 */
const AI_AGENTS = [
  // OpenAI — indexing, search, and live user-initiated fetches.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Gemini / AI Overviews grounding, and Apple Intelligence.
  "Google-Extended",
  "Applebot-Extended",
  // Common Crawl, which feeds many downstream models.
  "CCBot",
  // Meta, Amazon, DuckDuckGo, Cohere, You.com.
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];

/**
 * Paths no crawler should index. `/api/` has no crawlable content, and
 * `/keystatic` is the admin panel — it serves a 200 with a real UI, so leaving
 * it out of robots.txt is what would let it surface in results. The panel's own
 * layout also carries `noindex`, which is the half of the pair that still works
 * for a crawler that ignores this file.
 */
const DISALLOW = ["/api/", "/keystatic"];

/**
 * robots.txt is generated from the site config so the host stays in sync with
 * the canonical URL used everywhere else.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
