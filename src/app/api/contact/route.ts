import { NextResponse } from "next/server";

/**
 * Contact form endpoint — INTEGRATION POINT.
 *
 * It currently validates the payload and logs it server-side, then returns 200
 * so the UI can be exercised end to end. Replace the `deliver` function with a
 * real destination (transactional email, CRM, webhook) and the rest of the
 * route, including validation and the response shape, stays as it is.
 *
 * Suggested env vars for whichever provider is chosen:
 *   CONTACT_INBOX_EMAIL, RESEND_API_KEY / SENDGRID_API_KEY, CRM_WEBHOOK_URL
 */

interface ContactPayload {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  const data: ContactPayload = {
    fullName: read("fullName"),
    email: read("email"),
    company: read("company"),
    phone: read("phone"),
    projectType: read("projectType"),
    budget: read("budget"),
    message: read("message"),
  };

  const errors: Record<string, string> = {};
  if (data.fullName.length < 2) errors.fullName = "Full name is required.";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "A valid email is required.";
  if (data.projectType === "") errors.projectType = "Project type is required.";
  if (data.message.length < 20) errors.message = "Message is too short.";

  return Object.keys(errors).length > 0 ? { errors } : { data };
}

/** Swap this for the real destination. Throw to signal a delivery failure. */
async function deliver(payload: ContactPayload): Promise<void> {
  console.info("[contact] new enquiry", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
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
