/**
 * Technologies we actually work with, grouped by role in the stack.
 *
 * Content lives in `src/content/technologies.json` and is edited from the
 * Keystatic admin panel at `/keystatic`. This module keeps the shape and the
 * exports (`techCategories` plus the derived flat `allTechnologies` list).
 *
 * Note: there is deliberately no cloud-partner, marketplace or certification
 * section here. Cloud providers appear only as ordinary tools, and only where a
 * project genuinely uses them.
 */

import type { IconName } from "./icons";
import raw from "@/content/technologies.json";

interface Technology {
  name: string;
  /** Short note shown on hover / in the expanded grid. */
  note: string;
}

export interface TechCategory {
  id: string;
  title: string;
  icon: IconName;
  description: string;
  accent: "brand" | "violet" | "cyan";
  items: Technology[];
}

export const techCategories = raw.categories as unknown as TechCategory[];

/** Flat list used by the marquee strip and the About page. */
export const allTechnologies: string[] = techCategories.flatMap((category) =>
  category.items.map((item) => item.name),
);
