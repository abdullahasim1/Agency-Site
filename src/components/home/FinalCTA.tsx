import { ArrowUpRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRIMARY_CTA } from "@/data/navigation";
import { sharedCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";

interface FinalCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

/**
 * Closing call to action.
 *
 * The defaults are edited under Shared page copy; pages that want their own
 * wording pass it in, and those overrides live with the page that uses them.
 *
 * Rendered as a dark panel inside a light band rather than a full-bleed dark
 * section, so it stays visually distinct from the dark footer directly below.
 */
export function FinalCTA({
  eyebrow = sharedCopy.finalCta.eyebrow,
  title = sharedCopy.finalCta.title,
  description = sharedCopy.finalCta.description,
}: FinalCTAProps) {
  return (
    <section className="section-y relative">
      <Container>
        <Reveal>
          <div
            data-theme="dark"
            className="relative isolate overflow-hidden rounded-panel bg-ink-950 px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-blueprint-dark opacity-45"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-32 size-[30rem] rounded-full bg-brand-500/15 blur-[120px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-20 size-[28rem] rounded-full bg-accent-violet/15 blur-[120px]"
            />

            <div className="relative mx-auto max-w-3xl text-center">
              <Eyebrow align="center">{eyebrow}</Eyebrow>

              <h2 className="type-h2 mt-5 text-white">{title}</h2>

              <p className="type-lead mx-auto mt-5 max-w-2xl text-ink-300">
                {description}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href={PRIMARY_CTA.href}
                  size="lg"
                  variant="inverse"
                  trailingIcon={
                    <ArrowUpRight
                      className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      aria-hidden
                    />
                  }
                >
                  {PRIMARY_CTA.label}
                </Button>
                <Button href="/contact" size="lg" variant="secondary">
                  {sharedCopy.finalCta.secondaryLabel}
                </Button>
              </div>

              <p className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-ink-400">
                <Mail className="size-4" aria-hidden />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-ink-200 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
                <span aria-hidden className="text-ink-600">
                  ·
                </span>
                <span>{siteConfig.contact.responseTime}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
