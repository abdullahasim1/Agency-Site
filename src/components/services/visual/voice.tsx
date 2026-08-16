import type { Mockup } from "./types";

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

export const voiceMockup: Mockup = {
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
