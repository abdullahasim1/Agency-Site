import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPage, privacySections } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: privacyPage.title,
  description: privacyPage.seoDescription,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow={privacyPage.eyebrow}
      title={privacyPage.title}
      description={privacyPage.description}
      sections={privacySections}
      kind="privacy"
    />
  );
}
