import Image from "next/image";

import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  name: string;
  src?: string;
  accent?: "brand" | "violet" | "cyan";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const accents = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-400/25",
  violet:
    "bg-accent-violet/10 text-[#6d3fd4] ring-accent-violet/25 dark:bg-accent-violet/15 dark:text-accent-violet-soft dark:ring-accent-violet/30",
  cyan: "bg-accent-cyan/10 text-[#0b7285] ring-accent-cyan/25 dark:bg-accent-cyan/15 dark:text-accent-cyan-soft dark:ring-accent-cyan/30",
} as const;

const sizes = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
} as const;

const pixelSizes = { sm: 36, md: 44, lg: 56 } as const;

/**
 * Monogram avatar.
 *
 * Deliberately not stock photography: pairing an invented placeholder quote
 * with a photograph of a real person would be misleading. Supply `src` once
 * real headshots exist and it renders the image instead.
 */
export function Avatar({
  initials,
  name,
  src,
  accent = "brand",
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-ink-200 dark:ring-white/15",
          sizes[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold ring-1",
        accents[accent],
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
