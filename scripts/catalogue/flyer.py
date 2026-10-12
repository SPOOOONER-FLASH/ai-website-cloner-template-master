"""HYDE Canton Fair flyer: a 10-panel accordion (5 per side), the catalogue's look in your pocket.

    py scripts/catalogue/flyer.py --out-dir DIR

Client, 2026-10-11: a short "best of" flyer for the 140th Canton Fair, with QR codes, in
the long accordion format of the old Hyland flyer. Flat 500 x 210 mm, folds to 100 x 210.
Writes <out-dir>/HYDE-flyer-2026-print.pdf (3 mm bleed, crop and fold marks, 2 pages =
outside and inside) and <out-dir>/HYDE-flyer-2026-screen.pdf.

Folding (zigzag): outside A1..A5 left to right, inside B1..B5 left to right as printed; B1
backs A5. Folded, A1 is the cover and B1 the back cover.

Same rules as the catalogue (docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md):
real cut-out photographs only (no as-shot plates, which carry the old supplier watermark),
spec rows only as the product states them, no certification claims, the legal name as fixed
2026-09-28. Products are chosen, not invented: featured models first, then the cards with
the most stated spec rows, one finish per design.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import pymupdf

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "brand"))
from catalogue import heroes, qr, samples, style, variants  # noqa: E402
import hyde_mark as hm  # noqa: E402
import kit  # noqa: E402

MM = 72 / 25.4
PANEL_W, PANEL_H, PANELS = 100 * MM, 210 * MM, 5
BLEED, SLUG = 3 * MM, 12 * MM
PAD = 6.5 * MM
COMPANY = samples.COMPANY
CONTACT = [
    ("Factory", "No. 76 Haiwei Road, Zhongshan, Guangdong, China"),
    ("Germany", "Koblenzerstr. 29, 56656 Brohl-Lützing"),
    ("Email", "tec@cantonlock.com"),
    ("Phone", "+1 703 967 7493"),
    ("Web", "cantonlock.com"),
]
FEATURED = {"307", "311", "305", "316-D", "309-D", "302", "LC14", "564", "9014", "575", "578", "70722"}

# (title, [(family slug, count)]) for each product panel, in print order A3 A4 A5 B2 B3 B4 B5.
PRODUCT_PANELS = [
    ("Panic exit devices", [("panic-exit-devices", 10)]),
    ("Lock cases & cylinders", [("lock-cases", 6), ("lock-cylinders", 4)]),
    ("Levers & stainless handles", [("lever-handles", 6), ("stainless-steel-handles", 4)]),
    ("Knob & tubular locks", [("knob-locks", 10)]),
    ("Grip sets, rim & hook locks", [("grip-handle-sets", 4), ("night-latches-rim-locks", 4), ("sliding-hook-locks", 2)]),
    ("Hinges & accessories", [("brass-steel-hinges", 5), ("hardware-accessories", 5)]),
    ("Glass door & bathroom", [("glass-door-accessories", 6), ("bathroom-accessories", 4)]),
]


def _base(model: str) -> str:
    """'575 ABET' -> '575'; '9014 SSBK' -> '9014': one finish per design on a flyer."""
    return re.split(r"[\s*]", str(model).strip())[0]


def pick(slug: str, n: int) -> list[variants.Card]:
    fam = next(f for f in heroes.families() if f.slug == slug)
    good = [c for c in variants.cards(samples.ordered(fam))
            if heroes.hero_plate(c.product) and len(samples.card_specs(slug, c.product, 2)) >= 1
            and not re.match(r"^\d+\*\d", str(c.model))]  # "6*3*3mm" is a size, not a model
    good.sort(key=lambda c: (_base(c.model) not in FEATURED and c.model not in FEATURED,
                             -len(samples.card_specs(slug, c.product, 3))))
    out, seen = [], set()
    for c in good:
        if _base(c.model) in seen:
            continue
        seen.add(_base(c.model))
        out.append(c)
        if len(out) == n:
            break
    return out


class Sheet:
    """One side of the flat sheet. Panel i spans x in [i*PANEL_W, (i+1)*PANEL_W] in trim units."""

    def __init__(self, doc, print_mode: bool):
        self.off = BLEED + SLUG if print_mode else 0.0
        w, h = PANELS * PANEL_W + 2 * self.off, PANEL_H + 2 * self.off
        self.page = doc.new_page(width=w, height=h)
        if print_mode:
            trim = pymupdf.Rect(self.off, self.off, self.off + PANELS * PANEL_W, self.off + PANEL_H)
            self.page.set_trimbox(trim)
            self.page.set_bleedbox(trim + (-BLEED, -BLEED, BLEED, BLEED))
            self._marks(trim)

    def _marks(self, trim):
        s = self.page.new_shape()
        g, ln = BLEED + 2, 10
        for x, y, dx, dy in ((trim.x0, trim.y0, -1, -1), (trim.x1, trim.y0, 1, -1),
                             (trim.x0, trim.y1, -1, 1), (trim.x1, trim.y1, 1, 1)):
            s.draw_line((x + dx * g, y), (x + dx * (g + ln), y))
            s.draw_line((x, y + dy * g), (x, y + dy * (g + ln)))
        for i in range(1, PANELS):  # fold marks, dashed, outside the bleed
            x = trim.x0 + i * PANEL_W
            s.draw_line((x, trim.y0 - g), (x, trim.y0 - g - ln))
            s.draw_line((x, trim.y1 + g), (x, trim.y1 + g + ln))
        s.finish(color=(0, 0, 0), width=0.3, dashes="[2 1] 0")
        s.commit()

    def r(self, x0, y0, x1, y1):
        return pymupdf.Rect(x0 + self.off, y0 + self.off, x1 + self.off, y1 + self.off)

    def text(self, x, y, t, size, key="text", color=style.INK, track=0.0, align="left"):
        f = style.FONTS[key]
        w = f.text_length(t, size) + size * track / 1000 * max(len(t) - 1, 0)
        x = x - w / 2 if align == "center" else x - w if align == "right" else x
        cx = x + self.off
        if not track:
            self.page.insert_text((cx, y + self.off), t, fontname="f-" + key,
                                  fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color)
            return w
        for ch in t:
            self.page.insert_text((cx, y + self.off), ch, fontname="f-" + key,
                                  fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color)
            cx += f.text_length(ch, size) + size * track / 1000
        return w

    def para(self, x0, y0, x1, y1, t, size, key="text", color=style.INK, leading=1.45):
        rc = self.page.insert_textbox(self.r(x0, y0, x1, y1), t, fontname="f-" + key,
                                      fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color, lineheight=leading)
        if rc < 0:
            raise ValueError(f"text overflows by {-rc:.1f}pt: {t[:40]}")
        return (y1 - y0) - rc

    def rule(self, x0, y, x1, color=style.RULE, width=0.4):
        self.page.draw_line((x0 + self.off, y + self.off), (x1 + self.off, y + self.off), color=color, width=width)

    def fill(self, x0, y0, x1, y1, color):
        self.page.draw_rect(self.r(x0, y0, x1, y1), color=None, fill=color, width=0)

    def image(self, x0, y0, x1, y1, path, min_dpi=200):
        return style.place_image(self.page, self.r(x0, y0, x1, y1), path, min_dpi)

    def mark(self, x0, y0, x1, y1, mark, color=hm.INK, legal=False):
        return kit.place_mark(self.page, self.r(x0, y0, x1, y1), mark, color, legal)

    def qr(self, x0, y0, size, url):
        qr.draw_qr(self.page, self.r(x0, y0, x0 + size, y0 + size), url)


# --------------------------------------------------------------------------- panels


def cover(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.mark(x0, 16 * MM, x1, 46 * MM, hm.stacked())
    fam = next(f for f in heroes.families() if f.slug == "lever-handles")
    _, hero = heroes.hero_for(fam)
    top, bottom = 58 * MM, 150 * MM
    path = style.readable(hero)
    pix = pymupdf.Pixmap(str(path))
    mw, mh = style.max_print_width(pix.width), style.max_print_width(pix.height)
    k = min((x1 - x0) / mw, (bottom - top) / mh, 1.0)
    bw, bh = mw * k, mh * k
    s.image(x0 + (x1 - x0 - bw) / 2, bottom - bh, x0 + (x1 - x0 + bw) / 2, bottom, hero)
    s.rule(x0, 160 * MM, x0 + 14 * MM, style.BRASS, 1.0)
    s.para(x0, 164 * MM, x1, 190 * MM, "Door hardware, made in our own factory since 1998.", 13, "display", style.INK, 1.25)
    s.text(x0, 196 * MM, "PANIC EXIT · LOCKS · HANDLES · HINGES · GLASS · BATHROOM", 4.9, "text-medium", style.INK3, track=90)


def factory_panel(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 18 * MM, "THE FACTORY", 6, "text-medium", style.BRASS, track=160)
    s.para(x0, 21 * MM, x1, 42 * MM, "A factory, not a trading office.", 14, "display", style.INK, 1.2)
    photo = samples.COMPANY_PHOTOS / "press-shop.webp"
    s.image(x0, 46 * MM, x1, 98 * MM, photo)
    facts = [
        ("Since 1998", "Founded in Xiaolan, Zhongshan, the town that ships close to a third of China's lock exports."),
        ("Our own parts", "We stamp, polish, assemble and inspect our own parts."),
        ("OEM & tooling", "Bring a drawing or a sample and we tool it. Much of what we make ships under our customers' brands."),
        ("Orders", "Most models start between 300 and 5,000 pieces. Samples are charged and credited against the first order."),
        ("Markets", "Europe, Russia, the Americas, Turkey and Southeast Asia. An office in Germany; a Spanish-speaking team."),
        ("Inquiries", "Send the model, finish code, quantity and door thickness. A sample confirms the rest."),
    ]
    y = 106 * MM
    for head, body in facts:
        s.text(x0, y, head.upper(), 5.6, "text-semibold", style.INK, track=100)
        used = s.para(x0, y + 2.2 * MM, x1, y + 22 * MM, body, 6.6, "text", style.INK2, 1.4)
        y += 2.2 * MM + used + 4 * MM


def back_cover(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.fill(i * PANEL_W - (BLEED if i == 0 else 0), -BLEED, (i + 1) * PANEL_W, PANEL_H + BLEED, kit.INK)
    s.mark(x0, 20 * MM, x1, 40 * MM, hm.horizontal(), hm.WHITE)
    q = 46 * MM
    qx = x0 + (x1 - x0 - q) / 2
    s.fill(qx - 3 * MM, 56 * MM - 3 * MM, qx + q + 3 * MM, 56 * MM + q + 3 * MM, (1, 1, 1))
    s.qr(qx, 56 * MM, q, "https://cantonlock.com/")
    s.text((x0 + x1) / 2, 113 * MM, "SCAN FOR EVERY PRODUCT AND ITS FULL SPECIFICATIONS", 5.2, "text-medium", style.BRASS,
           track=80, align="center")
    y = 128 * MM
    for label, value in CONTACT:
        s.text(x0, y, label.upper(), 5.4, "text-medium", (0.7, 0.68, 0.64), track=140)
        s.para(x0 + 17 * MM, y - 2.4 * MM, x1, y + 8 * MM, value, 7, "text", (1, 1, 1), 1.3)
        y += 11 * MM
    s.para(x0, 186 * MM, x1, 202 * MM, COMPANY, 6.2, "text-semibold", (1, 1, 1), 1.3)


def product_panel(s: Sheet, i: int, title: str, groups: list[tuple[str, int]]) -> int:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    first = groups[0][0]
    s.text(x0, 15 * MM, title.upper(), 7.2, "display-semibold", style.INK, track=40)
    s.rule(x0, 18.5 * MM, x0 + 10 * MM, style.BRASS, 1.0)
    q = 13 * MM
    s.qr(x1 - q, 7 * MM, q, qr.family_url(first))
    s.text(x0, 23.5 * MM, "Full specifications: scan the code", 5.2, "text", style.INK3)
    cards = [(slug, c) for slug, n in groups for c in pick(slug, n)]
    cols, rows = 2, 5
    gx, gy = 4 * MM, 3.2 * MM
    top, bottom = 28 * MM, PANEL_H - 8 * MM
    cw = (x1 - x0 - gx) / cols
    ch = (bottom - top - (rows - 1) * gy) / rows
    box_h = ch * 0.58
    for k, (slug, c) in enumerate(cards[: cols * rows]):
        cx0 = x0 + (k % cols) * (cw + gx)
        cy0 = top + (k // cols) * (ch + gy)
        s.image(cx0, cy0, cx0 + cw, cy0 + box_h, samples.grid_plate(c.product))
        y = cy0 + box_h + 4.2 * MM
        s.text(cx0, y, style.fit(c.model, cw, 8.2, "text-semibold"), 8.2, "text-semibold", style.INK)
        y += 3.2 * MM
        s.text(cx0, y, style.fit(c.name, cw, 5.4), 5.4, "text", style.INK2)
        for label, value in samples.card_specs(slug, c.product, 2):
            y += 3.1 * MM
            lab = style.fit(label, cw * 0.48, 4.9)
            s.text(cx0, y, lab, 4.9, "text", style.INK3)
            room = cw - style.FONTS["text"].text_length(lab, 4.9) - 4
            s.text(cx0 + cw, y, style.fit(value, max(room, 10), 4.9, "text-medium"), 4.9, "text-medium", style.INK, align="right")
    return len(cards)


def render(out: Path, print_mode: bool) -> tuple[Path, int]:
    doc = pymupdf.open()
    # One side at a time: a page object loses its document once the next page is created.
    outside = Sheet(doc, print_mode)
    cover(outside, 0)
    factory_panel(outside, 1)
    n = 0
    for k, (title, groups) in enumerate(PRODUCT_PANELS[:3]):
        n += product_panel(outside, 2 + k, title, groups)
    inside = Sheet(doc, print_mode)
    back_cover(inside, 0)
    for k, (title, groups) in enumerate(PRODUCT_PANELS[3:]):
        n += product_panel(inside, 1 + k, title, groups)
    doc.set_metadata({"title": "HYDE — Canton Fair flyer 2026", "author": COMPANY, "subject": "Door hardware"})
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out, garbage=4, deflate=True)
    return out, n


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(style.ROOT / "tmp" / "claude-brand" / "out"))
    d = Path(ap.parse_args().out_dir)
    for mode, name in ((True, "print"), (False, "screen")):
        path, n = render(d / f"HYDE-flyer-2026-{name}.pdf", mode)
        print(f"{name}: {path} ({n} products)")


if __name__ == "__main__":
    main()
