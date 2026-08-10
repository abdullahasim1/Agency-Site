import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/data/site";
import { organizationSchema } from "@/lib/seo";

/*
 * Marketing metadata for the public site. This lives on the (site) group rather
 * than the root so the Keystatic admin and other utility routes don't inherit
 * the marketing title template or Open Graph tags. metadataBase is set on the
 * root layout.
 */
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — AI, Automation & Software Development Agency`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "AI development agency",
    "AI automation",
    "AI agents",
    "voice AI",
    "workflow automation",
    "custom software development",
    "web application development",
    "mobile app development",
    "CRM automation",
    "API integration",
  ],
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — AI, Automation & Software Development Agency`,
    description: siteConfig.description,
    images: [
      {
        url: `/og?title=${encodeURIComponent(siteConfig.name)}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: [`/og?title=${encodeURIComponent(siteConfig.name)}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      {/* pt offsets the fixed navbar; each page controls its own top spacing. */}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // Static object built from our own config — no user input reaches this.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />
    </div>
  );
}
