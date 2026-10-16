"""BAU 2027 stand C4.523: the band above the boards, wrapping three walls, and the counter front.

    python scripts/brand/build_bau_booth_band.py [--out-dir DIR]

Client, 2026-10-16, with the stand builder's render and a photo of another stand, the band above
the boards circled: 「展板上面明白吗 好好设计 既要标语也要产品图片 也要slogan 重新设计」.

The builder's render is the brief: three walls (left 4.50 m, back 6.50 m, right 4.50 m), a white
fascia over the open front, a lighting track, boards on all three walls (8 on the back, 4 on
each side) with their tops at about 1.95 m, two tables, a counter at the front left. The band is
the wall between the boards and the top of the wall. It reads left → back → right as one strip:

  left   OEM proof:   "Made to your drawing."  + the market lines (Brazil, Argentina) + a new model
  back   the brand:   logo plate, the slogan "Your brand. Our factory.", the brand line, five
                      best-selling models with their numbers
  right  the meeting: stand number, the QR code to the BAU page, three more models

Two colourways (ink band, white band) are rendered in the modelled stand from the aisle, and
both are written as production files: 1:10 PDF, page = bleed box (15 cm a side), TrimBox set.

ASSUMED until the builder confirms: wall height 2.50 m, band 0.55 m (boards' top at 1.95 m),
counter front 1.20 × 0.95 m. Every product picture is a real site photograph (cutout by flood
fill from the edges, see build_bau_booth_concepts.cutout); every line is a published fact.
"""
from __future__ import annotations

import argparse
import io
import math
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

import build_bau_booth_concepts as c
import build_bau_booth_graphics as g
import hyde_mark as hm
import kit
from kit import GREY, INK, WHITE, place_mark

S = c.S
H = 2.50
BAND = 0.55                    # band height, from the wall top down to the boards
BLEED = 0.15
WALLS = {"left": 4.50, "back": 6.50, "right": 4.50}
COUNTER = (1.20, 0.95)
OUT_DEFAULT = kit.ROOT / "docs" / "design-references" / "bau-2027-booth-band"
LIGHT = (0.74, 0.72, 0.69)

P = "products-hyde/"
PRODUCTS = {
    "left": [("brazil-collection/br1-sk", "BR series", "Brazil"), ("argentina-collection/ar5-112", "AR-5", "Argentina"),
             (P + "8829-bl-lever-handle", "8829 BL", "New")],
    "back": [(P + "307-panic-exit-device", "307", "Panic exit device"), (P + "lc14-85-50mm-lock-case", "LC14", "Lock case"),
             (P + "102-glass-door-handle", "102", "Pull handle"), (P + "9014s-stainless-steel-handle", "9014S", "Lever on rose"),
             (P + "311-panic-exit-device", "311", "Panic exit device")],
    "right": [(P + "564-night-latch-and-rim-lock", "564", "Night latch"), (P + "6068-mortise-lever-handle-lock", "6068", "Lock case"),
              (P + "587-sset-light-duty-cylindrical-lock", "587", "Knob lock")],
}


def t(page, x, y, s, size, key="text", color=INK, track=0.0, align="left"):
    return c.t(page, x, y, s, size, key, color, track, align)


def products_row(page, items, x0, x1, top, bottom, fg, sub):
    """Cutouts spread evenly between x0 and x1, each with its model and a two-word name under it."""
    n = len(items)
    cw = (x1 - x0) / n
    ih = bottom - top - 0.10
    for i, (path, model, name) in enumerate(items):
        cx = x0 + i * cw
        r = pymupdf.Rect((cx + 0.03) * S, top * S, (cx + cw - 0.03) * S, (top + ih) * S)
        page.insert_image(r, stream=c.cutout(path), keep_proportion=True)
        mw = t(page, cx + cw / 2, bottom - 0.035, model, 0.036, "semibold", fg, align="center")
        del mw
        t(page, cx + cw / 2, bottom + 0.005, name, 0.024, "text", sub, align="center")


def band(page, wall: str, w: float, ink: bool, x_off: float = 0.0, y_off: float = 0.0) -> None:
    """One wall's band, drawn with its top-left at (x_off, y_off) metres on the page."""
    bg, fg, sub, rule_c = (INK, WHITE, LIGHT, (0.32, 0.31, 0.29)) if ink else ((0.965, 0.962, 0.955), INK, GREY, (0.80, 0.78, 0.75))
    page.draw_rect(pymupdf.Rect(x_off * S, y_off * S, (x_off + w) * S, (y_off + BAND) * S), color=None, fill=bg, width=0)
    X = lambda m: x_off + m          # noqa: E731
    Y = lambda m: y_off + m          # noqa: E731
    mid = BAND / 2
    if wall == "back":
        # logo plate (white, rounded) on the left, as the reference stand does it
        pw_, ph_ = 1.20, 0.34
        r = pymupdf.Rect(X(0.18) * S, Y(mid - ph_ / 2) * S, X(0.18 + pw_) * S, Y(mid + ph_ / 2) * S)
        page.draw_rect(r, color=None, fill=WHITE, width=0, radius=0.12)
        if not ink:
            page.draw_rect(r, color=(0.80, 0.78, 0.75), width=0.002 * S, radius=0.12)
        m = hm.horizontal()
        mh = 0.13
        mw = mh * m.width / m.height
        place_mark(page, pymupdf.Rect(X(0.18 + (pw_ - mw) / 2) * S, Y(mid - mh / 2) * S, X(0.18 + (pw_ + mw) / 2) * S, Y(mid + mh / 2) * S), m)
        # slogan and brand line
        sx = 1.58
        t(page, X(sx), Y(0.135), "BAU 2027 · Messe München · Stand C4.523", 0.028, "semibold", sub, track=90)
        t(page, X(sx), Y(0.30), "Your brand. Our factory.", 0.150, "display-semibold", fg)
        t(page, X(sx), Y(0.375), "Ihre Marke. Unser Werk.", 0.042, "text", sub)
        t(page, X(sx), Y(0.445), "Panic exit devices, locks and door hardware · made in Zhongshan, China, since 1998", 0.030, "medium", fg)
        page.draw_line((X(3.98) * S, Y(0.08) * S), (X(3.98) * S, Y(BAND - 0.08) * S), color=rule_c, width=0.003 * S)
        products_row(page, PRODUCTS["back"], X(4.03), X(w - 0.10), Y(0.06), Y(BAND - 0.07), fg, sub)
    elif wall == "left":
        t(page, X(0.25), Y(0.135), "OEM · Private label · Eigenmarke", 0.028, "semibold", sub, track=90)
        t(page, X(0.25), Y(0.28), "Made to your drawing.", 0.118, "display-semibold", fg)
        t(page, X(0.25), Y(0.345), "Gefertigt nach Ihrer Zeichnung.", 0.036, "text", sub)
        t(page, X(0.25), Y(0.41), "Send a drawing or a sample: we cut the tool.", 0.028, "medium", fg)
        t(page, X(0.25), Y(0.455), "Lines made for Brazil and Argentina; most models from 300 pieces.", 0.028, "text", sub)
        page.draw_line((X(2.30) * S, Y(0.08) * S), (X(2.30) * S, Y(BAND - 0.08) * S), color=rule_c, width=0.003 * S)
        products_row(page, PRODUCTS["left"], X(2.35), X(w - 0.10), Y(0.06), Y(BAND - 0.07), fg, sub)
    else:  # right
        products_row(page, PRODUCTS["right"], X(0.10), X(2.05), Y(0.06), Y(BAND - 0.07), fg, sub)
        page.draw_line((X(2.12) * S, Y(0.08) * S), (X(2.12) * S, Y(BAND - 0.08) * S), color=rule_c, width=0.003 * S)
        t(page, X(2.25), Y(0.135), "Book a meeting · Termin vereinbaren", 0.028, "semibold", sub, track=90)
        t(page, X(2.25), Y(0.27), "cantonlock.com", 0.100, "display-semibold", fg)
        t(page, X(2.25), Y(0.335), "Models, spec sheets and meeting booking online.", 0.028, "medium", fg)
        t(page, X(2.25), Y(0.38), "Modelle, Datenblätter und Terminbuchung online.", 0.028, "text", sub)
        t(page, X(2.25), Y(0.455), "tec@cantonlock.com", 0.028, "medium", fg)
        q = 0.40
        qr = pymupdf.Rect(X(w - 0.12 - q) * S, Y(mid - q / 2) * S, X(w - 0.12) * S, Y(mid + q / 2) * S)
        g.draw_qr(page, qr, g.QR_URL)


def counter_front(page, ink: bool, x_off=0.0, y_off=0.0):
    w, h = COUNTER
    bg, fg, sub = (INK, WHITE, LIGHT) if ink else (WHITE, INK, GREY)
    page.draw_rect(pymupdf.Rect(x_off * S, y_off * S, (x_off + w) * S, (y_off + h) * S), color=None, fill=bg, width=0)
    m = hm.stacked()
    mh = 0.30
    mw = mh * m.width / m.height
    place_mark(page, pymupdf.Rect((x_off + (w - mw) / 2) * S, (y_off + 0.14) * S, (x_off + (w + mw) / 2) * S, (y_off + 0.14 + mh) * S), m, hm.WHITE if ink else hm.INK)
    t(page, x_off + w / 2, y_off + 0.60, "Your brand. Our factory.", 0.058, "display-semibold", fg, align="center")
    t(page, x_off + w / 2, y_off + 0.66, "Ihre Marke. Unser Werk.", 0.032, "text", sub, align="center")
    page.draw_rect(pymupdf.Rect(x_off * S, (y_off + h - 0.10) * S, (x_off + w) * S, (y_off + h) * S), color=None,
                   fill=WHITE if ink else INK, width=0)
    t(page, x_off + w / 2, y_off + h - 0.04, "cantonlock.com", 0.030, "medium", INK if ink else WHITE, align="center")


# ------------------------------------------------------------------------------- production
def production(out: Path, ink: bool) -> list[Path]:
    tag = "ink" if ink else "white"
    files = []
    jobs = [(k, w, BAND) for k, w in WALLS.items()] + [("counter", COUNTER[0], COUNTER[1])]
    for key, w, h in jobs:
        doc = pymupdf.open()
        page = doc.new_page(width=(w + 2 * BLEED) * S, height=(h + 2 * BLEED) * S)
        # bleed: extend the background, then draw the panel inside it
        page.draw_rect(page.rect, color=None, fill=(INK if ink else ((0.965, 0.962, 0.955) if key != "counter" else WHITE)), width=0)
        if key == "counter":
            counter_front(page, ink, BLEED, BLEED)
        else:
            band(page, key, w, ink, BLEED, BLEED)
        # The drawing is made at S = 100 pt per metre; 1:10 is 283.46 pt per metre. Place it, as
        # vector, on a page of the true 1:10 size.
        M = 100 * kit.MM
        final = pymupdf.open()
        fp = final.new_page(width=(w + 2 * BLEED) * M, height=(h + 2 * BLEED) * M)
        fp.draw_rect(fp.rect, color=None, fill=(INK if ink else ((0.965, 0.962, 0.955) if key != "counter" else WHITE)), width=0)
        fp.show_pdf_page(fp.rect, doc, 0)
        fp.set_trimbox(pymupdf.Rect(BLEED * M, BLEED * M, (w + BLEED) * M, (h + BLEED) * M))
        name = f"BAU2027-C4-523-{tag}-{key}-{w:.2f}x{h:.2f}m-bleed15cm-1to10.pdf"
        files.append(kit.save_pdf(final, out / "制作文件-1比10" / name, f"BAU 2027 C4.523 {key}"))
    return files


# --------------------------------------------------------------------------------- 3-D scene
W_IMG, H_IMG = 2000, 1100
CAM = np.array([3.25, -6.3, 1.60])
TARGET = np.array([3.25, 4.5, 1.55])
FOCAL = 1450.0
D = 4.50


def _basis():
    f = TARGET - CAM
    f /= np.linalg.norm(f)
    r = np.cross(f, [0, 0, 1.0])
    r /= np.linalg.norm(r)
    return f, r, np.cross(r, f)


F, R, U = _basis()


def proj(p):
    d = np.array(p, float) - CAM
    z = d @ F
    return (W_IMG / 2 + FOCAL * (d @ R) / z, H_IMG * 0.50 - FOCAL * (d @ U) / z)


def warp(canvas, tex, corners, shade=1.0):
    dst = [proj(p) for p in corners]
    src = [(0, 0), (tex.width, 0), (tex.width, tex.height), (0, tex.height)]
    coeffs = c.homography(src, dst)
    big = tex.transform(canvas.size, Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)
    if shade != 1.0:
        big = Image.eval(big, lambda v: int(v * shade))
    mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(mask).polygon(dst, fill=255)
    canvas.paste(big, (0, 0), mask)


def poly(d, pts, fill):
    d.polygon([proj(p) for p in pts], fill=fill)


PX = 200  # px per metre for wall textures


def page_png(w, h, draw) -> Image.Image:
    doc = pymupdf.open()
    page = doc.new_page(width=w * S, height=h * S)
    draw(page)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(PX / S, PX / S))
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def wall_texture(wall: str, ink: bool) -> Image.Image:
    w = WALLS[wall]
    im = page_png(w, H, lambda p: (p.draw_rect(p.rect, color=None, fill=WHITE, width=0), band(p, wall, w, ink)))
    d = ImageDraw.Draw(im)
    # skirting line (ink, replacing the render's red)
    d.rectangle((0, int((H - 0.10) * PX), im.width, int((H - 0.08) * PX)), fill=(20, 19, 15))
    # boards as in the builder's render: portrait, a dark title bar, product photographs
    n, bw, bh, top = (8, 0.56, 0.78, H - 1.95 + 0.06) if wall == "back" else (4, 0.56, 0.78, H - 1.95 + 0.06)
    if wall == "back":
        xs = [(w - (n * bw + (n - 1) * 0.16)) / 2 + i * (bw + 0.16) for i in range(n)]
    else:
        span = n * bw + (n - 1) * 0.14
        x0 = 0.35 if wall == "right" else w - 0.35 - span
        xs = [x0 + i * (bw + 0.14) for i in range(n)]
    stand_ins = ["307-panic-exit-device", "lc14-85-50mm-lock-case", "9014s-stainless-steel-handle", "564-night-latch-and-rim-lock",
                 "311-panic-exit-device", "102-glass-door-handle", "305-fire-door-panic-exit-device", "6068-mortise-lever-handle-lock"]
    for i, bx in enumerate(xs):
        x0, y0, x1, y1 = int(bx * PX), int(top * PX), int((bx + bw) * PX), int((top + bh) * PX)
        sh = Image.new("L", im.size, 0)
        ImageDraw.Draw(sh).rectangle((x0 + 5, y0 + 8, x1 + 5, y1 + 8), fill=70)
        im = Image.composite(Image.new("RGB", im.size, (20, 19, 17)), im, sh.filter(ImageFilter.GaussianBlur(8)))
        d = ImageDraw.Draw(im)
        d.rectangle((x0, y0, x1, y1), fill=(250, 250, 248), outline=(200, 198, 192), width=2)
        d.rectangle((x0, y0, x1, y0 + 22), fill=(28, 27, 24))
        name = stand_ins[(i + (2 if wall != "back" else 0)) % len(stand_ins)]
        for k in range(4):
            tl = Image.open(io.BytesIO(g.tile_jpeg("products-hyde/" + stand_ins[(i + k) % len(stand_ins)]))).resize(((x1 - x0 - 30) // 2, (x1 - x0 - 30) // 2))
            im.paste(tl, (x0 + 10 + (k % 2) * ((x1 - x0 - 30) // 2 + 10), y0 + 34 + (k // 2) * ((x1 - x0 - 30) // 2 + 12)))
        del name
    return im


def scene(ink: bool) -> Image.Image:
    im = Image.new("RGB", (W_IMG, H_IMG), (60, 60, 58))
    d = ImageDraw.Draw(im)
    horizon = proj((3.25, 80.0, 0))[1]
    d.rectangle((0, int(horizon), W_IMG, H_IMG), fill=(120, 119, 116))
    poly(d, [(0, 0, 0), (6.5, 0, 0), (6.5, D, 0), (0, D, 0)], (68, 68, 66))
    poly(d, [(-0.3, -0.05, 0), (6.8, -0.05, 0), (6.8, -0.25, 0), (-0.3, -0.25, 0)], (40, 40, 38))  # platform edge
    # walls: left (inner face seen from the right), back, right
    warp(im, wall_texture("left", ink), [(0, 0, H), (0, D, H), (0, D, 0), (0, 0, 0)], shade=0.90)
    warp(im, wall_texture("back", ink), [(0, D, H), (6.5, D, H), (6.5, D, 0), (0, D, 0)])
    warp(im, wall_texture("right", ink), [(6.5, D, H), (6.5, 0, H), (6.5, 0, 0), (6.5, D, 0)], shade=0.90)
    d = ImageDraw.Draw(im)
    # wall heads and front edges
    poly(d, [(-0.08, 0, 0), (0, 0, 0), (0, 0, H + 0.6), (-0.08, 0, H + 0.6)], (236, 235, 231))
    poly(d, [(6.5, 0, 0), (6.58, 0, 0), (6.58, 0, H + 0.6), (6.5, 0, H + 0.6)], (236, 235, 231))
    # fascia over the opening, white, with the mark and the stand number
    fas = page_png(6.66, 0.60, lambda p: (p.draw_rect(p.rect, color=None, fill=WHITE, width=0),
                                          place_mark(p, pymupdf.Rect(0.35 * S, 0.17 * S, 1.65 * S, 0.43 * S), hm.horizontal()),
                                          c.t(p, 6.30, 0.37, "BAU 2027 · C4.523", 0.09, "medium", INK, align="right"),
                                          p.draw_line((0, 0.56 * S), (6.66 * S, 0.56 * S), color=INK, width=0.02 * S)))
    warp(im, fas, [(-0.08, 0, H + 0.6), (6.58, 0, H + 0.6), (6.58, 0, H), (-0.08, 0, H)])
    d = ImageDraw.Draw(im)
    # lighting track and spots along the front, under the fascia
    for k in range(9):
        x = 0.6 + k * 0.66
        a, b = proj((x, 0.25, H - 0.02)), proj((x, 0.25, H - 0.16))
        d.rounded_rectangle((a[0] - 9, a[1], b[0] + 9, b[1]), radius=6, fill=(22, 22, 20))
    # two tables with chairs
    for cx, cy in ((2.4, 2.6), (4.4, 2.6)):
        d.line((proj((cx, cy, 0)), proj((cx, cy, 0.74))), fill=(170, 170, 168), width=5)
        poly(d, [(cx + 0.38 * math.cos(a), cy + 0.38 * math.sin(a), 0.74) for a in np.linspace(0, 2 * math.pi, 40)], (245, 245, 243))
        for ang in (math.pi * 0.15, math.pi * 0.85, math.pi * 1.5):
            sx, sy = cx + 0.62 * math.cos(ang), cy + 0.62 * math.sin(ang)
            for lx, ly in ((-0.17, -0.17), (0.17, -0.17), (-0.17, 0.17), (0.17, 0.17)):
                d.line((proj((sx + lx, sy + ly, 0)), proj((sx + lx, sy + ly, 0.45))), fill=(150, 150, 148), width=3)
            poly(d, [(sx - 0.2, sy - 0.2, 0.46), (sx + 0.2, sy - 0.2, 0.46), (sx + 0.2, sy + 0.2, 0.46), (sx - 0.2, sy + 0.2, 0.46)], (40, 40, 38))
            # backrest on the side away from the table, drawn as a frame so it does not read as a block
            bx = sx + 0.2 * math.cos(ang)
            by = sy + 0.2 * math.sin(ang)
            ox, oy = -math.sin(ang) * 0.19, math.cos(ang) * 0.19
            back = [proj((bx - ox, by - oy, 0.62)), proj((bx + ox, by + oy, 0.62)), proj((bx + ox, by + oy, 0.86)), proj((bx - ox, by - oy, 0.86))]
            d.line(back + [back[0]], fill=(30, 30, 28), width=5)
    # counter at the front left, its front face carrying the design
    x0, x1, y0, y1, hz = 0.30, 1.50, 0.45, 1.00, COUNTER[1]
    poly(d, [(x0, y0, hz), (x1, y0, hz), (x1, y1, hz), (x0, y1, hz)], (30, 30, 28))
    poly(d, [(x1, y0, 0), (x1, y1, 0), (x1, y1, hz), (x1, y0, hz)], (205, 204, 200))
    front = page_png(COUNTER[0], COUNTER[1], lambda p: counter_front(p, ink))
    warp(im, front, [(x0, y0, hz), (x1, y0, hz), (x1, y0, 0), (x0, y0, 0)])
    return im


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(OUT_DEFAULT))
    out = Path(ap.parse_args().out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for ink in (True, False):
        tag = "ink" if ink else "white"
        scene(ink).save(out / f"scene-{tag}.png", optimize=True)
        # flat strip: the three bands side by side as they wrap, plus the counter
        strip = page_png(sum(WALLS.values()) + 0.4 + COUNTER[0] + 0.4, max(BAND, COUNTER[1]) + 0.2, lambda p: None)
        doc = pymupdf.open()
        total = sum(WALLS.values()) + 0.2 * 2 + COUNTER[0] + 0.6
        page = doc.new_page(width=total * S, height=(COUNTER[1] + 0.25) * S)
        page.draw_rect(page.rect, color=None, fill=WHITE, width=0)
        x = 0.1
        for k, w in WALLS.items():
            band(page, k, w, ink, x, 0.1)
            x += w + 0.1
        counter_front(page, ink, x + 0.2, 0.1)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(160 / S, 160 / S))
        Image.open(io.BytesIO(pix.tobytes("png"))).save(out / f"flat-{tag}.png", optimize=True)
        del strip
        for f in production(out, ink):
            print(f.relative_to(kit.ROOT))
    print(out)


if __name__ == "__main__":
    main()
