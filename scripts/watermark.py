#!/usr/bin/env python3
"""
Bakes a repeating DevRox logo watermark into every portfolio image so the
assets are protected even when downloaded directly from /images.

Output: in-place, all PNGs under public/images/projects (cover + gallery +
case-study shots).

Usage: python3 scripts/watermark.py

Requires Pillow and ImageMagick (to rasterise the SVG logos into /tmp). The
watermark is the DevRox wordmark rendered in brand colour over a soft white
halo, so it stays readable on light and dark covers alike. Re-running is
idempotent — it does not blank anything out, so expect the mark to deepen if
the source images were already watermarked.
"""
from __future__ import annotations

import glob
import os
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PROJECT_IMAGES = ROOT / "public" / "images" / "projects"
LOGO_COLOR = ROOT / "public" / "logos" / "weblogo" / "devrox-color.svg"
LOGO_WHITE = ROOT / "public" / "logos" / "weblogo" / "devrox-white.svg"

COLOR_ALPHA = 0.55
HALO_ALPHA = 0.5
HALO_GROW = 1.04
SPACING_RATIO = 0.8  # tile cell as a fraction of the shortest side
SIZE_RATIO = 0.42  # logo width as a fraction of the shortest side
ANGLE = -25


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


def make_stamp(size_w: int) -> tuple[Image.Image, Image.Image]:
    """(halo, colour) stamps rotated to the watermark angle."""
    color = raster(LOGO_COLOR, size_w).rotate(ANGLE, expand=True, resample=Image.Resampling.BICUBIC)
    halo = raster(LOGO_WHITE, round(size_w * HALO_GROW)).rotate(
        ANGLE, expand=True, resample=Image.Resampling.BICUBIC
    )
    halo = halo.resize(color.size, Image.Resampling.LANCZOS)

    halo_a = halo.getchannel("A").point(lambda v: int(v * HALO_ALPHA))
    halo.putalpha(halo_a)
    color_a = color.getchannel("A").point(lambda v: int(v * COLOR_ALPHA))
    color.putalpha(color_a)
    return halo, color


def build_tile(cell: int, size_w: int) -> Image.Image:
    """One repeating cell: a corner-centred stamp plus a centre stamp."""
    halo, color = make_stamp(size_w)
    w, h = color.size
    tile = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    for cx, cy in [(cell // 2, cell // 2), (0, 0), (cell, 0), (0, cell), (cell, cell)]:
        x, y = round(cx - w / 2), round(cy - h / 2)
        tile.alpha_composite(halo, (x, y))
        tile.alpha_composite(color, (x, y))
    return tile


_tile_cache: dict[tuple[int, int], Image.Image] = {}


def _tile(cell: int, size_w: int) -> Image.Image:
    item = _tile_cache.get((cell, size_w))
    if item is None:
        item = build_tile(cell, size_w)
        _tile_cache[(cell, size_w)] = item
    return item


def watermark(path: Path, dry_run: bool = False) -> None:
    base = Image.open(path).convert("RGBA")
    w, h = base.size
    cell = round(min(w, h) * SPACING_RATIO)
    size_w = round(min(w, h) * SIZE_RATIO)
    tile = _tile(cell, size_w)

    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            ov.alpha_composite(tile, (x, y))

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