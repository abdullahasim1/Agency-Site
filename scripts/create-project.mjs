#!/usr/bin/env node
/**
 * Developer CLI: Create a new project scaffold in seconds.
 *
 * Usage:
 *   npm run new:project
 *   npm run new:project "Project Title"
 *   npm run new:project "Project Title" "AI / Automation"
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

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

async function main() {
  const args = process.argv.slice(2);
  let title = args[0];
  let category = args[1];

  if (!title) {
    const rl = readline.createInterface({ input, output });
    try {
      title = await rl.question("📌 Project Title (e.g. Acme AI Flow): ");
      if (!title || !title.trim()) {
        console.error("❌ Project title cannot be empty.");
        process.exit(1);
      }
      if (!category) {
        const catInput = await rl.question(
          "🏷️  Category (Press Enter for 'AI / Automation'): ",
        );
        category = catInput.trim() || "AI / Automation";
      }
    } finally {
      rl.close();
    }
  }

  title = title.trim();
  category = (category || "AI / Automation").trim();
  const slug = slugify(title);

  if (!slug) {
    console.error("❌ Invalid title: could not generate a valid URL slug.");
    process.exit(1);
  }

  const projectDir = resolve(ROOT, "src/content/projects", slug);
  const projectFile = resolve(projectDir, "index.json");
  const templateFile = resolve(
    ROOT,
    "src/content/projects/sample-template.json",
  );
  const imagesDir = resolve(ROOT, "public/images/projects", slug);

  if (existsSync(projectFile)) {
    console.error(`❌ Project already exists at: ${projectFile}`);
    process.exit(1);
  }

  let templateData = {};
  if (existsSync(templateFile)) {
    try {
      templateData = JSON.parse(readFileSync(templateFile, "utf-8"));
    } catch (err) {
      console.warn(
        "⚠️ Could not parse sample-template.json, using fallback defaults.",
        err,
      );
    }
  }

  const newProject = {
    ...templateData,
    title,
    basics: {
      ...(templateData.basics || {}),
      id: `prj-${slug}`,
      tagline:
        templateData.basics?.tagline || `Innovative ${category} solution`,
    },
    category,
    categories: category
      .split("/")
      .map((c) => c.trim())
      .filter(Boolean),
    overview: {
      ...(templateData.overview || {}),
      year: new Date().getFullYear().toString(),
      industry: category,
    },
    featured: false,
    order: 100,
  };

  mkdirSync(projectDir, { recursive: true });
  writeFileSync(
    projectFile,
    JSON.stringify(newProject, null, 2) + "\n",
    "utf-8",
  );
  mkdirSync(imagesDir, { recursive: true });

  console.log("\n🚀 Project created successfully!");
  console.log(`📁 JSON Data:  src/content/projects/${slug}/index.json`);
  console.log(`🖼️  Images Dir: public/images/projects/${slug}/\n`);
  console.log("💡 Next steps:");
  console.log(
    `  1. Drop your cover image into 'public/images/projects/${slug}/'`,
  );
  console.log(`     (name it 'cover.png' / 'cover.jpg' / 'hero.png')`);
  console.log(
    "  2. Open Keystatic CMS: npm run dev -> http://localhost:3000/keystatic",
  );
  console.log(
    `     Your new project is already listed under '🚀 Main Collections -> Projects'!`,
  );
  console.log(
    "  3. Or edit the JSON file directly or with ChatGPT/Claude prompt template in:",
  );
  console.log("     src/content/projects/ai-prompt-template.md");
  console.log(
    "  4. Auto-download tech logos for any new technologies: npm run fetch:logos\n",
  );
}

main().catch((err) => {
  console.error("❌ Failed to create project:", err);
  process.exit(1);
});
