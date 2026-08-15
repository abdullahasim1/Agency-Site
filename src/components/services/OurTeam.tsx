import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechLogo } from "@/components/ui/TechLogo";
import { servicesCopy } from "@/data/pages";

/**
 * "Our team" band on the services page — the platforms the team specialises in.
 *
 * A dark band placed under the services grid, so it reads as a structural break
 * before "Where We Work". Each platform shows its real brand mark on a white
 * chip (so AWS orange, Azure blue, Claude and n8n stay in full colour rather
 * than being flattened to white the way the marks are on the home tech band),
 * its name, and one honest line about what the team does with it.
 *
 * Deliberately *expertise*, not certification: the copy describes hands-on
 * experience, in keeping with the site's standing rule that there is no
 * partner, marketplace or certification content anywhere. The platform names
 * resolve to logos through the same registry the rest of the site uses, so an
 * editor only types a name in the panel and the mark appears automatically.
 */
export function OurTeam() {
  const { eyebrow, title, description, platforms } = servicesCopy.team;

  return (
    <section
      data-theme="dark"
      className="section-y-sm relative isolate overflow-hidden bg-ink-950"
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 size-[30rem] rounded-full bg-brand-600/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full bg-accent-cyan/10 blur-[130px]"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={eyebrow}
          tone="dark"
          title={title}
          description={description}
        />

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {platforms.map((platform) => (
            <StaggerItem as="li" key={platform.name} className="h-full">
              <div className="group flex h-full flex-col rounded-card border border-white/10 bg-white/[0.035] p-6 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[0.9rem] bg-white ring-1 ring-white/10">
                  <TechLogo name={platform.name} size="md" fallback="monogram" />
                </span>

                <h3 className="type-h4 mt-5 text-white">{platform.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {platform.capability}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
