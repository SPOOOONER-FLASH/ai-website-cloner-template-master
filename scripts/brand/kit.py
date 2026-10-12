"""Shared drawing for the brand kit, the factory signage and the Canton Fair flyer.

Everything is composed on PyMuPDF pages: the mark is placed as vector (SVG -> PDF ->
show_pdf_page), text is Archivo embedded, so a print shop gets sharp vectors at any size.
`outlined_svg()` re-exports a page with text converted to paths, for an ad company that
cannot install fonts.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import hyde_mark as hm  # noqa: E402

FONT_DIR = ROOT / "scripts" / "fonts" / "archivo"
FONTS = {
    "text": FONT_DIR / "Archivo-Regular.ttf",
    "medium": FONT_DIR / "Archivo-Medium.ttf",
    "semibold": FONT_DIR / "Archivo-SemiBold.ttf",
    "bold": FONT_DIR / "Archivo-Bold.ttf",
    "display": FONT_DIR / "ArchivoExpanded-Medium.ttf",
    "display-semibold": FONT_DIR / "ArchivoExpanded-SemiBold.ttf",
    # Chinese: Microsoft YaHei ships with Windows; the ad company sets the final Chinese in
    # its own licensed face (see the production notes), this is for layout and proofing.
    "cjk": Path("C:/Windows/Fonts/msyh.ttc"),
    "cjk-bold": Path("C:/Windows/Fonts/msyhbd.ttc"),
}
_F: dict[str, pymupdf.Font] = {}


def font(key: str) -> pymupdf.Font:
    if key not in _F:
        _F[key] = pymupdf.Font(fontfile=str(FONTS[key]))
    return _F[key]


def rgb(hex_: str) -> tuple[float, float, float]:
    h = hex_.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


INK, BRASS, WHITE = rgb(hm.INK), rgb(hm.BRASS), (1, 1, 1)
GREY, LIGHT, RULE = (0.45, 0.43, 0.40), (0.96, 0.955, 0.945), (0.84, 0.82, 0.78)
MM = 72 / 25.4


def text_width(txt: str, size: float, key: str = "text", track: float = 0.0) -> float:
    f = font(key)
    return f.text_length(txt, size) + size * track / 1000 * max(len(txt) - 1, 0)


def text(page: pymupdf.Page, x: float, y: float, txt: str, size: float, key: str = "text",
         color=INK, track: float = 0.0, align: str = "left") -> float:
    """One line at baseline y. `track` in em/1000. Returns the drawn width."""
    w = text_width(txt, size, key, track)
    if align == "center":
        x -= w / 2
    elif align == "right":
        x -= w
    if not track:
        page.insert_text((x, y), txt, fontname="f-" + key, fontfile=str(FONTS[key]), fontsize=size, color=color)
        return w
    cx = x
    for ch in txt:
        page.insert_text((cx, y), ch, fontname="f-" + key, fontfile=str(FONTS[key]), fontsize=size, color=color)
        cx += font(key).text_length(ch, size) + size * track / 1000
    return w


def fit_track(txt: str, size: float, key: str, width: float) -> float:
    """The tracking (em/1000) that makes `txt` exactly `width` wide at `size`."""
    natural = font(key).text_length(txt, size)
    return (width - natural) / max(len(txt) - 1, 1) / size * 1000


def place_mark(page: pymupdf.Page, rect: pymupdf.Rect, mark: hm.Mark, color: str = hm.INK,
               legal: bool = False) -> pymupdf.Rect:
    """Fit `mark` inside `rect` (centred, aspect kept) as vector; optionally the legal line."""
    src = pymupdf.open(stream=hm.svg(mark, color=color).encode(), filetype="svg")
    pdf = pymupdf.open("pdf", src.convert_to_pdf())
    s = min(rect.width / mark.width, rect.height / mark.height)
    w, h = mark.width * s, mark.height * s
    target = pymupdf.Rect(rect.x0 + (rect.width - w) / 2, rect.y0 + (rect.height - h) / 2, 0, 0)
    target.x1, target.y1 = target.x0 + w, target.y0 + h
    page.show_pdf_page(target, pdf, 0)
    if legal and mark.legal:
        x, base, lw, cap = mark.legal
        # Size from the width, not the cap: the legal name is long, so it is set as large as
        # fits the wordmark's width at a light +60 tracking, and never squeezed below 0.
        unit = font("medium").text_length(hm.LEGAL, 1) + 60 / 1000 * (len(hm.LEGAL) - 1)
        size = min(lw * s / unit, cap * s / 0.72)
        tr = max(fit_track(hm.LEGAL, size, "medium", lw * s), 0)
        text(page, target.x0 + x * s, target.y0 + base * s, hm.LEGAL, size, "medium", rgb(color), track=tr)
    return target


def outlined_svg(page: pymupdf.Page) -> str:
    """The page as SVG with every glyph converted to a path: no font needed to open it."""
    return page.get_svg_image(text_as_path=True)


def save_pdf(doc: pymupdf.Document, out: Path, title: str) -> Path:
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.set_metadata({"title": title, "author": "Canton Hyland Hardware & Building Material Co., Ltd.",
                      "subject": "HYDE brand"})
    doc.save(out, garbage=4, deflate=True)
    return out
