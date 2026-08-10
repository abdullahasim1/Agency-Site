import type { Metadata } from "next";
import { Check, Clock, Mail, ShieldCheck } from "lucide-react";

import { BookingEmbed } from "@/components/contact/BookingEmbed";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { consultationPoints } from "@/data/contact";
import { bookACallCopy, fill } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bookACallCopy.seo.title,
  description: bookACallCopy.seo.description,
  path: "/book-a-call",
  keywords: bookACallCopy.seo.keywords,
});

/**
 * Icons for the assurance list. They are bundled components, so they stay in
 * code and pair with the editable text by position — the panel controls the
 * wording, this controls the glyph.
 */
const assuranceIcons = [Clock, ShieldCheck, Mail];

export default function BookACallPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-blueprint mask-fade-b opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
        />

        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            {/* Left: what the call covers */}
            <div>
              <Reveal y={12}>
                <Eyebrow>{bookACallCopy.eyebrow}</Eyebrow>
              </Reveal>

              <Reveal delay={0.08} y={14}>
                <h1 className="type-display mt-6">{bookACallCopy.title}</h1>
              </Reveal>

              <Reveal delay={0.16} y={14}>
                <p className="type-lead mt-5 text-ink-600">
                  {bookACallCopy.lead}
                </p>
              </Reveal>

              <Reveal delay={0.22} y={14}>
                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
                  {bookACallCopy.assurances.map((text, index) => {
                    const AssuranceIcon =
                      assuranceIcons[index % assuranceIcons.length];
                    return (
                      <li
                        key={text}
                        className="flex items-center gap-2 text-sm text-ink-600"
                      >
                        <AssuranceIcon
                          className="size-4 shrink-0 text-brand-500"
                          aria-hidden
                        />
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              <div className="mt-10">
                <Reveal delay={0.28} y={14}>
                  <h2 className="type-h4">
                    {bookACallCopy.consultationHeading}
                  </h2>
                </Reveal>

                <Stagger
                  as="ol"
                  stagger={0.07}
                  delay={0.32}
                  className="mt-5 space-y-3"
                >
                  {consultationPoints.map((point, index) => (
                    <StaggerItem as="li" key={point.title}>
                      <div className="flex items-start gap-4 rounded-card border border-ink-200 bg-white p-5">
                        <span
                          aria-hidden
                          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-[0.9375rem] font-medium text-ink-900">
                            {point.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              <Reveal delay={0.4} y={14}>
                <div className="mt-8 flex items-start gap-3 rounded-card border border-ink-200 bg-ink-25 p-5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-brand-500"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-ink-600">
                    {bookACallCopy.fallback.before}{" "}
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="font-medium text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
                    >
                      {siteConfig.contact.email}
                    </a>{" "}
                    {fill(bookACallCopy.fallback.after, {
                      hours: siteConfig.contact.hours,
                    })}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right: scheduler */}
            <Reveal delay={0.2} y={18}>
              <BookingEmbed />
            </Reveal>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Book a Call", path: "/book-a-call" },
            ]),
          ),
        }}
      />
    </>
  );
}
