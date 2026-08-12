import { Reveal } from "@/components/ui/Reveal";

interface FaqListProps {
  items: Array<{ question: string; answer: string }>;
  /** Heading level for the questions — h3 under a section h2, h4 when nested. */
  as?: "h3" | "h4";
}

/**
 * A question-and-answer list.
 *
 * `<details>` rather than a scripted accordion: the answers are real text in
 * the document whether or not JavaScript runs, which is what lets a search
 * engine or an AI assistant quote them. Shared by /faq and by any service page
 * whose own FAQ list is filled in.
 */
export function FaqList({ items, as: Heading = "h3" }: FaqListProps) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200">
      {items.map((item) => (
        <Reveal key={item.question}>
          <details className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <Heading className="text-[1.0625rem] font-medium text-ink-900">
                {item.question}
              </Heading>
              <span
                aria-hidden
                className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-transform duration-200 group-open:rotate-45"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 1v10M1 6h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-600">
              {item.answer}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
