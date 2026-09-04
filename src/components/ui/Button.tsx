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
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: never;
    external?: never;
  };

type ButtonProps = AsLink | AsButton;

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] " +
  "duration-200 ease-[var(--ease-out-soft)] active:translate-y-px " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 " +
  "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft " +
    "hover:bg-brand-700 hover:shadow-card active:bg-brand-800",
  secondary:
    "border border-ink-200 bg-white text-ink-900 shadow-xs " +
    "hover:border-ink-300 hover:bg-ink-50 hover:text-ink-950 active:bg-ink-100",
  ghost:
    "text-ink-700 hover:bg-ink-100/70 hover:text-ink-950 active:bg-ink-200/70",
  inverse:
    "bg-white text-ink-950 shadow-soft " +
    "hover:bg-ink-50 hover:shadow-card active:bg-ink-100",
  outline:
    "border border-white/20 text-white " +
    "hover:border-white/40 hover:bg-white/10 active:bg-white/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs",
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
    const { href, external, onClick } = props;

    if (external) {
      return (
        <a
          href={typeof href === "string" ? href : "#"}
          onClick={onClick}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} onClick={onClick} className={classes}>
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
