import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isKeystaticEnabled } from "@/lib/keystatic-enabled";

import KeystaticApp from "./keystatic";

/**
 * The panel is a real 200-response UI, so without this it is indexable. Paired
 * with the `/keystatic` Disallow in robots.txt: that stops the crawl, this
 * stops the indexing of anything already crawled or linked from elsewhere.
 */
export const metadata: Metadata = {
  title: "Content panel",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin panel UI.
 *
 * This is a Server Component, which is what lets it read the server-only
 * GitHub App variables; the panel itself is a client component. When the panel
 * is not configured the route 404s rather than rendering a UI whose saves
 * would fail — or, worse, an unauthenticated one.
 */
export default function Layout() {
  if (!isKeystaticEnabled) notFound();

  return <KeystaticApp />;
}
