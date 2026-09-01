import { cn } from "@/lib/utils";

/**
 * FAQ hero visual — an illustrative first scoping conversation.
 *
 * The FAQ page spends its words promising that consultations are concrete and
 * no-commitment; this mockup shows what that actually looks like. The dialogue
 * is written, not recorded, so the chrome is stamped "Illustrative" the same
 * way LegalVisual is: no metrics, prices or client names, just the shape of how
 * a project gets scoped. Built from divs + Tailwind so the text stays
 * selectable, with only the CSS `animate-node` pulse for motion (neutralised
 * under prefers-reduced-motion).
 */

interface Message {
  speaker: "client" | "devrox";
  timestamp: string;
  text: string;
}

interface ConsultationMockupProps {
  className?: string;
}

const transcript: Message[] = [
  {
    speaker: "client",
    timestamp: "09:12",
    text: "We get about a hundred inbound enquiries a month, all coming in by email. Right now someone re-types each one into the CRM by hand.",
  },
  {
    speaker: "devrox",
    timestamp: "09:13",
    text: "That is a classic discovery candidate. First step would be mapping how a lead actually moves through your team today — then we flag which steps an automated handoff can take over.",
  },
  {
    speaker: "client",
    timestamp: "09:15",
    text: "Would it be able to draft a reply for us, or does it need a human on every message?",
  },
  {
    speaker: "devrox",
    timestamp: "09:16",
    text: "Both patterns exist. The honest answer is we would not know where yours lands until we see the enquiry mix — so the first deliverable is a scoping note, not a demo.",
  },
];

export function ConsultationMockup({ className }: ConsultationMockupProps) {
  return (
    <figure
      className={cn(
        "content-near-viewport relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card",
        className,
      )}
      aria-label="Illustrative scoping conversation between a client and DevRox."
    >
      {/* Faint engineering grid behind the conversation. */}
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/10 blur-[90px]"
      />

      {/* Panel chrome: reads as a tool, not a marketing illustration. */}
      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200" />
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200" />
        <span aria-hidden className="size-2.5 rounded-full bg-ink-200" />
        <p className="type-eyebrow ml-2 text-ink-400">Consultation</p>
        <span className="ml-auto font-mono text-[0.625rem] tracking-[0.14em] text-ink-400 uppercase">
          Illustrative
        </span>
      </div>

      {/* Conversation itself. */}
      <div className="relative flex flex-col gap-4 px-5 py-6 sm:px-6">
        <ol className="flex flex-col gap-4">
          {transcript.map((message) => {
            const isClient = message.speaker === "client";
            return (
              <li
                key={message.timestamp}
                className={cn(
                  "flex flex-col",
                  isClient ? "items-start" : "items-end",
                )}
              >
                <span className="type-eyebrow text-ink-400">
                  {isClient ? "You" : "DevRox"}
                </span>
                <div
                  className={cn(
                    "mt-1.5 max-w-[85%] rounded-card px-4 py-3 text-[0.875rem] leading-relaxed",
                    isClient
                      ? "rounded-tl-md border border-ink-200 bg-ink-50 text-ink-700"
                      : "rounded-tr-md border border-brand-500/15 bg-brand-500/10 text-brand-700",
                  )}
                >
                  {message.text}
                </div>
                <span className="mt-1.5 font-mono text-[0.6875rem] text-ink-400">
                  {message.timestamp}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Composing indicator — decorative, so it stays out of the a11y tree. */}
        <div aria-hidden className="flex flex-col items-end">
          <span className="type-eyebrow text-ink-400">DevRox</span>
          <div className="mt-1.5 flex items-center gap-1.5 rounded-card rounded-tr-md border border-brand-500/15 bg-brand-500/10 px-4 py-3">
            {[0, 0.24, 0.48].map((delay) => (
              <span
                key={delay}
                className="animate-node size-1.5 rounded-full bg-brand-500"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
