import type { Metadata } from "next";

import { AutomationRunVisual } from "@/components/home/AutomationRunVisual";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Process } from "@/components/home/Process";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { industries } from "@/data/industries";
import { getServices } from "@/data/services";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Rotated across the industry grid so the tiles do not read as one block. */
const industryTones = [
  "bg-brand-50 text-brand-600 ring-brand-100",
  "bg-accent-violet/10 text-accent-violet ring-accent-violet/20",
  "bg-accent-cyan/10 text-cyan-700 ring-accent-cyan/25",
];

export const metadata: Metadata = buildMetadata({
  title: "Our Services",
  description:
    "From intelligent automation to custom software platforms, we build technology around the way your business works — AI agents, voice AI, workflow automation, web and mobile applications, CRM and API integrations.",
  path: "/services",
  keywords: [
    "AI automation services",
    "AI agent development",
    "voice AI development",
    "workflow automation",
    "custom software development",
    "web application development",
    "mobile app development",
    "CRM integration",
  ],
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Our Expertise"
        description="From intelligent automation to custom software platforms, we build technology around the way your business works."
        visual={<AutomationRunVisual />}
        meta={[
          { label: "Service lines", value: `${services.length}` },
          { label: "Industries served", value: `${industries.length}+` },
          { label: "Engagement", value: "Project or retained" },
          { label: "Delivery", value: "Discover · Plan · Build · Launch" },
        ]}
      />

      <TechMarquee />

      <section className="section-y">
        <Container>
          <h2 className="sr-only">All services</h2>
          <Stagger
            as="ul"
            stagger={0.06}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <StaggerItem as="li" key={service.id} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow="Industries"
            title="Where We Work"
            description="Sector experience shapes the questions we ask in discovery, not the technology we reach for."
          />

          <Stagger
            as="ul"
            stagger={0.05}
            className="mt-10 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3"
          >
            {industries.map((industry, index) => (
              <StaggerItem as="li" key={industry.name} className="bg-white">
                <div className="h-full p-6">
                  <span
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] ring-1",
                      industryTones[index % industryTones.length],
                    )}
                  >
                    <Icon name={industry.icon} className="size-5" />
                  </span>

                  <h3 className="type-h4 mt-4 text-[1.0625rem]">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {industry.description}
                  </p>

                  <ul className="mt-3.5 space-y-1.5">
                    {industry.applications.slice(0, 3).map((application) => (
                      <li
                        key={application}
                        className="flex items-start gap-2.5 text-sm text-ink-500"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.4375rem] size-1.5 shrink-0 rounded-full bg-brand-300"
                        />
                        {application}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <Process />

      <FinalCTA
        eyebrow="Start a project"
        title="Not Sure Which Service You Need?"
        description="Describe the problem in plain language. We will tell you which approach fits and what it realistically takes."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
      />
    </>
  );
}
