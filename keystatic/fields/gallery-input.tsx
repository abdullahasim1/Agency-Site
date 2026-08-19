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
 * The field itself only shows the Upload button and an image count. All
 * management happens in one centered modal: every image (existing or newly
 * picked) appears in a scrollable vertical list, each row with the preview on
 * the left, its Alt Text and Caption on the right, and a Remove button below
 * the preview. The drop zone and Browse button at the bottom of the modal add
 * more images; values live in the field state, so Alt Text and Caption survive
 * adding, removing and reopening. Saving happens with the panel's normal
 * Create / Save action.
 */

const emptyClass = css({
  padding: tokenSchema.size.space.large,
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px dashed ${tokenSchema.color.border.neutral}`,
  color: tokenSchema.color.foreground.neutralSecondary,
  fontSize: tokenSchema.typography.text.small.size,
  textAlign: "center",
});

const dropZoneClass = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: tokenSchema.size.space.regular,
  padding: tokenSchema.size.space.large,
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
  width: 180,
  height: 130,
  objectFit: "contain",
  display: "block",
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px solid ${tokenSchema.color.border.neutral}`,
  background: tokenSchema.color.background.surfaceSecondary,
});

const listClass = css({
  maxHeight: "60vh",
  overflowY: "auto",
});

export function GalleryFieldInput(
  props: { label: string; description?: string } & FormFieldInputProps<GalleryValue>,
) {
  const { label, description, value, onChange } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
  };

  return (
    <VStack gap="regular" width="100%">
      <FieldLabel elementType="span">{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}

      <Flex gap="regular" alignItems="center">
        <ActionButton
          onPress={() => {
            setIsOpen(true);
            fileInputRef.current?.click();
          }}
        >
          Upload
        </ActionButton>
        {value.length > 0 ? (
          <Text size="small" color="neutralSecondary">
            {value.length} image{value.length > 1 ? "s" : ""}
          </Text>
        ) : null}
      </Flex>

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

      {isOpen ? (
        <DialogContainer isDismissable onDismiss={() => setIsOpen(false)}>
          <Dialog size="large">
            <VStack gap="medium" width="100%">
              <Heading size="medium">
                Gallery images{value.length ? ` (${value.length})` : ""}
              </Heading>

              {value.length === 0 ? (
                <div className={emptyClass}>No images yet — add some below.</div>
              ) : (
                <div className={listClass}>
                  <VStack gap="large" width="100%">
                    {value.map((item, index) => (
                      <Flex key={index} gap="regular" alignItems="start" width="100%">
                        <VStack gap="small" alignItems="center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.src}
                            alt={item.alt || item.originalFilename || `Gallery image ${index + 1}`}
                            className={previewClass}
                          />
                          <Button tone="critical" onPress={() => removeItem(index)}>
                            Remove
                          </Button>
                        </VStack>
                        <VStack gap="small" flex>
                          {item.originalFilename ? (
                            <Text size="small" color="neutralSecondary">
                              {item.originalFilename}
                            </Text>
                          ) : null}
                          <TextField
                            label="Alt Text"
                            value={item.alt}
                            onChange={(alt) => updateItem(index, { alt })}
                          />
                          <TextArea
                            label="Caption"
                            value={item.caption}
                            onChange={(caption) => updateItem(index, { caption })}
                          />
                        </VStack>
                      </Flex>
                    ))}
                  </VStack>
                </div>
              )}

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
                <Text>Drag &amp; drop more images here, or click to browse</Text>
                <Button prominence="high">Browse</Button>
              </div>

              <Flex justifyContent="end">
                <Button prominence="high" onPress={() => setIsOpen(false)}>
                  Done
                </Button>
              </Flex>
            </VStack>
          </Dialog>
        </DialogContainer>
      ) : null}
    </VStack>
  );
}