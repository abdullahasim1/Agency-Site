import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { sharedCopy } from "@/data/pages";

/*
 * The 404 body — one implementation shared by the (site) group boundary
 * and the root boundary, so every 404 looks identical wherever the bad
 * URL lands. Renders inside whichever layout owns the boundary, which is
 * what gives it the navbar and footer on the marketing tree.
 */

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "That page doesn't exist. Here's where to go next.",
  robots: { index: false, follow: true },
};

const suggestions = [
  {
    href: "/services",
    title: "Services",
    description: "AI agents, automation, voice AI and software engineering.",
  },
  {
    href: "/portfolio",
    title: "Portfolio",
    description: "Case studies with the problem, the build and the numbers.",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Guides on what AI automation costs and where it pays off.",
  },
];

export function NotFoundPage() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-32 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[80px]"
      />

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>404</Eyebrow>
          <h1 className="type-display mt-6">{sharedCopy.notFound.title}</h1>
          <p className="type-lead mt-5 text-ink-600">
            {sharedCopy.notFound.description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg" trailingIcon={<ArrowRight className="size-4" aria-hidden />}>
              Back to home
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              {sharedCopy.notFound.contactLabel}
            </Button>
          </div>
        </div>

        <ul className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-card border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-card"
              >
                <Compass
                  className="size-5 text-brand-600"
                  aria-hidden
                />
                <h2 className="type-h4 mt-4 text-ink-950 group-hover:text-brand-700 transition-colors">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
