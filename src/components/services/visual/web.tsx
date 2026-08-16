import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

export const webMockup: Mockup = {
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
