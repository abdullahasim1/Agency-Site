import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "outline";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Borrowed from next/link so href stays compatible with typed routes without
 * needing a cast at every call site.
 */
type LinkHref = ComponentPropsWithoutRef<typeof Link>["href"];

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Rendered after the label, typically an arrow. */
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  fullWidth?: boolean;
}

type AsLink = BaseProps & {
  href: LinkHref;
  external?: boolean;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: never;
    external?: never;
  };

export type ButtonProps = AsLink | AsButton;

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] " +
  "duration-200 ease-[var(--ease-out-soft)] active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  /* Solid brand. The only element on a page allowed to use it more than once. */
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-card " +
    "dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-ink-950",
  /* Bordered neutral, adapts to the surrounding band. */
  secondary:
    "border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50 " +
    "dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10",
  /* Text-only, used for tertiary actions and inline links. */
  ghost:
    "text-ink-700 hover:bg-ink-100 hover:text-ink-950 " +
    "dark:text-ink-200 dark:hover:bg-white/10 dark:hover:text-white",
  /* White on dark — the CTA on dark bands. */
  inverse:
    "bg-white text-ink-950 shadow-soft hover:bg-ink-100 " +
    "dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
  /* Transparent with a brand outline. */
  outline:
    "border border-brand-300 text-brand-700 hover:border-brand-500 hover:bg-brand-50 " +
    "dark:border-brand-400/50 dark:text-brand-200 dark:hover:border-brand-300 dark:hover:bg-brand-500/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    trailingIcon,
    leadingIcon,
    fullWidth,
  } = props;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;

    if (external) {
      return (
        <a
          href={typeof href === "string" ? href : "#"}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    trailingIcon: _trailingIcon,
    leadingIcon: _leadingIcon,
    fullWidth: _fullWidth,
    ...buttonProps
  } = props as AsButton;

  return (
    <button {...buttonProps} className={classes}>
      {content}
    </button>
  );
}
