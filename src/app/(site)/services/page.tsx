import type { Metadata } from "next";

import { AutomationRunVisual } from "@/components/home/AutomationRunVisual";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Process } from "@/components/home/Process";
import { OurTeam } from "@/components/services/OurTeam";
import { ServiceCard } from "@/components/services/ServiceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { industries } from "@/data/industries";
import { servicesCopy } from "@/data/pages";
import { getServices } from "@/data/services";
import { techCategories } from "@/data/technologies";
import { buildMetadata, pageGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The toolkit behind the services: AI, automation and communication tools only.
 * The full registry stays on the home page, so the strip reads differently
 * here instead of repeating the same wall of tools on every page.
 */
const serviceToolkit = techCategories
  .filter((category) =>
    ["ai", "automation", "communication"].includes(category.id),
  )
  .flatMap((category) => category.items.map((item) => item.name));

/** Rotated across the industry grid so the tiles do not read as one block. */
const industryTones = [
  "bg-brand-50 text-brand-600 ring-brand-100",
  "bg-accent-violet/10 text-accent-violet ring-accent-violet/20",
  "bg-accent-cyan/10 text-cyan-700 ring-accent-cyan/25",
];

export const metadata: Metadata = buildMetadata({
  title: servicesCopy.seo.title,
  description: servicesCopy.seo.description,
  path: "/services",
  keywords: servicesCopy.seo.keywords,
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow={servicesCopy.hero.eyebrow}
        title={servicesCopy.hero.title}
        description={servicesCopy.hero.description}
        visual={<AutomationRunVisual />}
        meta={[
          {
            label: servicesCopy.heroMeta.serviceLinesLabel,
            value: `${services.length}`,
          },
          {
            label: servicesCopy.heroMeta.industriesLabel,
            value: `${industries.length}+`,
          },
          {
            label: servicesCopy.heroMeta.engagementLabel,
            value: servicesCopy.heroMeta.engagementValue,
          },
          {
            label: servicesCopy.heroMeta.deliveryLabel,
            value: servicesCopy.heroMeta.deliveryValue,
          },
        ]}
      />

      <TechMarquee items={serviceToolkit} label="The toolkit behind these services" />

      <section className="section-y">
        <Container>
          <h2 className="sr-only">{servicesCopy.listHeading}</h2>
          <Stagger
            as="ul"
            stagger={0.06}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <StaggerItem as="li" key={service.id} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <OurTeam />

      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow={servicesCopy.industries.eyebrow}
            title={servicesCopy.industries.title}
            description={servicesCopy.industries.description}
          />

          <Stagger
            as="ul"
            stagger={0.05}
            className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3"
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
        eyebrow={servicesCopy.cta.eyebrow}
        title={servicesCopy.cta.title}
        description={servicesCopy.cta.description}
      />

      <JsonLd
        data={pageGraph({
          path: "/services",
          title: servicesCopy.seo.title,
          description: servicesCopy.seo.description,
          type: "CollectionPage",
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ],
        })}
      />
    </>
  );
}
