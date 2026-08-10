import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { stats } from "@/data/stats";

/**
 * Company statistics band.
 *
 * Figures live in src/data/stats.ts — change them there and the counters follow.
 * Every value is a placeholder until it can be substantiated.
 */
export function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="relative">
      <h2 id="stats-heading" className="sr-only">
        Company statistics
      </h2>

      <Container>
        <Stagger
          as="ul"
          stagger={0.09}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem
              as="li"
              key={stat.id}
              className="group relative bg-white p-7 transition-colors duration-300 hover:bg-ink-25 sm:p-8"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative inline-flex size-10 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <p className="relative mt-4 font-display text-[2.75rem] font-semibold leading-none tracking-[-0.03em] text-ink-950 lg:text-[3.25rem]">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="relative mt-3.5 text-[0.9375rem] font-medium text-ink-800">
                {stat.label}
              </p>
              {stat.detail ? (
                <p className="relative mt-1.5 text-sm leading-relaxed text-ink-500">
                  {stat.detail}
                </p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
