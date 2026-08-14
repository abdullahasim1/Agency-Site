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

function enquiryEmail(payload: ContactPayload): { text: string; html: string } {
  const field = (label: string, value: string) => `
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(label)}</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${escapeHtml(value) || '<span style="color:#9ca3af;font-weight:400;">—</span>'}</p>
              </td>
            </tr>
          </table>
        </td>`;

  const badge = (label: string, value: string) => `
        <td style="padding:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;width:100%;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(label)}</p>
                <span style="display:inline-block;margin:0;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:600;color:#5b21b6;background-color:#ede9fe;">${escapeHtml(value) || "—"}</span>
              </td>
            </tr>
          </table>
        </td>`;

  const initials = payload.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  const text = [
    `New enquiry from ${payload.fullName}`,
    `Date: ${new Date().toLocaleString()}`,
    "",
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Company: ${payload.company}`,
    `Project type: ${payload.projectType}`,
    `Budget: ${payload.budget}`,
    "",
    "Message:",
    payload.message,
    "",
    `Reply to: ${payload.email}`,
  ].join("\n");

  const html = `
  <div style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background-color:#111827;background-image:linear-gradient(135deg,#8b5cf6 0%,#22d3ee 100%);padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color:rgba(255,255,255,0.16);border-radius:10px;padding:8px 14px;">
                        <span style="font-size:16px;font-weight:800;color:#ffffff;letter-spacing:0.02em;">thedevrox<span style="opacity:0.7;">.</span></span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td align="right" style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:0.12em;text-transform:uppercase;vertical-align:middle;">New enquiry</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 10px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:56px;height:56px;border-radius:50%;background-color:#8b5cf6;color:#ffffff;font-size:20px;font-weight:700;text-align:center;vertical-align:middle;">${escapeHtml(initials || "?")}</td>
                <td style="padding-left:16px;vertical-align:middle;">
                  <h1 style="margin:0 0 4px;font-size:22px;color:#111827;font-weight:700;">New enquiry</h1>
                  <p style="margin:0;font-size:13px;color:#9ca3af;">${new Date().toLocaleString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 6px 12px 0;">${field("Name", payload.fullName)}</td>
                <td style="padding:0 0 12px 6px;">${field("Email", payload.email)}</td>
              </tr>
              <tr>
                <td style="padding:0 6px 12px 0;">${field("Phone", payload.phone)}</td>
                <td style="padding:0 0 12px 6px;">${field("Company", payload.company)}</td>
              </tr>
              <tr>
                <td style="padding:0 6px 0 0;">${badge("Project type", payload.projectType)}</td>
                <td style="padding:0 0 0 6px;">${badge("Budget", payload.budget)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:18px 22px;">
              <p style="margin:0 0 8px;font-size:11px;color:#6b7280;letter-spacing:0.08em;text-transform:uppercase;">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.65;color:#111827;white-space:pre-line;">${escapeHtml(payload.message)}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#111827;background-image:linear-gradient(135deg,#8b5cf6 0%,#22d3ee 100%);border-radius:999px;padding:12px 24px;">
                  <a href="mailto:${escapeHtml(payload.email)}" style="display:inline-block;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Reply to ${escapeHtml(payload.email)}</a>
                </td>
              </tr>
            </table>
            <p style="margin:18px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">This enquiry came from the contact form on <span style="color:#6b7280;font-weight:600;">thedevrox.com</span></p>
          </td>
        </tr>
      </table>
    </div>
  </div>`;

  return { text, html };
}

async function deliver(payload: ContactPayload): Promise<void> {
  const enquiryId = randomUUID();

  if (!mailTransport) {
    console.error("[contact] SMTP not configured — set SMTP_USER and SMTP_PASSWORD");
    throw new Error("SMTP not configured");
  }

  const { text, html } = enquiryEmail(payload);

  await mailTransport.sendMail({
    from: smtpConfig.user,
    to: smtpConfig.inbox,
    replyTo: payload.email,
    subject: `New enquiry from ${payload.fullName} — ${payload.projectType}`,
    text,
    html,
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