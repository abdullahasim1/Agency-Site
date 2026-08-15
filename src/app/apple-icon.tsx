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
 * `src/app/icon.svg`: the brand mark, one renderer.
 *
 * Full-bleed background with no corner radius on purpose — iOS applies its own
 * rounded-rect mask, and a pre-rounded icon shows dark corners inside it. The
 * mark sits inside the middle ~70%, which also satisfies the maskable safe zone
 * declared for this icon in manifest.ts.
 */
export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#0a0d14"; // ink-950
const MARK_NAVY = "#ffffff"; // white on the dark plate
const MARK_BLUE = "#2947e6"; // brand swoosh

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
        {/* Same geometry as src/app/icon.svg — the DevRox wordmark mark. */}
        <svg width="126" height="126" viewBox="72 108 215 215" fill="none">
          <path
            d="M175.156 322.329H110.474C103.346 322.329 99.7772 313.712 104.817 308.672L171.838 241.651C176.526 236.963 182.885 234.329 189.515 234.329H249.226C258.176 234.329 262.619 245.185 256.237 251.459L190.58 316.016C186.466 320.062 180.926 322.329 175.156 322.329Z"
            fill={MARK_NAVY}
          />
          <path
            d="M104.37 218.1L134.145 247.016C138.044 250.803 144.255 250.782 148.128 246.968L224.224 172.036C232.477 163.909 232.592 150.634 224.479 142.366L194.977 112.296C190.678 107.915 183.626 107.899 179.308 112.261L104.076 188.261C95.8611 196.559 95.9932 209.965 104.37 218.1Z"
            fill={MARK_BLUE}
          />
        </svg>
      </div>
    ),
    size,
  );
}