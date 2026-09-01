import { cn } from "@/lib/utils";

/**
 * Automation run visual — a workflow execution view for the Services section.
 *
 * The services copy talks about automation in the abstract; this shows what the
 * work actually looks like once it is running: ordered steps, a status per step,
 * and throughput underneath. Every value is illustrative, not a claimed metric.
 * Pure inline SVG on the globals.css keyframes, so it ships no client JS.
 */

interface AutomationRunVisualProps {
  className?: string;
}

type StepStatus = "completed" | "running" | "queued";

interface Step {
  name: string;
  duration: string;
  status: StepStatus;
  /** Illustrative share of the run's throughput, 0-1. Drives the chart below. */
  throughput: number;
}

const steps: readonly Step[] = [
  {
    name: "Fetch new leads",
    duration: "0.8s",
    status: "completed",
    throughput: 1,
  },
  {
    name: "Enrich record",
    duration: "1.4s",
    status: "completed",
    throughput: 0.8,
  },
  {
    name: "Score intent",
    duration: "0.6s",
    status: "completed",
    throughput: 0.63,
  },
  {
    name: "Write to CRM",
    duration: "1.1s",
    status: "running",
    throughput: 0.48,
  },
  { name: "Notify owner", duration: "--", status: "queued", throughput: 0.2 },
];

const dotFill: Record<StepStatus, string> = {
  completed: "#2947e6",
  running: "#3d63ff",
  queued: "#c5ccd9",
};

const nameFill: Record<StepStatus, string> = {
  completed: "#4d5568",
  running: "#39404f",
  queued: "#98a1b3",
};

const ROW_TOP = 30;
const ROW_PITCH = 40;
const AXIS_Y = 352;
const BAR_MAX = 70;
const BAR_WIDTH = 100;
const BAR_PITCH = 123;

export function AutomationRunVisual({ className }: AutomationRunVisualProps) {
  return (
    <div
      className={cn(
        "content-near-viewport relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card",
        className,
      )}
    >
      {/* Faint engineering grid behind the dashboard. */}
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
      <div
        aria-hidden
        className="wash pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand-500/10 blur-[90px]"
      />

      {/* Panel chrome: reads as a tool, not a marketing illustration. */}
      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-400">Automation Run</p>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium text-ink-500">
          <span
            className="animate-node size-1.5 rounded-full bg-brand-500"
            aria-hidden
          />
          Running
        </span>
      </div>

      <svg
        viewBox="0 0 640 400"
        className="relative block w-full"
        role="img"
        aria-label="Mockup of an automation run showing five workflow steps — fetch new leads, enrich record and score intent completed, write to CRM currently running, notify owner queued — each with an illustrative duration, above a bar chart of illustrative throughput for those same five steps in the last run."
      >
        <defs>
          <linearGradient id="autorun-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6384ff" />
            <stop offset="1" stopColor="#3d63ff" />
          </linearGradient>
        </defs>

        {/* Stepper spine: visible only in the gaps between rows. */}
        <path
          d={`M44 ${ROW_TOP + 16} V${ROW_TOP + 16 + ROW_PITCH * 4}`}
          stroke="#dfe3ea"
          strokeWidth="1"
        />

        {steps.map((step, index) => {
          const top = ROW_TOP + index * ROW_PITCH;
          const mid = top + 16;

          return (
            <g key={step.name}>
              <rect
                x="24"
                y={top}
                width="592"
                height="32"
                rx="9"
                fill="#ffffff"
                stroke="#dfe3ea"
              />
              <circle
                cx="44"
                cy={mid}
                r="3.5"
                fill={dotFill[step.status]}
                className={step.status === "running" ? "animate-node" : undefined}
              />
              <text
                x="60"
                y={mid + 4}
                fill={nameFill[step.status]}
                fontSize="12"
                fontFamily="var(--font-sans)"
              >
                {step.name}
              </text>
              <text
                x="596"
                y={mid + 4}
                textAnchor="end"
                fill="#98a1b3"
                fontSize="10.5"
                fontFamily="var(--font-mono)"
              >
                {step.duration}
              </text>
            </g>
          );
        })}

        {/* Divider between the step list and the throughput chart. */}
        <path
          d="M24 244 H616"
          stroke="#dfe3ea"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <text
          x="24"
          y="268"
          fill="#6b7488"
          fontSize="9.5"
          letterSpacing="1.4"
          fontFamily="var(--font-mono)"
        >
          THROUGHPUT
        </text>

        {steps.map((step, index) => {
          const height = Math.round(BAR_MAX * step.throughput);

          return (
            <rect
              key={step.name}
              x={24 + index * BAR_PITCH}
              y={AXIS_Y - height}
              width={BAR_WIDTH}
              height={height}
              rx="3"
              fill="url(#autorun-bar)"
              opacity={step.status === "queued" ? 0.28 : 0.9}
            />
          );
        })}

        <path d={`M24 ${AXIS_Y} H616`} stroke="#dfe3ea" strokeWidth="1" />
        <text
          x="24"
          y="374"
          fill="#98a1b3"
          fontSize="9.5"
          letterSpacing="1.4"
          fontFamily="var(--font-mono)"
        >
          STEPS · LAST RUN
        </text>
      </svg>
    </div>
  );
}
