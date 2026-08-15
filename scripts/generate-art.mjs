// @ts-nocheck
/**
 * Generates on-brand placeholder artwork for every project.
 *
 * Output: public/images/projects/<slug>/{cover,shot-1,shot-2,shot-3}.svg
 *
 * The look is deliberately abstract — dark "systems" panels, blueprint grids,
 * connected nodes and clean UI mockups — not robots, brains or particle fields.
 * Everything is deterministic (seeded by slug), so re-running produces identical
 * files and the diff stays clean. Run with: npm run art
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/images/projects");

// Accent palettes mirror the design tokens in globals.css.
const PALETTES = {
  brand: { main: "#3d63ff", soft: "#6b8afd", faint: "#1e2b5e" },
  violet: { main: "#8b5cf6", soft: "#a78bfa", faint: "#2f2358" },
  cyan: { main: "#22d3ee", soft: "#67e8f9", faint: "#123b47" },
};

const BG = "#0a0f1e";
const PANEL = "#111827";
const LINE = "rgba(255,255,255,0.06)";
const TEXT = "rgba(255,255,255,0.72)";
const MUTE = "rgba(255,255,255,0.38)";

// slug, accent, short category tag, and node labels used in the cover diagram.
const PROJECTS = [
  { slug: "verivoice", accent: "brand", tag: "AI · VOICE", io: ["Calls", "Intent", "Book"] },
  { slug: "ai-sales-automation", accent: "violet", tag: "AI · AUTOMATION", io: ["Leads", "Score", "Route"] },
  { slug: "smart-crm", accent: "cyan", tag: "SAAS · AI", io: ["Activity", "Resolve", "Report"] },
  { slug: "ai-resume-platform", accent: "brand", tag: "AI · WEB APP", io: ["Resume", "Match", "Generate"] },
  { slug: "workflow-automation-system", accent: "cyan", tag: "AUTOMATION", io: ["Trigger", "Run", "Deliver"] },
  { slug: "ai-customer-support-platform", accent: "violet", tag: "AI · SUPPORT", io: ["Ticket", "Reason", "Resolve"] },
  { slug: "fieldops-mobile", accent: "brand", tag: "MOBILE", io: ["Job", "Sync", "Report"] },
  { slug: "medisync-scheduling", accent: "cyan", tag: "SAAS · HEALTH", io: ["Request", "Match", "Confirm"] },
  { slug: "commerce-insights", accent: "violet", tag: "SAAS · DATA", io: ["Events", "Model", "Insight"] },
  { slug: "routelens-driver-app", accent: "brand", tag: "MOBILE · AI", io: ["Route", "Detect", "Alert"] },
  { slug: "recruitflow", accent: "cyan", tag: "SAAS · RECRUIT", io: ["Apply", "Screen", "Hire"] },
  { slug: "autovance", accent: "violet", tag: "AI · AUTOMATION", io: ["Trigger", "Orchestrate", "Deliver"] },
  { slug: "nextjs-auth", accent: "brand", tag: "SAAS · AUTH", io: ["Sign-up", "Verify", "Session"] },
  { slug: "adnois", accent: "violet", tag: "API · BACKEND", io: ["Request", "Auth", "Respond"] },
  { slug: "reportai", accent: "violet", tag: "AI · COMPLIANCE", io: ["Submit", "Research", "Report"] },
];

/** Deterministic PRNG so output never changes between runs. */
function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n) => Math.round(n * 100) / 100;

/** Shared defs: blueprint grid + soft accent glow. */
function defs(pal, id) {
  return `<defs>
    <pattern id="grid-${id}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${LINE}" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow-${id}" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="${pal.main}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${pal.main}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${pal.soft}"/>
      <stop offset="100%" stop-color="${pal.main}"/>
    </linearGradient>
  </defs>`;
}

/** Cover: an abstract request-through-a-system diagram, 1280×720 (16:9). */
function cover(project) {
  const pal = PALETTES[project.accent];
  const id = project.slug;
  const rand = rng(id);
  const W = 1280;
  const H = 720;

  const inX = 250;
  const coreX = 540;
  const coreW = 200;
  const outX = 900;
  const rows = [230, 360, 490];

  const inputs = project.io.length;
  const inNodes = rows
    .slice(0, 3)
    .map((y, i) => {
      const label = ["Input", "Signal", "Event"][i];
      return `<g transform="translate(${inX} ${y})">
        <rect x="-90" y="-26" width="180" height="52" rx="12" fill="${PANEL}" stroke="${LINE}"/>
        <circle cx="-64" cy="0" r="5" fill="${pal.soft}"/>
        <text x="-46" y="5" font-family="ui-monospace,monospace" font-size="15" fill="${TEXT}">${label}</text>
      </g>`;
    })
    .join("");

  const connectorsIn = rows
    .map(
      (y, i) =>
        `<path d="M${inX + 90} ${y} C ${inX + 160} ${y}, ${coreX - 70} ${360}, ${coreX - 4} 360" fill="none" stroke="${pal.main}" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="5 7"><animate attributeName="stroke-dashoffset" from="24" to="0" dur="${round(1.6 + i * 0.2)}s" repeatCount="indefinite"/></path>`,
    )
    .join("");

  const coreRows = ["Intake", "Reason", "Act"]
    .map(
      (t, i) =>
        `<g transform="translate(0 ${-34 + i * 34})">
          <rect x="18" y="0" width="${coreW - 36}" height="26" rx="7" fill="rgba(255,255,255,0.04)" stroke="${LINE}"/>
          <circle cx="34" cy="13" r="4" fill="${pal.soft}"/>
          <text x="48" y="18" font-family="ui-monospace,monospace" font-size="13" fill="${TEXT}">${t}</text>
        </g>`,
    )
    .join("");

  const outNodes = [260, 360, 460]
    .map((y, i) => {
      const label = project.io[i] ?? ["CRM", "Data", "Notify"][i];
      return `<g transform="translate(${outX} ${y})">
        <rect x="-92" y="-24" width="184" height="48" rx="12" fill="${PANEL}" stroke="${LINE}"/>
        <text x="-70" y="5" font-family="ui-monospace,monospace" font-size="15" fill="${TEXT}">${label}</text>
        <circle cx="72" cy="0" r="5" fill="${pal.main}"/>
      </g>`;
    })
    .join("");

  const connectorsOut = [260, 360, 460]
    .map(
      (y, i) =>
        `<path d="M${coreX + coreW} 360 C ${coreX + coreW + 70} 360, ${outX - 160} ${y}, ${outX - 92} ${y}" fill="none" stroke="${pal.main}" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="5 7"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="${round(1.7 + i * 0.2)}s" repeatCount="indefinite"/></path>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${defs(pal, id)}
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${id})"/>
  <g font-family="ui-monospace,monospace">
    <text x="64" y="74" font-size="13" letter-spacing="3" fill="${pal.soft}">${project.tag}</text>
    <text x="64" y="104" font-size="13" letter-spacing="2" fill="${MUTE}">SYSTEM ARCHITECTURE</text>
  </g>
  ${connectorsIn}
  ${connectorsOut}
  ${inNodes}
  <g transform="translate(${coreX} 360)">
    <rect x="0" y="-96" width="${coreW}" height="192" rx="18" fill="${PANEL}" stroke="${pal.main}" stroke-opacity="0.4"/>
    <rect x="0" y="-96" width="${coreW}" height="34" rx="18" fill="${pal.faint}" fill-opacity="0.5"/>
    <text x="18" y="-74" font-family="ui-monospace,monospace" font-size="12" letter-spacing="2" fill="${pal.soft}">ORCHESTRATION</text>
    ${coreRows}
  </g>
  ${outNodes}
  <g font-family="ui-monospace,monospace">
    <text x="64" y="668" font-size="12" letter-spacing="2" fill="${MUTE}">LOGGING · EVALUATION · HUMAN REVIEW</text>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="rgba(255,255,255,0.08)"/>
</svg>`;
}

/** Browser/app chrome header shared by every shot. */
function chrome(W, title, pal) {
  return `<rect width="${W}" height="46" fill="${PANEL}"/>
  <circle cx="26" cy="23" r="5" fill="rgba(255,255,255,0.18)"/>
  <circle cx="46" cy="23" r="5" fill="rgba(255,255,255,0.18)"/>
  <circle cx="66" cy="23" r="5" fill="rgba(255,255,255,0.18)"/>
  <rect x="96" y="13" width="${W - 200}" height="20" rx="10" fill="rgba(255,255,255,0.04)"/>
  <text x="112" y="27" font-family="ui-monospace,monospace" font-size="12" fill="${MUTE}">${title}</text>
  <line x1="0" y1="46" x2="${W}" y2="46" stroke="${LINE}"/>`;
}

/** Shot 1 — a records / list view with a sidebar. */
function shotList(project) {
  const pal = PALETTES[project.accent];
  const id = `${project.slug}-1`;
  const rand = rng(id);
  const W = 1280;
  const H = 720;

  const rowsHtml = Array.from({ length: 7 }, (_, i) => {
    const y = 150 + i * 62;
    const w1 = 120 + Math.floor(rand() * 120);
    const w2 = 60 + Math.floor(rand() * 80);
    const on = rand() > 0.55;
    return `<g transform="translate(300 ${y})">
      <rect x="0" y="0" width="${W - 360}" height="48" rx="10" fill="rgba(255,255,255,0.02)" stroke="${LINE}"/>
      <circle cx="30" cy="24" r="12" fill="${pal.faint}"/>
      <text x="24" y="28" font-family="ui-sans-serif,system-ui" font-size="12" fill="${pal.soft}">${String.fromCharCode(65 + i)}</text>
      <rect x="56" y="14" width="${w1}" height="9" rx="4" fill="rgba(255,255,255,0.22)"/>
      <rect x="56" y="29" width="${w1 - 40}" height="7" rx="3" fill="rgba(255,255,255,0.10)"/>
      <rect x="${W - 560}" y="18" width="${w2}" height="12" rx="6" fill="${on ? pal.main : "rgba(255,255,255,0.10)"}" fill-opacity="${on ? "0.35" : "1"}"/>
      <rect x="${W - 460}" y="18" width="44" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
    </g>`;
  }).join("");

  const nav = Array.from({ length: 5 }, (_, i) => {
    const active = i === 1;
    return `<g transform="translate(24 ${150 + i * 46})">
      <rect x="0" y="0" width="228" height="34" rx="9" fill="${active ? pal.faint : "transparent"}" fill-opacity="${active ? "0.55" : "1"}"/>
      <rect x="16" y="12" width="14" height="10" rx="3" fill="${active ? pal.soft : "rgba(255,255,255,0.28)"}"/>
      <rect x="42" y="13" width="${90 + i * 12}" height="8" rx="4" fill="${active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)"}"/>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${defs(pal, id)}
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  ${chrome(W, `${project.slug} · records`, pal)}
  <rect x="0" y="46" width="276" height="${H - 46}" fill="rgba(255,255,255,0.015)"/>
  <line x1="276" y1="46" x2="276" y2="${H}" stroke="${LINE}"/>
  <text x="24" y="104" font-family="ui-sans-serif,system-ui" font-size="15" fill="${TEXT}">Workspace</text>
  ${nav}
  <text x="300" y="104" font-family="ui-sans-serif,system-ui" font-size="20" fill="rgba(255,255,255,0.85)" font-weight="600">Records</text>
  <rect x="${W - 220}" y="86" width="120" height="30" rx="8" fill="url(#edge-${id})" fill-opacity="0.85"/>
  <text x="${W - 196}" y="106" font-family="ui-sans-serif,system-ui" font-size="12" fill="#fff">+ New</text>
  ${rowsHtml}
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="rgba(255,255,255,0.08)"/>
</svg>`;
}

/** Shot 2 — an analytics dashboard with KPI tiles and a bar chart. */
function shotDashboard(project) {
  const pal = PALETTES[project.accent];
  const id = `${project.slug}-2`;
  const rand = rng(id);
  const W = 1280;
  const H = 720;

  const tiles = Array.from({ length: 4 }, (_, i) => {
    const x = 40 + i * 300;
    return `<g transform="translate(${x} 90)">
      <rect width="272" height="120" rx="14" fill="${PANEL}" stroke="${LINE}"/>
      <rect x="20" y="22" width="90" height="8" rx="4" fill="rgba(255,255,255,0.20)"/>
      <text x="20" y="76" font-family="ui-sans-serif,system-ui" font-size="30" font-weight="700" fill="#fff">${["68%", "24/7", "3.4×", "1.2k"][i]}</text>
      <rect x="20" y="92" width="${70 + Math.floor(rand() * 60)}" height="7" rx="3" fill="${pal.main}" fill-opacity="0.4"/>
    </g>`;
  }).join("");

  const barCount = 12;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const bx = 72 + i * 62;
    const h = 40 + Math.floor(rand() * 190);
    const y = 560 - h;
    return `<rect x="${bx}" y="${y}" width="34" height="${h}" rx="6" fill="url(#edge-${id})" fill-opacity="${round(0.5 + rand() * 0.4)}"/>`;
  }).join("");

  // A trend line across the chart panel.
  let d = "";
  for (let i = 0; i < barCount; i++) {
    const x = 89 + i * 62;
    const y = 430 - Math.floor(rand() * 150);
    d += `${i === 0 ? "M" : "L"}${x} ${y} `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${defs(pal, id)}
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  ${chrome(W, `${project.slug} · analytics`, pal)}
  <text x="40" y="78" font-family="ui-sans-serif,system-ui" font-size="13" letter-spacing="2" fill="${pal.soft}">OVERVIEW</text>
  ${tiles}
  <g transform="translate(40 250)">
    <rect width="${W - 80}" height="380" rx="16" fill="${PANEL}" stroke="${LINE}"/>
    <text x="28" y="44" font-family="ui-sans-serif,system-ui" font-size="15" fill="${TEXT}">Throughput</text>
    <line x1="28" y1="312" x2="${W - 108}" y2="312" stroke="${LINE}"/>
    ${bars}
    <path d="${d}" fill="none" stroke="${pal.soft}" stroke-width="2.5" stroke-linejoin="round" opacity="0.9"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="rgba(255,255,255,0.08)"/>
</svg>`;
}

/** Shot 3 — a detail / pipeline timeline view. */
function shotDetail(project) {
  const pal = PALETTES[project.accent];
  const id = `${project.slug}-3`;
  const rand = rng(id);
  const W = 1280;
  const H = 720;

  const steps = ["Received", "Processing", "Enriched", "Delivered"];
  const stepsHtml = steps
    .map((s, i) => {
      const x = 120 + i * 300;
      const done = i < 3;
      return `<g transform="translate(${x} 210)">
        ${i < steps.length - 1 ? `<line x1="26" y1="0" x2="274" y2="0" stroke="${done ? pal.main : LINE}" stroke-opacity="${done ? "0.5" : "1"}" stroke-width="2" stroke-dasharray="4 6"/>` : ""}
        <circle cx="0" cy="0" r="16" fill="${done ? pal.main : PANEL}" fill-opacity="${done ? "0.9" : "1"}" stroke="${done ? pal.main : LINE}"/>
        ${done ? `<path d="M-6 0 l4 4 l8 -9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : `<circle cx="0" cy="0" r="4" fill="${MUTE}"/>`}
        <text x="-8" y="44" font-family="ui-sans-serif,system-ui" font-size="13" fill="${done ? TEXT : MUTE}">${s}</text>
      </g>`;
    })
    .join("");

  const logRows = Array.from({ length: 6 }, (_, i) => {
    const y = 348 + i * 52;
    const w = 300 + Math.floor(rand() * 480);
    return `<g transform="translate(40 ${y})" font-family="ui-monospace,monospace">
      <text x="0" y="14" font-size="12" fill="${pal.soft}">${String(i + 1).padStart(2, "0")}</text>
      <rect x="40" y="4" width="70" height="14" rx="4" fill="${pal.faint}" fill-opacity="0.7"/>
      <rect x="124" y="5" width="${w}" height="10" rx="4" fill="rgba(255,255,255,0.12)"/>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${defs(pal, id)}
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  ${chrome(W, `${project.slug} · pipeline`, pal)}
  <text x="40" y="100" font-family="ui-sans-serif,system-ui" font-size="20" font-weight="600" fill="rgba(255,255,255,0.88)">Request lifecycle</text>
  <text x="40" y="128" font-family="ui-monospace,monospace" font-size="12" fill="${MUTE}">traced end to end</text>
  ${stepsHtml}
  <line x1="40" y1="316" x2="${W - 40}" y2="316" stroke="${LINE}"/>
  ${logRows}
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="rgba(255,255,255,0.08)"/>
</svg>`;
}

function main() {
  let count = 0;
  for (const project of PROJECTS) {
    const dir = resolve(OUT, project.slug);
    mkdirSync(dir, { recursive: true });

    const files = {
      "cover.svg": cover(project),
      "shot-1.svg": shotList(project),
      "shot-2.svg": shotDashboard(project),
      "shot-3.svg": shotDetail(project),
    };

    for (const [name, svg] of Object.entries(files)) {
      writeFileSync(resolve(dir, name), svg.trim() + "\n", "utf8");
      count++;
    }
    process.stdout.write(`  ✓ ${project.slug} (4 files)\n`);
  }
  process.stdout.write(`\nGenerated ${count} SVG files across ${PROJECTS.length} projects.\n`);
}

main();


