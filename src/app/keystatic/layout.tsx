import type { Metadata } from "next";
import { headers } from "next/headers";
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
 * GitHub App variables; the panel itself is a client component. The gate is
 * evaluated per request: production needs the GitHub mode plus all three
 * secrets, and development answers 404 to any host that is not the local
 * machine — see `isKeystaticEnabled` for the full reasoning.
 */
export default async function Layout() {
  if (!isKeystaticEnabled((await headers()).get("host") ?? undefined)) {
    notFound();
  }

  return <KeystaticApp />;
}