/**
 * Legal copy for /privacy and /terms.
 *
 * Content lives in `src/content/legal.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the `LegalSection` shape and
 * the exports both legal pages import.
 *
 * IMPORTANT: the shipped copy is generic, good-faith boilerplate so the routes
 * exist and read sensibly. It is NOT legal advice and has not been reviewed by
 * counsel. Replace it with policies drafted or approved by a qualified lawyer
 * before launch, and set the real effective date.
 */

import raw from "@/content/legal.json";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/** The header and search listing for one legal route. */
interface LegalPageCopy {
  eyebrow: string;
  title: string;
  description: string;
  seoDescription: string;
}

/** Shown at the top of both documents so the placeholder status is never hidden. */
export const legalDisclaimer = raw.disclaimer as string;

export const legalEffectiveDate = raw.effectiveDate as string;

/** Word in front of the effective date, e.g. "Effective 1 January 2026". */
export const legalEffectiveDateLabel = raw.effectiveDateLabel as string;

export const privacyPage = raw.privacyPage as unknown as LegalPageCopy;

export const termsPage = raw.termsPage as unknown as LegalPageCopy;

export const privacySections = raw.privacySections as unknown as LegalSection[];

export const termsSections = raw.termsSections as unknown as LegalSection[];
