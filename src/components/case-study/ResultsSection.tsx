import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioCopy } from "@/data/pages";
import type { Project } from "@/data/projects";

/**
 * Measured outcomes for the engagement.
 *
 * Figures are read straight from `project.results` — see the placeholder note
 * at the top of src/data/projects.ts. Values stay strings rather than numbers
 * because they carry their own unit ("68%", "3.4x", "< 2s") and should never be
 * reformatted or animated into something the client did not actually report.
 */
export function ResultsSection({ project }: { project: Project }) {
  if (project.results.length === 0) return null;

  const resultsGridColumns =
    project.results.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <section className="section-y-sm">
      <Container>
        <SectionHeading
          eyebrow={portfolioCopy.caseStudy.results.eyebrow}
          title={portfolioCopy.caseStudy.results.title}
          description={portfolioCopy.caseStudy.results.description}
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className={`mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ink-200 sm:grid-cols-2 ${resultsGridColumns}`}
        >
          {project.results.map((result) => (
            <StaggerItem as="li" key={result.label} className="bg-white">
              <div className="flex h-full flex-col p-6 lg:p-7">
                <p className="nums-tabular type-h2 text-brand-600">
                  {result.value}
                </p>
                <p className="mt-3 text-base font-medium text-ink-900">
                  {result.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {result.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
