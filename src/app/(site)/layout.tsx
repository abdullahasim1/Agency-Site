import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { WebMCPProvider } from "@/components/webmcp/WebMCPProvider";
import { siteConfig, siteTitle } from "@/data/site";
import { siteGraph } from "@/lib/seo";

/*
 * Marketing metadata for the public site. This lives on the (site) group rather
 * than the root so the Keystatic admin and other utility routes don't inherit
 * the marketing title template or Open Graph tags. metadataBase is set on the
 * root layout.
 */
export const metadata: Metadata = {
  title: {
    default: siteTitle,
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
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteTitle,
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
  /*
   * max-snippet: -1 lifts the cap on how much of a page may be quoted. That is
   * the directive answer engines are bound by, so leaving it at the default is
   * what keeps a page out of an AI Overview or a generated answer even when it
   * is indexed. The preview limits are repeated on googleBot because Google
   * reads its own group in preference to the generic one.
   */
  robots: {
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
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
  /*
   * The chat/lead widget is opt-in: its origin comes from the
   * NEXT_PUBLIC_CHAT_WIDGET_URL environment variable, so an unconfigured (or
   * staging) deployment ships no third-party script at all. Set the variable to
   * the full widget.js URL in Vercel to turn the widget on.
   */
  const chatWidgetUrl = process.env.NEXT_PUBLIC_CHAT_WIDGET_URL?.trim();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      {/* pt offsets the fixed navbar; each page controls its own top spacing. */}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Organisation + WebSite, stated once. Each page's own graph refers back
          into these two nodes by @id rather than restating them. */}
      <JsonLd data={siteGraph()} />
      <WebMCPProvider />
      {/* Chat/lead widget — wanted on every page, but its script is heavy on
          the main thread. lazyOnload defers it to idle time after the page is
          interactive, so hydration and First Input never wait for it. */}
      {chatWidgetUrl ? (
        <Script
          src={chatWidgetUrl}
          data-business-id={process.env.NEXT_PUBLIC_CHAT_BUSINESS_ID}
          data-widget-key={process.env.NEXT_PUBLIC_CHAT_WIDGET_KEY}
          strategy="lazyOnload"
        />
      ) : null}
      {/* Service worker: enables offline caching for repeat visits. */}
      <Script
        id="sw-register"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function() {});
              });
            }
          `,
        }}
      />
    </div>
  );
}
