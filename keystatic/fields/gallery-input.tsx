"use client";

import { useRef, useState } from "react";
import { ActionButton, Button } from "@keystar/ui/button";
import { Dialog, DialogContainer } from "@keystar/ui/dialog";
import { FieldDescription, FieldLabel } from "@keystar/ui/field";
import { Flex, VStack } from "@keystar/ui/layout";
import { TextArea, TextField } from "@keystar/ui/text-field";
import { Heading, Text } from "@keystar/ui/typography";
import { css, tokenSchema } from "@keystar/ui/style";
import type { FormFieldInputProps } from "@keystatic/core";
import type { GalleryValue } from "./gallery";

/**
 * Editor UI for the custom gallery field — a client component.
 *
 * The field shows every image as a clean thumbnail (no buttons on top of the
 * image). Clicking a thumbnail opens a centered modal with the large preview,
 * the alt text and the caption stacked beneath it, and the Remove button under
 * the caption. The Upload button opens a centered modal with a clickable
 * drag-and-drop zone and a Browse picker, so many screenshots can be chosen at
 * once. All alt/caption values live in the field state, so they survive
 * closing and reopening modals, and saving happens with the panel's normal
 * Create / Save action.
 */

const thumbnailClass = css({
  width: 148,
  height: 100,
  objectFit: "contain",
  display: "block",
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px solid ${tokenSchema.color.border.neutral}`,
  background: tokenSchema.color.background.surfaceSecondary,
  cursor: "pointer",
  transition: "border-color 120ms ease",
  "&:hover": {
    borderColor: tokenSchema.color.border.accent,
  },
});

const emptyClass = css({
  padding: tokenSchema.size.space.large,
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px dashed ${tokenSchema.color.border.neutral}`,
  color: tokenSchema.color.foreground.neutralSecondary,
  fontSize: tokenSchema.typography.text.small.size,
});

const dropZoneClass = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: tokenSchema.size.space.regular,
  padding: tokenSchema.size.space.xlarge,
  borderRadius: tokenSchema.size.radius.medium,
  border: `2px dashed ${tokenSchema.color.border.neutral}`,
  color: tokenSchema.color.foreground.neutralSecondary,
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 120ms ease, background-color 120ms ease",
  "&:hover": {
    borderColor: tokenSchema.color.border.accent,
  },
});

const dropZoneDraggingClass = css({
  borderColor: tokenSchema.color.border.accent,
  background: tokenSchema.color.background.accent,
});

const previewClass = css({
  maxWidth: "100%",
  maxHeight: 320,
  objectFit: "contain",
  display: "block",
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px solid ${tokenSchema.color.border.neutral}`,
  background: tokenSchema.color.background.surfaceSecondary,
});

export function GalleryFieldInput(
  props: { label: string; description?: string } & FormFieldInputProps<GalleryValue>,
) {
  const { label, description, value, onChange } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    setUploadOpen(false);
    setIsDragging(false);
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
    setEditingIndex(null);
  };

  const editingItem = editingIndex === null ? null : value[editingIndex];

  return (
    <VStack gap="regular" width="100%">
      <FieldLabel elementType="span">{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {value.length === 0 ? (
        <div className={emptyClass}>No images yet — click Upload to add screenshots.</div>
      ) : (
        <Flex gap="regular" wrap="wrap">
          {value.map((item, index) => (
            <Flex key={index} direction="column" gap="xsmall" alignItems="center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt || item.originalFilename || `Gallery image ${index + 1}`}
                className={thumbnailClass}
                onClick={() => setEditingIndex(index)}
                title="Click to edit"
              />
              <Text size="small" color="neutralSecondary">
                {index + 1}
                {item.alt || item.caption ? " · filled" : ""}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}

      <Flex gap="regular" alignItems="center">
        <ActionButton onPress={() => setUploadOpen(true)}>Upload</ActionButton>
      </Flex>

      {editingItem && editingIndex !== null ? (
        <DialogContainer isDismissable onDismiss={() => setEditingIndex(null)}>
          <Dialog size="large">
            <VStack gap="medium" width="100%">
              <VStack gap="xsmall">
                <Heading size="medium">Image {editingIndex + 1}</Heading>
                {editingItem.originalFilename ? (
                  <Text size="small" color="neutralSecondary">
                    {editingItem.originalFilename}
                  </Text>
                ) : null}
              </VStack>
              <Flex justifyContent="center" width="100%">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingItem.src}
                  alt={editingItem.alt || editingItem.originalFilename || `Gallery image ${editingIndex + 1}`}
                  className={previewClass}
                />
              </Flex>
              <TextField
                label="Alt text"
                value={editingItem.alt}
                onChange={(alt) => updateItem(editingIndex, { alt })}
              />
              <TextArea
                label="Caption"
                value={editingItem.caption}
                onChange={(caption) => updateItem(editingIndex, { caption })}
              />
              <Flex gap="regular" justifyContent="space-between" alignItems="center">
                <Button tone="critical" onPress={() => removeItem(editingIndex)}>
                  Remove
                </Button>
                <Button prominence="high" onPress={() => setEditingIndex(null)}>
                  Done
                </Button>
              </Flex>
            </VStack>
          </Dialog>
        </DialogContainer>
      ) : null}

      {uploadOpen ? (
        <DialogContainer isDismissable onDismiss={() => setUploadOpen(false)}>
          <Dialog size="medium">
            <VStack gap="medium" width="100%">
              <Heading size="medium">Upload screenshots</Heading>
              <div
                className={`${dropZoneClass} ${isDragging ? dropZoneDraggingClass : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  void addFiles(event.dataTransfer.files);
                }}
              >
                <Text>Drag &amp; drop images here, or click to browse</Text>
                <Button prominence="high">Browse</Button>
              </div>
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
            </VStack>
          </Dialog>
        </DialogContainer>
      ) : null}
    </VStack>
  );
}