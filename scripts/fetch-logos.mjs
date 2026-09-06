#!/usr/bin/env node
/**
 * Automated Tech & Client Logo Downloader
 *
 * Scans projects, technologies, and clients.
 * Automatically fetches and downloads missing logos from:
 * 1. Simple Icons CDN (https://cdn.simpleicons.org/<slug>)
 * 2. High-res Google Favicons (https://www.google.com/s2/favicons?domain=<domain>&sz=128)
 *
 * Saves assets into /public/logos/, registers them in src/data/tech-logos.ts,
 * and refreshes the asset manifest.
 *
 * Usage:
 *   node scripts/fetch-logos.mjs
 *   node scripts/fetch-logos.mjs "Pinecone"
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LOGOS_DIR = resolve(ROOT, "public/logos");

// Curated domain / slug overrides for modern tools & platforms
const BRAND_HINTS = {
  pinecone: { slug: "pinecone", domain: "pinecone.io" },
  "pinecone vector database": { slug: "pinecone", domain: "pinecone.io" },
  prisma: { slug: "prisma" },
  "prisma orm": { slug: "prisma" },
  redux: { slug: "redux" },
  "redux toolkit": { slug: "redux" },
  "react router": { slug: "reactrouter" },
  calendly: { slug: "calendly" },
  "calendly rest api sync": { slug: "calendly" },
  axios: { slug: "axios" },
  "axios client": { slug: "axios" },
  stripe: { slug: "stripe" },
  supabase: { slug: "supabase" },
  postman: { slug: "postman" },
  voiceflow: { domain: "voiceflow.com" },
  "voiceflow conversation design": { domain: "voiceflow.com" },
  chatbase: { domain: "chatbase.co" },
  "chatbase chatbot embed": { domain: "chatbase.co" },
  "retell ai": { domain: "retellai.com" },
  "retell ai chat agents": { domain: "retellai.com" },
  "retell web calls": { domain: "retellai.com" },
  zustand: { domain: "zustand.docs.pmnd.rs" },
  llama: { slug: "meta" },
  "meta llama": { slug: "meta" },
  notion: { slug: "notion" },
  shopify: { slug: "shopify" },
  linear: { slug: "linear" },
  figma: { slug: "figma" },
  drizzle: { slug: "drizzle" },
  "drizzle orm": { slug: "drizzle" },
  shadcn: { slug: "shadcnui" },
  "shadcn ui": { slug: "shadcnui" },
  npm: { slug: "npm" },
  webrtc: { slug: "webrtc" },
  kubernetes: { slug: "kubernetes" },
  turbopack: { slug: "turbopack" },
  sentry: { slug: "sentry" },
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function fetchLogo(techName) {
  const normalized = techName.toLowerCase().trim();
  const hint = BRAND_HINTS[normalized];
  const primarySlug =
    hint?.slug || slugify(techName.replace(/\s*\([^)]*\)\s*/g, ""));
  const primaryDomain = hint?.domain;

  // 1. Try Simple Icons SVG
  if (primarySlug) {
    try {
      const url = `https://cdn.simpleicons.org/${primarySlug}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const text = await res.text();
        if (text.includes("<svg") && text.length > 100) {
          const fileName = `${primarySlug}.svg`;
          const filePath = resolve(LOGOS_DIR, fileName);
          writeFileSync(filePath, text, "utf-8");
          return { path: `/logos/${fileName}`, source: "Simple Icons" };
        }
      }
    } catch {
      // ignore network failure
    }
  }

  // 2. Try Google Favicon if domain is known or inferrable
  const domainToTry =
    primaryDomain ||
    (primarySlug.includes(".") ? primarySlug : `${primarySlug}.com`);
  if (domainToTry) {
    try {
      const url = `https://www.google.com/s2/favicons?domain=${domainToTry}&sz=128`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        // Default Google placeholder is small (< 500 bytes), real 128px logos are usually > 700 bytes
        if (buffer.length > 500) {
          const fileName = `${primarySlug}.png`;
          const filePath = resolve(LOGOS_DIR, fileName);
          writeFileSync(filePath, buffer);
          return { path: `/logos/${fileName}`, source: "Google Favicon" };
        }
      }
    } catch {
      // ignore network failure
    }
  }

  return null;
}

function parseExistingTechLogos() {
  const filePath = resolve(ROOT, "src/data/tech-logos.ts");
  const content = readFileSync(filePath, "utf-8");
  const logos = new Map();

  const match = content.match(
    /const techLogos: Record<string, string> = \{([\s\S]*?)\};/,
  );
  if (match) {
    const lines = match[1].split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*(?:"([^"]+)"|([A-Za-z0-9_.-]+)):\s*"([^"]+)"/);
      if (m) {
        const k = m[1] || m[2];
        logos.set(k, m[3]);
      }
    }
  }

  return { content, logos, filePath };
}

function updateTechLogosFile(newEntries) {
  if (newEntries.length === 0) return;
  const { content, filePath } = parseExistingTechLogos();

  const closingIndex = content.lastIndexOf("};");
  if (closingIndex === -1) return;

  const insertion = newEntries
    .map(
      ({ name, path }) => `  ${JSON.stringify(name)}: ${JSON.stringify(path)},`,
    )
    .join("\n");

  const updatedContent =
    content.slice(0, closingIndex) +
    insertion +
    "\n" +
    content.slice(closingIndex);

  writeFileSync(filePath, updatedContent, "utf-8");
}

async function main() {
  console.log("🔍 Scanning project technologies, content, and clients...");
  mkdirSync(LOGOS_DIR, { recursive: true });

  const specificTarget = process.argv[2]?.trim();
  const allTech = new Set();

  if (specificTarget) {
    allTech.add(specificTarget);
  } else {
    // 1. Projects
    const projectsDir = resolve(ROOT, "src/content/projects");
    if (existsSync(projectsDir)) {
      for (const dir of readdirSync(projectsDir)) {
        const file = resolve(projectsDir, dir, "index.json");
        if (existsSync(file)) {
          try {
            const data = JSON.parse(readFileSync(file, "utf-8"));
            (data.technologies || []).forEach((t) => allTech.add(t));
            (data.techStack || []).forEach((g) =>
              (g.items || []).forEach((t) => allTech.add(t)),
            );
          } catch {
            // ignore parse errors
          }
        }
      }
    }

    // 2. Technologies singleton
    const techFile = resolve(ROOT, "src/content/technologies.json");
    if (existsSync(techFile)) {
      try {
        const data = JSON.parse(readFileSync(techFile, "utf-8"));
        for (const cat of data.categories || []) {
          for (const item of cat.items || []) {
            if (item.name) allTech.add(item.name);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  const { logos } = parseExistingTechLogos();
  const missingTech = [];

  for (const tech of allTech) {
    const existing = logos.get(tech);
    if (
      !existing ||
      !existsSync(resolve(ROOT, "public", existing.replace(/^\//, "")))
    ) {
      missingTech.push(tech);
    }
  }

  console.log(`📊 Found ${allTech.size} total technologies.`);
  console.log(`🎯 Missing logos to resolve: ${missingTech.length}`);

  const newlyAdded = [];

  for (const tech of missingTech) {
    process.stdout.write(`  ⏳ Resolving logo for "${tech}"... `);
    const res = await fetchLogo(tech);
    if (res) {
      console.log(`✅ Downloaded (${res.source}) -> ${res.path}`);
      newlyAdded.push({ name: tech, path: res.path });
    } else {
      console.log(`⏭️  No logo found (will use sleek monogram)`);
    }
  }

  if (newlyAdded.length > 0) {
    console.log(
      `\n💾 Registering ${newlyAdded.length} new logo(s) in src/data/tech-logos.ts...`,
    );
    updateTechLogosFile(newlyAdded);

    console.log("🔄 Refreshing asset manifest...");
    try {
      execSync("node scripts/generate-asset-manifest.mjs", {
        stdio: "inherit",
        cwd: ROOT,
      });
    } catch {
      // ignore
    }
    console.log("✨ All logos updated successfully!\n");
  } else {
    console.log("\n✨ All logos are up to date!\n");
  }
}

main().catch((err) => {
  console.error("❌ Error in fetch-logos script:", err);
  process.exit(1);
});
