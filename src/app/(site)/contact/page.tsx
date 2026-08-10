import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRIMARY_CTA } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Tell us what you are building or automating. ${siteConfig.contact.responseTime}`,
  path: "/contact",
  keywords: [
    "contact AI agency",
    "software development enquiry",
    "automation consultation",
  ],
});

const details = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: siteConfig.contact.phoneHref,
  },
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.contact.location,
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: siteConfig.contact.hours,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-blueprint mask-fade-b opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
        />

        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* Left: introduction and contact details */}
            <div>
              <Reveal y={12}>
                <Eyebrow>Contact</Eyebrow>
              </Reveal>

              <Reveal delay={0.08} y={14}>
                <h1 className="type-display mt-6">Let&apos;s Build Something Great</h1>
              </Reveal>

              <Reveal delay={0.16} y={14}>
                <p className="type-lead mt-5 text-ink-600">
                  Send us the problem, not a polished brief. Describe the process
                  you want to automate or the product you want built, and we will
                  come back with a straight assessment: what is worth doing, what
                  it takes, and whether we are the right team for it.
                </p>
              </Reveal>

              <Reveal delay={0.22} y={14}>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-600">
                  Every enquiry is read by an engineer. There is no qualification
                  script and no obligation — plenty of first conversations end
                  with us pointing someone at a simpler answer.
                </p>
              </Reveal>

              <Reveal delay={0.3} y={14}>
                <dl className="mt-10 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-start gap-3.5 bg-white p-5"
                    >
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[0.625rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <detail.icon className="size-[1.0625rem]" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <dt className="type-eyebrow text-ink-400">
                          {detail.label}
                        </dt>
                        <dd className="mt-1.5 text-[0.9375rem] leading-relaxed break-words text-ink-800">
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            detail.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.36} y={14}>
                <p className="mt-8 rounded-card border border-ink-200 bg-ink-25 p-5 text-sm leading-relaxed text-ink-600">
                  Prefer to talk it through?{" "}
                  <a
                    href={PRIMARY_CTA.href}
                    className="font-medium text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
                  >
                    Book a free 30-minute consultation
                  </a>{" "}
                  and pick a slot that suits you.
                </p>
              </Reveal>
            </div>

            {/* Right: form */}
            <Reveal delay={0.2} y={18}>
              <ContactForm />
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
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />
    </>
  );
}
