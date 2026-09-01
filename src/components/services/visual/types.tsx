import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ServiceHeroVisualProps {
  slug: string;
  accent: "brand" | "violet" | "cyan";
  className?: string;
}

type Accent = ServiceHeroVisualProps["accent"];

export const accentHex: Record<Accent, string> = {
  brand: "#3d63ff",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
};

const accentGlow: Record<Accent, string> = {
  brand: "bg-brand-500/10",
  violet: "bg-accent-violet/10",
  cyan: "bg-accent-cyan/10",
};

interface VisualPanelProps {
  accent: Accent;
  label: string;
  description: string;
  className?: string;
  children: ReactNode;
}

/** Chrome shared by every mockup, so each one reads as a tool, not a poster. */
export function VisualPanel({
  accent,
  label,
  description,
  className,
  children,
}: VisualPanelProps) {
  return (
    <div
      className={cn(
        "content-near-viewport relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
      <div
        aria-hidden
        className={cn(
          "wash pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-[90px]",
          accentGlow[accent],
        )}
      />

      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-500">{label}</p>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink-500">
          <span
            className="animate-node size-1.5 rounded-full bg-emerald-500"
            aria-hidden
          />
          Live
        </span>
      </div>

      <svg
        viewBox="0 0 640 380"
        className="relative block w-full"
        role="img"
        aria-label={description}
      >
        {children}
      </svg>
    </div>
  );
}

interface MockupContext {
  /** Accent hex for this service, applied as fills, strokes and gradients. */
  tint: string;
}

export interface Mockup {
  label: string;
  description: string;
  body: (context: MockupContext) => ReactNode;
}
