import Image from "next/image";

import { techLogo } from "@/data/tech-logos";
import { cn } from "@/lib/utils";

interface TechLogoProps {
  /** Technology name; resolved to a logo via the registry in src/data/tech-logos.ts. */
  name: string;
  /** Display size of the logo square. */
  size?: "xs" | "sm" | "md";
  /** `true` on dark surfaces — inverts black brand marks so they stay visible. */
  dark?: boolean;
  /** What to render when the registry has no mark for this name. */
  fallback?: "dot" | "monogram";
  className?: string;
}

const sizes = {
  xs: "size-4",
  sm: "size-5",
  md: "size-7",
} as const;

const chipTints = [
  "bg-brand-50 text-brand-600 ring-brand-500/20",
  "bg-accent-violet/10 text-[#6d3fd4] ring-accent-violet/20",
  "bg-accent-cyan/10 text-[#0b7285] ring-accent-cyan/25",
] as const;

const chipSizes = {
  xs: "size-4 rounded-[0.375rem] text-[0.4375rem]",
  sm: "size-5 rounded-[0.4375rem] text-[0.5625rem]",
  md: "size-10 rounded-[0.75rem] text-[0.8125rem]",
} as const;

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

/**
 * A brand logo for a technology, with a graceful fallback.
 *
 * Every technology name on the site renders through this component so the logo
 * treatment is consistent everywhere: real brand mark when the registry has
 * one, otherwise a small accent dot (or a monogram chip on larger tiles) — a
 * freshly added technology can never break a page. Black marks (Vercel, OpenAI,
 * ElevenLabs…) are inverted on dark surfaces via `dark`.
 */
export function TechLogo({
  name,
  size = "xs",
  dark = false,
  fallback = "dot",
  className,
}: TechLogoProps) {
  const logo = techLogo(name);

  if (!logo) {
    if (fallback === "monogram") {
      return (
        <span
          aria-hidden
          className={cn(
            "flex shrink-0 select-none items-center justify-center",
            "ring-1 ring-inset",
            "font-mono font-semibold leading-none tracking-tight",
            chipTints[0],
            chipSizes[size],
            className,
          )}
        >
          {monogram(name)}
        </span>
      );
    }
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block shrink-0 rounded-full",
          size === "md" ? "size-2" : "size-1.5",
          dark ? "bg-brand-400" : "bg-brand-500",
          className,
        )}
      />
    );
  }

  return (
    <Image
      src={logo}
      alt=""
      width={28}
      height={28}
      aria-hidden
      className={cn(
        "shrink-0 object-contain",
        sizes[size],
        dark && !logo.startsWith("/logos/aws/") && "brightness-0 invert",
        className,
      )}
    />
  );
}