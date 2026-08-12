import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { termsPage, termsSections } from "@/data/legal";
import { buildMetadata, pageGraph } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: termsPage.title,
  description: termsPage.seoDescription,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <LegalPage
        eyebrow={termsPage.eyebrow}
        title={termsPage.title}
        description={termsPage.description}
        sections={termsSections}
        kind="terms"
      />

      <JsonLd
        data={pageGraph({
          path: "/terms",
          title: termsPage.title,
          description: termsPage.seoDescription,
          crumbs: [
            { name: "Home", path: "/" },
            { name: termsPage.title, path: "/terms" },
          ],
        })}
      />
    </>
  );
}
