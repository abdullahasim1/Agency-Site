import { Box, Mono, Outcome, Sans } from "./primitives";
import type { Mockup } from "./types";

export const mobileMockup: Mockup = {
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
