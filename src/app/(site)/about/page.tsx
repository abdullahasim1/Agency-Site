import type { Metadata } from "next";

import { StoryTimeline } from "@/components/about/StoryTimeline";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Process } from "@/components/home/Process";
import { Stats } from "@/components/home/Stats";
import { Technologies } from "@/components/home/Technologies";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { capabilities, missionVision, team, values } from "@/data/team";
import { differentiators } from "@/data/whyChooseUs";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `${siteConfig.name} is an AI, automation and software engineering studio. We build intelligent systems that are tested, observable and owned outright by the businesses that run them.`,
  path: "/about",
  keywords: [
    "AI agency",
    "automation agency",
    "software development company",
    "about us",
  ],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Engineering-Led AI and Automation"
        description={`${siteConfig.name} is a team of engineers, designers and automation specialists building intelligent software for growing businesses. We take on the systems that a company depends on daily, and we hold them to production standards.`}
        meta={[
          { label: "Founded", value: `${siteConfig.foundedYear}` },
          { label: "Team", value: `${team.length} specialists` },
          { label: "Model", value: "Remote-first" },
          { label: "Engagements", value: "Worldwide" },
        ]}
      />

      {/* Introduction */}
      <section className="section-y-sm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
            <SectionHeading eyebrow="Who we are" title="Our Story" />

            <div className="space-y-5">
              <Reveal>
                <p className="type-lead text-ink-600">
                  {siteConfig.name} started as a small engineering team building
                  internal tools for operations-heavy businesses. The pattern was
                  always the same: valuable work buried under repetitive work,
                  and software that had been bolted together rather than
                  designed.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="text-[0.9375rem] leading-relaxed text-ink-600">
                  We now build AI-powered applications, autonomous agents, voice
                  systems and workflow automation, alongside the web and mobile
                  products those systems sit behind. What has not changed is the
                  approach — understand the process first, use AI only where
                  judgement is genuinely required, and leave behind something a
                  different team could pick up and maintain.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-[0.9375rem] leading-relaxed text-ink-600">
                  We are deliberate about what we do not claim. There are no
                  award badges or vendor certifications on this site, because we
                  would rather point you at the work and let you judge it.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <StoryTimeline className="mt-8" />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <Stats />

      {/* Mission & vision */}
      <section className="section-y-sm">
        <Container>
          <SectionHeading
            eyebrow="Direction"
            title="Mission & Vision"
            description="Why the studio exists, and the standard we are trying to move the market towards."
          />

          <Stagger
            as="ul"
            stagger={0.08}
            className="mt-10 grid gap-5 lg:grid-cols-2"
          >
            {missionVision.map((pillar) => (
              <StaggerItem as="li" key={pillar.id} className="h-full">
                <GlowCard
                  accent={pillar.id === "mission" ? "brand" : "violet"}
                  padding="lg"
                  className="flex h-full flex-col"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[0.875rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={pillar.icon} className="size-[1.375rem]" />
                  </span>
                  <h3 className="type-h3 mt-5">{pillar.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
                    {pillar.body}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Values */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow="Principles"
            title="How We Operate"
            description="Four commitments that decide how engagements actually run."
          />

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2"
          >
            {values.map((value) => (
              <StaggerItem as="li" key={value.id} className="bg-white">
                <div className="flex h-full gap-4 p-6 lg:p-7">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={value.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="type-h4 text-[1.0625rem]">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {value.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="section-y-sm">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What We Do Well"
            description="The disciplines we keep in-house, so engagements do not stall waiting on a third party."
          />

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {capabilities.map((capability) => (
              <StaggerItem as="li" key={capability.id} className="h-full">
                <GlowCard
                  accent="brand"
                  padding="md"
                  className="flex h-full flex-col"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.75rem] bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={capability.icon} className="size-5" />
                  </span>
                  <h3 className="type-h4 mt-4">{capability.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                    {capability.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <Technologies />

      <Process />

      {/* Why clients work with us */}
      <section className="section-y-sm bg-ink-25">
        <Container>
          <SectionHeading
            eyebrow="Why us"
            title="Why Clients Work With Us"
            description="The reasons companies stay past the first engagement."
          />

          <Stagger as="ul" stagger={0.06} className="mt-10 space-y-4">
            {differentiators.map((item) => (
              <StaggerItem as="li" key={item.id}>
                <div className="flex flex-col gap-4 rounded-card border border-ink-200 bg-white p-6 sm:flex-row sm:items-start sm:gap-6 lg:p-7">
                  <p
                    aria-hidden
                    className="nums-tabular font-display text-3xl font-semibold text-ink-200 sm:w-16 sm:shrink-0"
                  >
                    {item.number}
                  </p>
                  <div>
                    <h3 className="type-h4">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-700">
                      {item.description}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Team */}
      <section className="section-y-sm">
        <Container>
          <SectionHeading
            eyebrow="Team"
            title="The People You Work With"
            description="Small, senior and directly involved. You talk to the engineers building your system, not an account layer."
          />

          <Stagger
            as="ul"
            stagger={0.06}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {team.map((member) => (
              <StaggerItem as="li" key={member.id} className="h-full">
                <div className="flex h-full flex-col rounded-card border border-ink-200 bg-white p-6">
                  <div className="flex items-center gap-4">
                    <Avatar
                      initials={member.initials}
                      name={member.name}
                      src={member.avatar}
                      accent={member.accent}
                      size="lg"
                    />
                    <div>
                      <h3 className="type-h4 text-[1.0625rem]">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-brand-700">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-ink-600">
                    {member.bio}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-ink-200 pt-4 text-xs text-ink-500">
                    {member.focus.map((focus) => (
                      <li key={focus}>{focus}</li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Work with us"
        title="Want to Talk to the People Who Build It?"
        description="Book a free consultation and speak directly with the engineers who would run your project."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />
    </>
  );
}
