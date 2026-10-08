"""Families in taxonomy order, and the photograph that opens each one.

The hero is the family's sharpest real product photograph that was successfully cut out,
taken from the high-resolution plates built by scripts/build-catalogue-plates.mjs.

Two kinds of image are refused, and why:
  - The category's editorial image (public/images/editorial). Those may be composed
    scenes, and a catalogue that promises real products cannot open a section on one.
  - An "as-shot" plate. Those skip cutOut(), which is where the supplier's burned-in
    watermark is removed, so an as-shot hero would print a floating Hyland logo at the
    largest size in the book.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
import build_catalogue as legacy  # noqa: E402

HI_PLATES = ROOT / "tmp" / "catalogue-plates-hi"


@dataclass
class Family:
    slug: str
    name: str
    summary: str
    products: list[dict] = field(default_factory=list)
    photographed: list[dict] = field(default_factory=list)


def _slug(product: dict) -> str | None:
    src = (product.get("heroImage") or {}).get("src", "")
    return Path(src).stem if src else None


def families() -> list[Family]:
    """The HYDE catalogue's families, in categories.json order, empty ones dropped."""
    categories, products = legacy.load()
    by_slug = {c["slug"]: Family(c["slug"], c["name"], c.get("summary", "")) for c in categories}
    for p in products:
        if p.get("published") is False:
            continue
        fam = by_slug.get((p.get("categoryPath") or [None])[0])
        if fam is None:
            continue
        fam.products.append(p)
        slug = _slug(p)
        if slug and legacy.plate(slug):
            fam.photographed.append(p)
    return [f for f in by_slug.values() if f.products]


@lru_cache(maxsize=1)
def _cut_out() -> frozenset[str]:
    report = json.loads((HI_PLATES / "index.json").read_text("utf8"))
    return frozenset(slug for slug, how in report.items() if how == "cut-out")


def hero_plate(product: dict) -> Path | None:
    """The high-resolution plate for a product, only if it was cleanly cut out."""
    slug = _slug(product)
    if not slug or slug not in _cut_out():
        return None
    path = HI_PLATES / f"{slug}.jpg"
    return path if path.exists() else None


# Measured 2026-10-08: every family's sharpest cut-out is 829–992 px on its long side, even
# though sources reach 2100 px — cutting the product out of the frame costs pixels. At the
# 200-dpi floor that prints 105–126 mm wide, so openers are a product on white space, not
# a full-page photograph. 800 px is the floor that keeps every family above 100 mm.
HERO_MIN_PX = 800

# Families with no clean cut-out at all, and why. Asserted as an exact set in the tests,
# so this list cannot grow without someone writing down the reason.
PENDING_HERO = {
    # All 28 photographs are crops from the supplier catalogue on a dark background with a
    # decorative circle (cutOut: "0% of the frame is white"), and D-1042's crop carries
    # fragments of Chinese catalogue text. Needs a dark-background cut-out, checked by eye.
    "floor-springs-and-pivots",
}


def hero_for(family: Family, min_px: int = HERO_MIN_PX) -> tuple[dict, Path]:
    """The family's sharpest cut-out photograph of at least `min_px` on its long side."""
    best: tuple[int, dict, Path] | None = None
    for p in family.photographed:
        path = hero_plate(p)
        if not path:
            continue
        with Image.open(path) as im:
            px = max(im.size)
        if px >= min_px and (best is None or px > best[0]):
            best = (px, p, path)
    if best is None:
        raise LookupError(f"{family.slug}: no cut-out photograph of at least {min_px}px")
    return best[1], best[2]
