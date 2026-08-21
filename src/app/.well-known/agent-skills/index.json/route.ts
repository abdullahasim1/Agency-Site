import { NextResponse } from "next/server";

import { siteConfig } from "@/data/site";
import { createHash } from "node:crypto";

/**
 * Agent Skills Discovery Index — per Agent Skills Discovery RFC v0.2.0.
 * Lists locally hosted skill artifacts (SKILL.md files) with SHA-256 digests.
 */

async function sha256OfPath(path: string): Promise<string> {
  const res = await fetch(new URL(path, siteConfig.url).toString());
  if (!res.ok) return "";
  const text = await res.text();
  return "sha256:" + createHash("sha256").update(text).digest("hex");
}

export async function GET(): Promise<Response> {
  const base = siteConfig.url;

  const skills = [
    {
      name: "portfolio",
      type: "skill-md",
      description: "Browse DevRox's portfolio of AI, automation and software engineering projects.",
      url: `${base}/.well-known/agent-skills/portfolio.md`,
      digest: await sha256OfPath("/.well-known/agent-skills/portfolio.md"),
    },
    {
      name: "contact",
      type: "skill-md",
      description: "Submit a project enquiry to DevRox on behalf of a user.",
      url: `${base}/.well-known/agent-skills/contact.md`,
      digest: await sha256OfPath("/.well-known/agent-skills/contact.md"),
    },
  ];

  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills,
  };

  return new NextResponse(JSON.stringify(index, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}