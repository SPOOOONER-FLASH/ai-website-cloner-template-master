"""Four sample pages of the redesigned catalogue, for the client's approval (2026-10-09).

    py scripts/catalogue/samples.py --out tmp/catalogue-samples/hyde-samples-screen.pdf
    py scripts/catalogue/samples.py --out tmp/catalogue-samples/hyde-samples-print.pdf --print

Pages: cover, factory (front matter), one family opener, one 3x3 product page.
Spec: docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md
Plan: docs/superpowers/plans/2026-10-08-canton-fair-catalogue-samples.md

Print mode follows what a print shop's preflight reads: the MediaBox is the trim plus
3 mm bleed plus a slug for crop marks, with TrimBox and BleedBox set. Screen mode is the
trim alone.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pymupdf

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from catalogue import heroes, qr, style  # noqa: E402
from catalogue.heroes import legacy  # noqa: E402

ROOT = style.ROOT
COMPANY = "Canton Hyland Hardware & Building Material Co., Ltd."
COMPANY_PHOTOS = ROOT / "public" / "images" / "company"
SLUG = 22.0  # room outside the bleed for crop marks

# Per-family priority of spec labels shown under each product. A card lists the first
# three that the product actually states. Not "—" rows: on a card, a dash per unknown row
# makes the page look unfinished, and leaving an unstated row off claims nothing.
KEY_SPECS: dict[str, list[str]] = {
    "panic-exit-devices": ["Type", "Material", "Length", "Door thickness", "Finish"],
}
DEFAULT_KEY_SPECS = ["Material", "Finish", "Size"]

# Accessories after the products they accessorise, so a family's first page shows the
# family. Matched against the product name.
ACCESSORY_WORDS = ("Trim", "Accessor", "Spare", "Part", "Cover")


# --------------------------------------------------------------------------- canvas


class Canvas:
    """Draw in trim coordinates; the offset to the bleed-and-slug page is applied here."""

    def __init__(self, doc: pymupdf.Document, print_mode: bool):
        self.print_mode = print_mode
        pad = style.BLEED + SLUG if print_mode else 0.0
        self.off = pad
        w, h = style.TRIM.width + 2 * pad, style.TRIM.height + 2 * pad
        self.page = doc.new_page(width=w, height=h)
        if print_mode:
            trim = pymupdf.Rect(pad, pad, pad + style.TRIM.width, pad + style.TRIM.height)
            bleed = trim + (-style.BLEED, -style.BLEED, style.BLEED, style.BLEED)
            self.page.set_bleedbox(bleed)
            self.page.set_trimbox(trim)
            self._crop_marks(trim)

    def r(self, x0, y0, x1, y1) -> pymupdf.Rect:
        return pymupdf.Rect(x0 + self.off, y0 + self.off, x1 + self.off, y1 + self.off)

    def p(self, x, y) -> pymupdf.Point:
        return pymupdf.Point(x + self.off, y + self.off)

    def _crop_marks(self, trim: pymupdf.Rect) -> None:
        gap, length = style.BLEED + 3, 14
        s = self.page.new_shape()
        for x, y, dx, dy in ((trim.x0, trim.y0, -1, -1), (trim.x1, trim.y0, 1, -1),
                             (trim.x0, trim.y1, -1, 1), (trim.x1, trim.y1, 1, 1)):
            s.draw_line((x + dx * gap, y), (x + dx * (gap + length), y))
            s.draw_line((x, y + dy * gap), (x, y + dy * (gap + length)))
        s.finish(color=(0, 0, 0), width=0.25)
        s.commit()

    def text(self, x, y, txt, size, key="text", color=style.INK, track=0.0) -> float:
        """One line at baseline (x, y). Returns the advance width. `track` in em/1000."""
        font_key = key
        if any(not style.has_glyph(key, ch) for ch in txt if not ch.isspace()):
            font_key = "fallback"
        name = "f-" + font_key
        fontfile = str(style.FONT_FILES[font_key])
        if not track:
            self.page.insert_text(self.p(x, y), txt, fontname=name, fontfile=fontfile,
                                  fontsize=size, color=color)
            return style.FONTS[font_key].text_length(txt, size)
        cx = x
        for ch in txt:
            self.page.insert_text(self.p(cx, y), ch, fontname=name, fontfile=fontfile,
                                  fontsize=size, color=color)
            cx += style.FONTS[font_key].text_length(ch, size) + size * track / 1000
        return cx - x

    def text_right(self, x_right, y, txt, size, key="text", color=style.INK) -> None:
        w = style.FONTS[key].text_length(txt, size)
        self.text(x_right - w, y, txt, size, key, color)

    def paragraph(self, x0, y0, x1, y1, txt, size, key="text", color=style.INK, leading=1.45) -> float:
        """A wrapped paragraph; raises rather than clipping silently. Returns height used."""
        rect = self.r(x0, y0, x1, y1)
        rc = self.page.insert_textbox(rect, txt, fontname="f-" + key, fontfile=str(style.FONT_FILES[key]),
                                      fontsize=size, color=color, lineheight=leading)
        if rc < 0:
            raise ValueError(f"text overflows its box by {-rc:.1f}pt: {txt[:50]}…")
        return (y1 - y0) - rc

    def rule(self, x0, y, x1, color=style.RULE, width=0.5) -> None:
        self.page.draw_line(self.p(x0, y), self.p(x1, y), color=color, width=width)

    def image(self, x0, y0, x1, y1, path: Path, min_dpi=200) -> pymupdf.Rect:
        return style.place_image(self.page, self.r(x0, y0, x1, y1), path, min_dpi)

    def hero(self, x0, y0, x1, y1, path: Path, align: str = "center", valign: str = "bottom",
             min_dpi=200) -> pymupdf.Rect:
        """A large photograph, as large as the area allows and the pixels support.

        The area is the most the layout offers; the box is shrunk to what the photograph
        can fill at `min_dpi`. Measured: every family's best cut-out prints at most
        105–126 mm wide, so on a page this is a product on white space, by necessity
        and by choice.
        """
        path = style.readable(path)
        pix = pymupdf.Pixmap(str(path))
        max_w = style.max_print_width(pix.width, min_dpi)
        max_h = style.max_print_width(pix.height, min_dpi)
        scale = min((x1 - x0) / max_w, (y1 - y0) / max_h, 1.0)
        bw, bh = max_w * scale, max_h * scale
        bx = {"left": x0, "right": x1 - bw}.get(align, x0 + ((x1 - x0) - bw) / 2)
        by = {"bottom": y1 - bh, "top": y0}.get(valign, y0 + ((y1 - y0) - bh) / 2)
        return self.image(bx, by, bx + bw, by + bh, path, min_dpi)

    def qr(self, x0, y0, size, url) -> None:
        qr.draw_qr(self.page, self.r(x0, y0, x0 + size, y0 + size), url)


# --------------------------------------------------------------------------- helpers

W, H = style.TRIM.width, style.TRIM.height
L, R = style.MARGIN_INNER, W - style.MARGIN_OUTER  # right-hand (recto) pages


def ordered(family: heroes.Family) -> list[dict]:
    """Main products first, accessories after; then by model."""
    def key(p: dict):
        name = p.get("name", "")
        return (any(w in name for w in ACCESSORY_WORDS), str(p.get("model", "")))
    return sorted(family.photographed, key=key)


def card_specs(family_slug: str, product: dict, n: int = 3) -> list[tuple[str, str]]:
    stated = legacy.spec_map(product)
    out = []
    for label in KEY_SPECS.get(family_slug, DEFAULT_KEY_SPECS):
        value = stated.get(label, "").strip()
        if value:
            out.append((label, value))
        if len(out) == n:
            break
    return out


def grid_plate(product: dict) -> Path | None:
    """The sharpest plate for a grid cell: the true-size plate if built, else the 460px one."""
    slug = heroes._slug(product)
    if not slug:
        return None
    hi = heroes.HI_PLATES / f"{slug}.jpg"
    return hi if hi.exists() else legacy.plate(slug)


def folio(c: Canvas, number: int, label: str) -> None:
    c.text(L, H - 34, label.upper(), 6.5, "text-medium", style.INK3, track=120)
    c.text_right(R, H - 34, f"{number:03d}", 7.5, "text-semibold", style.BRASS)


# --------------------------------------------------------------------------- pages


def cover(c: Canvas) -> None:
    fam = next(f for f in heroes.families() if f.slug == "lever-handles")
    _, hero = heroes.hero_for(fam)
    c.text(L, 118, "HYDE", 72, "display-semibold", style.INK, track=40)
    c.rule(L, 140, L + 64, style.BRASS, 1.2)
    c.text(L, 166, "Door hardware", 15, "text-medium", style.INK)
    c.text(L, 186, "Export catalogue 2026", 15, "text", style.INK2)
    c.text(L, 214, "SINCE 1998  ·  XIAOLAN, ZHONGSHAN, CHINA", 7, "text-medium", style.INK3, track=140)
    c.hero(L, 240, R, H - 100, hero, align="center", valign="middle")
    c.rule(L, H - 82, R, style.RULE, 0.5)
    c.text(L, H - 62, COMPANY, 8, "text-semibold", style.INK)
    c.text_right(R, H - 62, "cantonlock.com", 8, "text-medium", style.INK2)


def factory(c: Canvas) -> None:
    c.text(L, 96, "THE FACTORY", 7, "text-medium", style.BRASS, track=160)
    c.text(L, 128, "A factory, not a trading office.", 24, "display", style.INK)
    # One photograph as large as its pixels allow: 1308 px prints 166 mm at 200 dpi,
    # nearly the full text width. Two side by side came out stamp-sized.
    photo = c.hero(L, 156, R, 156 + 330, COMPANY_PHOTOS / "assembly-line.webp", align="left", valign="top")
    y_txt = photo.y1 - c.off + 34
    blocks = [
        ("Where we are",
         "Canton Hyland was founded in 1998 in Xiaolan, Zhongshan. Xiaolan has been called "
         "the southern lock city since 1986, and in 2004 it was named China's lock export base."),
        ("What we do best",
         "New tooling to your drawing or your sample. When a design meets someone else's patent, "
         "we rework the part or its appearance until it no longer conflicts."),
        ("Where it goes",
         "We export to Europe, Russia, North and South America, Turkey and Southeast Asia, and run "
         "our own office and resident company in Germany. We exhibited at the Cologne hardware fair "
         "for years; our Spanish-speaking team has exhibited in Lima and Buenos Aires."),
    ]
    for title, body in blocks:
        c.rule(L, y_txt, R, style.RULE, 0.5)
        c.text(L, y_txt + 22, title, 10, "text-semibold", style.INK)
        used = c.paragraph(L + 150, y_txt + 12, R, y_txt + 120, body, 9.2, "text", style.INK2)
        y_txt += max(used, 34) + 30
    folio(c, 4, "Canton Hyland")


def opener(c: Canvas, number: int) -> None:
    fam = next(f for f in heroes.families() if f.slug == "panic-exit-devices")
    _, hero = heroes.hero_for(fam)
    c.text(L, 96, f"{number:02d}", 9, "text-semibold", style.BRASS)
    c.rule(L + 22, 93, L + 70, style.BRASS, 0.8)
    c.text(L, 150, fam.name, 34, "display-semibold", style.INK)
    c.paragraph(L, 168, L + 330, 230, fam.summary, 11, "text", style.INK2, leading=1.4)
    c.text(L, 252, f"{len(fam.products)} MODELS", 7.5, "text-medium", style.INK3, track=140)
    c.hero(L, 290, R, H - 148, hero, align="right")
    qr_size = 58
    c.rule(L, H - 128, R, style.RULE, 0.5)
    c.qr(R - qr_size, H - 112, qr_size, qr.family_url(fam.slug))
    c.text(L, H - 92, "Full specifications online", 9.5, "text-semibold", style.INK)
    c.text(L, H - 77, qr.family_url(fam.slug).replace("https://", ""), 8, "text", style.INK2)
    folio(c, 7, fam.name)


def product_page(c: Canvas, number: int) -> list[dict]:
    fam = next(f for f in heroes.families() if f.slug == "panic-exit-devices")
    items = ordered(fam)[:9]
    gutter_x, gutter_y = 22, 18
    top, bottom = 64, H - 58
    cw = (R - L - 2 * gutter_x) / 3
    ch = (bottom - top - 2 * gutter_y) / 3
    box_h = ch * 0.56
    for i, p in enumerate(items):
        col, row = i % 3, i // 3
        x0 = L + col * (cw + gutter_x)
        y0 = top + row * (ch + gutter_y)
        path = grid_plate(p)
        if path:
            c.image(x0, y0, x0 + cw, y0 + box_h, path)
        y = y0 + box_h + 18
        c.text(x0, y, str(p.get("model", "")), 12, "text-semibold", style.INK)
        c.text(x0, y + 12, style.fit(p.get("name", ""), cw, 7.5, "text"), 7.5, "text", style.INK2)
        y += 22
        for label, value in card_specs(fam.slug, p):
            c.rule(x0, y - 7, x0 + cw, style.RULE, 0.35)
            c.text(x0, y + 2, label, 6.4, "text", style.INK3)
            v = style.fit(value, cw - 44, 6.4, "text-medium")
            c.text_right(x0 + cw, y + 2, v, 6.4, "text-medium", style.INK)
            y += 12
    folio(c, number, fam.name)
    return items


def render(out: Path, print_mode: bool) -> Path:
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open()
    cover(Canvas(doc, print_mode))
    factory(Canvas(doc, print_mode))
    opener(Canvas(doc, print_mode), 1)
    product_page(Canvas(doc, print_mode), 8)
    doc.set_metadata({"title": "HYDE — Export catalogue 2026 (sample pages)", "author": COMPANY})
    doc.save(out, garbage=4, deflate=True)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--print", dest="print_mode", action="store_true")
    a = ap.parse_args()
    print(render(a.out, a.print_mode))


if __name__ == "__main__":
    main()
