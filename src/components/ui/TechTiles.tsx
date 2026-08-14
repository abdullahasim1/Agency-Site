import { TechLogo } from "@/components/ui/TechLogo";
import { cn } from "@/lib/utils";

/**
 * Floating tech chips — the technology stack rendered as a scattered cloud
 * of pills, each with its brand mark on the left and name on the right.
 *
 * Every chip sits at a hairline rotation so the cloud reads as hand-placed
 * and floating; hovering straightens and lifts the pill. Tools without a
 * brand mark fall back to a small monogram chip derived from the tool's own
 * name, so a concept ("Queue workers") reads as cleanly as a brand ("n8n").
 */

interface TechTilesProps {
  items: string[];
  className?: string;
}

export function TechTiles({ items, className }: TechTilesProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={cn(
            "flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-4",
            "shadow-soft transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)]",
            "hover:-translate-y-0.5 hover:rotate-0 hover:shadow-[0_10px_24px_-8px_rgba(23,26,38,0.22)]",
            index % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]",
          )}
        >
          <TechLogo name={item} size="sm" fallback="monogram" />
          <span className="text-sm leading-none text-ink-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}
