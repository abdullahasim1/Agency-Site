import { randomUUID } from "node:crypto";

import { createTransport } from "nodemailer";

/**
 * Shared enquiry pipeline for /api/contact and the MCP submit_enquiry tool.
 *
 * Both entry points validate and deliver through this module so their rules
 * can never drift apart. It also matters for rate limiting: the MCP route used
 * to re-POST to /api/contact over HTTP, and on Vercel that self-request
 * arrives with an internal egress IP — every MCP enquiry shared one rate-limit
 * bucket, so five submissions in ten minutes locked out the tool globally.
 * Delivering directly keys the limit on each caller's real client IP.
 *
 * Hardening (mirrored by both callers):
 *  - Honeypot: a hidden `website` field real humans never fill; bots that do
 *    are silently dropped with a success response.
 *  - Rate limit: per-IP sliding window, in-memory. Good enough for this
 *    traffic; move to Upstash/Redis if the site grows.
 *  - CR/LF stripped from every field, so email headers cannot be injected.
 *  - All user values HTML-escaped before they go into the email body.
 *  - No PII in logs: delivery logs an opaque id only.
 *
 * Env vars:
 *   SMTP_HOST           default smtp.zoho.com
 *   SMTP_PORT           default 465 (SSL); use 587 for STARTTLS
 *   SMTP_USER           the sending mailbox, e.g. hello@thedevrox.com
 *   SMTP_PASSWORD       mailbox password or app-specific password
 *   CONTACT_INBOX_EMAIL where enquiries are delivered (defaults to SMTP_USER)
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

import { EMAIL_PATTERN } from "@/lib/validation";

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

/* ---------------------------------------------------------------------------
   Rate limiting — in-memory sliding window, keyed by client IP.
   One instance only; restarting resets counters, which is acceptable here.
--------------------------------------------------------------------------- */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_PRUNE_AT = 10_000;

const submissions = new Map<string, number[]>();

/** Best-effort client identity behind proxies; "unknown" collapses to one bucket. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function isRateLimited(ip: string): boolean {
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
export function validate(body: unknown): {
  data?: ContactPayload;
  errors?: Record<string, string>;
} {
  if (typeof body !== "object" || body === null) {
    return { errors: { body: "Expected a JSON object." } };
  }

  const raw = body as Record<string, unknown>;
  const read = (key: keyof ContactPayload) =>
    typeof raw[key] === "string"
      ? (raw[key] as string).trim().replace(/[\r\n]/g, " ")
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
  const detail = (label: string, value: string) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eef0f3;vertical-align:top;white-space:nowrap;color:#64748b;font-size:13px;">${escapeHtml(label)}</td>
        <td style="padding:12px 0 12px 32px;border-bottom:1px solid #eef0f3;vertical-align:top;color:#0f172a;font-size:14px;line-height:1.5;">${escapeHtml(value) || '<span style="color:#cbd5e1;">—</span>'}</td>
      </tr>`;

  const text = [
    "New Enquiry",
    `A new enquiry was submitted via the contact form on thedevrox.com.`,
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
  <div style="margin:0;padding:0;background-color:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e8ec;">
        <tr>
          <td style="background-color:#0f172a;padding:3px 0;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:28px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:18px;font-weight:700;color:#0f172a;letter-spacing:0.01em;">thedevrox</td>
                <td align="right" style="font-size:11px;color:#94a3b8;letter-spacing:0.14em;text-transform:uppercase;vertical-align:middle;">Contact form enquiry</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px 0;">
            <h1 style="margin:0 0 6px;font-size:24px;color:#0f172a;font-weight:700;">New Enquiry</h1>
            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">A new enquiry was submitted via the contact form on <span style="color:#0f172a;font-weight:600;">thedevrox.com</span>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${detail("Name", payload.fullName)}
              ${detail("Email", payload.email)}
              ${detail("Phone", payload.phone)}
              ${detail("Company", payload.company)}
              ${detail("Project type", payload.projectType)}
              ${detail("Budget", payload.budget)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 0;">
            <p style="margin:0 0 10px;font-size:11px;color:#64748b;letter-spacing:0.14em;text-transform:uppercase;">Message</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;white-space:pre-line;">${escapeHtml(payload.message)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#0f172a;border-radius:4px;">
                  <a href="mailto:${escapeHtml(payload.email)}" style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">Reply to ${escapeHtml(payload.email)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:0 0 4px 4px;margin-top:-1px;">
        <tr>
          <td style="padding:18px 36px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.8;">
            thedevrox.com &nbsp;·&nbsp; hello@thedevrox.com
          </td>
        </tr>
      </table>
    </div>
  </div>`;

  return { text, html };
}

/**
 * Delivers a validated payload. Throws on any failure so callers decide how
 * to surface it (HTTP status or JSON-RPC error).
 */
export async function deliver(payload: ContactPayload): Promise<void> {
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
