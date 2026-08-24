import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";

/**
 * robots.txt with Content-Signal directives for AI content usage preferences.
 * Per https://contentsignals.org/ and draft-romm-aipref-contentsignals.
 */
export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  /*
   * Policy mirrors the Content-Signal declaration below: indexing for search
   * is welcome (`search=yes`), while model training (`ai-train=no`) and
   * real-time AI input (`ai-input=no`) are reserved. Each AI crawler gets an
   * explicit group so agents never have to infer from wildcard rules alone.
   */
  const content = `# robots.txt for ${siteConfig.name}

# --- Everyone ---------------------------------------------------------------
User-agent: *
Allow: /
Disallow: /keystatic/
Disallow: /api/keystatic/

# --- AI crawlers welcome (search / user-initiated) --------------------------
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

# --- AI crawlers blocked (training / unpermitted AI input) ------------------
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

Sitemap: ${base}/sitemap.xml
Host: ${base}

# Content Signals (https://contentsignals.org/)
# Declare AI content usage preferences per draft-romm-aipref-contentsignals
Content-Signal: ai-train=no, search=yes, ai-input=no
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}