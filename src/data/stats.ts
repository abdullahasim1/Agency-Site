/**
 * Company statistics.
 *
 * Content lives in `src/content/stats.json` and is edited from the Keystatic
 * admin panel at `/keystatic` — do not edit the numbers here. This module keeps
 * the shape (the `Stat` type) and the exports every page imports.
 *
 * Do not publish figures that cannot be substantiated.
 */

import type { IconName } from "./icons";
import raw from "@/content/stats.json";

interface Stat {
  id: string;
  /** Numeric target the counter animates towards. */
  value: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string;
  label: string;
  /** Optional one-line clarification shown under the label. */
  detail?: string;
  /** Decorative glyph for the counter tile. */
  icon: IconName;
}

export const stats = raw.items as unknown as Stat[];
