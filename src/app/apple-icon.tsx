import { ImageResponse } from "next/og";

/*
 * Apple touch icon.
 *
 * iOS ignores `icon.svg` — it only reads a raster `apple-touch-icon`, and with
 * none present it uses a screenshot of the page when someone adds the site to
 * their home screen. 180×180 is the size current iPhones ask for and the one
 * every smaller slot downscales cleanly from.
 *
 * Drawn in code rather than committed as a PNG so it cannot drift from
 * `src/app/icon.svg` and `LogoMark.tsx`: one mark, three renderers.
 *
 * Full-bleed background with no corner radius on purpose — iOS applies its own
 * rounded-rect mask, and a pre-rounded icon shows dark corners inside it. The
 * mark sits inside the middle ~55%, which also satisfies the maskable safe zone
 * declared for this icon in manifest.ts.
 */
export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#0a0d14"; // ink-950
const BRAND_SOFT = "#6384ff"; // brand-400
const NODE = "#93aaff";
const NODE_ALT = "#a78bfa"; // accent-violet

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BG,
          backgroundImage:
            "radial-gradient(120px 90px at 70% 0%, rgba(61,99,255,0.30), transparent 65%)",
        }}
      >
        {/* Same geometry as src/app/icon.svg, minus that file's rounded plate. */}
        <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
          <path
            d="M10 8.4C18.1 8.4 23.4 11.6 23.4 16C23.4 20.4 18.1 23.6 10 23.6"
            stroke={BRAND_SOFT}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M10 8.4V23.6"
            stroke={BRAND_SOFT}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="10" cy="8.4" r="2.4" fill={NODE} />
          <circle cx="10" cy="23.6" r="2.4" fill={NODE_ALT} />
          <circle cx="23.4" cy="16" r="3.1" fill={NODE} />
        </svg>
      </div>
    ),
    size,
  );
}
