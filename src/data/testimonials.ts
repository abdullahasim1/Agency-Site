/**
 * Client testimonials.
 *
 * Content lives in `src/content/testimonials.json` and is edited from the
 * Keystatic admin panel at `/keystatic`. This module keeps the `Testimonial`
 * shape and the `testimonials` export.
 *
 * PLACEHOLDER CONTENT: every quote, name and company is illustrative and must
 * be replaced with real, attributable client feedback before launch.
 *
 * Avatars are generated monogram SVGs rather than stock photography, so no
 * quote is ever paired with a photograph of a person who did not say it.
 */

import raw from "@/content/testimonials.json";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Monogram rendered in the avatar when no image is supplied. */
  initials: string;
  /** Optional headshot path; falls back to the monogram avatar when absent. */
  avatar?: string;
  accent: "brand" | "violet" | "cyan";
  /** Slug from projects.ts, when the quote relates to a specific engagement. */
  projectSlug?: string;
}

export const testimonials = raw.items as unknown as Testimonial[];
