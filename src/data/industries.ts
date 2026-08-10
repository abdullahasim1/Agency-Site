/**
 * Industries served.
 *
 * Content lives in `src/content/industries.json` and is edited from the
 * Keystatic admin panel at `/keystatic`. This module keeps the `Industry`
 * shape and the `industries` export.
 */

import type { IconName } from "./icons";
import raw from "@/content/industries.json";

export interface Industry {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  /** Typical problems we are brought in to solve in this sector. */
  applications: string[];
}

export const industries = raw.items as unknown as Industry[];
