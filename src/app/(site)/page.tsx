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
import { clients } from "@/data/clients";
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

      {/*
        Below-fold sections, each its own content-visibility skip-unit.

        One wrapper around all eleven used to be a single skip-unit: the moment
        any part of it neared the viewport the browser had to lay out and paint
        every section in one task, and the 800px intrinsic estimate stood in for
        a block roughly ten times that tall, so the scroll height jumped as it
        resolved. Per-section containers render independently and keep each
        task small.

        `--cv-est` is each section's measured height, and it is the room reserved
        while that section is still unrendered. A flat default made the document
        grow ~1,500px over one scroll-through — every section below the one being
        resolved slid downward mid-scroll, and the scrollbar rescaled under the
        reader's thumb. These sections differ by an order of magnitude (a 260px
        logo strip against a 2,400px technology grid), so one number cannot
        serve them all.

        Two sets, because the grids reflow: the same ten sections measure
        19,854px at 412px and 10,649px at 1440px — the estimate has to move with
        the breakpoint or it is wrong by ~85% on phones, which is where it hurts
        most. Base values are the 412px measurement (phone widths are the common
        case, and every width below `lg` shares them); `lg:` is the 1440px one.

        Only the reader's first pass is affected; `contain-intrinsic-size: auto`
        switches each section to its real measured height once rendered.
      */}
      <div className="content-below-fold [--cv-est:180px] lg:[--cv-est:240px]">
        <TechMarquee />
      </div>
      {/* ClientLogos renders null while the Keystatic client list is empty, and
          a skip-unit around nothing still reserves its estimate — a phantom gap
          under the hero until the browser resolved it. Gate the wrapper on the
          same condition the component gates itself on. */}
      {clients.length > 0 && (
        <div className="content-below-fold [--cv-est:190px] lg:[--cv-est:260px]">
          <ClientLogos />
        </div>
      )}
      <div className="content-below-fold [--cv-est:980px] lg:[--cv-est:260px]">
        <Stats />
      </div>
      <div className="content-below-fold [--cv-est:3480px] lg:[--cv-est:1660px]">
        <Services />
      </div>
      <div className="content-below-fold [--cv-est:1190px] lg:[--cv-est:590px]">
        <OurTeam tone="light" />
      </div>
      <div className="content-below-fold [--cv-est:3810px] lg:[--cv-est:2410px]">
        <Technologies />
      </div>
      <div className="content-below-fold [--cv-est:1880px] lg:[--cv-est:900px]">
        <Process />
      </div>
      <div className="content-below-fold [--cv-est:3930px] lg:[--cv-est:1640px]">
        <FeaturedProjects />
      </div>
      <div className="content-below-fold [--cv-est:2000px] lg:[--cv-est:1080px]">
        <WhyChooseUs />
      </div>
      <div className="content-below-fold [--cv-est:1760px] lg:[--cv-est:1150px]">
        <Testimonials />
      </div>
      <div className="content-below-fold [--cv-est:650px] lg:[--cv-est:720px]">
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
