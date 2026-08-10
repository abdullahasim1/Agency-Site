/**
 * Central site configuration.
 *
 * Content lives in `src/content/site.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. Change the agency name, contact details or
 * social handles there and every page, the footer, the metadata, the sitemap
 * and the JSON-LD update automatically.
 *
 * The one exception is `url`: the canonical site URL is overridden by the
 * NEXT_PUBLIC_SITE_URL environment variable when set (so preview and production
 * deploys resolve their own absolute URLs), falling back to the value in the
 * JSON. That override has to live in code, so it stays here.
 */

import raw from "@/content/site.json";

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  shortDescription: string;
  url: string;
  contact: {
    email: string;
    salesEmail: string;
    phone: string;
    phoneHref: string;
    location: string;
    address: {
      line1: string;
      city: string;
      region: string;
      country: string;
    };
    hours: string;
    responseTime: string;
  };
  social: {
    linkedin: string;
    github: string;
    x: string;
  };
  twitterHandle: string;
  foundedYear: number;
}

const data = raw as unknown as SiteConfig;

export const siteConfig: SiteConfig = {
  ...data,
  /** Used for metadataBase, canonical URLs, sitemap and Open Graph. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? data.url,
};
