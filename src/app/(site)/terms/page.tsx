import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { termsPage, termsSections } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: termsPage.title,
  description: termsPage.seoDescription,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow={termsPage.eyebrow}
      title={termsPage.title}
      description={termsPage.description}
      sections={termsSections}
      kind="terms"
    />
  );
}
