import { ArrowRight, ArrowUpRight } from "lucide-react";

import { HeroVisual } from "@/components/home/HeroVisual";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/data/navigation";
import { homeCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      {/* Two very soft washes anchor the corners without reading as a gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 -top-40 -z-10 size-[42rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-56 top-24 -z-10 size-[38rem] rounded-full bg-accent-violet/[0.06] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-blueprint mask-fade-b opacity-60"
      />

      <Container>
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
          <div className="max-w-2xl">
            <Reveal y={12}>
              <Eyebrow>{siteConfig.tagline}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} y={14}>
              <h1 className="type-display mt-6">
                {homeCopy.heroHeadline}{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-cyan bg-clip-text text-transparent">
                    {homeCopy.heroHeadlineAccent}
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16} y={14}>
              <p className="type-lead mt-6 max-w-xl text-ink-600">
                {homeCopy.heroLead}
              </p>
            </Reveal>

            <Reveal delay={0.24} y={14}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href={PRIMARY_CTA.href}
                  size="lg"
                  trailingIcon={
                    <ArrowUpRight
                      className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      aria-hidden
                    />
                  }
                >
                  {PRIMARY_CTA.label}
                </Button>
                <Button
                  href={SECONDARY_CTA.href}
                  size="lg"
                  variant="secondary"
                  trailingIcon={
                    <ArrowRight
                      className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5"
                      aria-hidden
                    />
                  }
                >
                  {SECONDARY_CTA.label}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.32} y={14}>
              <div className="mt-10 border-t border-ink-200 pt-6">
                <p className="type-eyebrow text-ink-500">
                  {homeCopy.heroCapabilitiesLabel}
                </p>
                <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2.5">
                  {homeCopy.heroCapabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-center gap-2 text-sm text-ink-600"
                    >
                      <span
                        className="size-1 rounded-full bg-brand-500"
                        aria-hidden
                      />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.18} y={20} className="lg:pl-4">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
