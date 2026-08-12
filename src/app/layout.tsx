import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { siteConfig } from "@/data/site";

import "./globals.css";

/* Display face: tight, slightly editorial grotesque for headings. */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Body face: built for long-form paragraphs on case-study pages. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Mono face: eyebrows, step numbers, metrics and technical labels. */
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

/*
 * Root layout is intentionally minimal: just <html>/<body>, the fonts and the
 * global stylesheet. The marketing chrome (navbar, footer, SEO metadata) lives
 * in the (site) route group so that non-marketing routes — most importantly the
 * Keystatic admin at /keystatic — render as their own full-screen apps without
 * the site header and footer wrapped around them.
 *
 * metadataBase stays here so every route (including /og and the sitemap) can
 * resolve relative URLs; the rich marketing metadata is set in (site)/layout.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

/*
 * Every route needs width=device-width, including the ones outside the (site)
 * group — without it /keystatic renders at a desktop width on a phone. The
 * (site) group overrides this with themeColor and colorScheme on top.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <body className="bg-white">{children}</body>
    </html>
  );
}
