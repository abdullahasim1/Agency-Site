import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

export const runtime = "nodejs";

/**
 * Dynamic Open Graph / Twitter card image, shared by every route.
 *
 * `buildMetadata()` points each page's og:image and twitter:image here with a
 * `?title=` (and optional `?label=`) query, so social cards stay on-brand and
 * per-page without needing an image file in every route segment. It lives at a
 * crawlable path (not under /api, which robots.txt disallows).
 *
 * Size is the standard 1200×630. No custom fonts are loaded — next/og ships a
 * sensible default — which keeps the endpoint dependency-free.
 */
const SIZE = { width: 1200, height: 630 };

const BG = "#0a0d14"; // ink-950
const PANEL = "#141922"; // ink-900
const BRAND = "#3d63ff"; // brand-500
const BRAND_SOFT = "#6384ff"; // brand-400
const TEXT = "#f6f7f9"; // ink-50
const MUTE = "#98a1b3"; // ink-400

function clamp(value: string, max: number): string {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title") || siteConfig.name, 96);
  const label = clamp(searchParams.get("label") || siteConfig.tagline, 48);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          backgroundImage: `radial-gradient(1000px 500px at 78% -10%, rgba(61,99,255,0.28), transparent 60%)`,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: wordmark + section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 15,
                background: PANEL,
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* The DevRox mark, matching src/components/ui/LogoMark.tsx. */}
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 6.6C17.6 6.6 24.2 10.4 24.2 16C24.2 21.6 17.6 25.4 8 25.4"
                  stroke={BRAND_SOFT}
                  strokeWidth="2.9"
                  strokeLinecap="round"
                />
                <path
                  d="M8 6.6V25.4"
                  stroke={BRAND_SOFT}
                  strokeWidth="2.9"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="6.6" r="2.1" fill="#93aaff" />
                <circle cx="8" cy="25.4" r="2.1" fill="#a78bfa" />
                <circle cx="24.2" cy="16" r="2.9" fill="#93aaff" />
              </svg>
            </div>
            <div
              style={{ color: TEXT, fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}
            >
              {siteConfig.name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: PANEL,
              color: BRAND_SOFT,
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 6,
              borderRadius: 999,
              background: BRAND,
            }}
          />
          <div
            style={{
              color: TEXT,
              fontSize: title.length > 48 ? 66 : 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom row: url + focus */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: MUTE,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
          <div style={{ display: "flex" }}>
            AI · Automation · Software Engineering
          </div>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
