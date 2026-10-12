"""HYDE Canton Fair flyer: a six-panel Z-fold (three per side), the catalogue's look in your pocket.

    py scripts/catalogue/flyer.py --out-dir DIR

Client, 2026-10-11: a short "best of" flyer for the 140th Canton Fair, with QR codes. The
first draft was a 10-panel accordion; the client found it 「不够流畅」 and asked for six
panels, front and back, with a folded preview. Flat 300 x 210 mm, folds to 100 x 210.

Writes to <out-dir>:
  HYDE-flyer-2026-print.pdf    2 pages = side A and side B, 3 mm bleed, crop and fold marks
  HYDE-flyer-2026-screen.pdf   6 single panels in reading order, for email
  传单预览/*.png                both sides flat, plus folded previews (closed, and each side
                               half-open in a zigzag) drawn from the same pages

Folding (Z): side A is A1 A2 A3 left to right, side B is B1 B2 B3 left to right as printed;
B3 backs A1. Folded, A3 is the cover and B3 the back cover. Opening the cover shows B1 | B2
(the factory, then the range with a code per family); opened flat, side A shows the twenty
selected models next to the cover.

Same rules as the catalogue (docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md):
real cut-out photographs only (no as-shot plates, which carry the old supplier watermark),
spec rows only as the product states them, no certification claims, the legal name as fixed
2026-09-28. Products are chosen, not invented: featured models first, then the cards with
the most stated spec rows, one finish per design. Ink on white only (client 2026-10-11).
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "brand"))
from catalogue import heroes, qr, samples, style, variants  # noqa: E402
import hyde_mark as hm  # noqa: E402
import kit  # noqa: E402

MM = 72 / 25.4
PANEL_W, PANEL_H, PANELS = 100 * MM, 210 * MM, 3
BLEED, SLUG = 3 * MM, 12 * MM
PAD = 6.5 * MM
COMPANY = samples.COMPANY
SITE = "https://cantonlock.com/"
CONTACT = [
    ("Factory", "No. 76 Haiwei Road, Zhongshan, Guangdong, China"),
    ("Germany", "Koblenzerstr. 29, 56656 Brohl-Lützing"),
    ("Email", "tec@cantonlock.com"),
    ("Phone", "+1 703 967 7493"),
    ("Web", "cantonlock.com"),
]
FEATURED = {"307", "311", "305", "316-D", "309-D", "302", "LC14", "564", "9014", "575", "578", "70722"}

# The range panel: one row and one code per family group; the code opens the first family.
RANGE = [
    ("Panic exit devices", ["panic-exit-devices"]),
    ("Lock cases & cylinders", ["lock-cases", "lock-cylinders"]),
    ("Levers & stainless handles", ["lever-handles", "stainless-steel-handles"]),
    ("Knob & tubular locks", ["knob-locks"]),
    ("Grip sets, rim & hook locks", ["grip-handle-sets", "night-latches-rim-locks", "sliding-hook-locks"]),
    ("Hinges & accessories", ["brass-steel-hinges", "hardware-accessories"]),
    ("Glass door & bathroom", ["glass-door-accessories", "bathroom-accessories"]),
]
# The two selected-models panels, ten cards each: (title, [(family slug, count)]).
PRODUCT_PANELS = [
    ("Panic exit & locks", [("panic-exit-devices", 6), ("lock-cases", 2), ("lock-cylinders", 2)]),
    ("Handles, hinges & glass", [("lever-handles", 3), ("stainless-steel-handles", 1), ("knob-locks", 2),
                                 ("brass-steel-hinges", 2), ("glass-door-accessories", 2)]),
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

    def __init__(self, doc, print_mode: bool, panels: int = PANELS):
        self.panels = panels
        self.off = BLEED + SLUG if print_mode else 0.0
        w, h = panels * PANEL_W + 2 * self.off, PANEL_H + 2 * self.off
        self.page = doc.new_page(width=w, height=h)
        if print_mode:
            trim = pymupdf.Rect(self.off, self.off, self.off + panels * PANEL_W, self.off + PANEL_H)
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
        for i in range(1, self.panels):  # fold marks, dashed, outside the bleed
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
    s.rule(x0, 160 * MM, x0 + 14 * MM, style.INK, 1.0)
    s.para(x0, 164 * MM, x1, 190 * MM, "Door hardware, made in our own factory since 1998.", 13, "display", style.INK, 1.25)
    s.text(x0, 196 * MM, "PANIC EXIT · LOCKS · HANDLES · HINGES · GLASS · BATHROOM", 4.9, "text-medium", style.INK3, track=90)


def factory_panel(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 18 * MM, "THE FACTORY", 6, "text-medium", style.INK, track=160)
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
    s.mark(x0 + 12 * MM, 22 * MM, x1 - 12 * MM, 36 * MM, hm.horizontal(), hm.INK)   # ink on white: the website's colours
    q = 46 * MM
    qx = x0 + (x1 - x0 - q) / 2
    s.qr(qx, 56 * MM, q, "https://cantonlock.com/")
    s.text((x0 + x1) / 2, 113 * MM, "SCAN FOR EVERY PRODUCT AND ITS FULL SPECIFICATIONS", 5.2, "text-medium", style.INK,
           track=80, align="center")
    y = 128 * MM
    for label, value in CONTACT:
        s.text(x0, y, label.upper(), 5.4, "text-medium", style.INK3, track=140)
        s.para(x0 + 17 * MM, y - 2.4 * MM, x1, y + 8 * MM, value, 7, "text", style.INK, 1.3)
        y += 11 * MM
    s.para(x0, 186 * MM, x1, 202 * MM, COMPANY, 6.2, "text-semibold", style.INK, 1.3)


def product_panel(s: Sheet, i: int, title: str, groups: list[tuple[str, int]]) -> int:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 11 * MM, "SELECTED MODELS", 5.4, "text-medium", style.INK3, track=160)
    s.text(x0, 16 * MM, title.upper(), 7.2, "display-semibold", style.INK, track=40)
    s.rule(x0, 19.5 * MM, x0 + 10 * MM, style.INK, 1.0)
    q = 13 * MM
    s.qr(x1 - q, 7 * MM, q, SITE + "products/")
    s.text(x0, 24.5 * MM, "Every model and its full specifications: scan the code", 5.2, "text", style.INK3)
    cards = [(slug, c) for slug, n in groups for c in pick(slug, n)]
    cols, rows = 2, 5
    gx, gy = 4 * MM, 3.2 * MM
    top, bottom = 29 * MM, PANEL_H - 8 * MM
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


def range_panel(s: Sheet, i: int) -> None:
    """The whole range on one panel: a photograph, model numbers and a code per family."""
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 18 * MM, "THE RANGE", 6, "text-medium", style.INK, track=160)
    s.para(x0, 21 * MM, x1, 36 * MM, "Scan a family for every model.", 14, "display", style.INK, 1.2)
    top, row = 40 * MM, 23.6 * MM
    q, img_w = 15 * MM, 22 * MM
    for k, (title, slugs) in enumerate(RANGE):
        y = top + k * row
        s.rule(x0, y, x1, style.RULE, 0.4)
        lead = next(c for slug in slugs for c in pick(slug, 1))
        s.image(x0, y + 2 * MM, x0 + img_w, y + row - 2 * MM, samples.grid_plate(lead.product))
        tx = x0 + img_w + 4 * MM
        tw = x1 - q - 3 * MM - tx
        s.text(tx, y + 8 * MM, style.fit(title, tw, 7.4, "text-semibold"), 7.4, "text-semibold", style.INK)
        models = [_base(c.model) for slug in slugs for c in pick(slug, -(-4 // len(slugs)))][:4]
        s.text(tx, y + 12.5 * MM, style.fit("  ·  ".join(models), tw, 5.6), 5.6, "text", style.INK2)
        s.text(tx, y + 16.5 * MM, "Scan for all models", 4.9, "text", style.INK3)
        s.qr(x1 - q, y + (row - q) / 2, q, qr.family_url(slugs[0]))
    s.rule(x0, top + len(RANGE) * row, x1, style.RULE, 0.4)


# Panels per side, left to right as printed (key, product-panel index), and reading order.
SIDE_A = [("products-1", 0), ("products-2", 1), ("cover", None)]
SIDE_B = [("factory", None), ("range", None), ("back", None)]
READING = ["cover", "factory", "range", "products-1", "products-2", "back"]


def draw_panel(s: Sheet, i: int, key: str, idx) -> int:
    if key.startswith("products"):
        title, groups = PRODUCT_PANELS[idx]
        return product_panel(s, i, title, groups)
    {"cover": cover, "factory": factory_panel, "range": range_panel, "back": back_cover}[key](s, i)
    return 0


def _side(doc, mode, panels) -> int:
    s = Sheet(doc, mode)
    return sum(draw_panel(s, i, key, idx) for i, (key, idx) in enumerate(panels))


def render_sides(out: Path | None, print_mode: bool) -> tuple[pymupdf.Document, int]:
    doc = pymupdf.open()
    # One side at a time: a page object loses its document once the next page is created.
    n = _side(doc, print_mode, SIDE_A)
    n += _side(doc, print_mode, SIDE_B)
    doc.set_metadata({"title": "HYDE — Canton Fair flyer 2026", "author": COMPANY, "subject": "Door hardware"})
    if out:
        out.parent.mkdir(parents=True, exist_ok=True)
        doc.save(out, garbage=4, deflate=True)
    return doc, n


def render_screen(out: Path) -> Path:
    doc = pymupdf.open()
    where = dict(SIDE_A + SIDE_B)
    for key in READING:
        draw_panel(Sheet(doc, False, panels=1), 0, key, where[key])
    doc.set_metadata({"title": "HYDE — Canton Fair flyer 2026", "author": COMPANY, "subject": "Door hardware"})
    doc.save(out, garbage=4, deflate=True)
    return out


# --------------------------------------------------------------------------- folded previews

BG = (239, 238, 235)


def _perspective(src_size, quad):
    """PIL PERSPECTIVE coefficients mapping the output quad (tl, tr, br, bl) onto the source."""
    w, h = src_size
    a = []
    for (x, y), (u, v) in zip(quad, [(0, 0), (w, 0), (w, h), (0, h)]):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y, v])
    for c in range(8):  # Gauss-Jordan with partial pivoting
        p = max(range(c, 8), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        for r in range(8):
            if r != c:
                f = a[r][c] / a[c][c]
                a[r] = [x - f * y for x, y in zip(a[r], a[c])]
    return [a[r][8] / a[r][r] for r in range(8)]


def _warp(canvas, panel, quad, shade):
    coeffs = _perspective(panel.size, quad)
    img = panel.transform(canvas.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    mask = Image.new("L", panel.size, 255).transform(canvas.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    canvas.paste(ImageEnhance.Brightness(img).enhance(shade), (0, 0), mask)


def _shadow(canvas, polys, blur):
    sh = Image.new("L", canvas.size, 0)
    d = ImageDraw.Draw(sh)
    for poly in polys:
        d.polygon(poly, fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas.paste(Image.new("RGB", canvas.size, (60, 58, 54)), (0, 0), sh)


def _zigzag(panels, path):
    """The three panels of one side half-open in a Z, fold edges alternately near and far."""
    w, h = panels[0].size
    pw, far = int(w * 0.82), 0.88
    W, H = int(3 * pw + 0.5 * w), int(h * 1.3)
    canvas = Image.new("RGB", (W, H), BG)
    x0, cy = (W - 3 * pw) // 2, H // 2 - int(0.02 * h)
    edges = [(x0 + k * pw, far if k % 2 == 0 else 1.0) for k in range(4)]
    quads = []
    for k in range(3):
        (xl, sl), (xr, sr) = edges[k], edges[k + 1]
        quads.append([(xl, cy - h * sl / 2), (xr, cy - h * sr / 2), (xr, cy + h * sr / 2), (xl, cy + h * sl / 2)])
    floor = [[(q[3][0] + 18, q[3][1] - 10), (q[2][0] + 18, q[2][1] - 10), (q[2][0] + 40, q[2][1] + 22),
              (q[3][0] + 40, q[3][1] + 22)] for q in quads]
    _shadow(canvas, floor, 22)
    for k, (panel, quad) in enumerate(zip(panels, quads)):
        _warp(canvas, panel, quad, 1.0 if k % 2 == 0 else 0.86)
    canvas.save(path)


def _closed(front, back, path):
    w, h = front.size
    gap = int(0.25 * w)
    W, H = 2 * w + 3 * gap, int(h * 1.2)
    canvas = Image.new("RGB", (W, H), BG)
    y = (H - h) // 2
    spots = [(gap, front), (2 * gap + w, back)]
    _shadow(canvas, [[(x + 14, y + 18), (x + w + 14, y + 18), (x + w + 14, y + h + 18), (x + 14, y + h + 18)]
                     for x, _ in spots], 16)
    for x, img in spots:
        canvas.paste(img, (x, y))
    canvas.save(path)


def previews(doc: pymupdf.Document, out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    sides, paths = [], []
    for pno, name in ((0, "外侧-展开.png"), (1, "内侧-展开.png")):
        pix = doc[pno].get_pixmap(dpi=150)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        img.save(out_dir / name)
        paths.append(out_dir / name)
        pw = img.width // PANELS
        sides.append([img.crop((k * pw, 0, (k + 1) * pw, img.height)) for k in range(PANELS)])
    a, b = sides
    folds = [out_dir / "折叠效果-1-合起-封面与封底.png", out_dir / "折叠效果-2-内侧-工厂-产品线-封底.png",
             out_dir / "折叠效果-3-外侧-精选产品-封面.png"]
    _closed(a[2], b[2], folds[0])
    _zigzag(b, folds[1])
    _zigzag(a, folds[2])
    return paths + folds


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(style.ROOT / "tmp" / "claude-brand" / "out"))
    d = Path(ap.parse_args().out_dir)
    _, n = render_sides(d / "HYDE-flyer-2026-print.pdf", True)
    print(f"print: {d / 'HYDE-flyer-2026-print.pdf'} ({n} products)")
    print(f"screen: {render_screen(d / 'HYDE-flyer-2026-screen.pdf')} (6 panels in reading order)")
    flat, _ = render_sides(None, False)
    for p in previews(flat, d / "传单预览"):
        print(f"preview: {p}")


if __name__ == "__main__":
    main()
