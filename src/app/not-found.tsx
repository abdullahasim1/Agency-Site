import { NotFoundPage, metadata } from "@/components/layout/NotFoundPage";

/*
 * Root 404 — handles URLs that don't match any route at all (e.g. /keystatic/xyz)
 * as well as notFound() calls in segments without their own boundary.
 *
 * Renders inside the root layout (<html>/<body>/fonts only), so it carries no
 * navbar — but the component's own home button keeps the visitor moving.
 * Sharing one component means every 404 on the site looks identical.
 */

export { metadata };

export default function RootNotFound() {
  return <NotFoundPage />;
}
