/**
 * Navigation structure for the navbar and footer.
 *
 * `as const` keeps each href as a literal type, which satisfies Next's typed
 * routes without needing casts at the call site.
 */

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerCompanyLinks = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * The footer's Services column is derived from the service catalogue itself
 * (see `Footer.tsx`), so it is not listed here — that keeps it in sync with
 * whatever is published in the admin panel.
 *
 * Technology labels in the footer are anchors into the technologies section
 * rather than routes, since there are no per-technology pages.
 */
export const footerTechnologyLinks = [
  { label: "React", href: "/services/web-application-development" },
  { label: "Next.js", href: "/services/web-application-development" },
  { label: "Node.js", href: "/services/custom-software-development" },
  { label: "Python", href: "/services/ai-automation" },
  { label: "AI", href: "/services/ai-agents" },
  { label: "Automation", href: "/services/workflow-automation" },
] as const;

export const footerResourceLinks = [
  { label: "Case Studies", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Book a Call", href: "/book-a-call" },
] as const;

export const footerLegalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

/** Reused as the primary call-to-action label across the whole site. */
export const PRIMARY_CTA = {
  label: "Book a Free Consultation",
  href: "/book-a-call",
} as const;

export const SECONDARY_CTA = {
  label: "View Our Work",
  href: "/portfolio",
} as const;
