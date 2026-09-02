import { Container } from "@/components/ui/Container";
import { PauseableMarquee } from "@/components/ui/PauseableMarquee";
import { TechLogo } from "@/components/ui/TechLogo";
import { sharedCopy } from "@/data/pages";
import { allTechnologies } from "@/data/technologies";
import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  /** Mono label above the strip. Say what the strip is, honestly. */
  label?: string;
  /**
   * The technologies to show. Defaults to the full registry — pass a subset
   * (e.g. the categories a page is about) so the strip varies per page
   * instead of repeating the same wall of tools everywhere.
   */
  items?: string[];
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Auto-scrolling strip of the tools we actually build with.
 *
 * These are tools, never clients: the names come straight from
 * src/data/technologies.ts, so the strip can only ever show something the site
 * already claims elsewhere.
 *
 * The track is rendered twice and translated -50%, which makes the loop
 * seamless. Everything is CSS (`animate-marquee` pauses on hover/focus-within
 * via `marquee-track`, and is neutralised under `prefers-reduced-motion`), so
 * this ships no JavaScript.
 */
export function TechMarquee({
  label = sharedCopy.techMarqueeLabel,
  items = allTechnologies.slice(0, 28),
  tone = "light",
  className,
}: TechMarqueeProps) {
  const dark = tone === "dark";

  return (
    <section
      aria-labelledby="tech-marquee-heading"
      className={cn(
        "section-y-sm",
        dark ? "bg-ink-950" : "bg-ink-25",
        className,
      )}
      data-theme={dark ? "dark" : undefined}
    >
      <h2 id="tech-marquee-heading" className="sr-only">
        {label}
      </h2>

      <Container>
        <p
          className={cn(
            "type-eyebrow text-center",
            dark ? "text-ink-500" : "text-ink-500",
          )}
        >
          {label}
        </p>
      </Container>

      <PauseableMarquee className="marquee-track mask-fade-x relative mt-7 overflow-hidden">
        {/* Glass sheen sweeping over the strip. */}
        <span
          aria-hidden
          className={cn(
            "animate-sheen pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-linear-to-r from-transparent to-transparent",
            dark ? "via-white/9" : "via-brand-500/8",
          )}
        />
        <div className="animate-marquee flex w-full gap-3.5 pr-3.5">
          {/* Second copy is decorative: the first already names every tool. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 gap-3.5"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {items.map((tech) => (
                <li
                  key={tech}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-pill border px-5 py-2.5",
                    dark
                      ? "border-white/15 bg-white/[0.07] text-ink-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
                      : "border-ink-200/80 bg-white text-ink-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(23,26,38,0.12)]",
                  )}
                >
                  <TechLogo name={tech} size="sm" dark={dark} />
                  <span className="font-mono text-sm whitespace-nowrap">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </PauseableMarquee>
    </section>
  );
}
