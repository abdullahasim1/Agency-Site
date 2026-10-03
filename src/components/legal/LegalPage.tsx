import { LegalVisual } from "@/components/legal/LegalVisual";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import {
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
 * Shared layout for the legal pages (/privacy, /terms).
 *
 * Content comes from src/content/legal.json (editable in Keystatic).
 * NOTE: this copy is standard good-faith policy text, not legal advice.
 * Have it reviewed by qualified counsel for the jurisdictions served.
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
