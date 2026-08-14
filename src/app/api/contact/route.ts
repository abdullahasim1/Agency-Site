import { randomUUID } from "node:crypto";

import { createTransport } from "nodemailer";

import { NextResponse } from "next/server";

/**
 * Contact form endpoint — delivers enquiries by email over SMTP (Zoho Mail
 * defaults, overridable).
 *
 * Env vars:
 *   SMTP_HOST           default smtp.zoho.com
 *   SMTP_PORT           default 465 (SSL); use 587 for STARTTLS
 *   SMTP_USER           the sending mailbox, e.g. hello@thedevrox.com
 *   SMTP_PASSWORD       mailbox password or app-specific password
 *   CONTACT_INBOX_EMAIL where enquiries are delivered (defaults to SMTP_USER)
 *
 * If SMTP_USER/SMTP_PASSWORD are missing the route fails loudly (502) so a
 * misconfigured deploy is obvious instead of silently logging.
 *
 * Hardening built in:
 *  - Honeypot: a hidden `website` field real humans never fill; bots that do
 *    are silently dropped with a success response.
 *  - Rate limit: per-IP sliding window, in-memory. Good enough for this
 *    traffic; move to Upstash/Redis if the site grows.
 *  - Size caps: per-field max lengths and a request-body ceiling, so a bot
 *    cannot push unbounded data through `request.json()`.
 *  - No PII in logs: delivery logs an opaque id only.
 *  - CR/LF stripped from every field, so email headers cannot be injected.
 *  - All user values HTML-escaped before they go into the email body.
 */

interface ContactPayload {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot. Humans never see it; bots auto-fill it. */
  website: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Per-field upper bounds, mirroring what the UI would ever legitimately send. */
const MAX_LENGTHS: Record<keyof Omit<ContactPayload, "website">, number> = {
  fullName: 100,
  email: 254,
  company: 120,
  phone: 30,
  projectType: 60,
  budget: 60,
  message: 5000,
};

/** Reject bodies bigger than this before they are parsed. */
const MAX_BODY_BYTES = 20_000;

/* ---------------------------------------------------------------------------
   Rate limiting — in-memory sliding window, keyed by client IP.
   One instance only; restarting resets counters, which is acceptable here.
--------------------------------------------------------------------------- */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_PRUNE_AT = 10_000;

const submissions = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (submissions.size > RATE_LIMIT_PRUNE_AT) {
    for (const [key, times] of submissions) {
      if (times[times.length - 1] < now - RATE_LIMIT_WINDOW_MS) {
        submissions.delete(key);
      }
    }
  }

  const times = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (times.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, times);
    return true;
  }

  times.push(now);
  submissions.set(ip, times);
  return false;
}

/** Server-side validation. The client cannot be trusted to have run its own. */
function validate(body: unknown): {
  data?: ContactPayload;
  errors?: Record<string, string>;
} {
  if (typeof body !== "object" || body === null) {
    return { errors: { body: "Expected a JSON object." } };
  }

  const raw = body as Record<string, unknown>;
  const read = (key: keyof ContactPayload) =>
    typeof raw[key] === "string"
      ? raw[key].trim().replace(/[\r\n]/g, " ")
      : "";

  const data: ContactPayload = {
    fullName: read("fullName"),
    email: read("email"),
    company: read("company"),
    phone: read("phone"),
    projectType: read("projectType"),
    budget: read("budget"),
    message: read("message"),
    website: read("website"),
  };

  const errors: Record<string, string> = {};
  if (data.fullName.length < 2) errors.fullName = "Full name is required.";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "A valid email is required.";
  if (data.projectType === "") errors.projectType = "Project type is required.";
  if (data.message.length < 20) errors.message = "Message is too short.";

  for (const [key, limit] of Object.entries(MAX_LENGTHS) as [
    keyof typeof MAX_LENGTHS,
    number,
  ][]) {
    if (data[key].length > limit) {
      errors[key] = `Too long — at most ${limit} characters.`;
    }
  }

  return Object.keys(errors).length > 0 ? { errors } : { data };
}

/** Swap this for the real destination. Throw to signal a delivery failure. */
const smtpConfig = {
  host: process.env.SMTP_HOST ?? "smtp.zoho.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "",
  pass: process.env.SMTP_PASSWORD ?? "",
  inbox: process.env.CONTACT_INBOX_EMAIL ?? process.env.SMTP_USER ?? "",
};

const mailTransport =
  smtpConfig.user && smtpConfig.pass
    ? createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        auth: { user: smtpConfig.user, pass: smtpConfig.pass },
      })
    : null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function deliver(payload: ContactPayload): Promise<void> {
  const enquiryId = randomUUID();

  if (!mailTransport) {
    console.error("[contact] SMTP not configured — set SMTP_USER and SMTP_PASSWORD");
    throw new Error("SMTP not configured");
  }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px;font-weight:600;vertical-align:top;white-space:nowrap;border-bottom:1px solid #eee;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
    </tr>`;

  const text = [
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company}`,
    `Phone: ${payload.phone}`,
    `Project type: ${payload.projectType}`,
    `Budget: ${payload.budget}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  await mailTransport.sendMail({
    from: smtpConfig.user,
    to: smtpConfig.inbox,
    replyTo: payload.email,
    subject: `New enquiry from ${payload.fullName} — ${payload.projectType}`,
    text,
    html: `
      <table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
        ${row("Name", payload.fullName)}
        ${row("Email", payload.email)}
        ${row("Company", payload.company)}
        ${row("Phone", payload.phone)}
        ${row("Project type", payload.projectType)}
        ${row("Budget", payload.budget)}
        <tr>
          <td style="padding:8px 12px;font-weight:600;vertical-align:top;border-bottom:1px solid #eee;">Message</td>
          <td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${escapeHtml(payload.message).replace(/\n/g, "<br>")}</td>
        </tr>
      </table>`,
  });

  console.info("[contact] enquiry delivered", { enquiryId });
}

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, message: "Too many requests — try again later." },
      { status: 429 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, message: "Request body too large." },
      { status: 413 },
    );
  }

  let body: unknown;

  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, message: "Request body too large." },
        { status: 413 },
      );
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { data, errors } = validate(body);

  if (errors || !data) {
    return NextResponse.json(
      { ok: false, message: "Validation failed.", errors },
      { status: 422 },
    );
  }

  // Honeypot tripped: act as if everything worked, drop the payload silently.
  if (data.website !== "") {
    console.warn("[contact] honeypot tripped — submission dropped");
    return NextResponse.json({ ok: true, message: "Enquiry received." });
  }

  try {
    await deliver(data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not deliver the enquiry." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Enquiry received." });
}