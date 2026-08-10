import { CalendarClock, ExternalLink } from "lucide-react";

import { SchedulerMockup } from "@/components/contact/SchedulerMockup";
import { Button } from "@/components/ui/Button";
import { bookACallCopy } from "@/data/pages";
import { siteConfig } from "@/data/site";

/**
 * Scheduler slot — INTEGRATION POINT.
 *
 * Set NEXT_PUBLIC_BOOKING_URL to a Calendly, Cal.com or GoHighLevel scheduling
 * link and this renders that scheduler in a sandboxed iframe. With the variable
 * unset it renders a placeholder with a working fallback, so the page is never
 * broken in development or before a scheduler has been chosen.
 *
 * Swapping providers is a config change, not a code change — each of the three
 * exposes a plain embeddable URL.
 */
export function BookingEmbed() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const copy = bookACallCopy.scheduler;

  if (bookingUrl) {
    return (
      <div className="overflow-hidden rounded-panel border border-ink-200 bg-white shadow-soft">
        <iframe
          src={bookingUrl}
          title={copy.calendarTitle}
          loading="lazy"
          className="h-[44rem] w-full border-0"
          allow="camera; microphone; fullscreen"
        />
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-dashed border-ink-300 bg-white p-8 shadow-soft sm:p-10">
      <span className="inline-flex size-12 items-center justify-center rounded-[0.875rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        <CalendarClock className="size-6" aria-hidden />
      </span>

      <h2 className="type-h3 mt-6">{copy.placeholderHeading}</h2>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
        {copy.placeholderDescription}
      </p>

      <SchedulerMockup className="mt-8" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          href={`mailto:${siteConfig.contact.email}?subject=Consultation%20request`}
          external
          size="lg"
          trailingIcon={<ExternalLink className="size-[1.125rem]" aria-hidden />}
        >
          {copy.emailButtonLabel}
        </Button>
        <Button href="/contact" size="lg" variant="secondary">
          {copy.formButtonLabel}
        </Button>
      </div>

      <p className="mt-8 border-t border-ink-200 pt-6 text-xs leading-relaxed text-ink-500">
        <span className="font-medium text-ink-700">Developer note: </span>
        set <code className="font-mono text-ink-700">NEXT_PUBLIC_BOOKING_URL</code>{" "}
        to a Calendly, Cal.com or GoHighLevel scheduling link and this panel is
        replaced by the live calendar. No component changes required.
      </p>
    </div>
  );
}
