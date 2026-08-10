import { cn } from "@/lib/utils";

/**
 * Founding-arc timeline for the About "Our Story" section.
 *
 * The prose describes an arc — internal tooling, then AI systems, then the
 * products in front of them — so the diagram draws that arc rather than a
 * dated chronology. Same construction as the Hero visual: pure inline SVG
 * animated with the CSS keyframes in globals.css, zero client JavaScript,
 * neutralised under prefers-reduced-motion.
 */

interface StoryTimelineProps {
  className?: string;
}

const stages = [
  {
    x: 18,
    ordinal: "01",
    accent: "#3d63ff",
    label: "Internal tools",
    sub: "For operations-heavy teams",
  },
  {
    x: 236,
    ordinal: "02",
    accent: "#8b5cf6",
    label: "AI apps, agents & voice",
    sub: "AI where judgement is required",
  },
  {
    x: 454,
    ordinal: "03",
    accent: "#22d3ee",
    label: "Web & mobile products",
    sub: "The front end of those systems",
  },
] as const;

const connectors = [
  { from: 186, to: 236, accent: "#8b5cf6" },
  { from: 404, to: 454, accent: "#22d3ee" },
] as const;

export function StoryTimeline({ className }: StoryTimelineProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-soft",
        className,
      )}
    >
      {/* Faint engineering grid behind the diagram. */}
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />

      {/* Panel chrome: reads as a tool, not a marketing illustration. */}
      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-400">Founding Arc</p>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink-500">
          <span
            className="animate-node size-1.5 rounded-full bg-brand-500"
            aria-hidden
          />
          Ongoing
        </span>
      </div>

      <svg
        viewBox="0 0 640 300"
        className="relative block w-full"
        role="img"
        aria-label="Timeline of the studio's founding arc in three stages: first internal tools for operations-heavy teams, then AI apps, agents and voice systems where judgement is required, then the web and mobile products those systems sit behind — the same engineering approach applied to progressively bigger systems."
      >
        <defs>
          <linearGradient id="storytl-flow" x1="0" y1="0" x2="640" y2="0">
            <stop offset="0" stopColor="#3d63ff" stopOpacity="0.2" />
            <stop offset="0.4" stopColor="#3d63ff" stopOpacity="0.75" />
            <stop offset="0.7" stopColor="#8b5cf6" stopOpacity="0.65" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {stages.map((stage) => {
          const centre = stage.x + 84;

          return (
            <g key={stage.label}>
              {/* Ordinal marker above the node */}
              <circle
                cx={centre}
                cy="64"
                r="14"
                fill="#ffffff"
                stroke={stage.accent}
                strokeWidth="1.25"
              />
              <text
                x={centre}
                y="68"
                textAnchor="middle"
                fill={stage.accent}
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {stage.ordinal}
              </text>
              <path
                d={`M${centre} 78 V100`}
                stroke="#dfe3ea"
                strokeWidth="1"
                strokeDasharray="2 5"
              />

              {/* Stage node */}
              <rect
                x={stage.x}
                y="100"
                width="168"
                height="84"
                rx="14"
                fill="#ffffff"
                stroke="#dfe3ea"
              />
              <rect
                x={stage.x + 16}
                y="100"
                width="136"
                height="3.5"
                rx="1.75"
                fill={stage.accent}
              />
              <text
                x={centre}
                y="136"
                textAnchor="middle"
                fill="#39404f"
                fontSize="9"
                letterSpacing="0.6"
                fontFamily="var(--font-mono)"
              >
                {stage.label.toUpperCase()}
              </text>
              <text
                x={centre}
                y="160"
                textAnchor="middle"
                fill="#6b7488"
                fontSize="9.5"
                fontFamily="var(--font-sans)"
              >
                {stage.sub}
              </text>
            </g>
          );
        })}

        {/* Flow between stages: pulsing exit vertex, dashed run, arrow head */}
        {connectors.map((connector, index) => (
          <g key={connector.from}>
            <circle
              cx={connector.from}
              cy="142"
              r="3.5"
              fill={connector.accent}
              className="animate-node"
              style={{ animationDelay: `${index * 0.8}s` }}
            />
            <path
              d={`M${connector.from + 8} 142 H${connector.to - 14}`}
              fill="none"
              stroke="url(#storytl-flow)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="animate-dash"
              style={{ animationDelay: `${index * 0.35}s` }}
            />
            <polygon
              points={`${connector.to - 4},142 ${connector.to - 13},137.5 ${connector.to - 13},146.5`}
              fill={connector.accent}
            />
          </g>
        ))}

        {/* Continuity rail: what did not change across the arc */}
        <text
          x="18"
          y="232"
          fill="#98a1b3"
          fontSize="9.5"
          letterSpacing="1.4"
          fontFamily="var(--font-mono)"
        >
          SAME APPROACH · PROGRESSIVELY BIGGER SYSTEMS
        </text>
        <path
          d="M18 243 H622"
          stroke="#dfe3ea"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      </svg>
    </div>
  );
}
