import { AlertCircle } from "lucide-react";

import { LegalVisual } from "@/components/legal/LegalVisual";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import {
  legalDisclaimer,
  legalEffectiveDate,
  legalEffectiveDateLabel,
  type LegalSection,
} from "@/data/legal";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  /** Picks the hero diagram: the data rail, or the terms motifs. */
  kind: "privacy" | "terms";
}

/**
 * Shared layout for the placeholder legal pages (/privacy, /terms).
 *
 * The disclaimer banner is deliberately prominent so nobody mistakes the
 * boilerplate for reviewed policy. Content comes from src/data/legal.ts.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
  kind,
}: LegalPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        visual={<LegalVisual kind={kind} />}
      />

      <section className="section-y">
        <Container width="prose">
          <Reveal>
            <p className="type-eyebrow text-ink-400">
              {legalEffectiveDateLabel} {legalEffectiveDate}
            </p>
          </Reveal>

          <Reveal>
            <div
              role="note"
              className="mt-6 flex items-start gap-3 rounded-card border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>{legalDisclaimer}</p>
            </div>
          </Reveal>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <Reveal key={section.heading}>
                <div>
                  <h2 className="type-h3">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-[0.9375rem] leading-relaxed text-ink-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
