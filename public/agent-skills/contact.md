---
name: contact
type: skill-md
description: Submit a project enquiry to DevRox on behalf of a user. Validates required fields and delivers the message to the DevRox inbox.
url: /.well-known/agent-skills/contact.md
---

# Skill: DevRox Contact Enquiry

## Overview
This skill allows an agent to submit a project enquiry to DevRox via the contact form API. Use when a user expresses interest in working with DevRox or wants to start a conversation about a project.

## Inputs (all required unless noted)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | Yes | User's full name |
| `email` | string (email) | Yes | Business email for reply |
| `company` | string | No | Company or organisation name |
| `phone` | string | No | Phone number |
| `projectType` | string | Yes | Type of project (e.g., "AI agent", "process automation", "voice system", "web application") |
| `budget` | string | No | Indicative budget range (e.g., "$20k–$50k", "monthly retainer") |
| `message` | string | Yes | Detailed description of the problem, goals, existing systems, timeline |

## Output
On success, returns:
```json
{ "ok": true, "message": "Enquiry received." }
```

On validation failure (422):
```json
{ "ok": false, "message": "Validation failed.", "errors": { "email": "A valid email is required." } }
```

On rate limit (429):
```json
{ "ok": false, "message": "Too many requests — try again later." }
```

## Invocation
Agents should invoke this skill when a user clearly wants to contact DevRox for a project. The agent must collect all required fields before invoking.

## Rate Limits
- 5 requests per 10-minute sliding window per IP.
- A honeypot `website` field must be empty (agents must omit or send empty string).

## Notes
- The API is public and requires no authentication.
- Submissions are delivered to the DevRox inbox via SMTP.
- A confirmation email is not sent to the user; DevRox replies within one business day.
- Use this skill only when the user has provided all required information. Do not hallucinate or guess fields.

## Registration
No registration required — public endpoint.