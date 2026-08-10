import { cn } from "@/lib/utils";

/**
 * Tech tiles — a monogram grid for the tools a project actually runs on.
 *
 * Replaces the flat badge stack in case studies. The chips are typeset
 * monograms derived from the tool's own name, deliberately *not* imitations of
 * third-party brand logos: that keeps the page honest, avoids trademark
 * cosplay, and ships no image assets. The tint rotates by index, so the same
 * list always renders identically on the server and the client.
 */

interface TechTilesProps {
  items: string[];
  className?: string;
}

/* Deep violet/teal are the house values already used for the same tint pairing
   in ui/Badge.tsx; the raw accent hues are too light to read at this size. */
const chipTints = [
  "bg-brand-50 text-brand-600 ring-brand-500/20",
  "bg-accent-violet/10 text-[#6d3fd4] ring-accent-violet/20",
  "bg-accent-cyan/10 text-[#0b7285] ring-accent-cyan/25",
] as const;

/**
 * "Tailwind CSS" → TC · "n8n (self-hosted)" → n8 · "pgvector" → pg · "React" → R
 * Casing is preserved for single words so lowercase brands stay lowercase.
 */
function monogram(name: string): string {
  const words = name
    .replace(/\([^)]*\)/g, " ")
    .split(/[\s/]+/)
    .filter((word) => /[a-z0-9]/i.test(word));

  const first = words[0] ?? "";
  const second = words[1] ?? "";

  if (!first) return "?";
  if (second) return (first.charAt(0) + second.charAt(0)).toUpperCase();
  if (/^[a-z]/.test(first) || /\d/.test(first)) return first.slice(0, 2);
  return first.charAt(0);
}

export function TechTiles({ items, className }: TechTilesProps) {
  if (items.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-center gap-3 rounded-card border border-ink-200 bg-white p-3"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-10 shrink-0 select-none items-center justify-center",
              "rounded-[0.75rem] ring-1 ring-inset",
              "font-mono text-[0.8125rem] font-semibold leading-none tracking-tight",
              chipTints[index % chipTints.length],
            )}
          >
            {monogram(item)}
          </span>
          <span className="min-w-0 text-sm leading-snug text-ink-700">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
