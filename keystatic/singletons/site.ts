import { fields, singleton } from "@keystatic/core";

export const site = singleton({
  label: "Site settings",
  path: "src/content/site",
  format: { data: "json" },
  schema: {
    name: fields.text({
      label: "Agency name",
      validation: { isRequired: true },
    }),
    legalName: fields.text({
      label: "Legal name",
      description: "Used in the footer copyright and structured data.",
      validation: { isRequired: true },
    }),
    tagline: fields.text({ label: "Tagline" }),
    description: fields.text({
      label: "Description",
      description: "Used for search-engine and social previews.",
      multiline: true,
    }),
    shortDescription: fields.text({
      label: "Short description",
      description: "Shown in the footer.",
      multiline: true,
    }),
    url: fields.url({
      label: "Site URL",
      description:
        "Canonical address, e.g. https://thedevrox.com. Overridden by NEXT_PUBLIC_SITE_URL on preview deploys.",
      validation: { isRequired: true },
    }),
    contact: fields.object(
      {
        email: fields.text({ label: "Email" }),
        salesEmail: fields.text({ label: "Sales email" }),
        whatsapp: fields.text({
          label: "WhatsApp number",
          description: "As displayed, e.g. +92 301 6297433",
        }),
        whatsappHref: fields.text({
          label: "WhatsApp link",
          description: "Chat link, e.g. https://wa.me/923016297433",
        }),
        location: fields.text({ label: "Location line" }),
        address: fields.object(
          {
            line1: fields.text({ label: "Address line" }),
            city: fields.text({ label: "City" }),
            region: fields.text({ label: "Region / state" }),
            country: fields.text({ label: "Country" }),
          },
          { label: "Address" },
        ),
        hours: fields.text({ label: "Opening hours" }),
        responseTime: fields.text({ label: "Response-time promise" }),
      },
      { label: "Contact details" },
    ),
    social: fields.object(
      {
        linkedin: fields.text({ label: "LinkedIn URL" }),
        github: fields.text({ label: "GitHub URL" }),
      },
      { label: "Social links" },
    ),
    twitterHandle: fields.text({
      label: "X / Twitter handle",
      description: "Including the @, e.g. @devrox",
    }),
    foundedYear: fields.integer({
      label: "Founded year",
      validation: { isRequired: true },
    }),
    /*
     * Kept separate from the contact details above because these are
     * *claims made to search engines*, not display copy. The contact block
     * can hold a placeholder while the site is being built; this block
     * cannot — a fictional phone number or a social link that 404s is read
     * as a low-trust signal. Anything left blank is simply left out of the
     * markup, so filling these in is what switches the extra detail on.
     */
    schema: fields.object(
      {
        telephone: fields.text({
          label: "Phone number",
          description:
            "In international format, e.g. +14155550142. Must be a number that really answers — leave blank otherwise.",
        }),
        foundingDate: fields.text({
          label: "Founding date",
          description: "YYYY or YYYY-MM-DD. Leave blank if unconfirmed.",
        }),
        sameAs: fields.array(fields.text({ label: "Profile URL" }), {
          label: "Verified profiles",
          description:
            "Links to profiles that exist and are yours — LinkedIn, GitHub, X, Crunchbase. A link that 404s does more harm than no link.",
          itemLabel: (props) => props.value || "Profile URL",
        }),
        address: fields.object(
          {
            streetAddress: fields.text({ label: "Street address" }),
            addressLocality: fields.text({ label: "City" }),
            addressRegion: fields.text({ label: "Region / state" }),
            postalCode: fields.text({ label: "Postal code" }),
            addressCountry: fields.text({
              label: "Country code",
              description: "Two letters, e.g. PK, US, GB.",
            }),
          },
          { label: "Registered address" },
        ),
      },
      {
        label: "Structured data (verified details only)",
      },
    ),
  },
});
