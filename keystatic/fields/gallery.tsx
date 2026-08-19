import type { AssetsFormField, FormFieldInputProps } from "@keystatic/core";
import { GalleryFieldInput } from "./gallery-input";

/**
 * Custom Keystatic form field for the project gallery.
 *
 * Unlike the built-in array-of-images field (one picker per image), this field
 * opens a single multi-select file picker and shows every chosen image in one
 * list, each with its own alt-text and caption inputs right beside the preview.
 * The "Upload" button below the list adds more images at once.
 *
 * Files are written on save to `public/images/projects/<slug>/gallery/<n>/` and
 * the stored JSON keeps the exact same `{ src, alt, caption }` shape the old
 * array field produced, so the data layer and pages are untouched.
 *
 * This module stays server-safe (no hooks): the editor UI lives in
 * `gallery-input.tsx` behind a "use client" boundary, which is exactly the
 * pattern Keystatic's own field components use.
 */

export type GalleryImageValue = {
  /** Public path of a previously saved image, or a temporary object URL for a newly picked file. */
  src: string;
  alt: string;
  caption: string;
  /** Bytes of a newly picked file; absent for images already saved. */
  data?: Uint8Array;
  /** Extension without the dot, e.g. "png". Only used while `data` is set. */
  extension?: string;
  /** Original filename of a newly picked file. */
  originalFilename?: string;
};

export type GalleryValue = GalleryImageValue[];

const DIRECTORY = "public/images/projects";
const PUBLIC_PATH = "/images/projects";

const parseItems = (value: unknown): GalleryValue => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("Gallery must be a list of images");
  return value.map((item) => {
    const image = (item ?? {}) as Record<string, unknown>;
    return {
      src: typeof image.src === "string" ? image.src : "",
      alt: typeof image.alt === "string" ? image.alt : "",
      caption: typeof image.caption === "string" ? image.caption : "",
    };
  });
};

export function galleryField(opts: {
  label: string;
  description?: string;
}): AssetsFormField<GalleryValue, GalleryValue, GalleryValue> {
  const { label, description } = opts;

  return {
    kind: "form",
    formKind: "assets",
    directories: [DIRECTORY],
    defaultValue: () => [],
    parse(value) {
      return parseItems(value);
    },
    validate(value) {
      if (!Array.isArray(value)) throw new Error("Gallery must be a list of images");
      return value.map((item) => ({
        ...item,
        alt: item.alt ?? "",
        caption: item.caption ?? "",
      }));
    },
    serialize(value, args) {
      const files = new Map<string, Uint8Array>();
      const used = new Set<string>();
      const stored = value.map((item, index) => {
        const alt = item.alt ?? "";
        const caption = item.caption ?? "";
        if (item.data) {
          const extension = item.extension || "png";
          // Do NOT prepend slug here — Keystatic runtime inserts it automatically
          // between the directory and this key when writing to disk.
          // Final disk path = public/images/projects/<slug>/gallery/<n>/src.<ext>
          let relative = `gallery/${index}/src.${extension}`;
          let counter = 1;
          while (used.has(relative)) {
            relative = `gallery/${index}/src-${counter++}.${extension}`;
          }
          used.add(relative);
          files.set(relative, item.data);
          // The src stored in JSON still needs the full public URL with the slug
          const slugPart = args.slug ? `${args.slug}/` : "";
          return { src: `${PUBLIC_PATH}/${slugPart}${relative}`, alt, caption };
        }
        used.add(item.src);
        return { src: item.src, alt, caption };
      });
      return {
        value: stored,
        other: new Map(),
        external: new Map([[DIRECTORY, files]]),
      };
    },
    reader: {
      parse(value) {
        return parseItems(value);
      },
    },
    Input(props: FormFieldInputProps<GalleryValue>) {
      return <GalleryFieldInput label={label} description={description} {...props} />;
    },
  };
}