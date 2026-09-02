/**
 * Location configuration for localized landing pages.
 *
 * Each city has coordinates, timezone, and service-specific content that
 * targets local keywords. The slug format is /locations/{city}/{service}.
 */

export interface LocationCity {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
  description: string;
  localContext: string;
  techSectors: string[];
  nearbyAreas: string[];
}

export interface LocationServicePage {
  serviceSlug: string;
  title: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  localProblem: string;
  localSolution: string;
  localStats: { label: string; value: string }[];
  faq: { question: string; answer: string }[];
}

export const locations: LocationCity[] = [
  {
    slug: "raleigh-nc",
    name: "Raleigh",
    state: "North Carolina",
    stateCode: "NC",
    coordinates: { lat: 35.7796, lng: -78.6382 },
    timezone: "America/New_York",
    description:
      "Raleigh is the heart of North Carolina's Research Triangle — a thriving hub of biotech, enterprise SaaS, and funded startups. DevRox partners with Raleigh businesses to build AI-powered applications, intelligent automations, and scalable software systems.",
    localContext:
      "The Research Triangle is home to over 300 biotech firms, 200+ SaaS startups, and major enterprise tech companies. Raleigh businesses are rapidly adopting AI and automation to stay competitive in a market that demands speed, intelligence, and scale.",
    techSectors: [
      "Biotech & Life Sciences",
      "Enterprise SaaS",
      "Healthcare Technology",
      "FinTech",
      "Clean Energy Tech",
    ],
    nearbyAreas: [
      "Durham",
      "Chapel Hill",
      "Cary",
      "Morrisville",
      "Holly Springs",
    ],
  },
  {
    slug: "tampa-fl",
    name: "Tampa",
    state: "Florida",
    stateCode: "FL",
    coordinates: { lat: 27.9506, lng: -82.4572 },
    timezone: "America/New_York",
    description:
      "Tampa is one of America's fastest-growing tech and business migration hubs. DevRox helps Tampa businesses leverage AI automation, custom software, and cloud infrastructure to scale operations and outpace the competition.",
    localContext:
      "Tampa's tech ecosystem has grown 40% in the past five years, with a surge in funded startups, remote-first companies, and enterprises modernizing their stacks. The demand for AI consulting and custom development has never been higher.",
    techSectors: [
      "Fintech & Payments",
      "Healthcare Systems",
      "Real Estate Tech",
      "Logistics & Supply Chain",
      "Cybersecurity",
    ],
    nearbyAreas: [
      "St. Petersburg",
      "Clearwater",
      "Brandon",
      "Wesley Chapel",
      "Sarasota",
    ],
  },
];

export const locationServices: Record<string, LocationServicePage> = {
  "ai-automation": {
    serviceSlug: "ai-automation",
    title: "AI Automation Agency",
    metaDescription:
      "Custom AI automation solutions for businesses in {city}, {state}. Build intelligent workflows, AI agents, and automated systems that save time and reduce costs.",
    heroEyebrow: "AI Automation in {city}",
    heroTitle: "AI Automation Agency in {city}, {state}",
    heroDescription:
      "We build custom AI automations that eliminate repetitive work, accelerate decision-making, and unlock new capabilities for {city} businesses. From intelligent document processing to autonomous AI agents — we design systems that work while you sleep.",
    localProblem:
      "Many {city} businesses still rely on manual workflows, scattered spreadsheets, and repetitive tasks that drain team productivity. As the {techSectors} sectors grow, the gap between AI-powered competitors and traditional operations widens every quarter.",
    localSolution:
      "Our AI automation solutions are built specifically for {city}'s business landscape. We deploy intelligent agents that handle customer inquiries, automate document processing, optimize supply chains, and connect your existing tools — all without replacing what already works.",
    localStats: [
      { label: "Tasks automated per client", value: "2,400+" },
      { label: "Average time saved weekly", value: "32 hrs" },
      { label: "Client ROI in year one", value: "340%" },
    ],
    faq: [
      {
        question: "How long does it take to build an AI automation?",
        answer:
          "Most AI automation projects in {city} are delivered within 4-8 weeks, depending on complexity. We start with a discovery phase to map your workflows, then build, test, and deploy in iterative sprints so you see results early.",
      },
      {
        question: "Do I need to replace our existing tools?",
        answer:
          "No. Our AI automations integrate with your current tech stack — CRMs, ERPs, databases, APIs, and SaaS tools. We connect and enhance, never rip-and-replace.",
      },
      {
        question: "What industries in {city} benefit most from AI automation?",
        answer:
          "In {city}, we see the highest impact in {techSectors}, and any business processing high volumes of documents, customer data, or repetitive operational tasks.",
      },
      {
        question: "How much does AI automation cost?",
        answer:
          "Projects typically range from $5,000 for focused workflow automations to $50,000+ for enterprise AI agent systems. We scope every project with transparent pricing before any commitment.",
      },
    ],
  },
  "web-development": {
    serviceSlug: "web-application-development",
    title: "Custom Web Development",
    metaDescription:
      "Custom web application development in {city}, {state}. Modern, fast, and scalable web apps built with Next.js, React, and cutting-edge technologies.",
    heroEyebrow: "Web Development in {city}",
    heroTitle: "Custom Web Development in {city}, {state}",
    heroDescription:
      "We design and build modern web applications for {city} businesses — from high-performance marketing sites to complex SaaS platforms. Every project is built with performance, scalability, and user experience as core principles.",
    localProblem:
      "{city} businesses often struggle with outdated websites, slow load times, and off-the-shelf platforms that don't fit their unique workflows. As the local tech ecosystem matures, first impressions and digital experiences become critical competitive advantages.",
    localSolution:
      "We build custom web applications tailored to {city}'s market — fast, responsive, and designed to convert. Whether you need a customer portal, internal dashboard, or full-stack SaaS product, our {city}-focused development team delivers production-grade software.",
    localStats: [
      { label: "Average LCP score", value: "< 1.2s" },
      { label: "Core Web Vitals pass rate", value: "100%" },
      { label: "Projects delivered", value: "80+" },
    ],
    faq: [
      {
        question: "What technologies do you use for web development?",
        answer:
          "We primarily use Next.js, React, TypeScript, Tailwind CSS, and Node.js. For {city} clients needing backend services, we deploy on AWS, Vercel, or serverless infrastructure depending on the project's scale and performance requirements.",
      },
      {
        question: "How long does a web application take to build?",
        answer:
          "A focused MVP or landing page takes 2-4 weeks. A full-featured SaaS platform typically takes 8-16 weeks. We provide a detailed timeline after our initial discovery session with your {city} team.",
      },
      {
        question: "Do you work with startups in {city}?",
        answer:
          "Absolutely. We've helped several {city}-area startups build their MVPs, scale from prototype to production, and iterate based on real user feedback. Our flexible engagement model works for early-stage and growth-stage companies alike.",
      },
      {
        question: "Will my website be fast and SEO-optimized?",
        answer:
          "Performance is baked into every project. We target sub-1.5s LCP, zero layout shift, and full Core Web Vitals compliance. Technical SEO — structured data, meta tags, sitemaps — is included by default.",
      },
    ],
  },
};

/** Resolves a template string with location-specific values. */
export function resolveLocationTemplate(
  template: string,
  city: LocationCity,
): string {
  return template
    .replace(/\{city\}/g, city.name)
    .replace(/\{state\}/g, city.state)
    .replace(/\{stateCode\}/g, city.stateCode)
    .replace(
      /\{techSectors\}/g,
      city.techSectors.slice(0, 3).join(", "),
    );
}

/** Returns all location page paths for static generation. */
export function getLocationPaths() {
  const paths: { city: string; service: string }[] = [];
  for (const city of locations) {
    for (const serviceKey of Object.keys(locationServices)) {
      paths.push({ city: city.slug, service: serviceKey });
    }
  }
  return paths;
}
