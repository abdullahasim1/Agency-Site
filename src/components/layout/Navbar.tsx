"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark, Wordmark } from "@/components/ui/LogoMark";
import { PRIMARY_CTA, primaryNav } from "@/data/navigation";
import { sharedCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { EASE_OUT_SOFT } from "@/lib/motion";
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
  const reduceMotion = useReducedMotion();
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
          ? "border-b border-ink-200/80 bg-white/80 shadow-[0_1px_0_0_rgb(10_13_20/0.02)] backdrop-blur-xl supports-backdrop-filter:bg-white/70"
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
            /* py-2 lifts the hit area to 48px tall on touch without resizing the
               mark. The horizontal pair does the same for width: below sm the
               wordmark is hidden, so the link is only as wide as the 32px mark —
               px-1.5 takes it to 44px and the matching -mx-1.5 cancels the
               indent, leaving the mark exactly where it was. */
            className="-mx-1.5 flex shrink-0 items-center gap-2.5 rounded-lg px-1.5 py-2 lg:py-0"
            aria-label={`${siteConfig.name} — home`}
          >
            <LogoMark
              gradientId="devrox-mark-nav"
              className="size-8 lg:size-9"
            />
            <Wordmark name={siteConfig.name} className="hidden sm:block" />
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
                    <motion.span
                      layoutId={reduceMotion ? undefined : "nav-active"}
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-brand-500"
                      transition={{ duration: 0.3, ease: EASE_OUT_SOFT }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              href={PRIMARY_CTA.href}
              size="sm"
              /* max-lg:hidden, not `hidden lg:inline-flex`. Tailwind emits the
                 display utilities in one fixed order — block, contents, flex,
                 grid, hidden, inline, inline-flex, table — at equal specificity,
                 so an unprefixed `hidden` from here loses to the unprefixed
                 `inline-flex` in Button's own base classes and the button stays
                 visible on mobile. A variant-prefixed utility is emitted after
                 all the unprefixed ones, so this one actually wins. */
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
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_SOFT }}
            className="lg:hidden"
          >
            <div className="border-t border-ink-200 bg-white/95 backdrop-blur-xl">
              <Container className="py-5">
                <ul className="flex flex-col">
                  {primaryNav.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: reduceMotion ? 0 : 0.04 * index,
                        ease: EASE_OUT_SOFT,
                      }}
                      className="border-b border-ink-100 last:border-b-0"
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
                    </motion.li>
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

                <p className="mt-4 text-center text-xs text-ink-500">
                  {siteConfig.contact.responseTime}
                </p>
              </Container>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
