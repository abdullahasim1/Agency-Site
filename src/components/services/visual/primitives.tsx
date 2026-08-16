import type { ReactNode } from "react";

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

export function Box({
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
export function Mono({ x, y, fill = "#98a1b3", size = 9, anchor, children }: LabelProps) {
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

export function Sans({ x, y, fill = "#4d5568", size = 11, anchor, children }: LabelProps) {
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
export function Outcome({
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
