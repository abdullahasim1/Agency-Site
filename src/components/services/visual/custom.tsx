import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

export const customMockup: Mockup = {
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
