import { fields } from "@keystatic/core";
import { iconRegistry } from "../src/data/icons";

/** Icon dropdown options, derived from the one registry that bundles the icons. */
const iconOptions = Object.keys(iconRegistry).map((name) => ({
  label: name,
  value: name,
}));

export const iconField = (label = "Icon") =>
  fields.select({
    label,
    description: "Icon shown alongside this item.",
    options: iconOptions,
    defaultValue: "Sparkles",
  });

export const accentField = (label = "Accent colour") =>
  fields.select({
    label,
    options: [
      { label: "Brand (blue)", value: "brand" },
      { label: "Violet", value: "violet" },
      { label: "Cyan", value: "cyan" },
    ],
    defaultValue: "brand",
  });

/**
 * Shared validation for every machine key on the site (ids, slugs, references).
 *
 * The same pattern in `src/data/*.ts` selectors must match it, so keep them in
 * sync when either changes: lowercase letters, digits and hyphens only.
 */
export const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const keyPatternValidation = {
  regex: KEY_PATTERN,
  message:
    "Use only lowercase letters, numbers and hyphens (e.g. my-project-1).",
};

/**
 * Marks a field as developer-only and explains why it must stay stable.
 * Every machine field on the site should be framed through this so editors
 * learn the pattern in one place.
 */
export const devOnly = (reason: string) => `Developer field — ${reason}`;

/** Stable machine key for an entry. Changing one can break links, so it is explained. */
export const idField = fields.text({
  label: "Internal ID",
  description: devOnly(
    "not shown on the site. Used as a stable key by the data layer — changing it breaks saved references.",
  ),
  validation: {
    isRequired: true,
    pattern: keyPatternValidation,
  },
});

/**
 * A section intro — the small label, the heading and the line underneath.
 *
 * Used throughout the page-copy singletons so every heading on the site is
 * editable without touching a component.
 */
export const sectionField = (label: string, description?: string) =>
  fields.object(
    {
      eyebrow: fields.text({
        label: "Label",
        description: "Small line above the heading.",
      }),
      title: fields.text({
        label: "Heading",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Supporting text",
        multiline: true,
      }),
    },
    { label, description },
  );

/** Title, description and keywords for a page's search-engine listing. */
export const seoField = (description?: string) =>
  fields.object(
    {
      title: fields.text({
        label: "Browser / search title",
        description: "The site name is appended automatically.",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Search description",
        description: "Aim for roughly 150–160 characters.",
        multiline: true,
        validation: { isRequired: true },
      }),
      keywords: fields.array(fields.text({ label: "Keyword" }), {
        label: "Keywords",
        itemLabel: (props) => props.value || "Keyword",
      }),
    },
    { label: "SEO", description },
  );

/** Header and search listing for a legal page; the body sections are separate. */
export const legalPageField = (label: string) =>
  fields.object(
    {
      eyebrow: fields.text({ label: "Label" }),
      title: fields.text({
        label: "Heading",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Introduction",
        multiline: true,
      }),
      seoDescription: fields.text({
        label: "Search description",
        description: "Shown in search results. The heading is used as the title.",
        multiline: true,
      }),
    },
    { label },
  );
