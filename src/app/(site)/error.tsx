"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/data/site";

/*
 * Route-segment error boundary for the (site) group. Client component per
 * the error.js convention; renders inside the site layout so the navbar and
 * footer stay reachable.
 *
 * `retry` re-fetches and re-renders the failed segment — the right first
 * move because most render failures are transient (a reader that timed out,
 * a cache miss). If it persists, the contact route is the fallback.
 */

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function Error({ error, retry }: ErrorProps) {
  useEffect(() => {
    // Surfaced in the server logs alongside the digest, not to the visitor.
    console.error("[page] render failed", error);
  }, [error]);

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
          <span className="inline-flex size-14 items-center justify-center rounded-[1rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <AlertTriangle className="size-7" aria-hidden />
          </span>
          <Eyebrow>Error</Eyebrow>
          <h1 className="type-display mt-4">Something went wrong</h1>
          <p className="type-lead mt-5 text-ink-600">
            The page failed to render. This is usually temporary — try again,
            and if it still fails, email {siteConfig.contact.email} and we&apos;ll
            fix it right away.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-ink-400">
              Reference: {error.digest}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={retry}
              size="lg"
              leadingIcon={<RotateCcw className="size-4" aria-hidden />}
            >
              Try again
            </Button>
            <Button href="/" size="lg" variant="secondary">
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
