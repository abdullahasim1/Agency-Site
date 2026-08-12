import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { privacyPage, privacySections } from "@/data/legal";
import { buildMetadata, pageGraph } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: privacyPage.title,
  description: privacyPage.seoDescription,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <LegalPage
        eyebrow={privacyPage.eyebrow}
        title={privacyPage.title}
        description={privacyPage.description}
        sections={privacySections}
        kind="privacy"
      />

      <JsonLd
        data={pageGraph({
          path: "/privacy",
          title: privacyPage.title,
          description: privacyPage.seoDescription,
          crumbs: [
            { name: "Home", path: "/" },
            { name: privacyPage.title, path: "/privacy" },
          ],
        })}
      />
    </>
  );
}
