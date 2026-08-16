import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

const agentTrace = [
  { kind: "THINK", text: "Refund request — needs order history", ms: "120ms" },
  { kind: "TOOL", text: "orders.lookup(order_id)", ms: "340ms" },
  { kind: "TOOL", text: "policy.search(“refund window”)", ms: "210ms" },
  { kind: "THINK", text: "Outside window — escalate, do not promise", ms: "150ms" },
] as const;

export const agentsMockup: Mockup = {
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
