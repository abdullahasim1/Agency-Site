/**
 * What sets the studio apart.
 *
 * Content lives in `src/content/why.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the `Differentiator` shape
 * and the `differentiators` export.
 */

import type { IconName } from "./icons";
import raw from "@/content/why.json";

interface Differentiator {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Longer supporting line used on the About page. */
  detail: string;
  icon: IconName;
}

export const differentiators = raw.items as unknown as Differentiator[];
