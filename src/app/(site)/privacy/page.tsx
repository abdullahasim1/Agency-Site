import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { privacySections } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How we collect, use and protect the information you share with us through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="What information we collect when you use this site or contact us, why we collect it, and the choices you have."
      sections={privacySections}
      kind="privacy"
    />
  );
}
