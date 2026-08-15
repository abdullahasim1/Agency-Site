import Link from "next/link";
import { ArrowUpRight, Globe, Mail, MapPin } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { GithubIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { LogoMark, Wordmark } from "@/components/ui/LogoMark";
import {
  footerCompanyLinks,
  footerLegalLinks,
  footerResourceLinks,
  footerTechnologyLinks,
} from "@/data/navigation";
import { fill, sharedCopy } from "@/data/pages";
import { getServices } from "@/data/services";
import { siteConfig } from "@/data/site";

/**
 * The Services column is derived from the service catalogue rather than a fixed
 * list, so adding or removing a service in the admin panel updates the footer
 * too. Each entry's `navLabel` is the short form written for this column.
 */
export async function Footer() {
  const year = new Date().getFullYear();
  const services = await getServices();

  const columns = [
    { title: sharedCopy.footer.companyTitle, links: footerCompanyLinks },
    {
      title: sharedCopy.footer.servicesTitle,
      links: services.map((service) => ({
        label: service.navLabel,
        href: `/services/${service.slug}`,
      })),
    },
    { title: sharedCopy.footer.technologiesTitle, links: footerTechnologyLinks },
    { title: sharedCopy.footer.resourcesTitle, links: footerResourceLinks },
  ];

  return (
    <footer
      data-theme="dark"
      className="relative overflow-hidden border-t border-white/10 bg-ink-950 text-ink-300"
    >
      {/* Single restrained wash, top-left, to stop the dark band reading flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-brand-600/10 blur-[120px]"
      />
      <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-40" />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16 lg:py-20">
          {/* Brand + contact */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label={`${siteConfig.name} — home`}
            >
              <LogoMark
                tone="inverse"
                gradientId="devrox-mark-footer"
                className="size-9"
              />
              <Wordmark name={siteConfig.name} tone="inverse" />
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-ink-400">
              {siteConfig.shortDescription}
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group inline-flex items-center gap-2.5 text-ink-300 transition-colors hover:text-white"
                >
                  <Mail className="size-4 text-ink-500 transition-colors group-hover:text-brand-300" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-ink-300 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="size-4 text-ink-500 transition-colors group-hover:text-brand-300" />
                  {siteConfig.contact.whatsapp}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-ink-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden />
                {siteConfig.contact.location}
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-2">
              <SocialLink
                href={siteConfig.social.linkedin}
                label={`${siteConfig.name} on LinkedIn`}
              >
                <Globe className="size-4" aria-hidden />
              </SocialLink>
              <SocialLink
                href={siteConfig.social.github}
                label={`${siteConfig.name} on GitHub`}
              >
                <GithubIcon className="size-4" />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="type-eyebrow text-ink-500">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-400">
            {sharedCopy.footer.ctaText}{" "}
            <span className="text-ink-200">
              {siteConfig.contact.responseTime}
            </span>
          </p>
          <Link
            href="/book-a-call"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white"
          >
            {sharedCopy.footer.ctaLinkLabel}
            <ArrowUpRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {fill(sharedCopy.footer.copyright, {
              year: String(year),
              legalName: siteConfig.legalName,
            })}
          </p>
          <ul className="flex items-center gap-5">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ink-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white"
    >
      {children}
    </a>
  );
}
