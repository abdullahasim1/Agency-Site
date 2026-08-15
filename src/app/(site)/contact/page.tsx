import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRIMARY_CTA } from "@/data/navigation";
import { contactCopy, fill } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, pageGraph } from "@/lib/seo";

const description = fill(contactCopy.seo.description, {
  responseTime: siteConfig.contact.responseTime,
});

export const metadata: Metadata = buildMetadata({
  title: contactCopy.seo.title,
  description,
  path: "/contact",
  keywords: contactCopy.seo.keywords,
});

const details = [
  {
    icon: Mail,
    label: contactCopy.details.emailLabel,
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: WhatsAppIcon,
    label: contactCopy.details.whatsappLabel,
    value: siteConfig.contact.whatsapp,
    href: siteConfig.contact.whatsappHref,
  },
  {
    icon: MapPin,
    label: contactCopy.details.locationLabel,
    value: siteConfig.contact.location,
    href: null,
  },
  {
    icon: Clock,
    label: contactCopy.details.hoursLabel,
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* Left: introduction and contact details */}
            <div>
              <Reveal y={12}>
                <Eyebrow>{contactCopy.eyebrow}</Eyebrow>
              </Reveal>

              <Reveal delay={0.08} y={14}>
                <h1 className="type-display mt-6">{contactCopy.title}</h1>
              </Reveal>

              <Reveal delay={0.16} y={14}>
                <p className="type-lead mt-5 text-ink-600">
                  {contactCopy.lead}
                </p>
              </Reveal>

              <Reveal delay={0.22} y={14}>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-600">
                  {contactCopy.secondaryParagraph}
                </p>
              </Reveal>

              <Reveal delay={0.3} y={14}>
                <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2">
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
                  {contactCopy.callout.before}{" "}
                  <a
                    href={PRIMARY_CTA.href}
                    className="font-medium text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
                  >
                    {contactCopy.callout.linkLabel}
                  </a>{" "}
                  {contactCopy.callout.after}
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

      <JsonLd
        data={pageGraph({
          path: "/contact",
          title: contactCopy.seo.title,
          description,
          type: "ContactPage",
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ],
        })}
      />
    </>
  );
}
