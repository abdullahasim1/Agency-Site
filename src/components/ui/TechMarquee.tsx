import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { sharedCopy } from "@/data/pages";
import { allTechnologies } from "@/data/technologies";
import { techLogo } from "@/data/tech-logos";
import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  /** Mono label above the strip. Say what the strip is, honestly. */
  label?: string;
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
  tone = "light",
  className,
}: TechMarqueeProps) {
  const dark = tone === "dark";

  return (
    <section
      aria-labelledby="tech-marquee-heading"
      className={cn("section-y-sm", dark && "bg-ink-950", className)}
      data-theme={dark ? "dark" : undefined}
    >
      <h2 id="tech-marquee-heading" className="sr-only">
        {label}
      </h2>

      <Container>
        <p
          className={cn(
            "type-eyebrow text-center",
            dark ? "text-ink-500" : "text-ink-400",
          )}
        >
          {label}
        </p>
      </Container>

      <div className="marquee-track mask-fade-x mt-7 overflow-hidden">
        <div className="animate-marquee flex w-max gap-3 pr-3">
          {/* Second copy is decorative: the first already names every tool. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 gap-3"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {allTechnologies.map((tech) => {
                const logo = techLogo(tech);
                return (
                  <li
                    key={tech}
                    className={cn(
                      "flex shrink-0 items-center gap-2.5 rounded-pill border px-4 py-2",
                      dark
                        ? "border-white/10 bg-white/[0.04] text-ink-300"
                        : "border-ink-200 bg-white text-ink-600",
                    )}
                  >
                    {logo ? (
                      <Image
                        src={logo}
                        alt=""
                        width={18}
                        height={18}
                        aria-hidden
                        className={cn(
                          "size-[1.125rem] shrink-0 object-contain",
                          // Vercel, OpenAI and ElevenLabs are black marks; invert
                          // them on the dark band so they don't vanish.
                          dark && "brightness-0 invert",
                        )}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          dark ? "bg-brand-400" : "bg-brand-500",
                        )}
                      />
                    )}
                    <span className="font-mono text-[0.8125rem] whitespace-nowrap">
                      {tech}
                    </span>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
