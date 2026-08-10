import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: string;
  className?: string;
  tone?: "brand" | "muted" | "inverse";
  /** Centres the rule + label pair. */
  align?: "start" | "center";
}

const tones = {
  brand: "text-brand-600 dark:text-brand-300",
  muted: "text-ink-500 dark:text-ink-400",
  inverse: "text-ink-300",
} as const;

const ruleTones = {
  brand: "bg-brand-500/60 dark:bg-brand-300/60",
  muted: "bg-ink-300 dark:bg-white/25",
  inverse: "bg-white/30",
} as const;

/**
 * Monospaced label that opens every section. The short rule to its left is the
 * repeating motif that ties the sections together.
 */
export function Eyebrow({
  children,
  className,
  tone = "brand",
  align = "start",
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "type-eyebrow flex items-center gap-2.5",
        align === "center" && "justify-center",
        tones[tone],
        className,
      )}
    >
      <span className={cn("h-px w-6 shrink-0", ruleTones[tone])} aria-hidden />
      {children}
    </p>
  );
}
