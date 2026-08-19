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
  transition: "border-color 120ms ease, background-color 120ms ease",
  "&:hover": {
    borderColor: tokenSchema.color.border.accent,
  },
});

const dropZoneDraggingClass = css({
  borderColor: tokenSchema.color.border.accent,
  background: tokenSchema.color.background.accent,
});

const previewBoxClass = css({
  width: "100%",
  maxWidth: 300,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: tokenSchema.size.space.small,
  borderRadius: tokenSchema.size.radius.medium,
  border: `1px solid ${tokenSchema.color.border.neutral}`,
  background: tokenSchema.color.background.surfaceSecondary,
});

const imageItemClass = css({
  display: "grid",
  gridTemplateColumns: "minmax(240px, 300px) 1fr",
  gap: tokenSchema.size.space.regular,
  width: "100%",
  alignItems: "start",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const imageLeftClass = css({
  display: "flex",
  flexDirection: "column",
  gap: tokenSchema.size.space.small,
  alignItems: "center",
});

const imageRightClass = css({
  display: "flex",
  flexDirection: "column",
  gap: tokenSchema.size.space.small,
  width: "100%",
  minWidth: 0,
});

const previewClass = css({
  width: "100%",
  maxHeight: 240,
  objectFit: "contain",
  display: "block",
});

const listClass = css({
  maxHeight: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: `${tokenSchema.color.border.neutral} transparent`,
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: tokenSchema.color.border.neutral,
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-button": {
    display: "none",
  },
});

const dialogContentClass = css({
  width: "100%",
  maxWidth: "calc(100vw - 100px)",
  padding: "50px !important",
  position: "relative",
  "@media (min-width: 900px)": {
    minWidth: "800px",
  },
  "@media (max-width: 900px)": {
    minWidth: "calc(100vw - 100px)",
    padding: "24px !important",
  },
});

const modalWrapperClass = css({
  position: "relative",
  width: "100%",
  maxHeight: "80vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const modalBodyClass = css({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  width: "100%",
  boxSizing: "border-box",
});

const closeButtonOverrideClass = css({
  marginRight: "-100px !important",
  "button, [role='button']": {
    cursor: "pointer !important",
  },
  "& button": {
    cursor: "pointer !important",
  },
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack gap="regular" width="100%">
      <FieldLabel elementType="span">{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}

      <Flex gap="regular" alignItems="center">
        <ActionButton
          onPress={() => {
            setIsOpen(true);
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
            <div className={`${dialogContentClass} ${closeButtonOverrideClass}`}>
              <div className={modalWrapperClass}>
                <div className={modalBodyClass}>
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
                        <div key={index} className={imageItemClass}>
                          <div className={imageLeftClass}>
                            <div className={previewBoxClass}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.src}
                                alt={item.alt || item.originalFilename || `Gallery image ${index + 1}`}
                                className={previewClass}
                              />
                            </div>
                            <Button tone="critical" onPress={() => removeItem(index)}>
                              Remove
                            </Button>
                          </div>
                          <div className={imageRightClass}>
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
                          </div>
                        </div>
                      ))}
                    </VStack>
                  </div>
                )}

                <div
                  className={`${dropZoneClass} ${isDragging ? dropZoneDraggingClass : ""}`}
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
                  <Text>Drag &amp; drop more images here, or click Browse</Text>
                  <Button prominence="high" onPress={handleBrowseClick}>
                    Browse
                  </Button>
                </div>

                <Flex justifyContent="end">
                  <Button prominence="high" onPress={() => setIsOpen(false)}>
                    Done
                  </Button>
                </Flex>
              </VStack>
                </div>
              </div>
            </div>
          </Dialog>
        </DialogContainer>
      ) : null}
    </VStack>
  );
}
