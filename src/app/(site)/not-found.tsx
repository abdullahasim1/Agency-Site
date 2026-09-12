import { NotFoundPage, metadata } from "@/components/layout/NotFoundPage";

/*
 * The (site) group's 404 boundary. notFound() anywhere under the marketing
 * tree renders this through the (site) layout — navbar and footer included.
 */

export { metadata };

export default function NotFound() {
  return <NotFoundPage />;
}
