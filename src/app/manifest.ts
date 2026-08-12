import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

/**
 * Web app manifest.
 *
 * `/manifest.webmanifest` was a 404 before this, which is one of the checks
 * Lighthouse's PWA/best-practices audit and several mobile crawlers make. It
 * also gives Android a real name and icon when someone adds the site to their
 * home screen, instead of the URL and a screenshot.
 *
 * `display: "browser"` rather than "standalone": this is a marketing site, not
 * an app. Stripping the browser chrome would take the address bar and the share
 * button away from a visitor who is trying to evaluate and share a supplier.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#ffffff",
    /* Matches themeColor in the (site) layout's viewport export. */
    theme_color: "#ffffff",
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity", "developer"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        /* "any" is correct for SVG — one file scales to every slot. */
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "180x180",
        purpose: "maskable",
      },
    ],
  };
}
