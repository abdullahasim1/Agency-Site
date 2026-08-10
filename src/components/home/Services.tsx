import { ArrowRight } from "lucide-react";

import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedServices } from "@/data/services";

export async function Services() {
  const featuredServices = await getFeaturedServices();
  return (
    <section id="services" className="section-y relative bg-ink-25">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Our Expertise"
          description="From intelligent automation to custom software platforms, we build technology around the way your business works."
          action={
            <Button
              href="/services"
              variant="secondary"
              trailingIcon={
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                  aria-hidden
                />
              }
            >
              All services
            </Button>
          }
        />

        <Stagger
          as="ul"
          stagger={0.06}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {featuredServices.map((service) => (
            <StaggerItem as="li" key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
