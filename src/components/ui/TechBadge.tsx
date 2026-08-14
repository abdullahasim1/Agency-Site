import { Badge } from "@/components/ui/Badge";
import { TechLogo } from "@/components/ui/TechLogo";
import type { Project } from "@/data/projects";

type Accent = Project["accent"];

interface TechBadgeProps {
  name: string;
  tone?: Accent | "neutral";
  dark?: boolean;
}

const badgeTones: Record<Accent, "brand" | "violet" | "cyan"> = {
  brand: "brand",
  violet: "violet",
  cyan: "cyan",
};

/**
 * A technology chip with its brand logo — the standard treatment for tech
 * names on cards. Falls back to an accent dot when the logo registry has no
 * mark for the name, so new technologies can never break a card.
 */
export function TechBadge({ name, tone = "neutral", dark = false }: TechBadgeProps) {
  return (
    <Badge tone={tone === "neutral" ? "neutral" : badgeTones[tone]} size="sm">
      <TechLogo name={name} size="xs" dark={dark} />
      {name}
    </Badge>
  );
}