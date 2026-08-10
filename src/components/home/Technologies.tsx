import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy } from "@/data/pages";
import { techCategories } from "@/data/technologies";
import { cn } from "@/lib/utils";

const accentDots = {
  brand: "bg-brand-400",
  violet: "bg-accent-violet-soft",
  cyan: "bg-accent-cyan",
} as const;

const accentIcons = {
  brand: "bg-brand-500/12 text-brand-300 ring-brand-400/20",
  violet: "bg-accent-violet/12 text-accent-violet-soft ring-accent-violet/25",
  cyan: "bg-accent-cyan/12 text-accent-cyan-soft ring-accent-cyan/25",
} as const;

/**
 * Technologies grid.
 *
 * A dark band, which gives the page a structural break and lets the accent
 * colours carry the grouping. Cloud providers appear here only as ordinary
 * tools — there is no partner, marketplace or certification content anywhere on
 * this site.
 */
export function Technologies() {
  return (
    <section
      data-theme="dark"
      className="section-y relative isolate overflow-hidden bg-ink-950"
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 size-[34rem] rounded-full bg-brand-600/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 size-[30rem] rounded-full bg-accent-violet/10 blur-[130px]"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={homeCopy.technologies.eyebrow}
          tone="dark"
          title={homeCopy.technologies.title}
          description={homeCopy.technologies.description}
        />

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-4"
        >
          {techCategories.map((category) => (
            <StaggerItem as="li" key={category.id} className="h-full">
              <div className="group flex h-full flex-col rounded-card border border-white/10 bg-white/[0.035] p-6 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[0.75rem] ring-1",
                      accentIcons[category.accent],
                    )}
                  >
                    <Icon name={category.icon} className="size-[1.125rem]" />
                  </span>
                  <h3 className="type-h4 text-white">{category.title}</h3>
                </div>

                <p className="mt-3.5 text-sm leading-relaxed text-ink-400">
                  {category.description}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[0.4375rem] size-1.5 shrink-0 rounded-full",
                          accentDots[category.accent],
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink-100">
                          {item.name}
                        </span>
                        <span className="block text-xs leading-relaxed text-ink-500">
                          {item.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
