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
 * `src/app/icon.svg` (the Frame 11 round mark): a white circle on a dark
 * plate. Full-bleed background with the circle safely inside the middle ~80%,
 * which satisfies the maskable safe zone declared in manifest.ts.
 */
export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#0a0d14"; // ink-950 plate
const MARK_NAVY = "#011c6a"; // badge
const MARK_BLUE = "#2947e6"; // swoosh

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
        }}
      >
        <div
          style={{
            width: 146,
            height: 146,
            borderRadius: 73,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Same geometry as src/app/icon.svg — the Frame 11 round mark. */}
          <svg width="118" height="118" viewBox="0 0 310 310" fill="none">
            <path
              d="M157.205 259.114H90.442C83.0856 259.114 79.4015 250.182 84.6033 244.959L153.78 175.492C158.619 170.633 165.182 167.903 172.026 167.903H233.658C242.895 167.903 247.481 179.155 240.894 185.658L173.125 252.571C168.878 256.764 163.161 259.114 157.205 259.114Z"
              fill={MARK_NAVY}
            />
            <path
              d="M84.1417 151.081L114.874 181.053C118.899 184.978 125.31 184.956 129.307 181.003L207.851 103.337C216.37 94.9133 216.488 81.1536 208.115 72.5837L177.663 41.4165C173.226 36.8753 165.947 36.8591 161.49 41.3804L83.8381 120.154C75.3594 128.755 75.4958 142.65 84.1417 151.081Z"
              fill={MARK_BLUE}
            />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}