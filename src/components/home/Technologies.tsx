import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechLogo } from "@/components/ui/TechLogo";
import { homeCopy } from "@/data/pages";
import { techCategories, type TechCategory } from "@/data/technologies";
import { cn } from "@/lib/utils";

const accentIcons = {
  brand: "bg-brand-500/12 text-brand-300 ring-brand-400/20",
  violet: "bg-accent-violet/12 text-accent-violet-soft ring-accent-violet/25",
  cyan: "bg-accent-cyan/12 text-accent-cyan-soft ring-accent-cyan/25",
} as const;

/** One category card: icon + heading, note, and the tool list. */
function CategoryCard({
  category,
  wide = false,
}: {
  category: TechCategory;
  wide?: boolean;
}) {
  return (
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

      <ul
        className={cn(
          "mt-5 border-t border-white/10 pt-5",
          wide
            ? "grid gap-x-8 gap-y-2.5 sm:grid-cols-2"
            : "space-y-2.5",
        )}
      >
        {category.items.map((item) => (
          <li key={item.name} className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-[0.3125rem] flex size-5 shrink-0 items-center justify-center"
            >
              <TechLogo name={item.name} size="xs" dark />
            </span>
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
  );
}

/**
 * Technologies grid.
 *
 * A dark band, which gives the page a structural break and lets the accent
 * colours carry the grouping. Cards are paired so every row is balanced, and
 * the large Cloud / Deployment category is pulled out as a full-width card so
 * it never forces empty space into smaller neighbours. Cloud providers appear
 * here only as ordinary tools — there is no partner, marketplace or
 * certification content anywhere on this site.
 */
export function Technologies() {
  const cloud = techCategories.find((category) => category.id === "cloud");
  const groups = techCategories.filter((category) => category.id !== "cloud");

  return (
    <section
      data-theme="dark"
      className="section-y relative isolate overflow-hidden bg-ink-950"
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint-dark opacity-50" />
      <Parallax speed={0.2} className="absolute -right-40 top-0 size-[34rem]">
        <div
          aria-hidden
          className="wash size-full rounded-full bg-brand-600/10 blur-[130px]"
        />
      </Parallax>
      <Parallax speed={0.15} className="absolute -left-40 bottom-0 size-[30rem]">
        <div
          aria-hidden
          className="wash size-full rounded-full bg-accent-violet/10 blur-[130px]"
        />
      </Parallax>

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
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14"
        >
          {groups.map((category) => (
            <StaggerItem as="li" key={category.id} className="h-full">
              <CategoryCard category={category} />
            </StaggerItem>
          ))}

          {cloud && (
            <StaggerItem as="li" className="h-full sm:col-span-2">
              <CategoryCard category={cloud} wide />
            </StaggerItem>
          )}
        </Stagger>
      </Container>
    </section>
  );
}
