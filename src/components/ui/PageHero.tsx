import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Small key/value pairs rendered under the description. */
  meta?: { label: string; value: string }[];
  children?: React.ReactNode;
  /**
   * Optional artwork rendered beside the copy from lg up, and beneath it on
   * smaller screens. Supplying this switches the hero to a two-column layout.
   */
  visual?: React.ReactNode;
  className?: string;
}

/**
 * Shared hero for the non-home top-level pages (portfolio, services, about,
 * contact, book a call). Keeps the entry to every page visually identical, and
 * clears the fixed navbar with its own top padding.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  meta,
  children,
  visual,
  className,
}: PageHeroProps) {
  const content = (
    <>
      <Reveal y={12}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={0.08} y={14}>
        <h1 className="type-display mt-6">{title}</h1>
      </Reveal>

      <Reveal delay={0.16} y={14}>
        <p className="type-lead mt-5 max-w-2xl text-ink-600">{description}</p>
      </Reveal>

      {children ? (
        <Reveal delay={0.24} y={14}>
          <div className="mt-8">{children}</div>
        </Reveal>
      ) : null}
    </>
  );

  /** Full-bleed under the whole hero, so it spans the visual column too. */
  const metaRow = meta?.length ? (
    <Reveal delay={0.3} y={14}>
      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label} className="bg-white/90 p-5">
            <dt className="type-eyebrow text-ink-400">{item.label}</dt>
            <dd className="mt-2 text-[0.9375rem] font-medium text-ink-900">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  ) : null;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-ink-200 pt-28 pb-14 sm:pt-32 lg:pt-40 lg:pb-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-blueprint mask-fade-b opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-brand-500/[0.07] blur-[130px]"
      />

      <Container>
        {visual ? (
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="max-w-3xl">{content}</div>
            <Reveal delay={0.2} y={20} className="lg:pl-2">
              {visual}
            </Reveal>
          </div>
        ) : (
          <div className="max-w-3xl">{content}</div>
        )}
        {metaRow}
      </Container>
    </section>
  );
}
