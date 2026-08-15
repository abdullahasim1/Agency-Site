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
 * JSON. That override has to live in code, so it stays here. See `resolveUrl()`
 * below for the two cases where the environment variable is deliberately
 * ignored.
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
    whatsapp: string;
    whatsappHref: string;
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
  };
  twitterHandle: string;
  foundedYear: number;
  /**
   * The subset of the identity that gets *asserted to search engines* in
   * JSON-LD, kept separate from the copy above on purpose.
   *
   * The visible contact details are placeholders, and publishing a placeholder
   * as structured data is worse than publishing nothing: a reserved fictional
   * phone number and `sameAs` links that 404 read as low-trust signals rather
   * than neutral ones. So every field here is empty by default and
   * `organizationSchema()` omits whatever is still blank. Fill them in from the
   * Keystatic panel once the real details exist and the markup appears with no
   * code change.
   */
  schema: {
    telephone: string;
    foundingDate: string;
    sameAs: string[];
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
}

const data = raw as unknown as SiteConfig;

/**
 * Resolves the canonical origin.
 *
 * `NEXT_PUBLIC_SITE_URL` wins when it names a real site, because preview deploys
 * need to resolve their own absolute URLs. Two things are stripped out first:
 *
 * 1. Surrounding whitespace. Pasting a value into the Vercel dashboard has
 *    already smuggled a tab into one variable on this project; a stray tab here
 *    would make `new URL()` throw during the build instead of at review time.
 * 2. A `*.vercel.app` host, when the JSON names a real domain. The deploy alias
 *    is not the site's identity: canonicalising to it tells Google the content
 *    lives on a Public-Suffix-List hostname that accrues no authority, and
 *    points every page on the real domain at a different origin. The panel's
 *    value is the one an editor controls, so it is the one that should win — and
 *    the check means a forgotten dashboard variable cannot quietly undo a domain
 *    move.
 */
function resolveUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!override) return data.url;

  const isAlias = (value: string) => {
    try {
      return new URL(value).hostname.endsWith(".vercel.app");
    } catch {
      return false;
    }
  };

  if (isAlias(override) && !isAlias(data.url)) return data.url;
  return override;
}

export const siteConfig: SiteConfig = {
  ...data,
  /** Used for metadataBase, canonical URLs, sitemap and Open Graph. */
  url: resolveUrl(),
};

/**
 * The homepage / default document title. Shared by the (site) layout's metadata
 * and the homepage's JSON-LD so the two can never disagree about what the page
 * is called — a mismatch there is a contradiction a crawler can see.
 */
export const siteTitle = `${siteConfig.name} — AI, Automation & Software Development Agency`;
