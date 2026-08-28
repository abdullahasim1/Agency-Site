import { ClientLogos } from "@/components/home/ClientLogos";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Services } from "@/components/home/Services";
import { Stats } from "@/components/home/Stats";
import { Technologies } from "@/components/home/Technologies";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { OurTeam } from "@/components/services/OurTeam";
import { JsonLd } from "@/components/seo/JsonLd";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { siteConfig, siteTitle } from "@/data/site";
import { pageGraph } from "@/lib/seo";

/**
 * Homepage.
 *
 * A server component throughout: every section below renders on the server and
 * only the small reveal/counter wrappers inside them ship any JavaScript.
 *
 * No metadata export: the (site) layout's defaults *are* the homepage's, and
 * restating them here would only create a second copy to keep in sync.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero: always visible, no animation delay on first paint */}
      <Hero />

      {/* Below-fold sections: content-visibility auto defers rendering */}
      <div className="content-below-fold">
        <TechMarquee />
        <ClientLogos />
        <Stats />
        <Services />
        <OurTeam tone="light" />
        <Technologies />
        <Process />
        <FeaturedProjects />
        <WhyChooseUs />
        <Testimonials />
        <FinalCTA />
      </div>

      {/* No breadcrumb — a single-item trail ending at the page itself carries
          no information, and Google discards it. */}
      <JsonLd
        data={pageGraph({
          path: "/",
          title: siteTitle,
          description: siteConfig.description,
        })}
      />
    </>
  );
}
