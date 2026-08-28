import { loadIcon, type IconName } from "@/data/icons";

interface IconProps {
  name: IconName;
  className?: string;
  /** Stroke width; 1.75 is the house default for a slightly lighter line. */
  strokeWidth?: number;
}

/**
 * Renders an icon referenced by name from a data file. Icons are lazily
 * loaded on demand to keep the initial bundle small.
 */
export async function Icon({ name, className, strokeWidth = 1.75 }: IconProps) {
  const Glyph = await loadIcon(name);
  if (!Glyph) return null;
  return <Glyph className={className} strokeWidth={strokeWidth} aria-hidden />;
}
