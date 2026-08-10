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
import { aboutCopy, fill } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { capabilities, missionVision, team, values } from "@/data/team";
import { differentiators } from "@/data/whyChooseUs";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: aboutCopy.seo.title,
  description: fill(aboutCopy.seo.description, { name: siteConfig.name }),
  path: "/about",
  keywords: aboutCopy.seo.keywords,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={aboutCopy.hero.eyebrow}
        title={aboutCopy.hero.title}
        description={fill(aboutCopy.hero.description, {
          name: siteConfig.name,
        })}
        meta={[
          {
            label: aboutCopy.heroMeta.foundedLabel,
            value: `${siteConfig.foundedYear}`,
          },
          {
            label: aboutCopy.heroMeta.teamLabel,
            value: `${team.length} ${aboutCopy.heroMeta.teamSuffix}`,
          },
          {
            label: aboutCopy.heroMeta.modelLabel,
            value: aboutCopy.heroMeta.modelValue,
          },
          {
            label: aboutCopy.heroMeta.engagementsLabel,
            value: aboutCopy.heroMeta.engagementsValue,
          },
        ]}
      />

      {/* Introduction */}
      <section className="section-y-sm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
            <SectionHeading
              eyebrow={aboutCopy.story.eyebrow}
              title={aboutCopy.story.title}
            />

            <div className="space-y-5">
              {/* The opening paragraph carries the lead treatment; the rest is body copy. */}
              {aboutCopy.story.paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index === 0 ? 0 : 0.02 + index * 0.06}>
                  <p
                    className={
                      index === 0
                        ? "type-lead text-ink-600"
                        : "text-[0.9375rem] leading-relaxed text-ink-600"
                    }
                  >
                    {fill(paragraph, { name: siteConfig.name })}
                  </p>
                </Reveal>
              ))}

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
            eyebrow={aboutCopy.missionVision.eyebrow}
            title={aboutCopy.missionVision.title}
            description={aboutCopy.missionVision.description}
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
            eyebrow={aboutCopy.values.eyebrow}
            title={aboutCopy.values.title}
            description={aboutCopy.values.description}
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
            eyebrow={aboutCopy.capabilities.eyebrow}
            title={aboutCopy.capabilities.title}
            description={aboutCopy.capabilities.description}
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
            eyebrow={aboutCopy.whyUs.eyebrow}
            title={aboutCopy.whyUs.title}
            description={aboutCopy.whyUs.description}
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
            eyebrow={aboutCopy.team.eyebrow}
            title={aboutCopy.team.title}
            description={aboutCopy.team.description}
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
        eyebrow={aboutCopy.cta.eyebrow}
        title={aboutCopy.cta.title}
        description={aboutCopy.cta.description}
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
