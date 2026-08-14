import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsultationMockup } from "@/components/ui/ConsultationMockup";
import { Container } from "@/components/ui/Container";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, type FaqItem } from "@/data/faq";
import { faqCopy } from "@/data/pages";
import { buildMetadata, pageGraph } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: faqCopy.seo.title,
  description: faqCopy.seo.description,
  path: "/faq",
  keywords: faqCopy.seo.keywords,
});

const categoryOrder: FaqItem["category"][] = [
  "Engagement",
  "Delivery",
  "Technology",
  "Commercial",
];

export default function FaqPage() {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: faqs.filter((faq) => faq.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow={faqCopy.hero.eyebrow}
        title={faqCopy.hero.title}
        description={faqCopy.hero.description}
        visual={<ConsultationMockup />}
      />

      <section className="section-y">
        <Container width="prose">
          {grouped.map((group, groupIndex) => (
            <div
              key={group.category}
              className={groupIndex > 0 ? "mt-14" : undefined}
            >
              <Reveal>
                <h2 className="type-h3">{group.category}</h2>
              </Reveal>

              <div className="mt-6">
                <FaqList items={group.items} />
              </div>
            </div>
          ))}
        </Container>
      </section>

      <FinalCTA
        eyebrow={faqCopy.cta.eyebrow}
        title={faqCopy.cta.title}
        description={faqCopy.cta.description}
      />

      <JsonLd
        data={pageGraph({
          path: "/faq",
          title: faqCopy.seo.title,
          description: faqCopy.seo.description,
          /* The questions are the page here, so they become its mainEntity
             rather than a nested FAQPage node. */
          type: "FAQPage",
          faq: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
          crumbs: [
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ],
        })}
      />
    </>
  );
}
