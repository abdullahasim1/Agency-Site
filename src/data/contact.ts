/**
 * Contact-form option lists.
 *
 * Content lives in `src/content/contact.json` and is edited from the Keystatic
 * admin panel at `/keystatic`, which keeps the form component presentational.
 * The option values are what get submitted, so keep them stable if they are
 * ever mapped to a CRM field.
 */

import raw from "@/content/contact.json";

export interface ConsultationPoint {
  title: string;
  description: string;
}

export const projectTypes = raw.projectTypes as string[];

export const budgetRanges = raw.budgetRanges as string[];

/** Bullets shown on the book-a-call page next to the scheduler. */
export const consultationPoints = raw.consultationPoints as ConsultationPoint[];
