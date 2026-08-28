/**
 * Shared validation patterns.
 *
 * Extracted here so both server-side (enquiry.ts) and client-side
 * (ContactForm.tsx) use the same regex without either pulling in the
 * other's dependencies (e.g. nodemailer).
 */

/** Deliberately permissive: rejecting a valid address is worse than accepting a bad one. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
