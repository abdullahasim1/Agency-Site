"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ZoomableImageProps {
  /** Every image in the set, so the overlay can step through them. */
  images: LightboxImage[];
  /** This thumbnail's position in `images`. */
  index: number;
  /** Thumbnail content. Rendered inside a button that opens the overlay. */
  children: ReactNode;
  className?: string;
}

/**
 * Zoomable image: the thumbnail opens a full-screen overlay showing the image
 * at full size with next/previous, keyboard navigation and scroll lock.
 *
 * The thumbnail is `children` wrapped in a button, so the surrounding card can
 * keep its own link without nesting interactive elements.
 */
export function ZoomableImage({
  images,
  index,
  children,
  className,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(index);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (direction: 1 | -1) => {
      setActive((current) => (current + direction + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const image = images[active];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setActive(index);
          setOpen(true);
        }}
        aria-label={`View ${images[index].alt}`}
        className={cn("block h-full w-full cursor-zoom-in text-left", className)}
      >
        {children}
      </button>

      {open && image
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={image.alt}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-ink-950/95 p-4 backdrop-blur-sm sm:p-8"
            >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" aria-hidden />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="absolute top-1/2 left-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="absolute top-1/2 right-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </>
          ) : null}

          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full flex-col items-center justify-center gap-3"
          >
            <Image
                src={image.src}
                alt={image.alt}
                width={1280}
                height={720}
                sizes="100vw"
                className="max-h-[80vh] w-auto max-w-full rounded-card object-contain shadow-2xl"
              />
              {image.caption ? (
                <figcaption className="max-w-2xl text-center text-sm leading-relaxed text-ink-300">
                  {image.caption}
                </figcaption>
              ) : null}
              {images.length > 1 ? (
                <p className="text-xs text-ink-500">
                  {active + 1} / {images.length}
                </p>
              ) : null}
            </figure>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
