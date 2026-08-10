import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Services } from "@/components/home/Services";
import { Stats } from "@/components/home/Stats";
import { Technologies } from "@/components/home/Technologies";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TechMarquee } from "@/components/ui/TechMarquee";

/**
 * Homepage.
 *
 * A server component throughout: every section below renders on the server and
 * only the small reveal/counter wrappers inside them ship any JavaScript.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Stats />
      <Services />
      <Technologies />
      <Process />
      <FeaturedProjects />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
