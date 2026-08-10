/**
 * Delivery process steps.
 *
 * Content lives in `src/content/process.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the `ProcessStep` shape and
 * the `processSteps` export.
 */

import type { IconName } from "./icons";
import raw from "@/content/process.json";

export interface ProcessStep {
  id: string;
  /** Two-digit index rendered in mono type. */
  number: string;
  title: string;
  summary: string;
  icon: IconName;
  /** Concrete activities inside the step. */
  activities: string[];
  /** What exists at the end of the step. */
  output: string;
}

export const processSteps = raw.items as unknown as ProcessStep[];

/** Prefix in front of each step's output line. */
export const processOutputLabel = raw.outputLabel as string;
