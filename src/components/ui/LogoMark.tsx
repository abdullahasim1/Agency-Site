import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  /** `inverse` for dark backgrounds. */
  tone?: "default" | "inverse";
  /**
   * `mono` draws the mark in a single `currentColor` at a slightly heavier
   * weight — for favicons, one-colour print and any place a gradient across a
   * ~1.5px stroke would only produce colour fringing.
   */
  variant?: "gradient" | "mono";
  /**
   * Namespaces the gradient id. Every instance defines identical stops, so a
   * collision is harmless, but distinct ids keep the document valid when the
   * mark appears more than once on a page.
   */
  gradientId?: string;
}

/**
 * The DevRox mark: a straight stem and a curved bowl meeting at two vertices,
 * with a larger node at the bowl's apex.
 *
 * It resolves as a "D" while staying in the node-and-edge language the rest of
 * the site uses for systems diagrams — the stem and bowl read as edges, the
 * three circles as vertices, and the apex node as the point everything routes
 * into. Pure SVG on a transparent ground, so it drops onto any surface and
 * costs no image request.
 */
export function LogoMark({
  className,
  tone = "default",
  variant = "gradient",
  gradientId = "devrox-mark-flow",
}: LogoMarkProps) {
  const mono = variant === "mono";
  const inverse = tone === "inverse";

  // Slightly heavier in mono, where there is no gradient to carry the shape.
  const width = mono ? 3.1 : 2.9;
  const vertex = mono ? 2.2 : 2.1;
  const hub = mono ? 3 : 2.9;

  const stem = mono ? "currentColor" : inverse ? "#3d63ff" : "#2947e6";
  const bowl = mono ? "currentColor" : `url(#${gradientId})`;
  const topNode = mono ? "currentColor" : inverse ? "#6384ff" : "#3d63ff";
  const bottomNode = mono ? "currentColor" : inverse ? "#a78bfa" : "#8b5cf6";
  const hubNode = mono ? "currentColor" : inverse ? "#6384ff" : "#3d63ff";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      role="img"
      aria-hidden
      fill="none"
    >
      {/* Bowl: leaves the stem horizontally and turns vertical at the apex. */}
      <path
        d="M8 6.6C17.6 6.6 24.2 10.4 24.2 16C24.2 21.6 17.6 25.4 8 25.4"
        stroke={bowl}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* Stem: the spine that makes the silhouette read as a D. */}
      <path
        d="M8 6.6V25.4"
        stroke={stem}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* Vertices where the two edges meet. */}
      <circle cx="8" cy="6.6" r={vertex} fill={topNode} />
      <circle cx="8" cy="25.4" r={vertex} fill={bottomNode} />
      {/* The node the flow routes into. */}
      <circle cx="24.2" cy="16" r={hub} fill={hubNode} />

      {mono ? null : (
        <defs>
          <linearGradient
            id={gradientId}
            x1="8"
            y1="6.6"
            x2="24.2"
            y2="25.4"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3d63ff" />
            <stop offset="0.55" stopColor="#6366f1" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}

interface BrandLogoProps {
  className?: string;
  /** `inverse` picks the white mark for dark backgrounds (footer). */
  tone?: "default" | "inverse";
}

/**
 * The full DevRox wordmark logo as a static asset. Two variants live in
 * `public/logos/weblogo/`: the colored mark (`devrox-color.svg`) on light
 * surfaces and the white mark (`devrox-white.svg`) on dark surfaces.
 */
export function BrandLogo({ className, tone = "default" }: BrandLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        tone === "inverse"
          ? "/logos/weblogo/devrox-white.svg"
          : "/logos/weblogo/devrox-color.svg"
      }
      alt="DevRox"
      width={1304}
      height={432}
      className={cn("h-9 w-auto", className)}
    />
  );
}
