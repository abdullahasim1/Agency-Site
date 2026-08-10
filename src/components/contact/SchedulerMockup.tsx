import { cn } from "@/lib/utils";

/**
 * Placeholder scheduler — decorative only.
 *
 * Before a real scheduling URL is configured the booking section has nothing
 * calendar-shaped in it, and the CTA beneath reads as an empty promise. This
 * draws the shape of a scheduler without claiming anything: no availability,
 * no timezone, no interactivity. The whole subtree is hidden from assistive
 * technology because the real booking actions sit below it.
 */

interface SchedulerMockupProps {
  className?: string;
}

interface DayCell {
  readonly day: string;
  readonly date: string;
  readonly selected: boolean;
}

interface SlotChip {
  readonly time: string;
  readonly highlighted: boolean;
}

const week: readonly DayCell[] = [
  { day: "Mon", date: "11", selected: false },
  { day: "Tue", date: "12", selected: false },
  { day: "Wed", date: "13", selected: true },
  { day: "Thu", date: "14", selected: false },
  { day: "Fri", date: "15", selected: false },
];

const slots: readonly SlotChip[] = [
  { time: "09:00", highlighted: false },
  { time: "10:30", highlighted: false },
  { time: "13:00", highlighted: true },
  { time: "14:30", highlighted: false },
  { time: "16:00", highlighted: false },
];

export function SchedulerMockup({ className }: SchedulerMockupProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-ink-200 bg-white shadow-soft",
        className,
      )}
    >
      <div className="absolute inset-0 bg-blueprint opacity-70" />

      <div className="relative flex items-center border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <p className="type-eyebrow text-ink-400">Scheduler</p>
      </div>

      <div className="relative px-4 py-5 sm:px-5">
        <div className="grid grid-cols-5 gap-x-1.5 gap-y-2">
          {week.map((cell) => (
            <span
              key={cell.day}
              className="type-eyebrow text-center text-ink-400"
            >
              {cell.day}
            </span>
          ))}

          {week.map((cell) => (
            <span
              key={cell.date}
              className={cn(
                "nums-tabular flex h-10 items-center justify-center rounded-lg font-mono text-[0.8125rem]",
                cell.selected
                  ? "bg-brand-500 font-medium text-white shadow-soft"
                  : "border border-ink-200 bg-white text-ink-600",
              )}
            >
              {cell.date}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-ink-200 pt-5">
          {slots.map((slot) => (
            <span
              key={slot.time}
              className={cn(
                "nums-tabular flex items-center justify-between rounded-pill border px-4 py-2.5 font-mono text-[0.8125rem]",
                slot.highlighted
                  ? "border-brand-100 bg-brand-50 text-brand-700 ring-1 ring-brand-100"
                  : "border-ink-200 bg-white text-ink-600",
              )}
            >
              <span>{slot.time}</span>
              {slot.highlighted ? (
                <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium">
                  <span className="animate-node size-1.5 rounded-full bg-brand-500" />
                  30 min
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
