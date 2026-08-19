"use client";

import { useRef } from "react";
import { ActionButton } from "@keystar/ui/button";
import { FieldDescription, FieldLabel } from "@keystar/ui/field";
import { Flex, VStack } from "@keystar/ui/layout";
import { TextArea, TextField } from "@keystar/ui/text-field";
import { css, tokenSchema } from "@keystar/ui/style";
import type { FormFieldInputProps } from "@keystatic/core";
import type { GalleryValue } from "./gallery";

/**
 * Editor UI for the custom gallery field — a client component.
 *
 * One multi-select file picker feeds a single list where every image shows its
 * preview with its own alt-text and caption inputs right beside it, and the
 * Upload button below adds more images in one go. Actual saving happens with
 * the panel's normal Create / Save action, exactly like every other field.
 */

const previewClass = css({
  width: 180,
  height: 120,
  objectFit: "contain",
  flexShrink: 0,
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px solid ${tokenSchema.color.border.neutral}`,
  background: tokenSchema.color.background.surfaceSecondary,
});

const emptyClass = css({
  padding: tokenSchema.size.space.large,
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px dashed ${tokenSchema.color.border.neutral}`,
  color: tokenSchema.color.foreground.neutralSecondary,
  fontSize: tokenSchema.typography.text.small.size,
});

export function GalleryFieldInput(
  props: { label: string; description?: string } & FormFieldInputProps<GalleryValue>,
) {
  const { label, description, value, onChange } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const added = [];
    for (const file of Array.from(files)) {
      const dotIndex = file.name.lastIndexOf(".");
      const extension =
        dotIndex > 0 ? file.name.slice(dotIndex + 1).toLowerCase() : "";
      added.push({
        src: URL.createObjectURL(file),
        data: new Uint8Array(await file.arrayBuffer()),
        extension,
        originalFilename: file.name,
        alt: "",
        caption: "",
      });
    }
    onChange([...value, ...added]);
  };

  const updateItem = (index: number, patch: Record<string, unknown>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    const item = value[index];
    if (item && item.src.startsWith("blob:")) {
      URL.revokeObjectURL(item.src);
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <VStack gap="regular" width="100%">
      <FieldLabel elementType="span">{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {value.length === 0 ? (
        <div className={emptyClass}>No images yet — click Upload to add screenshots.</div>
      ) : (
        <VStack gap="regular" width="100%">
          {value.map((item, index) => (
            <Flex key={index} gap="regular" alignItems="start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt || item.originalFilename || `Gallery image ${index + 1}`}
                className={previewClass}
              />
              <VStack gap="small" flex>
                <TextField
                  label="Alt text"
                  value={item.alt}
                  onChange={(alt) => updateItem(index, { alt })}
                />
                <TextArea
                  label="Caption"
                  value={item.caption}
                  onChange={(caption) => updateItem(index, { caption })}
                />
              </VStack>
              <ActionButton onPress={() => removeItem(index)}>Remove</ActionButton>
            </Flex>
          ))}
        </VStack>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          void addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <Flex gap="regular" alignItems="center">
        <ActionButton onPress={() => fileInputRef.current?.click()}>Upload</ActionButton>
      </Flex>
    </VStack>
  );
}