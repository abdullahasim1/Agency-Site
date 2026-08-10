import { cn } from "@/lib/utils";

/**
 * Hero visual — an abstract systems diagram.
 *
 * Deliberately not a robot, a brain or a particle field: it draws the shape of
 * the work (inputs → orchestration → systems of record) as a piece of technical
 * documentation would. Pure inline SVG animated with the CSS keyframes defined
 * in globals.css, so it costs zero client JavaScript and is neutralised
 * automatically under prefers-reduced-motion.
 */

interface HeroVisualProps {
  className?: string;
}

const inputs = [
  { y: 74, label: "Calls" },
  { y: 140, label: "Messages" },
  { y: 206, label: "Documents" },
  { y: 272, label: "Events" },
] as const;

const outputs = [
  { y: 92, label: "CRM" },
  { y: 158, label: "Database" },
  { y: 224, label: "Dashboards" },
  { y: 290, label: "Notifications" },
] as const;

export function HeroVisual({ className }: HeroVisualProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card",
        className,
      )}
    >
      {/* Faint engineering grid behind the diagram. */}
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/10 blur-[90px]"
      />

      {/* Panel chrome: reads as a tool, not a marketing illustration. */}
      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-400">System Architecture</p>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink-500">
          <span
            className="animate-node size-1.5 rounded-full bg-emerald-500"
            aria-hidden
          />
          Live
        </span>
      </div>

      <svg
        viewBox="0 0 640 360"
        className="relative block w-full"
        role="img"
        aria-label="Diagram showing business inputs such as calls, messages, documents and events flowing through an AI orchestration layer into connected systems including a CRM, database, dashboards and notifications."
      >
        <defs>
          <linearGradient id="hero-flow" x1="0" y1="0" x2="640" y2="0">
            <stop offset="0" stopColor="#3d63ff" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#3d63ff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="hero-core" x1="240" y1="110" x2="400" y2="270">
            <stop offset="0" stopColor="#3d63ff" />
            <stop offset="0.55" stopColor="#6366f1" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Input rail → core */}
        {inputs.map((node, index) => (
          <g key={node.label}>
            <path
              d={`M138 ${node.y} H196 Q216 ${node.y} 216 ${node.y + (180 - node.y) * 0.5} V172 Q216 190 236 190 H244`}
              fill="none"
              stroke="url(#hero-flow)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="animate-dash"
              style={{ animationDelay: `${index * 0.35}s` }}
            />
            <rect
              x="24"
              y={node.y - 17}
              width="114"
              height="34"
              rx="9"
              fill="#ffffff"
              stroke="#dfe3ea"
            />
            <circle cx="44" cy={node.y} r="3.5" fill="#3d63ff" opacity="0.65" />
            <text
              x="58"
              y={node.y + 4}
              fill="#4d5568"
              fontSize="12"
              fontFamily="var(--font-sans)"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Core orchestration block */}
        <rect
          x="244"
          y="112"
          width="152"
          height="136"
          rx="18"
          fill="url(#hero-core)"
          opacity="0.08"
        />
        <rect
          x="244"
          y="112"
          width="152"
          height="136"
          rx="18"
          fill="none"
          stroke="url(#hero-core)"
          strokeWidth="1.5"
        />
        <text
          x="320"
          y="146"
          textAnchor="middle"
          fill="#6b7488"
          fontSize="10"
          letterSpacing="1.6"
          fontFamily="var(--font-mono)"
        >
          ORCHESTRATION
        </text>

        {/* Three agents inside the core */}
        {[
          { y: 168, label: "Agent · Intake" },
          { y: 196, label: "Agent · Reasoning" },
          { y: 224, label: "Agent · Action" },
        ].map((agent, index) => (
          <g key={agent.label}>
            <rect
              x="260"
              y={agent.y - 11}
              width="120"
              height="22"
              rx="7"
              fill="#ffffff"
              stroke="#dfe3ea"
            />
            <circle
              cx="274"
              cy={agent.y}
              r="3"
              fill={["#3d63ff", "#8b5cf6", "#22d3ee"][index]}
              className="animate-node"
              style={{ animationDelay: `${index * 0.8}s` }}
            />
            <text
              x="286"
              y={agent.y + 3.5}
              fill="#4d5568"
              fontSize="10.5"
              fontFamily="var(--font-sans)"
            >
              {agent.label}
            </text>
          </g>
        ))}

        {/* Core → output rail */}
        {outputs.map((node, index) => (
          <g key={node.label}>
            <path
              d={`M396 190 H420 Q440 190 440 ${190 + (node.y - 190) * 0.5} V${node.y} Q440 ${node.y} 460 ${node.y} H482`}
              fill="none"
              stroke="url(#hero-flow)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="animate-dash"
              style={{ animationDelay: `${0.2 + index * 0.35}s` }}
            />
            <rect
              x="482"
              y={node.y - 17}
              width="134"
              height="34"
              rx="9"
              fill="#ffffff"
              stroke="#dfe3ea"
            />
            <circle
              cx="502"
              cy={node.y}
              r="3.5"
              fill="#22d3ee"
              opacity="0.8"
            />
            <text
              x="516"
              y={node.y + 4}
              fill="#4d5568"
              fontSize="12"
              fontFamily="var(--font-sans)"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Observability rail along the bottom */}
        <path
          d="M24 326 H616"
          stroke="#dfe3ea"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <text
          x="24"
          y="318"
          fill="#98a1b3"
          fontSize="9.5"
          letterSpacing="1.4"
          fontFamily="var(--font-mono)"
        >
          LOGGING · EVALUATION · HUMAN REVIEW
        </text>
      </svg>
    </div>
  );
}
