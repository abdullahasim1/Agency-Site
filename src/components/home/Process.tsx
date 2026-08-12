import { Check } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy } from "@/data/pages";
import { processOutputLabel, processSteps } from "@/data/process";

/**
 * How we work — a four-step timeline.
 *
 * Rendered on several pages (home, about, services), all sharing one heading
 * edited under Home page → Process section.
 *
 * The connector is a single absolutely-positioned hairline behind the step
 * markers, so the timeline stays aligned at every breakpoint without any
 * per-item borders to keep in sync.
 */
export function Process() {
  return (
    <section className="section-y relative">
      <Container>
        <SectionHeading
          eyebrow={homeCopy.process.eyebrow}
          title={homeCopy.process.title}
          description={homeCopy.process.description}
        />

        <div className="relative mt-14 lg:mt-16">
          {/* Timeline rail: vertical on small screens, horizontal from lg. */}
          <div
            aria-hidden
            className="absolute left-[1.4375rem] top-2 bottom-2 w-px bg-gradient-to-b from-brand-200 via-ink-200 to-transparent lg:left-0 lg:right-0 lg:top-[1.4375rem] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-brand-200 lg:via-ink-200 lg:to-transparent"
          />

          <Stagger
            as="ol"
            stagger={0.1}
            className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6"
          >
            {processSteps.map((step) => (
              <StaggerItem
                as="li"
                key={step.id}
                className="group relative pl-16 lg:pl-0"
              >
                {/* Step marker sits on the rail. */}
                <span className="absolute left-0 top-0 inline-flex size-12 items-center justify-center rounded-full border border-ink-200 bg-white shadow-soft transition-[border-color,box-shadow] duration-300 group-hover:border-brand-300 group-hover:shadow-card lg:static lg:mb-6">
                  <Icon
                    name={step.icon}
                    className="size-[1.3125rem] text-brand-600"
                  />
                </span>

                <div className="lg:pr-4">
                  <p className="type-eyebrow text-ink-400">{step.number}</p>
                  <h3 className="type-h3 mt-2">{step.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
                    {step.summary}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {step.activities.map((activity) => (
                      <li
                        key={activity}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-brand-500"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        {activity}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 border-t border-ink-200 pt-4 text-sm text-ink-500">
                    <span className="font-medium text-ink-700">
                      {processOutputLabel}
                    </span>
                    {step.output}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
