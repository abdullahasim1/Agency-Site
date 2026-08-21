#!/usr/bin/env python3
"""
Bakes a single DevRox logo watermark into the bottom of every portfolio image
so the assets are protected even when downloaded directly from /images.

Output: in-place, all PNGs under public/images/projects (cover + gallery +
case-study shots).

Usage: python3 scripts/watermark.py

Requires Pillow and ImageMagick (to rasterise the SVG logos into /tmp). The
watermark is the DevRox wordmark rendered in brand colour at the bottom centre
with a soft white halo, so it stays readable on light and dark images alike.
"""
from __future__ import annotations

import glob
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PROJECT_IMAGES = ROOT / "public" / "images" / "projects"
LOGO_COLOR = ROOT / "public" / "logos" / "weblogo" / "devrox-color.svg"
LOGO_WHITE = ROOT / "public" / "logos" / "weblogo" / "devrox-white.svg"

COLOR_ALPHA = 0.75
HALO_ALPHA = 0.65
HALO_GROW = 1.04
WIDTH_RATIO = 0.28  # logo width as a fraction of the image width
EDGE_PADDING = 3  # px gap from the bottom edge

CACHE: dict[tuple[int, int], Image.Image] = {}


def raster(logo_svg: Path, size_w: int) -> Image.Image:
    """Rasterise a logo SVG to a transparent RGBA image of ~size_w px wide."""
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "logo.png"
        density = max(96, round(96 * size_w / 1304))
        subprocess.run(
            ["convert", "-background", "none", "-density", str(density), str(logo_svg), str(png)],
            check=True,
            capture_output=True,
        )
        img = Image.open(png).convert("RGBA")
        scale = size_w / img.width
        return img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)


def make_stamp(size_w: int) -> Image.Image:
    """Composite (halo + brand colour) logo stamp at the given width."""
    key = (size_w,)
    if key not in CACHE:
        color = raster(LOGO_COLOR, size_w)
        halo = raster(LOGO_WHITE, round(size_w * HALO_GROW)).resize(color.size, Image.Resampling.LANCZOS)

        halo_a = halo.getchannel("A").point(lambda v: int(v * HALO_ALPHA))
        halo.putalpha(halo_a)
        color_a = color.getchannel("A").point(lambda v: int(v * COLOR_ALPHA))
        color.putalpha(color_a)
        CACHE[key] = Image.alpha_composite(halo, color)
    return CACHE[key].copy()


def watermark(path: Path, dry_run: bool = False) -> None:
    base = Image.open(path).convert("RGBA")
    w, h = base.size
    size_w = round(w * WIDTH_RATIO)
    stamp = make_stamp(size_w)
    sw, sh = stamp.size

    x = round((w - sw) / 2)
    y = h - sh - EDGE_PADDING

    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov.alpha_composite(stamp, (x, y))

    if dry_run:
        return
    out = Image.alpha_composite(base, ov).convert("RGB")
    out.save(path)


def main() -> None:
    files = sorted(glob.glob(str(PROJECT_IMAGES / "**" / "*.png"), recursive=True))
    files += sorted(glob.glob(str(PROJECT_IMAGES / "**" / "*.jpg")))
    files += sorted(glob.glob(str(PROJECT_IMAGES / "**" / "*.jpeg")))

    if not files:
        print("No images found.")
        sys.exit(1)

    for f in files:
        msg = "checking" if "--dry-run" in sys.argv else "watermark"
        print(f"  - {msg}: {f}")
        watermark(Path(f), dry_run="--dry-run" in sys.argv)
    print(f"\nDone: {len(files)} images ({'dry run — nothing written' if '--dry-run' in sys.argv else 'watermarked in place'}).")


if __name__ == "__main__":
    main()