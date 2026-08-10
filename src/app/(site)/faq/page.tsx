import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { ConsultationMockup } from "@/components/ui/ConsultationMockup";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { faqs, type FaqItem } from "@/data/faq";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "How engagements start, how long projects take, where AI genuinely fits, who owns the code, and how we price work.",
  path: "/faq",
  keywords: [
    "AI agency FAQ",
    "software development questions",
    "automation engagement",
    "project pricing",
  ],
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
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Straight answers to the questions we are asked most often. If yours is not here, ask us directly — we would rather answer it properly."
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

              <div className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
                {group.items.map((faq) => (
                  <Reveal key={faq.id}>
                    <details className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                        <h3 className="text-[1.0625rem] font-medium text-ink-900">
                          {faq.question}
                        </h3>
                        <span
                          aria-hidden
                          className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-transform duration-200 group-open:rotate-45"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 1v10M1 6h10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-600">
                        {faq.answer}
                      </p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <TechMarquee />

      <FinalCTA
        eyebrow="Still deciding?"
        title="Have a Question We Have Not Answered?"
        description="Book a free consultation or send us a message. There is no obligation and no sales script."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(
              faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              })),
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
          ),
        }}
      />
    </>
  );
}
