"""The catalogue's design system: geometry, type, colour, and the print-resolution guard.

Archivo is the website's typeface (src/app/fonts.ts), so the printed book and the site
read as one brand. Static TTFs are vendored from Omnibus-Type/Archivo (OFL, see
scripts/fonts/archivo/OFL.txt) because MuPDF renders only the default instance of a
variable font, and a catalogue needs four weights and a wide display cut.

Spec: docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md
"""
from __future__ import annotations

from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[2]
FONT_DIR = ROOT / "scripts" / "fonts" / "archivo"

TRIM = pymupdf.Rect(0, 0, 595.276, 841.890)  # A4
BLEED = 8.504  # 3 mm
MARGIN_OUTER, MARGIN_INNER = 46.0, 58.0
MARGIN_TOP, MARGIN_BOTTOM = 54.0, 58.0

INK = (0.08, 0.075, 0.06)
INK2 = (0.34, 0.32, 0.29)
INK3 = (0.55, 0.53, 0.49)
RULE = (0.84, 0.82, 0.78)
# The one accent (rules, folios, section marks) is ink: the website's two colours, ink on
# white (client 2026-10-11: 「目录也改成墨白两色」). It was brass until then.
ACCENT = INK

FONT_FILES: dict[str, Path] = {
    "text": FONT_DIR / "Archivo-Regular.ttf",
    "text-medium": FONT_DIR / "Archivo-Medium.ttf",
    "text-semibold": FONT_DIR / "Archivo-SemiBold.ttf",
    "text-bold": FONT_DIR / "Archivo-Bold.ttf",
    "display": FONT_DIR / "ArchivoExpanded-Medium.ttf",
    "display-semibold": FONT_DIR / "ArchivoExpanded-SemiBold.ttf",
    # A safety net, not a known gap: checked 2026-10-08, Archivo covers every character
    # spec values use (— – × ° Ø ± ½ ¼ ≤ ≥). A character found missing later is drawn here.
    "fallback": Path("C:/Windows/Fonts/arial.ttf"),
}
FONTS: dict[str, pymupdf.Font] = {k: pymupdf.Font(fontfile=str(p)) for k, p in FONT_FILES.items()}


class LowResolution(ValueError):
    """Raised instead of placing an image that would print below the dpi floor."""


def has_glyph(key: str, ch: str) -> bool:
    return FONTS[key].has_glyph(ord(ch)) != 0


def fit(text: str, width: float, size: float, key: str = "text") -> str:
    """Trim to the measured width with an ellipsis, measured with the real font.

    The legacy generator measured with Helvetica. Archivo's widths differ, so a value
    trimmed for Helvetica would overrun its cell here. An ellipsis is the admission that
    there is more: a silently truncated "1040mm(length can be a" reads as a wrong length.
    """
    font = FONTS[key]
    text = " ".join(str(text).split())
    if font.text_length(text, size) <= width:
        return text
    while text and font.text_length(text + "…", size) > width:
        text = text[:-1]
    return text.rstrip(" ,;") + "…"


IMAGE_CACHE = ROOT / "tmp" / "catalogue-images"


def readable(path: Path) -> Path:
    """A file MuPDF can embed. The site's photographs are WebP, which MuPDF cannot read,
    so they are converted once to JPEG at quality 95 (no resizing) and cached in tmp/."""
    path = Path(path)
    if path.suffix.lower() not in (".webp",):
        return path
    from PIL import Image
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    out = IMAGE_CACHE / (path.stem + ".jpg")
    if not out.exists() or out.stat().st_mtime < path.stat().st_mtime:
        with Image.open(path) as im:
            im.convert("RGB").save(out, "JPEG", quality=95, subsampling=0)
    return out


def max_print_width(px: int, min_dpi: int = 200) -> float:
    """The widest an image of `px` pixels may print, in points, at `min_dpi`."""
    return px / min_dpi * 72.0


def place_image(page: pymupdf.Page, rect: pymupdf.Rect, path: Path, min_dpi: int = 200) -> pymupdf.Rect:
    """Fit an image inside `rect` (aspect kept, centred), refusing anything below `min_dpi`.

    Measured 2026-10-08: product photographs are 648–2100 px on the long side (median
    1000), the client's confirmed factory photographs at most 1308 px. At full-page size
    the median product prints near 65 dpi — the difference between a premium book and a
    blurred one. This guard makes that impossible to send to the printer by accident.
    """
    path = readable(path)
    pix = pymupdf.Pixmap(str(path))
    w, h = pix.width, pix.height
    scale = min(rect.width / w, rect.height / h)
    dw, dh = w * scale, h * scale
    dpi = w / (dw / 72.0)
    if dpi < min_dpi - 0.01:  # a box computed exactly at the limit lands at 199.9999…
        raise LowResolution(f"{path.name}: {w}px printed {dw:.0f}pt wide = {dpi:.0f} dpi < {min_dpi}")
    x0 = rect.x0 + (rect.width - dw) / 2
    y0 = rect.y0 + (rect.height - dh) / 2
    target = pymupdf.Rect(x0, y0, x0 + dw, y0 + dh)
    page.insert_image(target, filename=str(path))
    return target
