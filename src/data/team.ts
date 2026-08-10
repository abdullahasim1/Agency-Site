/**
 * About-page content: team, mission, vision, values and capabilities.
 *
 * Content lives in `src/content/about.json` and is edited from the Keystatic
 * admin panel at `/keystatic`. This module keeps the shapes and the exports
 * the About page imports.
 *
 * PLACEHOLDER CONTENT: the team members are illustrative. Replace names, roles
 * and biographies with the real team before launch. Avatars are generated
 * monograms, not stock photography.
 *
 * Deliberately absent: awards, certifications and partner badges. None are
 * claimed because none have been verified.
 */

import type { IconName } from "./icons";
import raw from "@/content/about.json";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  focus: string[];
  accent: "brand" | "violet" | "cyan";
  avatar?: string;
}

export interface Pillar {
  id: string;
  title: string;
  body: string;
  icon: IconName;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export const team = raw.team as unknown as TeamMember[];

export const missionVision = raw.missionVision as unknown as Pillar[];

export const values = raw.values as unknown as Pillar[];

export const capabilities = raw.capabilities as unknown as Capability[];
