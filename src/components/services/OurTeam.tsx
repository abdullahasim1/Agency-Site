import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechLogo } from "@/components/ui/TechLogo";
import { servicesCopy } from "@/data/pages";
import { cn } from "@/lib/utils";

interface OurTeamProps {
  /** "light" for light bands (home page); "dark" for dark bands (services page). */
  tone?: "light" | "dark";
}

/**
 * "Our team" band — the platforms the team specialises in.
 *
 * Rendered as a band under the services grid on the services page (dark, so it
 * reads as a structural break before "Where We Work") and above the stack band
 * on the home page (light, so the page keeps its light → team → dark stack
 * rhythm). Each platform shows its real brand mark on a white chip (so AWS
 * orange, Azure blue, Claude and n8n stay in full colour rather than being
 * flattened to white the way the marks are on the tech band), its name, and
 * one honest line about what the team does with it.
 *
 * Deliberately *expertise*, not certification: the copy describes hands-on
 * experience, in keeping with the site's standing rule that there is no
 * partner, marketplace or certification content anywhere. The platform names
 * resolve to logos through the same registry the rest of the site uses, so an
 * editor only types a name in the panel and the mark appears automatically.
 */
export function OurTeam({ tone = "dark" }: OurTeamProps) {
  const { eyebrow, title, description, platforms } = servicesCopy.team;
  const dark = tone === "dark";

  return (
    <section
      data-theme={dark ? "dark" : undefined}
      className={cn(
        "section-y-sm relative isolate overflow-hidden",
        dark ? "bg-ink-950" : "bg-ink-25",
      )}
    >
      {dark ? (
        <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-50" />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-blueprint opacity-40" />
      )}
      <div
        aria-hidden
        className={cn(
          "wash pointer-events-none absolute -left-40 top-0 size-[30rem] rounded-full blur-[130px]",
          dark ? "bg-brand-600/10" : "bg-brand-500/[0.09]",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "wash pointer-events-none absolute -right-40 bottom-0 size-[28rem] rounded-full blur-[130px]",
          dark ? "bg-accent-cyan/10" : "bg-accent-cyan/10",
        )}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={eyebrow}
          tone={dark ? "dark" : "light"}
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
              <div
                className={cn(
                  "group flex h-full flex-col rounded-card border p-6 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1",
                  dark
                    ? "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                    : "border-ink-200 bg-white shadow-[0_10px_24px_-14px_rgba(23,26,38,0.18)] hover:border-ink-300 hover:shadow-lift",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-[0.9rem] ring-1",
                    dark ? "bg-white ring-white/10" : "bg-ink-50 ring-ink-100",
                  )}
                >
                  <TechLogo name={platform.name} size="md" fallback="monogram" dark={dark} />
                </span>

                <h3
                  className={cn("type-h4 mt-5", dark ? "text-white" : "text-ink-900")}
                >
                  {platform.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    dark ? "text-ink-400" : "text-ink-600",
                  )}
                >
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