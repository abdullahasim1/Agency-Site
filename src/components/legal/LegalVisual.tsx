import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Hero diagrams for /privacy and /terms.
 *
 * The legal pages are the one place a visitor arrives already suspicious, so
 * these draw the mechanics — where data actually goes, what the agreement
 * actually covers — instead of a padlock clip-art. Illustrative only: nothing
 * here stands for a certification, an audit or a legal review. Inline SVG
 * animated by the keyframes already in globals.css, so it costs zero client
 * JavaScript and is neutralised under prefers-reduced-motion.
 */

export interface LegalVisualProps {
  kind: "privacy" | "terms";
  className?: string;
}

interface PanelProps {
  label: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}

function Panel({ label, ariaLabel, className, children }: PanelProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-panel border border-ink-200 bg-white shadow-soft",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-blueprint opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 size-60 rounded-full bg-brand-500/[0.08] blur-[90px]"
      />

      <div className="relative flex items-center gap-2 border-b border-ink-200/80 bg-ink-25/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden />
        <p className="type-eyebrow ml-2 text-ink-400">{label}</p>
        <span className="ml-auto font-mono text-[0.625rem] tracking-[0.14em] text-ink-400 uppercase">
          Illustrative
        </span>
      </div>

      <svg
        viewBox="0 0 640 240"
        className="relative block w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {children}
      </svg>
    </div>
  );
}

/** Shared footer rail: a caption the diagram sits on, as a spec sheet would. */
function FootRail({ text }: { text: string }) {
  return (
    <>
      <text
        x="24"
        y="198"
        fill="#98a1b3"
        fontSize="9.5"
        letterSpacing="1.4"
        fontFamily="var(--font-mono)"
      >
        {text}
      </text>
      <path
        d="M24 210 H616"
        stroke="#dfe3ea"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
    </>
  );
}

const rail = [
  {
    label: "INPUT",
    caption: "Your request",
    tint: "#3d63ff",
    glyph: "M-5 0 H4 M1 -3.5 L4.5 0 L1 3.5",
  },
  {
    label: "REDACT",
    caption: "Identifiers stripped",
    tint: "#8b5cf6",
    glyph: "M-5.5 -3 H5.5 M-5.5 3 H1",
  },
  {
    label: "PROVIDER",
    caption: "No training use",
    tint: "#22d3ee",
    glyph: "M-5 -4.5 H5 V4.5 H-5 Z M-5 -1 H5",
  },
  {
    label: "DELETE",
    caption: "Retention window",
    tint: "#6b7488",
    glyph: "M-4 -4 L4 4 M4 -4 L-4 4",
  },
] as const;

const RAIL_Y = 88;
const railX = (index: number) => 80 + index * 160;

function PrivacyRail() {
  return (
    <>
      <defs>
        <linearGradient id="legalviz-rail" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" stopColor="#3d63ff" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {rail.slice(0, -1).map((node, index) => (
        <path
          key={`seg-${node.label}`}
          d={`M${railX(index) + 24} ${RAIL_Y} H${railX(index + 1) - 24}`}
          fill="none"
          stroke="url(#legalviz-rail)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="animate-dash"
          style={{ animationDelay: `${index * 0.4}s` }}
        />
      ))}

      {rail.map((node, index) => (
        <g key={node.label}>
          <circle
            cx={railX(index)}
            cy={RAIL_Y}
            r="22"
            fill={node.tint}
            fillOpacity="0.06"
            stroke={node.tint}
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          <g
            transform={`translate(${railX(index)} ${RAIL_Y})`}
            fill="none"
            stroke={node.tint}
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d={node.glyph} />
          </g>
          <circle
            cx={railX(index) + 17}
            cy={RAIL_Y - 15}
            r="3.5"
            fill={node.tint}
            className="animate-node"
            style={{ animationDelay: `${index * 0.7}s` }}
          />
          <text
            x={railX(index)}
            y="150"
            textAnchor="middle"
            fill={node.tint}
            fontSize="9"
            letterSpacing="1.4"
            fontFamily="var(--font-mono)"
          >
            {node.label}
          </text>
          <text
            x={railX(index)}
            y="168"
            textAnchor="middle"
            fill="#6b7488"
            fontSize="10.5"
            fontFamily="var(--font-sans)"
          >
            {node.caption}
          </text>
        </g>
      ))}

      <FootRail text="DATA MINIMISATION · PURPOSE LIMITATION · DELETION" />
    </>
  );
}

const motifs = [
  { label: "AGREEMENT", caption: "Scope of work", cx: 128, tint: "#3d63ff" },
  { label: "LIABILITY", caption: "Limits & warranty", cx: 320, tint: "#8b5cf6" },
  {
    label: "GOVERNING LAW",
    caption: "Disputes & venue",
    cx: 512,
    tint: "#22d3ee",
  },
] as const;

function TermsMotif() {
  return (
    <>
      <defs>
        <linearGradient id="legalviz-terms" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" stopColor="#3d63ff" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {[
        { d: "M162 92 H286", delay: 0 },
        { d: "M354 92 H474", delay: 0.4 },
      ].map((link) => (
        <path
          key={link.d}
          d={link.d}
          fill="none"
          stroke="url(#legalviz-terms)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="animate-dash"
          style={{ animationDelay: `${link.delay}s` }}
        />
      ))}

      {/* Document — the scope of the agreement. */}
      <g
        fill="none"
        stroke="#3d63ff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M106 60 h30 l14 14 v46 a5 5 0 0 1 -5 5 h-34 a5 5 0 0 1 -5 -5 V65 a5 5 0 0 1 5 -5 z" />
        <path d="M136 60 v14 h14" strokeOpacity="0.55" />
        <g stroke="#98a1b3">
          <path d="M116 88 H140" />
          <path d="M116 98 H144" />
          <path d="M116 108 H132" />
        </g>
      </g>
      <circle cx="150" cy="62" r="3.5" fill="#3d63ff" className="animate-node" />

      {/* Shield — liability limits and warranties. */}
      <g
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M320 58 l22 8 v24 c0 17 -11 27 -22 33 c-11 -6 -22 -16 -22 -33 V66 z" />
        <path
          d="M320 71 l12 4.5 v14 c0 10 -6 15.5 -12 18 c-6 -2.5 -12 -8 -12 -18 V75.5 z"
          strokeOpacity="0.45"
        />
      </g>
      <circle
        cx="320"
        cy="88"
        r="3.5"
        fill="#8b5cf6"
        className="animate-node"
        style={{ animationDelay: "0.6s" }}
      />

      {/* Balance scale — governing law and dispute resolution. */}
      <g
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M512 66 V116" />
        <path d="M498 118 H526" />
        <path d="M488 76 H536" />
        <path d="M488 76 V82" strokeOpacity="0.6" />
        <path d="M536 76 V82" strokeOpacity="0.6" />
        <path d="M476 82 Q488 98 500 82" />
        <path d="M524 82 Q536 98 548 82" />
      </g>
      <circle
        cx="512"
        cy="64"
        r="3.5"
        fill="#22d3ee"
        className="animate-node"
        style={{ animationDelay: "1.2s" }}
      />

      {motifs.map((motif) => (
        <g key={motif.label}>
          <text
            x={motif.cx}
            y="150"
            textAnchor="middle"
            fill={motif.tint}
            fontSize="9"
            letterSpacing="1.4"
            fontFamily="var(--font-mono)"
          >
            {motif.label}
          </text>
          <text
            x={motif.cx}
            y="168"
            textAnchor="middle"
            fill="#6b7488"
            fontSize="10.5"
            fontFamily="var(--font-sans)"
          >
            {motif.caption}
          </text>
        </g>
      ))}

      <FootRail text="AGREEMENT SCOPE · LIABILITY LIMITS · GOVERNING LAW" />
    </>
  );
}

const panels = {
  privacy: {
    label: "Data Handling",
    ariaLabel:
      "Diagram of a data handling rail with four stages: a request arrives as input, identifiers are stripped in a redaction step, the redacted request is sent to a model provider that does not train on it, and the data is deleted at the end of a retention window.",
  },
  terms: {
    label: "Terms At A Glance",
    ariaLabel:
      "Diagram of three themes covered by the terms of service, drawn as simple line motifs: a document for the scope of the agreement, a shield for liability limits and warranties, and a balance scale for governing law and dispute resolution.",
  },
} as const;

export function LegalVisual({ kind, className }: LegalVisualProps) {
  const panel = panels[kind];

  return (
    <Panel
      label={panel.label}
      ariaLabel={panel.ariaLabel}
      className={className}
    >
      {kind === "privacy" ? <PrivacyRail /> : <TermsMotif />}
    </Panel>
  );
}
