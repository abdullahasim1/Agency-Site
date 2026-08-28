"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GithubIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { BrandLogo } from "@/components/ui/LogoMark";
import { PRIMARY_CTA, primaryNav } from "@/data/navigation";
import { sharedCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Sticky navigation.
 *
 * Transparent over the hero, then a subtle glass surface with a hairline border
 * once the page scrolls. The scroll listener is passive and only ever flips a
 * boolean, so it does no layout work per frame.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes. Syncing to an external
  // event (navigation) is exactly what this effect is for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Lock body scroll and trap Escape while the mobile panel is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "border-b border-ink-200/80 bg-white/90 shadow-[0_1px_0_0_rgb(10_13_20/0.02)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {sharedCopy.skipLink}
      </a>

      <Container>
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-4 lg:h-20"
        >
          <Link
            href="/"
            className="-mx-1.5 flex shrink-0 items-center gap-2.5 rounded-lg px-1.5 py-2 lg:py-0"
            aria-label={`${siteConfig.name} — home`}
          >
            <BrandLogo className="h-8 lg:h-9" />
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-200",
                    isActive(item.href)
                      ? "text-ink-950"
                      : "text-ink-600 hover:text-ink-950",
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-brand-500" />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${siteConfig.name} on GitHub`}
                className="inline-flex size-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-950"
              >
                <GithubIcon className="size-4.5" aria-hidden />
              </a>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`${siteConfig.name} on WhatsApp`}
                className="inline-flex size-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-950"
              >
                <WhatsAppIcon className="size-4.5" aria-hidden />
              </a>
            </div>

            <Button
              href={PRIMARY_CTA.href}
              size="sm"
              className="max-lg:hidden"
              trailingIcon={<ArrowUpRight className="size-4" aria-hidden />}
            >
              {PRIMARY_CTA.label}
            </Button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-ink-200 bg-white/70 text-ink-800 transition-colors hover:bg-ink-50 lg:hidden"
            >
              {open ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-240 ease-out",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
            <div className="border-t border-ink-200 bg-white/95">
          <Container className="py-5">
            <ul className="flex flex-col">
              {primaryNav.map((item, index) => (
                <li
                  key={item.href}
                  className={cn(
                    "border-b border-ink-100 last:border-b-0",
                    "animate-menu-item-in",
                    !open && "opacity-0"
                  )}
                  style={{ animationDelay: open ? `${0.04 * index}s` : "0s" }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between py-3.5 text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "text-brand-600"
                        : "text-ink-800 hover:text-ink-950",
                    )}
                  >
                    {item.label}
                    <ArrowUpRight
                      className="size-4 text-ink-400"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Button
              href={PRIMARY_CTA.href}
              size="lg"
              fullWidth
              className="mt-5"
              trailingIcon={<ArrowUpRight className="size-4" aria-hidden />}
            >
              {PRIMARY_CTA.label}
            </Button>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
              >
                <GithubIcon className="size-4" aria-hidden />
                GitHub
              </a>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
              >
                <WhatsAppIcon className="size-4" aria-hidden />
                WhatsApp
              </a>
            </div>

            <p className="mt-4 text-center text-xs text-ink-500">
              {siteConfig.contact.responseTime}
            </p>
          </Container>
        </div>
      </div>
    </header>
  );
}
