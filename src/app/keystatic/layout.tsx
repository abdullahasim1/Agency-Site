import { notFound } from "next/navigation";

import { isKeystaticEnabled } from "@/lib/keystatic-mode";

import KeystaticApp from "./keystatic";

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
