import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

const syncRows = [
  { system: "CRM", field: "contact.email", state: "synced" },
  { system: "Billing", field: "invoice.status", state: "synced" },
  { system: "Support", field: "ticket.owner", state: "retry" },
  { system: "Warehouse", field: "order.stage", state: "synced" },
] as const;

export const integrationsMockup: Mockup = {
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
