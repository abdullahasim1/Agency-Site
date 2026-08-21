---
name: portfolio
type: skill-md
description: Browse DevRox's portfolio of AI, automation and software engineering projects. Returns project metadata (title, tagline, category, technologies, short description, case study URL).
url: /.well-known/agent-skills/portfolio.md
---

# Skill: DevRox Portfolio

## Overview
This skill allows an agent to retrieve a structured list of DevRox's completed projects, suitable for answering questions like "What projects has DevRox done?" or "Show me DevRox's AI case studies."

## Inputs
None — this skill requires no parameters. The agent simply invokes it to get the current portfolio snapshot.

## Output
A JSON array of project objects, each containing:
- `title` (string): Project name
- `tagline` (string): One-line summary
- `category` (string): Human-readable category (e.g., "AI / Automation / Multi-Agent")
- `technologies` (string[]): Technology badges
- `shortDescription` (string): 1-2 sentence overview
- `caseStudyUrl` (string): Absolute URL to the full case study

## Invocation
Agents should call this skill when a user asks about DevRox's past work, case studies, or project examples. No user-facing parameters are needed; the skill returns the full current portfolio.

## Example Response
```json
[
  {
    "title": "RecruitFlow",
    "tagline": "Job Posting, Applicant Tracking & Interview Scheduling",
    "category": "Web Application",
    "technologies": ["Next.js", "TypeScript", "Tailwind CSS", "Formik", "Recharts"],
    "shortDescription": "An internal recruitment frontend with separate admin and candidate workspaces...",
    "caseStudyUrl": "https://thedevrox.com/portfolio/recruitflow"
  },
  ...
]
```

## Notes
- The portfolio is updated automatically when new case studies are published.
- Each project includes a `caseStudyUrl` linking to the full human-readable case study with challenge, solution, results and technical details.
- Technologies are returned as an array of strings matching the badges shown on the site.

## Registration
No registration required — this is a public read-only skill.