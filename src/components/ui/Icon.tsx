import { iconRegistry, type IconName } from "@/data/icons";

interface IconProps {
  name: IconName;
  className?: string;
  /** Stroke width; 1.75 is the house default for a slightly lighter line. */
  strokeWidth?: number;
}

/**
 * Renders an icon referenced by name from a data file. Keeping the lookup in
 * one place means content files never import JSX and only registered icons are
 * bundled.
 */
export function Icon({ name, className, strokeWidth = 1.75 }: IconProps) {
  const Glyph = iconRegistry[name];
  return <Glyph className={className} strokeWidth={strokeWidth} aria-hidden />;
}
