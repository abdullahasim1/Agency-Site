/**
 * Frequently asked questions.
 *
 * Content lives in `src/content/faq.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the `FaqItem` shape and the
 * `faqs` export the FAQ page imports.
 */

import raw from "@/content/faq.json";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "Engagement" | "Technology" | "Delivery" | "Commercial";
}

export const faqs = raw.items as unknown as FaqItem[];
