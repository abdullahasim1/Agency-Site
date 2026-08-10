import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Per-service hero mockup.
 *
 * A service page has to argue for that one service, so the slug picks a
 * purpose-built drawing of the artefact we actually hand over — a call
 * transcript, an agent trace, a sync map — instead of one generic illustration
 * retinted eight times. Server-rendered inline SVG animated by the keyframes
 * already in globals.css, so it costs zero client JavaScript and is neutralised
 * under prefers-reduced-motion.
 */

export interface ServiceHeroVisualProps {
  slug: string;
  accent: "brand" | "violet" | "cyan";
  className?: string;
}

type Accent = ServiceHeroVisualProps["accent"];

const accentHex: Record<Accent, string> = {
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
function VisualPanel({
  accent,
  label,
  description,
  className,
  children,
}: VisualPanelProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-card",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-70" />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-[90px]",
          accentGlow[accent],
        )}
      />

      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-400">{label}</p>
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

interface Mockup {
  label: string;
  description: string;
  body: (context: MockupContext) => ReactNode;
}

const transcript = [
  { from: "AGENT", line: "Thanks for calling — how can I help?" },
  { from: "CALLER", line: "I'd like to book an appointment." },
  { from: "AGENT", line: "Tuesday at 2pm is open." },
  { from: "CALLER", line: "Can I speak with a person?" },
] as const;

const waveform = [
  10, 24, 34, 18, 44, 30, 52, 26, 38, 16, 46, 28, 20, 40, 24, 12, 32, 48, 22,
  14,
] as const;

const voiceMockup: Mockup = {
  label: "Live Call",
  description:
    "Mockup of a voice agent handling an inbound call: a running transcript of the agent and caller, a live audio waveform, checkmarks for transcript, recording and CRM write-back, and a highlighted row showing the call being warm-transferred to a human.",
  body: ({ tint }) => (
    <>
      <rect
        x="24"
        y="24"
        width="348"
        height="250"
        rx="14"
        fill="#ffffff"
        stroke="#dfe3ea"
      />
      <text
        x="40"
        y="46"
        fill="#98a1b3"
        fontSize="9"
        letterSpacing="1.4"
        fontFamily="var(--font-mono)"
      >
        INBOUND CALL · 00:42
      </text>

      {transcript.map((turn, index) => {
        const agent = turn.from === "AGENT";
        const y = 56 + index * 52;
        return (
          <g key={turn.line}>
            <rect
              x={agent ? 40 : 108}
              y={y}
              width="248"
              height="44"
              rx="11"
              fill={agent ? tint : "#ffffff"}
              fillOpacity={agent ? 0.07 : 1}
              stroke={agent ? tint : "#dfe3ea"}
              strokeOpacity={agent ? 0.3 : 1}
            />
            <text
              x={(agent ? 40 : 108) + 14}
              y={y + 17}
              fill={agent ? tint : "#98a1b3"}
              fontSize="8"
              letterSpacing="1.3"
              fontFamily="var(--font-mono)"
            >
              {turn.from}
            </text>
            <text
              x={(agent ? 40 : 108) + 14}
              y={y + 33}
              fill="#4d5568"
              fontSize="11"
              fontFamily="var(--font-sans)"
            >
              {turn.line}
            </text>
          </g>
        );
      })}

      <rect
        x="392"
        y="24"
        width="224"
        height="124"
        rx="14"
        fill="#ffffff"
        stroke="#dfe3ea"
      />
      <text
        x="408"
        y="48"
        fill="#98a1b3"
        fontSize="9"
        letterSpacing="1.4"
        fontFamily="var(--font-mono)"
      >
        WAVEFORM
      </text>
      {waveform.map((height, index) => (
        <rect
          key={`wave-${index}`}
          x={406 + index * 10}
          y={106 - height / 2}
          width="4"
          height={height}
          rx="2"
          fill={tint}
          opacity={0.35 + (height / 52) * 0.6}
          className={index % 4 === 1 ? "animate-node" : undefined}
          style={
            index % 4 === 1
              ? { animationDelay: `${index * 0.16}s` }
              : undefined
          }
        />
      ))}

      <rect
        x="392"
        y="164"
        width="224"
        height="110"
        rx="14"
        fill="#ffffff"
        stroke="#dfe3ea"
      />
      {["Transcript", "Recording", "CRM write-back"].map((row, index) => (
        <g key={row}>
          <circle cx="412" cy={192 + index * 28} r="3.5" fill={tint} />
          <text
            x="426"
            y={196 + index * 28}
            fill="#4d5568"
            fontSize="11"
            fontFamily="var(--font-sans)"
          >
            {row}
          </text>
          <rect
            x="560"
            y={185 + index * 28}
            width="40"
            height="14"
            rx="7"
            fill={tint}
            fillOpacity="0.1"
          />
        </g>
      ))}

      <path
        d="M198 274 V292"
        stroke="#dfe3ea"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        className="animate-dash"
      />
      <rect
        x="24"
        y="294"
        width="592"
        height="52"
        rx="12"
        fill={tint}
        fillOpacity="0.06"
        stroke={tint}
        strokeOpacity="0.35"
      />
      <text
        x="44"
        y="315"
        fill={tint}
        fontSize="8.5"
        letterSpacing="1.3"
        fontFamily="var(--font-mono)"
      >
        ESCALATION
      </text>
      <text
        x="44"
        y="332"
        fill="#39404f"
        fontSize="11.5"
        fontFamily="var(--font-sans)"
      >
        Transfer to human — caller asked for a person
      </text>
      <circle
        cx="580"
        cy="320"
        r="4"
        fill={tint}
        className="animate-node"
      />

      <text
        x="24"
        y="370"
        fill="#98a1b3"
        fontSize="9.5"
        letterSpacing="1.4"
        fontFamily="var(--font-mono)"
      >
        TURN-TAKING · BARGE-IN · CONFIRMATION · HANDOFF
      </text>
    </>
  ),
};

/* Shared primitives, so each mockup below only carries its own shapes. */

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  rx?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}

function Box({
  x,
  y,
  w,
  h,
  fill = "#ffffff",
  stroke = "#dfe3ea",
  rx = 13,
  fillOpacity,
  strokeOpacity,
}: BoxProps) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={fill}
      stroke={stroke}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
    />
  );
}

interface LabelProps {
  x: number;
  y: number;
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}

/** Uppercase mono caption — the annotation voice shared by every mockup. */
function Mono({ x, y, fill = "#98a1b3", size = 9, anchor, children }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      letterSpacing="1.3"
      textAnchor={anchor}
      fontFamily="var(--font-mono)"
    >
      {children}
    </text>
  );
}

function Sans({ x, y, fill = "#4d5568", size = 11, anchor, children }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      textAnchor={anchor}
      fontFamily="var(--font-sans)"
    >
      {children}
    </text>
  );
}

/** The summary band every mockup ends on, plus its footer rail. */
function Outcome({
  tint,
  kicker,
  line,
  rail,
}: {
  tint: string;
  kicker: string;
  line: string;
  rail: string;
}) {
  return (
    <>
      <path
        d="M198 276 V292"
        stroke="#dfe3ea"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        className="animate-dash"
      />
      <Box
        x={24}
        y={294}
        w={592}
        h={52}
        rx={12}
        fill={tint}
        fillOpacity={0.06}
        stroke={tint}
        strokeOpacity={0.35}
      />
      <Mono x={44} y={315} fill={tint} size={8.5}>
        {kicker}
      </Mono>
      <Sans x={44} y={332} fill="#39404f" size={11.5}>
        {line}
      </Sans>
      <circle cx={580} cy={320} r={4} fill={tint} className="animate-node" />
      <Mono x={24} y={370} size={9.5}>
        {rail}
      </Mono>
    </>
  );
}

const automationSteps = [
  { name: "Watch inbox", state: "done" },
  { name: "Extract fields", state: "done" },
  { name: "Match customer", state: "done" },
  { name: "Await approval", state: "gate" },
  { name: "Write to CRM", state: "queued" },
] as const;

/* Emerald stays reserved for the Live chrome dot, so a finished step reads as a
   darker brand against brand-500 for anything still moving. Amber matches the
   caution tone already used by the legal disclaimer. */
const stateFill = {
  done: "#2947e6",
  gate: "#f59e0b",
  queued: "#c5ccd9",
} as const;

const automationMockup: Mockup = {
  label: "Automation Run",
  description:
    "Mockup of an automation run: five ordered steps — watch inbox, extract fields and match customer completed, await approval paused on a human gate, write to CRM still queued — beside a panel of run counters, above a band noting that the approval gate is deliberate.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <Mono x={40} y={46}>
        RUN #2481 · TRIGGERED BY EMAIL
      </Mono>

      <path d="M56 70 V246" stroke="#dfe3ea" strokeWidth="1" />
      {automationSteps.map((step, index) => {
        const y = 70 + index * 36;
        return (
          <g key={step.name}>
            <circle
              cx="56"
              cy={y}
              r="4.5"
              fill={stateFill[step.state]}
              className={step.state === "gate" ? "animate-node" : undefined}
            />
            <Sans
              x={76}
              y={y + 4}
              fill={step.state === "queued" ? "#98a1b3" : "#4d5568"}
            >
              {step.name}
            </Sans>
            {step.state === "gate" ? (
              <>
                <Box
                  x={250}
                  y={y - 10}
                  w={104}
                  h={20}
                  rx={10}
                  fill="#f59e0b"
                  fillOpacity={0.12}
                  stroke="#f59e0b"
                  strokeOpacity={0.35}
                />
                <Mono x={302} y={y + 4} fill="#b45309" size={7.5} anchor="middle">
                  NEEDS REVIEW
                </Mono>
              </>
            ) : null}
          </g>
        );
      })}

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        THIS RUN
      </Mono>
      {[
        { k: "Steps automated", v: "4 of 5" },
        { k: "Manual touches", v: "1" },
        { k: "Retries", v: "0" },
        { k: "Audit trail", v: "Complete" },
      ].map((row, index) => (
        <g key={row.k}>
          <Sans x={408} y={82 + index * 34} size={10.5} fill="#6b7488">
            {row.k}
          </Sans>
          <Sans x={600} y={82 + index * 34} size={11} anchor="end" fill="#39404f">
            {row.v}
          </Sans>
          <path
            d={`M408 ${92 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}
      <Box
        x={408}
        y={216}
        w={192}
        h={40}
        rx={10}
        fill={tint}
        fillOpacity={0.06}
        stroke={tint}
        strokeOpacity={0.3}
      />
      <Mono x={424} y={233} fill={tint} size={8}>
        NEXT RUN
      </Mono>
      <Sans x={424} y={247} size={10.5} fill="#4d5568">
        On next inbound email
      </Sans>

      <Outcome
        tint={tint}
        kicker="BY DESIGN"
        line="The approval gate stays — a person signs off before the write"
        rail="TRIGGER · EXTRACT · DECIDE · APPROVE · WRITE"
      />
    </>
  ),
};

const agentTrace = [
  { kind: "THINK", text: "Refund request — needs order history", ms: "120ms" },
  { kind: "TOOL", text: "orders.lookup(order_id)", ms: "340ms" },
  { kind: "TOOL", text: "policy.search(“refund window”)", ms: "210ms" },
  { kind: "THINK", text: "Outside window — escalate, do not promise", ms: "150ms" },
] as const;

const agentsMockup: Mockup = {
  label: "Agent Trace",
  description:
    "Mockup of an agent trace for a refund request: alternating reasoning and tool-call steps with per-step latencies, a panel listing the tools the agent is allowed to call, and a band showing the agent stopping rather than promising a refund it cannot authorise.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <Mono x={40} y={46}>
        TRACE · REFUND REQUEST
      </Mono>

      {agentTrace.map((step, index) => {
        const y = 58 + index * 52;
        const isTool = step.kind === "TOOL";
        return (
          <g key={step.text}>
            <Box
              x={40}
              y={y}
              w={316}
              h={44}
              rx={11}
              fill={isTool ? "#ffffff" : tint}
              fillOpacity={isTool ? 1 : 0.07}
              stroke={isTool ? "#dfe3ea" : tint}
              strokeOpacity={isTool ? 1 : 0.3}
            />
            <Mono x={54} y={y + 17} fill={isTool ? "#98a1b3" : tint} size={8}>
              {step.kind}
            </Mono>
            <Mono x={342} y={y + 17} size={8} anchor="end">
              {step.ms}
            </Mono>
            <Sans x={54} y={y + 33}>
              {step.text}
            </Sans>
          </g>
        );
      })}

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        TOOLS AVAILABLE
      </Mono>
      {[
        "orders.lookup",
        "policy.search",
        "ticket.create",
        "human.escalate",
      ].map((tool, index) => (
        <g key={tool}>
          <Box
            x={408}
            y={62 + index * 40}
            w={192}
            h={30}
            rx={9}
            fill="#ffffff"
            stroke="#eef0f4"
          />
          <circle cx={424} cy={77 + index * 40} r="3.5" fill={tint} />
          <text
            x={438}
            y={81 + index * 40}
            fill="#4d5568"
            fontSize="10.5"
            fontFamily="var(--font-mono)"
          >
            {tool}
          </text>
        </g>
      ))}
      <Mono x={408} y={252} size={8}>
        NOTHING OUTSIDE THIS LIST
      </Mono>

      <Outcome
        tint={tint}
        kicker="GUARDRAIL"
        line="Refund outside policy — escalated instead of promised"
        rail="REASON · CALL TOOL · CHECK POLICY · ESCALATE"
      />
    </>
  ),
};

const webMockup: Mockup = {
  label: "App Shell",
  description:
    "Mockup of a web application in progress: a browser-style layout with a sidebar, a data table and a summary chart, beside a panel listing the delivery checks that run on every commit — typecheck, tests, accessibility and bundle budget.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <rect x="24" y="24" width="348" height="26" rx="13" fill="#f7f8fa" />
      <rect x="24" y="38" width="348" height="12" fill="#f7f8fa" />
      <circle cx="42" cy="37" r="3.5" fill="#dfe3ea" />
      <circle cx="54" cy="37" r="3.5" fill="#dfe3ea" />
      <circle cx="66" cy="37" r="3.5" fill="#dfe3ea" />
      <Box x={82} y={30} w={272} h={14} rx={7} fill="#ffffff" stroke="#eef0f4" />

      {/* Sidebar */}
      <Box x={38} y={62} w={78} h={198} rx={10} fill="#fbfcfd" stroke="#eef0f4" />
      {[0, 1, 2, 3, 4].map((row) => (
        <rect
          key={row}
          x="50"
          y={78 + row * 26}
          width={row === 1 ? 54 : 44}
          height="8"
          rx="4"
          fill={row === 1 ? tint : "#dfe3ea"}
          opacity={row === 1 ? 0.75 : 1}
        />
      ))}

      {/* Data table */}
      <Box x={128} y={62} w={228} h={104} rx={10} fill="#ffffff" stroke="#eef0f4" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect
            x="142"
            y={78 + row * 22}
            width={row === 0 ? 60 : 84}
            height="7"
            rx="3.5"
            fill={row === 0 ? "#c5ccd9" : "#e8ebf0"}
          />
          <rect
            x="248"
            y={78 + row * 22}
            width="42"
            height="7"
            rx="3.5"
            fill="#e8ebf0"
          />
          <rect
            x="304"
            y={78 + row * 22}
            width="38"
            height="7"
            rx="3.5"
            fill={row === 0 ? "#c5ccd9" : tint}
            opacity={row === 0 ? 1 : 0.35}
          />
        </g>
      ))}

      {/* Summary chart */}
      <Box x={128} y={178} w={228} h={82} rx={10} fill="#ffffff" stroke="#eef0f4" />
      {[26, 40, 30, 52, 44, 62, 48].map((height, index) => (
        <rect
          key={index}
          x={144 + index * 30}
          y={246 - height}
          width="18"
          height={height}
          rx="3"
          fill={tint}
          opacity={0.25 + index * 0.1}
        />
      ))}

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        EVERY COMMIT
      </Mono>
      {[
        "Typecheck",
        "Unit + integration tests",
        "Accessibility pass",
        "Bundle budget",
        "Preview deploy",
      ].map((check, index) => (
        <g key={check}>
          <circle cx={412} cy={74 + index * 34} r="3.5" fill={tint} />
          <Sans x={426} y={78 + index * 34} size={10.5}>
            {check}
          </Sans>
          <path
            d={`M408 ${90 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}

      <Outcome
        tint={tint}
        kicker="HANDOVER"
        line="Repository, pipeline and docs — owned by you outright"
        rail="ARCHITECT · BUILD · TEST · SHIP"
      />
    </>
  ),
};

const mobileMockup: Mockup = {
  label: "Release Build",
  description:
    "Mockup of a mobile application: a phone frame showing a list screen with a sync banner, beside a panel covering the release pipeline — offline queue, push delivery, crash-free sessions and staged store rollout.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />

      {/* Phone frame */}
      <Box x={132} y={40} w={132} h={218} rx={20} fill="#ffffff" stroke="#dfe3ea" />
      <rect x="176" y="50" width="44" height="6" rx="3" fill="#e8ebf0" />

      {/* Sync banner */}
      <Box
        x={144}
        y={66}
        w={108}
        h={26}
        rx={8}
        fill={tint}
        fillOpacity={0.09}
        stroke={tint}
        strokeOpacity={0.28}
      />
      <circle cx={158} cy={79} r="3" fill={tint} className="animate-node" />
      <Mono x={168} y={82} fill={tint} size={7.5}>
        SYNCING · 3 QUEUED
      </Mono>

      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <Box
            x={144}
            y={100 + row * 34}
            w={108}
            h={28}
            rx={8}
            fill="#fbfcfd"
            stroke="#eef0f4"
          />
          <circle cx={158} cy={114 + row * 34} r="5" fill="#e8ebf0" />
          <rect
            x="170"
            y={110 + row * 34}
            width={row === 0 ? 56 : 68}
            height="6"
            rx="3"
            fill="#dfe3ea"
          />
          <rect
            x="170"
            y={120 + row * 34}
            width="40"
            height="5"
            rx="2.5"
            fill="#eef0f4"
          />
        </g>
      ))}

      {/* Tab bar */}
      <path d="M144 240 H252" stroke="#eef0f4" strokeWidth="1" />
      {[0, 1, 2].map((tab) => (
        <circle
          key={tab}
          cx={168 + tab * 30}
          cy={250}
          r="4"
          fill={tab === 0 ? tint : "#dfe3ea"}
        />
      ))}

      <Mono x={40} y={46}>
        BUILD 1.4.0 · TESTFLIGHT
      </Mono>
      <Mono x={40} y={264} size={8}>
        iOS · ANDROID · ONE CODEBASE
      </Mono>

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        RELEASE PIPELINE
      </Mono>
      {[
        "Offline queue drains",
        "Push delivery verified",
        "Crash-free sessions",
        "Staged store rollout",
        "Rollback path tested",
      ].map((row, index) => (
        <g key={row}>
          <circle cx={412} cy={74 + index * 34} r="3.5" fill={tint} />
          <Sans x={426} y={78 + index * 34} size={10.5}>
            {row}
          </Sans>
          <path
            d={`M408 ${90 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}

      <Outcome
        tint={tint}
        kicker="SHIPPED"
        line="Store listing, signing keys and pipeline handed over with the app"
        rail="DESIGN · BUILD · BETA · RELEASE"
      />
    </>
  ),
};

const workflowNodes = [
  { x: 60, y: 96, label: "FORM", sub: "New request" },
  { x: 208, y: 60, label: "ROUTE", sub: "By value" },
  { x: 208, y: 152, label: "ENRICH", sub: "Lookup data" },
  { x: 356, y: 96, label: "ASSIGN", sub: "To owner" },
] as const;

const workflowMockup: Mockup = {
  label: "Workflow Map",
  description:
    "Mockup of a workflow map: a request arrives from a form, branches through routing and enrichment steps, and is assigned to an owner — beside a panel listing what happens when a step fails, including retries, alerting and a documented runbook.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <Mono x={40} y={46}>
        REQUEST INTAKE
      </Mono>

      {[
        "M116 104 L204 74",
        "M116 112 L204 158",
        "M268 74 L352 100",
        "M268 158 L352 112",
      ].map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={tint}
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          className="animate-dash"
          style={{ animationDelay: `${index * 0.3}s` }}
        />
      ))}

      {workflowNodes.map((node, index) => (
        <g key={node.label}>
          <Box
            x={node.x - 32}
            y={node.y - 22}
            w={64}
            h={44}
            rx={11}
            fill="#ffffff"
            stroke="#dfe3ea"
          />
          <rect
            x={node.x - 22}
            y={node.y - 22}
            width="44"
            height="3"
            rx="1.5"
            fill={tint}
          />
          <Mono x={node.x} y={node.y - 4} fill="#39404f" size={8} anchor="middle">
            {node.label}
          </Mono>
          <Sans x={node.x} y={node.y + 11} size={9} fill="#6b7488" anchor="middle">
            {node.sub}
          </Sans>
          <circle
            cx={node.x + 26}
            cy={node.y - 16}
            r="3"
            fill={tint}
            className="animate-node"
            style={{ animationDelay: `${index * 0.4}s` }}
          />
        </g>
      ))}

      <Mono x={40} y={258} size={8}>
        BRANCHES ARE EXPLICIT · NOTHING IMPLIED
      </Mono>

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        WHEN A STEP FAILS
      </Mono>
      {[
        { k: "Retry", v: "3× backoff" },
        { k: "Then", v: "Alert owner" },
        { k: "Queue", v: "Held, not lost" },
        { k: "Runbook", v: "Documented" },
        { k: "Replay", v: "One click" },
      ].map((row, index) => (
        <g key={row.k}>
          <Sans x={408} y={78 + index * 34} size={10.5} fill="#6b7488">
            {row.k}
          </Sans>
          <Sans x={600} y={78 + index * 34} size={10.5} anchor="end" fill="#39404f">
            {row.v}
          </Sans>
          <path
            d={`M408 ${88 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}

      <Outcome
        tint={tint}
        kicker="OPERABLE"
        line="Failures surface to a person — they do not disappear silently"
        rail="MAP · ORCHESTRATE · ALERT · HAND OVER"
      />
    </>
  ),
};

const syncRows = [
  { system: "CRM", field: "contact.email", state: "synced" },
  { system: "Billing", field: "invoice.status", state: "synced" },
  { system: "Support", field: "ticket.owner", state: "retry" },
  { system: "Warehouse", field: "order.stage", state: "synced" },
] as const;

const integrationsMockup: Mockup = {
  label: "Sync Map",
  description:
    "Mockup of an integration sync map: four systems — CRM, billing, support and warehouse — with the field each one exchanges, one row retrying after a failed call, beside a panel showing how the connector handles rate limits, duplicates and schema changes.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <Mono x={40} y={46}>
        FIELD MAPPING
      </Mono>

      {syncRows.map((row, index) => {
        const y = 62 + index * 52;
        const retry = row.state === "retry";
        return (
          <g key={row.system}>
            <Box
              x={40}
              y={y}
              w={316}
              h={44}
              rx={11}
              fill="#ffffff"
              stroke={retry ? "#f59e0b" : "#dfe3ea"}
              strokeOpacity={retry ? 0.5 : 1}
            />
            <Sans x={56} y={y + 20} size={11} fill="#39404f">
              {row.system}
            </Sans>
            <text
              x={56}
              y={y + 35}
              fill="#98a1b3"
              fontSize="9.5"
              fontFamily="var(--font-mono)"
            >
              {row.field}
            </text>
            <path
              d={`M196 ${y + 22} H268`}
              stroke={retry ? "#f59e0b" : tint}
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="animate-dash"
              style={{ animationDelay: `${index * 0.25}s` }}
            />
            <Box
              x={280}
              y={y + 12}
              w={62}
              h={20}
              rx={10}
              fill={retry ? "#f59e0b" : tint}
              fillOpacity={0.12}
              stroke={retry ? "#f59e0b" : tint}
              strokeOpacity={0.3}
            />
            <Mono
              x={311}
              y={y + 26}
              fill={retry ? "#b45309" : tint}
              size={7.5}
              anchor="middle"
            >
              {retry ? "RETRY 2/3" : "SYNCED"}
            </Mono>
          </g>
        );
      })}

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        CONNECTOR HANDLES
      </Mono>
      {[
        "Rate limits + backoff",
        "Duplicate suppression",
        "Schema drift alerts",
        "Partial-failure replay",
        "Field-level audit log",
      ].map((row, index) => (
        <g key={row}>
          <circle cx={412} cy={74 + index * 34} r="3.5" fill={tint} />
          <Sans x={426} y={78 + index * 34} size={10.5}>
            {row}
          </Sans>
          <path
            d={`M408 ${90 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}

      <Outcome
        tint={tint}
        kicker="ONE SOURCE OF TRUTH"
        line="Systems agree because the mapping is explicit, not assumed"
        rail="MAP FIELDS · SYNC · RECONCILE · AUDIT"
      />
    </>
  ),
};

const customMockup: Mockup = {
  label: "System Design",
  description:
    "Mockup of a custom software architecture: a client layer talking to an API layer, which sits over a domain services layer and a datastore, with cross-cutting authentication, observability and testing — beside a panel of the artefacts handed over at the end of the engagement.",
  body: ({ tint }) => (
    <>
      <Box x={24} y={24} w={348} h={250} />
      <Mono x={40} y={46}>
        ARCHITECTURE
      </Mono>

      {[
        { label: "CLIENTS", sub: "Web · Mobile · Internal" },
        { label: "API LAYER", sub: "Typed contracts, versioned" },
        { label: "DOMAIN SERVICES", sub: "Business rules live here" },
        { label: "DATASTORE", sub: "Migrations, backups, seeds" },
      ].map((layer, index) => {
        const y = 60 + index * 52;
        return (
          <g key={layer.label}>
            <Box
              x={40}
              y={y}
              w={316}
              h={42}
              rx={11}
              fill={index === 2 ? tint : "#ffffff"}
              fillOpacity={index === 2 ? 0.07 : 1}
              stroke={index === 2 ? tint : "#dfe3ea"}
              strokeOpacity={index === 2 ? 0.3 : 1}
            />
            <Mono x={56} y={y + 18} fill={index === 2 ? tint : "#39404f"} size={8}>
              {layer.label}
            </Mono>
            <Sans x={56} y={y + 33} size={10.5} fill="#6b7488">
              {layer.sub}
            </Sans>
            {index < 3 ? (
              <path
                d={`M198 ${y + 42} V${y + 52}`}
                stroke={tint}
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeDasharray="3 5"
                className="animate-dash"
                style={{ animationDelay: `${index * 0.3}s` }}
              />
            ) : null}
          </g>
        );
      })}

      <Box x={392} y={24} w={224} h={250} />
      <Mono x={408} y={46}>
        YOU RECEIVE
      </Mono>
      {[
        "Source repository",
        "Architecture decision log",
        "Test suite + fixtures",
        "Deployment pipeline",
        "Runbook + onboarding",
      ].map((row, index) => (
        <g key={row}>
          <circle cx={412} cy={74 + index * 34} r="3.5" fill={tint} />
          <Sans x={426} y={78 + index * 34} size={10.5}>
            {row}
          </Sans>
          <path
            d={`M408 ${90 + index * 34} H600`}
            stroke="#eef0f4"
            strokeWidth="1"
          />
        </g>
      ))}

      <Outcome
        tint={tint}
        kicker="NO LOCK-IN"
        line="Built so another team could pick it up without calling us"
        rail="DISCOVER · DESIGN · BUILD · HAND OVER"
      />
    </>
  ),
};

const fallbackMockup = customMockup;

const registry: Record<string, Mockup> = {
  "ai-automation": automationMockup,
  "ai-agents": agentsMockup,
  "ai-voice-agents": voiceMockup,
  "web-application-development": webMockup,
  "mobile-app-development": mobileMockup,
  "workflow-automation": workflowMockup,
  "crm-api-integrations": integrationsMockup,
  "custom-software-development": customMockup,
};

export function ServiceHeroVisual({
  slug,
  accent,
  className,
}: ServiceHeroVisualProps) {
  const mockup = registry[slug] ?? fallbackMockup;

  return (
    <VisualPanel
      accent={accent}
      label={mockup.label}
      description={mockup.description}
      className={className}
    >
      {mockup.body({ tint: accentHex[accent] })}
    </VisualPanel>
  );
}
