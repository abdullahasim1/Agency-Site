import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

const workflowNodes = [
  { x: 60, y: 96, label: "FORM", sub: "New request" },
  { x: 208, y: 60, label: "ROUTE", sub: "By value" },
  { x: 208, y: 152, label: "ENRICH", sub: "Lookup data" },
  { x: 356, y: 96, label: "ASSIGN", sub: "To owner" },
] as const;

export const workflowMockup: Mockup = {
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
