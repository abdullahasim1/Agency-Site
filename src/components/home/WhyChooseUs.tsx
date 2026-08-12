import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy } from "@/data/pages";
import { differentiators } from "@/data/whyChooseUs";

/**
 * Why Businesses Choose Us.
 *
 * Five cards on a 6-column grid: the first two run wide and the remaining three
 * sit beneath, which avoids the orphaned fifth card a plain 3-column grid gives.
 */
const spans = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export function WhyChooseUs() {
  return (
    <section className="section-y relative">
      <Container>
        <SectionHeading
          eyebrow={homeCopy.whyChooseUs.eyebrow}
          title={homeCopy.whyChooseUs.title}
          description={homeCopy.whyChooseUs.description}
        />

        <Stagger
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-6"
        >
          {differentiators.map((item, index) => (
            <StaggerItem
              as="li"
              key={item.id}
              className={`h-full ${spans[index] ?? "lg:col-span-2"}`}
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-ink-200 bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift">
                {/* Oversized step number, set back behind the content. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-5 select-none font-display text-[5.5rem] font-semibold leading-none tracking-tight text-ink-100 transition-colors duration-300 group-hover:text-brand-50"
                >
                  {item.number}
                </span>

                <span className="relative inline-flex size-10 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={item.icon} className="size-5" />
                </span>

                <h3 className="type-h4 relative mt-5">{item.title}</h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-ink-600">
                  {item.description}
                </p>
                <p className="relative mt-4 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-500">
                  {item.detail}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
