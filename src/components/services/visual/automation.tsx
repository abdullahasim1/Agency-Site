import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

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

export const automationMockup: Mockup = {
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
