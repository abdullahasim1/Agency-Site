import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { termsSections } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply when you access and use this website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that apply when you access and use this website."
      sections={termsSections}
      kind="terms"
    />
  );
}
