#!/usr/bin/env python
"""Print artwork for a HYDE reception desk: one front panel and two side panels.

---------------------------------------------------------------------------
WHY

Client, 2026-10-23: 「设计接待台广告，准备广告尺寸 1.6米/1米/50厘米」. Read as a desk
1600 mm wide, 1000 mm high and 500 mm deep, so the wrap is a 1600 x 1000 front and two
500 x 1000 ends. Change PANELS below if the vendor measures something else.

---------------------------------------------------------------------------
WHAT IS ON IT, AND WHAT IS NOT

Every product is a real HYDE catalogue photograph from public/images/products-hyde/ (the
small corner HYDE mark is cleared to white and the frame trimmed; nothing else is touched).
Each product sits in its own captioned cell, never composed into one scene, because the
products are not shown at true relative scale. Every claim (since 1998, ISO 9001:2015,
Xiaolan) is one the site already publishes. No render, no invented part.

---------------------------------------------------------------------------
PRINT SPEC

  · 1:1 size, 3 mm bleed on every edge, crop marks outside the bleed
  · colours set in CMYK: type 100K, large dark fields rich black C50 M40 Y40 K100
  · photographs converted to CMYK with full grey-component replacement, so stainless
    steel prints on black ink and stays neutral; resampled to 150 ppi at placed size
    (the sources are 1000 px catalogue shots, so this is the honest ceiling)
  · nothing a buyer needs sits in the bottom 100 mm (plinth / kick zone) or within 40 mm
    of a fold

  python scripts/build_reception_desk_ad.py --out <dir>

writes reception-<direction>-<panel>.pdf for both directions ("light", "dark"), plus
reception-<direction>-preview.png (all three panels unfolded, with dimensions).
"""
from __future__ import annotations

import argparse
import re
import subprocess
from pathlib import Path

from PIL import Image
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import CMYKColor
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "public/images/products-hyde"
FONTS = ROOT / "scripts/fonts/archivo"

BLEED = 3  # mm
MARK = 10  # mm of slug outside the bleed for crop marks
PPI = 150

PANELS = {"front": (1600, 1000), "left": (500, 1000), "right": (500, 1000)}
KICK = 100  # mm at the bottom that a plinth may hide

# (photo, category, model) — all on the HYDE catalogue (sites omits nothing / includes hyde)
FRONT_PRODUCTS = [
    ("9014-sset-stainless-steel-handle.webp", "Lever handles", "9014 SSET"),
    ("110-lock-case.webp", "Mortise locks", "AR4-110"),
    ("70-sndk-lock-cylinder.webp", "Lock cylinders", "70 SNDK"),
    ("ssh016-brass-and-steel-hinges.webp", "Hinges", "SSH016"),
    ("311-panic-exit-device.webp", "Panic exit devices", "311"),
    ("stainless-steel-glass-door-pull-handle.webp", "Pull handles", "Glass door pull"),
]
SIDE_PRODUCT = ("9014-sset-stainless-steel-handle.webp", "9014 SSET lever handle", "Satin stainless steel, US32D")

QR_URL = "https://cantonlock.com/?utm_source=reception_desk&utm_medium=print"

K100 = CMYKColor(0, 0, 0, 1)
RICH = CMYKColor(0.5, 0.4, 0.4, 1)
WHITE = CMYKColor(0, 0, 0, 0)
GREY = CMYKColor(0, 0, 0, 0.6)  # ink-secondary #6e6e73
LIGHT_GREY = CMYKColor(0, 0, 0, 0.35)
RULE = CMYKColor(0, 0, 0, 0.15)  # line #deddd8
RULE_DARK = CMYKColor(0, 0, 0, 0.7)

THEMES = {
    "light": dict(field=WHITE, ink=K100, sub=GREY, rule=RULE, tile=None),
    "dark": dict(field=RICH, ink=WHITE, sub=LIGHT_GREY, rule=RULE_DARK, tile=WHITE),
}

# ---------------------------------------------------------------------------- logo
# public/images/brand/hyde/hyde-logo-horizontal-black.svg, 960 x 240 units
LOGO_W, LOGO_H = 960.0, 240.0
LOGO_RECTS = [(24, 30, 34, 180, 17), (41, 103, 141, 34, 17), (200, 30, 34, 180, 17)]
LOGO_PATHS = [
    ("M0 0H22V39H94V0H116V101H94V58H22V101H0Z", 362.824),
    ("M0 0H28L64 42L101 0H129L75 56V101H53V56Z", 519.0),
    ("M0 0H62C95 0 114 18 114 50C114 83 95 101 62 101H0Z M22 18V83H59C80 83 92 70 92 50C92 30 80 18 59 18Z", 683.118),
    ("M0 0H101V18H21V40H92V57H21V83H101V101H0Z", 847.235),
]
LOGO_PATH_Y, LOGO_PATH_S = 75.441, 0.882353


def svg_path(c: canvas.Canvas, d: str, dx: float, dy: float, s: float):
    p = c.beginPath()
    x = y = 0.0
    for cmd, args in re.findall(r"([MHVLCZ])([^MHVLCZ]*)", d):
        n = [float(v) for v in args.split()]
        if cmd == "M":
            x, y = n
            p.moveTo(dx + x * s, dy + y * s)
        elif cmd == "L":
            for i in range(0, len(n), 2):
                x, y = n[i], n[i + 1]
                p.lineTo(dx + x * s, dy + y * s)
        elif cmd == "H":
            x = n[0]
            p.lineTo(dx + x * s, dy + y * s)
        elif cmd == "V":
            y = n[0]
            p.lineTo(dx + x * s, dy + y * s)
        elif cmd == "C":
            for i in range(0, len(n), 6):
                p.curveTo(*[(dx + n[i + j] * s) if j % 2 == 0 else (dy + n[i + j] * s) for j in range(6)])
                x, y = n[i + 4], n[i + 5]
        elif cmd == "Z":
            p.close()
    return p


def draw_logo(c, x, y_top, width, colour, mark_only=False):
    """Draw the horizontal logo with its top-left at (x, y_top), in points."""
    k = width / (240.0 if mark_only else LOGO_W)
    c.saveState()
    c.translate(x, y_top)
    c.scale(k, -k)  # SVG y runs down
    c.setFillColor(colour)
    for rx, ry, rw, rh, rr in LOGO_RECTS:
        c.roundRect(rx, ry, rw, rh, rr, stroke=0, fill=1)
    if not mark_only:
        for d, dx in LOGO_PATHS:
            c.drawPath(svg_path(c, d, dx, LOGO_PATH_Y, LOGO_PATH_S), stroke=0, fill=1, fillMode=0)
    c.restoreState()


# ---------------------------------------------------------------------------- photos
def clean_photo(name: str) -> Image.Image:
    """Clear the small corner HYDE mark to white and trim to the product."""
    im = Image.open(PHOTOS / name).convert("RGB")
    w, h = im.size
    g = im.convert("L")
    px = g.load()
    for top in (True, False):
        y0, y1 = (0, int(h * 0.09)) if top else (int(h * 0.91), h)
        box = (0, y0, int(w * 0.2), y1)
        dark = [(xx, yy) for yy in range(box[1], box[3]) for xx in range(box[0], box[2]) if px[xx, yy] < 200]
        if not dark:
            continue
        xs, ys = [p[0] for p in dark], [p[1] for p in dark]
        bx0, by0, bx1, by1 = min(xs), min(ys), max(xs), max(ys)
        if (bx1 - bx0) > w * 0.12 or (by1 - by0) > h * 0.04:
            continue  # product reaches into the corner: leave it alone
        pad = 6
        im.paste((255, 255, 255), (max(0, bx0 - pad), max(0, by0 - pad), bx1 + pad, by1 + pad))
    # levels: the catalogue shots sit on 240-250 off-white; lift that to paper white
    im = im.point(lambda v: 255 if v >= 236 else round(v * 255 / 236))
    g = im.convert("L").point(lambda v: 255 if v < 250 else 0)
    bbox = g.getbbox()
    if bbox:
        pad = int(max(w, h) * 0.02)
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
        im = im.crop(bbox)
    return im


def to_cmyk(im: Image.Image) -> Image.Image:
    """RGB -> CMYK with full grey-component replacement (neutral greys on K only)."""
    r, g, b = [ch.point(lambda v: 255 - v) for ch in im.split()]  # c', m', y'
    from PIL import ImageChops

    k = ImageChops.darker(ImageChops.darker(r, g), b)
    c = ImageChops.subtract(r, k)
    m = ImageChops.subtract(g, k)
    y = ImageChops.subtract(b, k)
    # drop sub-3% tints so the photo's paper-white edge prints as no ink at all
    c, m, y, k = [ch.point(lambda v: 0 if v < 8 else v) for ch in (c, m, y, k)]
    return Image.merge("CMYK", (c, m, y, k))


_cache: dict[tuple, ImageReader] = {}


def place_photo(c, name, x, y, w, h, bottom=True):
    """Fit a photo inside the box (points), bottom-aligned on a shared baseline."""
    im = clean_photo(name)
    iw, ih = im.size
    s = min(w / iw, h / ih)
    pw, ph = iw * s, ih * s
    px_w = max(1, round(pw / mm / 25.4 * PPI))
    px_h = max(1, round(ph / mm / 25.4 * PPI))
    key = (name, px_w, px_h)
    if key not in _cache:
        _cache[key] = ImageReader(to_cmyk(im.resize((px_w, px_h), Image.LANCZOS)))
    ox = x + (w - pw) / 2
    oy = y if bottom else y + (h - ph) / 2
    c.drawImage(_cache[key], ox, oy, pw, ph)


# ---------------------------------------------------------------------------- page
def register_fonts():
    for name in ("Regular", "Medium", "SemiBold", "Bold"):
        pdfmetrics.registerFont(TTFont(f"Archivo-{name}", str(FONTS / f"Archivo-{name}.ttf")))


def new_page(path: Path, w_mm: float, h_mm: float, theme):
    pw, ph = (w_mm + 2 * (BLEED + MARK)) * mm, (h_mm + 2 * (BLEED + MARK)) * mm
    c = canvas.Canvas(str(path), pagesize=(pw, ph))
    c.setTitle(path.stem)
    c.setAuthor("HYDE (Canton Hyland Hardware & Building Material Co., Ltd.)")
    # TrimBox / BleedBox so the RIP knows the finished size
    off = (BLEED + MARK) * mm
    c.setTrimBox((off, off, off + w_mm * mm, off + h_mm * mm))
    c.setBleedBox((off - BLEED * mm, off - BLEED * mm, off + (w_mm + BLEED) * mm, off + (h_mm + BLEED) * mm))
    # field, bleed included
    c.setFillColor(theme["field"])
    c.rect(off - BLEED * mm, off - BLEED * mm, (w_mm + 2 * BLEED) * mm, (h_mm + 2 * BLEED) * mm, stroke=0, fill=1)
    # crop marks in the slug, registration colour
    c.setStrokeColor(CMYKColor(1, 1, 1, 1))
    c.setLineWidth(0.25)
    for X in (off, off + w_mm * mm):
        for Y, d in ((off, -1), (off + h_mm * mm, 1)):
            c.line(X, Y + d * (BLEED + 1) * mm, X, Y + d * (BLEED + MARK - 1) * mm)
    for Y in (off, off + h_mm * mm):
        for X, d in ((off, -1), (off + w_mm * mm, 1)):
            c.line(X + d * (BLEED + 1) * mm, Y, X + d * (BLEED + MARK - 1) * mm, Y)
    c.translate(off, off)  # origin = bottom-left of trim, in points
    return c


def text(c, s, x, y, size_mm, font="Archivo-Medium", colour=K100, anchor="left", tracking=0.0):
    c.setFillColor(colour)
    size = size_mm * mm
    if tracking:
        c.saveState()
        t = c.beginText()
        t.setFont(font, size)
        t.setCharSpace(tracking * size)
        width = pdfmetrics.stringWidth(s, font, size) + tracking * size * (len(s) - 1)
        x0 = x - width if anchor == "right" else x - width / 2 if anchor == "center" else x
        t.setTextOrigin(x0, y)
        t.textLine(s)
        c.drawText(t)
        c.restoreState()
        return
    c.setFont(font, size)
    {"left": c.drawString, "right": c.drawRightString, "center": c.drawCentredString}[anchor](x, y, s)


def front(out: Path, theme):
    W, H = PANELS["front"]
    c = new_page(out, W, H, theme)
    ink, sub = theme["ink"], theme["sub"]
    M = 70  # side margin, mm
    top = H - 70
    draw_logo(c, M * mm, top * mm, 470 * mm, ink)
    text(c, "DOOR HARDWARE MANUFACTURER", (W - M) * mm, (top - 40) * mm, 13, "Archivo-SemiBold", ink, "right", 0.12)
    text(c, "Xiaolan, Zhongshan · since 1998", (W - M) * mm, (top - 64) * mm, 13, "Archivo-Regular", sub, "right")

    # headline
    text(c, "Made in our own factory, since 1998.", M * mm, 640 * mm, 62, "Archivo-SemiBold", ink)

    # product row: six captioned cells on one baseline
    n = len(FRONT_PRODUCTS)
    gap = 16
    cw = (W - 2 * M - gap * (n - 1)) / n
    cell_bottom, cell_top = 250, 570
    img_bottom = cell_bottom + 70
    for i, (photo, cat, model) in enumerate(FRONT_PRODUCTS):
        x = M + i * (cw + gap)
        if theme["tile"] is not None:
            c.setFillColor(theme["tile"])
            c.roundRect(x * mm, (img_bottom - 14) * mm, cw * mm, (cell_top - img_bottom + 14) * mm, 2 * mm, stroke=0, fill=1)
            place_photo(c, photo, (x + 14) * mm, img_bottom * mm, (cw - 28) * mm, (cell_top - img_bottom - 18) * mm, bottom=False)
        else:
            place_photo(c, photo, (x + 6) * mm, img_bottom * mm, (cw - 12) * mm, (cell_top - img_bottom) * mm)
            if i:
                c.setStrokeColor(theme["rule"])
                c.setLineWidth(0.8 * mm)
                c.line((x - gap / 2) * mm, (cell_bottom + 10) * mm, (x - gap / 2) * mm, cell_top * mm)
        text(c, cat, x * mm, (cell_bottom + 26) * mm, 13, "Archivo-SemiBold", ink)
        text(c, model, x * mm, (cell_bottom + 4) * mm, 11, "Archivo-Regular", sub)

    # footer, kept above the kick zone
    c.setStrokeColor(ink)
    c.setLineWidth(1.2 * mm)
    c.line(M * mm, 205 * mm, (W - M) * mm, 205 * mm)
    text(c, "cantonlock.com", M * mm, 140 * mm, 34, "Archivo-SemiBold", ink)
    text(c, "ISO 9001:2015 stamping plant", (W - M) * mm, 168 * mm, 13, "Archivo-Medium", ink, "right")
    text(c, "tec@cantonlock.com", (W - M) * mm, 140 * mm, 13, "Archivo-Regular", sub, "right")
    c.showPage()
    c.save()


def side(out: Path, theme, which: str):
    W, H = PANELS[which]
    c = new_page(out, W, H, theme)
    ink, sub = theme["ink"], theme["sub"]
    M = 55
    if which == "left":
        # mark + wordmark stacked, one product, its name
        draw_logo(c, M * mm, (H - 70) * mm, 120 * mm, ink, mark_only=True)
        text(c, "HYDE", M * mm, (H - 235) * mm, 30, "Archivo-SemiBold", ink, tracking=0.18)
        photo, name, finish = SIDE_PRODUCT
        box_b, box_t = 290, 680
        if theme["tile"] is not None:
            c.setFillColor(theme["tile"])
            c.roundRect(M * mm, box_b * mm, (W - 2 * M) * mm, (box_t - box_b) * mm, 2 * mm, stroke=0, fill=1)
            place_photo(c, photo, (M + 20) * mm, (box_b + 20) * mm, (W - 2 * M - 40) * mm, (box_t - box_b - 40) * mm, bottom=False)
        else:
            place_photo(c, photo, M * mm, box_b * mm, (W - 2 * M) * mm, (box_t - box_b) * mm, bottom=False)
        text(c, name, M * mm, 245 * mm, 14, "Archivo-SemiBold", ink)
        text(c, finish, M * mm, 222 * mm, 11, "Archivo-Regular", sub)
        c.setStrokeColor(ink)
        c.setLineWidth(1.2 * mm)
        c.line(M * mm, 170 * mm, (W - M) * mm, 170 * mm)
        text(c, "Since 1998", M * mm, 125 * mm, 14, "Archivo-Medium", ink)
    else:
        # facts + QR to the catalogue
        lines = [
            ("Our own factory", "Xiaolan, Zhongshan, China"),
            ("Since 1998", "Tooling, pressing, assembly, inspection"),
            ("ISO 9001:2015", "Certified stamping plant, OEM for export"),
        ]
        y = H - 110
        for head, body in lines:
            text(c, head, M * mm, y * mm, 22, "Archivo-SemiBold", ink)
            text(c, body, M * mm, (y - 32) * mm, 12, "Archivo-Regular", sub)
            y -= 115
        qs = 300
        qy = 230
        if theme["tile"] is None:
            fg, bg = K100, None
        else:
            fg, bg = K100, WHITE
            c.setFillColor(bg)
            c.roundRect(M * mm, (qy - 0) * mm, qs * mm, qs * mm, 2 * mm, stroke=0, fill=1)
        pad = 18 if bg else 0
        w = QrCodeWidget(QR_URL, barLevel="M")
        w.barFillColor = fg
        w.barStrokeColor = fg
        b = w.getBounds()
        bw, bh = b[2] - b[0], b[3] - b[1]
        d = Drawing((qs - 2 * pad) * mm, (qs - 2 * pad) * mm, transform=[(qs - 2 * pad) * mm / bw, 0, 0, (qs - 2 * pad) * mm / bh, 0, 0])
        d.add(w)
        renderPDF.draw(d, c, (M + pad) * mm, (qy + pad) * mm)
        text(c, "Scan for the full catalogue", M * mm, (qy - 40) * mm, 12, "Archivo-Medium", ink)
        text(c, "cantonlock.com", M * mm, (qy - 64) * mm, 12, "Archivo-Regular", sub)
    c.showPage()
    c.save()


def preview(out_dir: Path, direction: str):
    """Rasterise the three PDFs at trim size and lay them out unfolded, with dimensions."""
    from PIL import ImageDraw, ImageFont

    dpi = 24
    tiles = {}
    for p in ("left", "front", "right"):
        pdf = out_dir / f"reception-{direction}-{p}.pdf"
        stem = out_dir / f".prev-{direction}-{p}"
        subprocess.run(["pdftoppm", "-png", "-r", str(dpi), "-singlefile", "-cropbox", str(pdf), str(stem)], check=True)
        im = Image.open(f"{stem}.png").convert("RGB")
        Path(f"{stem}.png").unlink()
        cut = round((BLEED + MARK) / 25.4 * dpi)
        tiles[p] = im.crop((cut, cut, im.width - cut, im.height - cut))
    gap, pad, lab = 30, 60, 70
    total_w = sum(t.width for t in tiles.values()) + 2 * gap + 2 * pad
    total_h = tiles["front"].height + pad + lab + pad
    sheet = Image.new("RGB", (total_w, total_h), (236, 236, 232))
    dr = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(str(FONTS / "Archivo-Medium.ttf"), 26)
    x = pad
    labels = {"left": "LEFT END  500 × 1000 mm", "front": "FRONT  1600 × 1000 mm", "right": "RIGHT END  500 × 1000 mm"}
    for p in ("left", "front", "right"):
        t = tiles[p]
        sheet.paste(t, (x, pad))
        dr.rectangle((x - 1, pad - 1, x + t.width, pad + t.height), outline=(150, 150, 146))
        dr.text((x, pad + t.height + 22), labels[p], fill=(40, 40, 38), font=font)
        x += t.width + gap
    sheet.save(out_dir / f"reception-{direction}-preview.png")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "tmp/claude-reception-desk"))
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    register_fonts()
    for direction, theme in THEMES.items():
        front(out / f"reception-{direction}-front.pdf", theme)
        side(out / f"reception-{direction}-left.pdf", theme, "left")
        side(out / f"reception-{direction}-right.pdf", theme, "right")
        preview(out, direction)
        print(f"{direction}: 3 PDFs + preview -> {out}")


if __name__ == "__main__":
    main()
