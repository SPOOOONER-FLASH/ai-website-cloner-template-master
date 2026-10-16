"""BAU 2027 stand C4.523: the picture band above the boards on three walls, and the counter front.

    python scripts/brand/build_bau_booth_band.py [--out-dir DIR]

Geometry is the stand builder's drawing set (平面图 / A·B·C 立面图 / 门头图 / 顶面图, received
2026-10-16), not an assumption any more:

  walls      A (left) 4.50 m, B (back) 6.50 m, C (right) 4.50 m, all 2.95 m high
  fascia     6.50 × 0.55 m over the open front (2.40–2.95 m), 0.24 m deep; its returns cover the
             front-top corner of A and C (0.24 × 0.55 m), so the A and C bands start behind them
  boards     pure white. A and C: 4 × 900 w × 600 h, bottom 1.00 m, columns 240|900|150|…|210
             (A, front at left) and 210|…|900|240 (C, front at right). B: 8 × 600 w × 900 h,
             bottom 0.85 m, columns 325|600|150|…|600|325
  counter    1.20 m long, 0.60 m deep, about 0.90 m high, at the front left

Client, same day: 「图片放在顶 3 米往下高度 1.1 米的位置，195 高度别超过……加上大拉手和天地轴」,
three pivot pictures marked 420 × 370 mm, then the first band render with 「就这个是我们要的款式」.
So the band style of that render, at the drawing's sizes:

  zone       1.95–2.95 m on every wall (1.00 m; 1.10 m would cross the 1.95 m line)
  A (left)   "Made to your drawing." + the three pivot pictures, 420 × 370 scaled 1.5×
  B (back)   white logo plate, "Your brand. Our factory.", five products incl. the D-3019 top pivot
  C (right)  three big pull handles (105, 109, 102), cantonlock.com, the QR at the front end

BOARD_SAMPLES only dresses the boards in the 3-D model; the boards themselves are the client's.

Every product picture is a real site photograph cut out of its white ground (flood fill from
the edges, see build_bau_booth_concepts.cutout), or of its dark studio ground (GrabCut, see
cutout_dark). The three pivot scenes are the client's own pictures; the RAYEN wordmark on their
backgrounds is painted out so the wall carries one brand. They come from a screenshot (≈370 px)
and must be replaced by the originals before printing.
"""
from __future__ import annotations

import argparse
import io
import json
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
H = 2.95                       # wall height
ZONE_BOTTOM = 1.95             # nothing below this line
ZONE = H - ZONE_BOTTOM         # 1.00 m picture zone
FASCIA_H, FASCIA_D = 0.55, 0.24
BLEED = 0.15
COUNTER = (1.20, 0.90)         # front face; height read off the 门头图, confirm with the builder
OUT_DEFAULT = kit.ROOT / "docs" / "design-references" / "bau-2027-booth-band"
SOURCE = OUT_DEFAULT / "source"
LIGHT = (0.74, 0.72, 0.69)
PANEL = (0.940, 0.936, 0.928)

# Board columns, in metres from the left end of each wall as seen from inside the stand.
WALL_W = {"A": 4.50, "B": 6.50, "C": 4.50}
BOARDS = {
    "A": dict(xs=[0.24 + i * 1.05 for i in range(4)], w=0.90, h=0.60, bottom=1.00),
    "B": dict(xs=[0.325 + i * 0.75 for i in range(8)], w=0.60, h=0.90, bottom=0.85),
    "C": dict(xs=[0.21 + i * 1.05 for i in range(4)], w=0.90, h=0.60, bottom=1.00),
}
# The printed band: A and C stop at the fascia return (front end), B runs wall to wall.
BAND_X = {"A": (0.24, 4.50), "B": (0.0, 6.50), "C": (0.0, 4.26)}
BOARD_TITLES = {  # the builder's board names, for the model only
    "A": ["Lever handles 1", "Lever handles 2", "Cylinders · lock cases", "Hinges"],
    "B": ["Lever handles 3", "Lever handles 4", "Lock cases 1", "Lock cases 2", "Pivots", "Door numbers",
          "Panic exit 1", "Panic exit 2"],
    "C": ["Panic exit 3", "Pull handles 1", "Pull handles 2", "Pull handles 3"],
}

P = "products-hyde/"
# Stand-ins for the samples on each board, in the 3-D model only: (label, [pictures]). A picture is a
# site product slug, a collection path, "dark:<slug>" (dark studio ground) or "photo:<file>".
BOARD_SAMPLES = {
    "A": [
        ("Lever handle", [P + "lh1016-stainless-steel-handle", P + "9087-ss-stainless-steel-handle",
                          P + "9014s-stainless-steel-handle", P + "9004s-stainless-steel-handle"]),
        ("Lever handle", [P + "8829-bl-lever-handle", P + "808-snet-lever-handle",
                          P + "6491-snet-lever-handle", P + "3431-sset-lever-handle"]),
        ("Cylinder · lock case", [P + "70-snkt-cp-lock-cylinder", P + "60-sndk-lock-cylinder",
                                  P + "lc14-85-50mm-lock-case", P + "lc04-85-60-lock-case"]),
        ("Hinge", [P + "ssh011-brass-and-steel-hinges", P + "f100-ss-door-hinge",
                   P + "bl027-brass-and-steel-hinges", P + "stainless-steel-door-hinge"]),
    ],
    "B": [
        ("Lever handle", [P + "9001-stainless-steel-handle", P + "9007s-stainless-steel-handle"]),
        ("Knob lock", [P + "587-sset-light-duty-cylindrical-lock", P + "tubular-knob-lock"]),
        ("Mortise lock", [P + "6068-mortise-lever-handle-lock", P + "lc8525-lock-case"]),
        ("Lock case", [P + "lc7065-lock-case", P + "hy007-lock-case"]),
        ("Pivot", ["photo:pivot-heavy", "photo:pivot-profile"]),
        ("Pivot", ["photo:pivot-frameless", "dark:d-3019-top-pivot"]),
        ("Panic exit device", [P + "307-panic-exit-device", P + "310-panic-exit-device"]),
        ("Panic exit device", [P + "311-panic-exit-device", P + "305-fire-door-panic-exit-device"]),
    ],
    "C": [
        ("Panic exit device", [P + "300-panic-exit-device", P + "320-two-point-locking-exit-device",
                               P + "037-panic-exit-device-trim", "brazil-collection/br1-sk"]),
        ("Pull handle", [P + "100-glass-door-handle", P + "102-glass-door-handle",
                         P + "104-glass-door-handle", P + "106-glass-door-handle"]),
        ("Pull handle", [P + "105-glass-door-handle", P + "109-glass-door-handle",
                         P + "108-glass-door-handle", P + "107-glass-door-handle"]),
        ("Pull handle", [P + "112-glass-door-handle", P + "stainless-steel-glass-door-pull-handle",
                         P + "19-130mm-glass-door-handle", P + "70900-mbbk-grip-handle-set"]),
    ],
}
PHOTO_LABEL = {"pivot-heavy": "Heavy-duty series", "pivot-profile": "Profile series",
               "pivot-frameless": "Frameless glass series"}


def t(page, x, y, s, size, key="text", color=INK, track=0.0, align="left"):
    return c.t(page, x, y, s, size, key, color, track, align)


def model_of(pic: str) -> str:
    """The model number as the site prints it, from the product record."""
    if pic.startswith("photo:"):
        return PHOTO_LABEL[pic[6:]]
    slug = pic.split(":")[-1].split("/")[-1]
    if pic.startswith("brazil-collection/"):
        return slug.upper().replace("BR1-SK", "BR-1 SK")
    rec = kit.ROOT / "content" / "products" / f"{slug}.json"
    model = json.loads(rec.read_text(encoding="utf-8")).get("model") or slug
    model = {"LC14 85×50mm": "LC14"}.get(model, model)
    return "Glass door pull" if model.startswith("Stainless Steel Glass") else model


# ------------------------------------------------------------------------------ pictures
_IMG: dict[str, bytes] = {}


def cutout_dark(slug: str) -> bytes:
    """A product shot on a dark studio ground, on a transparent ground: GrabCut seeded with the
    bright metal, the largest component kept and its holes filled. Checked by eye against the
    photograph (d-3019: plate, bearing, gear and body all kept)."""
    import cv2
    im = np.array(Image.open(kit.ROOT / "public" / "images" / "products" / f"{slug}.webp").convert("RGB"))
    h, w = im.shape[:2]
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    mask[cv2.cvtColor(im, cv2.COLOR_RGB2GRAY) > 140] = cv2.GC_PR_FGD
    mask[:8, :] = mask[-8:, :] = cv2.GC_BGD
    mask[:, :8] = mask[:, -8:] = cv2.GC_BGD
    cv2.grabCut(im, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_MASK)
    m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    _, lab, st, _ = cv2.connectedComponentsWithStats(m)
    m = np.where(lab == 1 + int(np.argmax(st[1:, 4])), 255, 0).astype(np.uint8)
    ff = m.copy()
    cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 255)
    m = m | cv2.bitwise_not(ff)
    ys, xs = np.where(m > 0)
    alpha = Image.fromarray(m).filter(ImageFilter.GaussianBlur(1.2))
    rgba = Image.fromarray(im).convert("RGBA")
    rgba.putalpha(alpha)
    rgba = rgba.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    buf = io.BytesIO()
    rgba.save(buf, "PNG")
    return buf.getvalue()


def scene_photo(name: str) -> bytes:
    """The client's pivot scene with the RAYEN wordmark (blue and red letters on the light
    background, top left) painted out. Nothing in the product area is touched."""
    import cv2
    im = np.array(Image.open(SOURCE / f"{name}-screenshot.png").convert("RGB"))
    h, w = im.shape[:2]
    r, b = im[..., 0].astype(int), im[..., 2].astype(int)
    coloured = ((b - r > 40) | (r - b > 60)) & (np.arange(h)[:, None] < h * 0.16) & (np.arange(w)[None, :] < w * 0.45)
    mask = cv2.dilate(coloured.astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
    out = cv2.inpaint(im, mask, 6, cv2.INPAINT_TELEA)
    buf = io.BytesIO()
    Image.fromarray(out).save(buf, "PNG")
    return buf.getvalue()


def picture(pic: str) -> bytes:
    if pic not in _IMG:
        if pic.startswith("photo:"):
            _IMG[pic] = scene_photo(pic[6:])
        elif pic.startswith("dark:"):
            _IMG[pic] = cutout_dark(pic[5:])
        else:
            _IMG[pic] = c.cutout(pic)
    return _IMG[pic]


# The band, in the style the client chose on 2026-10-16 (「就这个是我们要的款式」, pointing at the
# first band render): one light strip per wall, text on one side, large cut-out products on the
# other, a white logo plate on the back wall, the QR at the front end of the right wall.
BAND_ITEMS = {
    "A": ["photo:pivot-heavy", "photo:pivot-profile", "photo:pivot-frameless"],
    "B": [(P + "307-panic-exit-device", "Panic exit device"), (P + "lc14-85-50mm-lock-case", "Lock case"),
          ("dark:d-3019-top-pivot", "Top pivot"), (P + "9014s-stainless-steel-handle", "Lever on rose"),
          (P + "311-panic-exit-device", "Panic exit device")],
    "C": [(P + "105-glass-door-handle", "Pull handle"), (P + "109-glass-door-handle", "Pull handle"),
          (P + "102-glass-door-handle", "Pull handle")],
}
PHOTO_SCALE = 1.5   # the client's 420 × 370 pictures, scaled to 630 × 555 to sit with the products
BAND_BG = (0.965, 0.962, 0.955)


def products_row(page, items, x0, x1, top, bottom, fg, sub) -> None:
    """Cut-outs spread evenly between x0 and x1, each with its model and a short name under it."""
    cw = (x1 - x0) / len(items)
    for i, (pic, name) in enumerate(items):
        cx = x0 + i * cw
        r = pymupdf.Rect((cx + 0.04) * S, top * S, (cx + cw - 0.04) * S, (bottom - 0.15) * S)
        page.insert_image(r, stream=picture(pic), keep_proportion=True)
        t(page, cx + cw / 2, bottom - 0.065, model_of(pic), 0.050, "semibold", fg, align="center")
        t(page, cx + cw / 2, bottom - 0.015, name, 0.032, "text", sub, align="center")


def rule(page, x, y0, y1, color) -> None:
    page.draw_line((x * S, y0 * S), (x * S, y1 * S), color=color, width=0.004 * S)


def band(page, wall: str, ink: bool, x_off: float = 0.0, y_off: float = 0.0, full_wall: bool = False) -> None:
    """The zone of one wall. With full_wall, (x_off, y_off) is the wall's top-left corner and the
    band is drawn at its place on the wall; otherwise (x_off, y_off) is the band's top-left."""
    x0, x1 = BAND_X[wall]
    ox = x_off + (x0 if full_wall else 0)        # page x of band x = 0
    X = lambda m: ox + m                          # noqa: E731
    Y = lambda m: y_off + m                       # noqa: E731
    w = x1 - x0
    bg, fg, sub, rule_c = (INK, WHITE, LIGHT, (0.32, 0.31, 0.29)) if ink else (BAND_BG, INK, GREY, (0.80, 0.78, 0.75))
    page.draw_rect(pymupdf.Rect(X(0) * S, Y(0) * S, X(w) * S, Y(ZONE) * S), color=None, fill=bg, width=0)
    if wall == "B":
        pw_, ph_ = 1.45, 0.46
        r = pymupdf.Rect(X(0.30) * S, Y(0.5 - ph_ / 2) * S, X(0.30 + pw_) * S, Y(0.5 + ph_ / 2) * S)
        page.draw_rect(r, color=None, fill=WHITE, width=0, radius=0.12)
        if not ink:
            page.draw_rect(r, color=(0.80, 0.78, 0.75), width=0.002 * S, radius=0.12)
        m = hm.horizontal()
        mh = 0.17
        mw = mh * m.width / m.height
        place_mark(page, pymupdf.Rect(X(0.30 + (pw_ - mw) / 2) * S, Y(0.5 - mh / 2) * S, X(0.30 + (pw_ + mw) / 2) * S, Y(0.5 + mh / 2) * S), m)
        sx = 2.00
        t(page, X(sx), Y(0.255), "BAU 2027 · Messe München · Stand C4.523", 0.034, "semibold", sub, track=90)
        sw = t(page, X(sx), Y(0.46), "Your brand. Our factory.", 0.150, "display-semibold", fg)
        t(page, X(sx), Y(0.56), "Ihre Marke. Unser Werk.", 0.056, "text", sub)
        t(page, X(sx), Y(0.68), "Panic exit devices, locks and door hardware", 0.040, "medium", fg)
        t(page, X(sx), Y(0.74), "Made in Zhongshan, China, since 1998", 0.040, "text", sub)
        rx = sx + sw + 0.15
        rule(page, X(rx), Y(0.12), Y(ZONE - 0.12), rule_c)
        products_row(page, BAND_ITEMS["B"], X(rx + 0.08), X(w - 0.15), Y(0.10), Y(ZONE - 0.08), fg, sub)
    elif wall == "A":
        lx = 0.25
        t(page, X(lx), Y(0.235), "OEM · Private label · Eigenmarke", 0.032, "semibold", sub, track=90)
        tw = t(page, X(lx), Y(0.42), "Made to your drawing.", 0.120, "display-semibold", fg)
        t(page, X(lx), Y(0.51), "Gefertigt nach Ihrer Zeichnung.", 0.048, "text", sub)
        t(page, X(lx), Y(0.63), "Send a drawing or a sample: we cut the tool.", 0.036, "medium", fg)
        t(page, X(lx), Y(0.69), "Lines made for Brazil and Argentina.", 0.036, "text", sub)
        t(page, X(lx), Y(0.75), "Most models from 300 pieces.", 0.036, "text", sub)
        pw, ph = 0.42 * PHOTO_SCALE, 0.37 * PHOTO_SCALE
        gap = 0.05
        px0 = w - 0.10 - 3 * pw - 2 * gap
        rule(page, X(px0 - 0.10), Y(0.12), Y(ZONE - 0.12), rule_c)
        del tw
        t(page, X(px0), Y(0.12), "Top & bottom pivots · Boden- und Deckenlager", 0.032, "semibold", sub, track=60)
        for i, pic in enumerate(BAND_ITEMS["A"]):
            x = px0 + i * (pw + gap)
            page.insert_image(pymupdf.Rect(X(x) * S, Y(0.16) * S, X(x + pw) * S, Y(0.16 + ph) * S), stream=picture(pic), keep_proportion=False)
            t(page, X(x + pw / 2), Y(0.16 + ph + 0.075), model_of(pic), 0.042, "semibold", fg, align="center")
            t(page, X(x + pw / 2), Y(0.16 + ph + 0.125), "Pivot", 0.030, "text", sub, align="center")
    else:  # C, front end at the right
        products_row(page, BAND_ITEMS["C"], X(0.15), X(1.95), Y(0.08), Y(ZONE - 0.08), fg, sub)
        rule(page, X(2.05), Y(0.12), Y(ZONE - 0.12), rule_c)
        tx = 2.18
        t(page, X(tx), Y(0.235), "Book a meeting · Termin vereinbaren", 0.030, "semibold", sub, track=80)
        t(page, X(tx), Y(0.40), "cantonlock.com", 0.105, "display-semibold", fg)
        t(page, X(tx), Y(0.50), "Models, spec sheets and", 0.036, "medium", fg)
        t(page, X(tx), Y(0.55), "meeting booking online.", 0.036, "medium", fg)
        t(page, X(tx), Y(0.62), "Modelle, Datenblätter, Termine.", 0.034, "text", sub)
        t(page, X(tx), Y(0.74), "tec@cantonlock.com", 0.036, "medium", fg)
        q = 0.46
        qx = w - 0.12 - q
        page.draw_rect(pymupdf.Rect(X(qx - 0.02) * S, Y(0.5 - q / 2 - 0.02) * S, X(qx + q + 0.02) * S, Y(0.5 + q / 2 + 0.02) * S), color=None, fill=WHITE, width=0)
        g.draw_qr(page, pymupdf.Rect(X(qx) * S, Y(0.5 - q / 2) * S, X(qx + q) * S, Y(0.5 + q / 2) * S), g.QR_URL)


def counter_front(page, ink: bool, x_off=0.0, y_off=0.0):
    w, h = COUNTER
    bg, fg, sub = (INK, WHITE, LIGHT) if ink else (WHITE, INK, GREY)
    page.draw_rect(pymupdf.Rect(x_off * S, y_off * S, (x_off + w) * S, (y_off + h) * S), color=None, fill=bg, width=0)
    m = hm.stacked()
    mh = 0.28
    mw = mh * m.width / m.height
    place_mark(page, pymupdf.Rect((x_off + (w - mw) / 2) * S, (y_off + 0.12) * S, (x_off + (w + mw) / 2) * S, (y_off + 0.12 + mh) * S), m,
               hm.WHITE if ink else hm.INK)
    t(page, x_off + w / 2, y_off + 0.56, "Your brand. Our factory.", 0.058, "display-semibold", fg, align="center")
    t(page, x_off + w / 2, y_off + 0.62, "Ihre Marke. Unser Werk.", 0.032, "text", sub, align="center")
    page.draw_rect(pymupdf.Rect(x_off * S, (y_off + h - 0.10) * S, (x_off + w) * S, (y_off + h) * S), color=None,
                   fill=WHITE if ink else INK, width=0)
    t(page, x_off + w / 2, y_off + h - 0.04, "cantonlock.com", 0.030, "medium", INK if ink else WHITE, align="center")


# ----------------------------------------------------------------------------- production
def production(out: Path, ink: bool) -> list[Path]:
    tag = "ink" if ink else "white"
    files = []
    jobs = [(k, BAND_X[k][1] - BAND_X[k][0], ZONE) for k in WALL_W] + [("counter", COUNTER[0], COUNTER[1])]
    names = {"A": "A-left", "B": "B-back", "C": "C-right", "counter": "counter"}
    for key, w, h in jobs:
        fill = (INK if ink else BAND_BG) if key != "counter" else (INK if ink else WHITE)
        doc = pymupdf.open()
        page = doc.new_page(width=(w + 2 * BLEED) * S, height=(h + 2 * BLEED) * S)
        page.draw_rect(page.rect, color=None, fill=fill, width=0)
        if key == "counter":
            counter_front(page, ink, BLEED, BLEED)
        else:
            band(page, key, ink, BLEED, BLEED)
        # drawn at S = 100 pt per metre; placed as vector on a page of the true 1:10 size
        M = 100 * kit.MM
        final = pymupdf.open()
        fp = final.new_page(width=(w + 2 * BLEED) * M, height=(h + 2 * BLEED) * M)
        fp.draw_rect(fp.rect, color=None, fill=fill, width=0)
        fp.show_pdf_page(fp.rect, doc, 0)
        fp.set_trimbox(pymupdf.Rect(BLEED * M, BLEED * M, (w + BLEED) * M, (h + BLEED) * M))
        name = f"BAU2027-C4-523-{tag}-{names[key]}-{w:.2f}x{h:.2f}m-bleed15cm-1to10.pdf"
        files.append(kit.save_pdf(final, out / "制作文件-1比10" / name, f"BAU 2027 C4.523 {names[key]}"))
    return files


# ------------------------------------------------------------------------------ elevation
def boards(page, wall: str, x_off: float, y_off: float, outline=True) -> None:
    """The builder's boards, white, with a few real products standing in for the samples."""
    b = BOARDS[wall]
    for i, bx in enumerate(b["xs"]):
        top = H - b["bottom"] - b["h"]
        r = pymupdf.Rect((x_off + bx) * S, (y_off + top) * S, (x_off + bx + b["w"]) * S, (y_off + top + b["h"]) * S)
        page.draw_rect(r, color=(0.78, 0.77, 0.74) if outline else None, fill=WHITE, width=0.002 * S)
        t(page, x_off + bx + b["w"] / 2, y_off + top + 0.05, BOARD_TITLES[wall][i], 0.022, "medium", GREY, align="center")
        pics = [p for p in BOARD_SAMPLES[wall][i][1] if not p.startswith("photo:")] or ["dark:d-3019-top-pivot"]
        n = 3 if b["w"] >= 0.9 else 2
        rows = 2 if b["h"] < 0.8 else 3
        cw, ch = (b["w"] - 0.08) / n, (b["h"] - 0.12) / rows
        for k in range(n * rows):
            px, py = bx + 0.04 + (k % n) * cw, top + 0.09 + (k // n) * ch
            pr = pymupdf.Rect((x_off + px + 0.02) * S, (y_off + py + 0.01) * S, (x_off + px + cw - 0.02) * S, (y_off + py + ch - 0.01) * S)
            page.insert_image(pr, stream=picture(pics[k % len(pics)]), keep_proportion=True)


def elevation(page, wall: str, ink: bool, x_off: float, y_off: float, dims=True) -> None:
    w = WALL_W[wall]
    page.draw_rect(pymupdf.Rect(x_off * S, y_off * S, (x_off + w) * S, (y_off + H) * S), color=None, fill=WHITE, width=0)
    band(page, wall, ink, x_off, y_off, full_wall=True)
    boards(page, wall, x_off, y_off)
    if wall in ("A", "C"):  # fascia return over the front-top corner
        fx = 0.0 if wall == "A" else w - FASCIA_D
        page.draw_rect(pymupdf.Rect((x_off + fx) * S, y_off * S, (x_off + fx + FASCIA_D) * S, (y_off + FASCIA_H) * S),
                       color=(0.6, 0.6, 0.58), fill=(0.90, 0.90, 0.88), width=0.002 * S)
    page.draw_rect(pymupdf.Rect(x_off * S, y_off * S, (x_off + w) * S, (y_off + H) * S), color=(0.55, 0.55, 0.52), width=0.003 * S)
    if dims:
        red = (0.80, 0.20, 0.15)
        for yy, lab in ((0, "2.95 m"), (ZONE, "1.95 m")):
            page.draw_line(((x_off - 0.10) * S, (y_off + yy) * S), ((x_off + w + 0.10) * S, (y_off + yy) * S), color=red, width=0.003 * S,
                           dashes="[6 4] 0")
            t(page, x_off - 0.12, y_off + yy + 0.012, lab, 0.035, "medium", red, align="right")
        t(page, x_off + w / 2, y_off + H + 0.12, {"A": "A · left wall 4.50 m", "B": "B · back wall 6.50 m", "C": "C · right wall 4.50 m"}[wall],
          0.06, "semibold", INK, align="center")
        t(page, x_off + w / 2, y_off + H + 0.20, f"band {BAND_X[wall][1] - BAND_X[wall][0]:.2f} × {ZONE:.2f} m · zone 1.95–2.95 m", 0.04, "text", GREY, align="center")


# --------------------------------------------------------------------------------- 3-D scene
W_IMG, H_IMG = 2000, 1150
D = 4.50
PX = 220  # px per metre for wall textures


class Cam:
    def __init__(self, cam, target, focal):
        self.cam, self.focal = np.array(cam, float), focal
        f = np.array(target, float) - self.cam
        self.f = f / np.linalg.norm(f)
        r = np.cross(self.f, [0, 0, 1.0])
        self.r = r / np.linalg.norm(r)
        self.u = np.cross(self.r, self.f)

    def __call__(self, p):
        d = np.array(p, float) - self.cam
        z = d @ self.f
        return (W_IMG / 2 + self.focal * (d @ self.r) / z, H_IMG * 0.5 - self.focal * (d @ self.u) / z)


def warp(canvas, tex, corners, proj, shade=1.0):
    dst = [proj(p) for p in corners]
    src = [(0, 0), (tex.width, 0), (tex.width, tex.height), (0, tex.height)]
    big = tex.transform(canvas.size, Image.PERSPECTIVE, tuple(c.homography(src, dst)), Image.BICUBIC)
    if shade != 1.0:
        big = Image.eval(big, lambda v: int(v * shade))
    mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(mask).polygon(dst, fill=255)
    canvas.paste(big, (0, 0), mask)


def page_png(w, h, draw, px=PX) -> Image.Image:
    doc = pymupdf.open()
    page = doc.new_page(width=w * S, height=h * S)
    draw(page)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(px / S, px / S))
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


_TEX: dict = {}


def wall_texture(wall: str, ink: bool) -> Image.Image:
    if (wall, ink) not in _TEX:
        w = WALL_W[wall]

        def draw(p):
            p.draw_rect(p.rect, color=None, fill=WHITE, width=0)
            band(p, wall, ink, 0, 0, full_wall=True)
            boards(p, wall, 0, 0, outline=False)
        im = page_png(w, H, draw)
        # board shadows, so the white boards read against the white wall
        b = BOARDS[wall]
        sh = Image.new("L", im.size, 0)
        board_mask = Image.new("L", im.size, 0)
        for bx in b["xs"]:
            top = H - b["bottom"] - b["h"]
            box = (int(bx * PX), int(top * PX), int((bx + b["w"]) * PX), int((top + b["h"]) * PX))
            ImageDraw.Draw(sh).rectangle((box[0] + 4, box[1] + 7, box[2] + 4, box[3] + 7), fill=60)
            ImageDraw.Draw(board_mask).rectangle(box, fill=255)
        shadow = Image.composite(Image.new("RGB", im.size, (40, 40, 38)), im, sh.filter(ImageFilter.GaussianBlur(7)))
        _TEX[(wall, ink)] = Image.composite(im, shadow, board_mask)
    return _TEX[(wall, ink)]


def scene(ink: bool, view: str = "aisle") -> Image.Image:
    proj = Cam((3.25, -6.0, 1.62), (3.25, 4.5, 1.85), 1350.0) if view == "aisle" else Cam((5.4, -3.2, 1.65), (2.2, 4.5, 2.05), 1050.0)
    im = Image.new("RGB", (W_IMG, H_IMG), (58, 58, 56))
    d = ImageDraw.Draw(im)
    horizon = proj((3.25, 80.0, 0))[1]
    d.rectangle((0, int(horizon), W_IMG, H_IMG), fill=(118, 117, 114))
    d.polygon([proj(p) for p in [(0, 0, 0), (6.5, 0, 0), (6.5, D, 0), (0, D, 0)]], fill=(70, 70, 68))
    # walls; A is the left wall (its texture's left end is the front), C the right (front at right)
    warp(im, wall_texture("A", ink), [(0, 0, H), (0, D, H), (0, D, 0), (0, 0, 0)], proj, shade=0.92)
    warp(im, wall_texture("B", ink), [(0, D, H), (6.5, D, H), (6.5, D, 0), (0, D, 0)], proj)
    warp(im, wall_texture("C", ink), [(6.5, D, H), (6.5, 0, H), (6.5, 0, 0), (6.5, D, 0)], proj, shade=0.92)
    d = ImageDraw.Draw(im)
    # fascia: front face 6.50 × 0.55 and its underside, 0.24 deep
    d.polygon([proj(p) for p in [(0, 0, H - FASCIA_H), (6.5, 0, H - FASCIA_H), (6.5, FASCIA_D, H - FASCIA_H), (0, FASCIA_D, H - FASCIA_H)]],
              fill=(214, 213, 209))
    fas = page_png(6.50, FASCIA_H, lambda p: (p.draw_rect(p.rect, color=None, fill=WHITE, width=0),
                                              place_mark(p, pymupdf.Rect(0.30 * S, 0.17 * S, 1.50 * S, 0.40 * S), hm.horizontal()),
                                              c.t(p, 6.20, 0.36, "BAU 2027 · C4-523", 0.085, "medium", INK, align="right")))
    warp(im, fas, [(0, 0, H), (6.5, 0, H), (6.5, 0, H - FASCIA_H), (0, 0, H - FASCIA_H)], proj)
    d = ImageDraw.Draw(im)
    # two tables, three chairs each (平面图)
    for cx, cy in ((2.05, 2.67), (4.45, 2.67)):
        d.line((proj((cx, cy, 0)), proj((cx, cy, 0.74))), fill=(170, 170, 168), width=5)
        d.polygon([proj((cx + 0.40 * math.cos(a), cy + 0.40 * math.sin(a), 0.74)) for a in np.linspace(0, 2 * math.pi, 40)], fill=(226, 225, 221))
        for ang in (math.pi * 0.8, math.pi * 0.2, math.pi * 1.5):
            sx, sy = cx + 0.62 * math.cos(ang), cy + 0.62 * math.sin(ang)
            for lx, ly in ((-0.17, -0.17), (0.17, -0.17), (-0.17, 0.17), (0.17, 0.17)):
                d.line((proj((sx + lx, sy + ly, 0)), proj((sx + lx, sy + ly, 0.45))), fill=(150, 150, 148), width=3)
            d.polygon([proj(p) for p in [(sx - 0.2, sy - 0.2, 0.46), (sx + 0.2, sy - 0.2, 0.46), (sx + 0.2, sy + 0.2, 0.46), (sx - 0.2, sy + 0.2, 0.46)]],
                      fill=(40, 40, 38))
    # counter at the front left: 1.20 long, 0.60 deep, front face to the aisle
    x0, x1, y0, y1, hz = 0.02, 1.22, 0.02, 0.62, COUNTER[1]
    d.polygon([proj(p) for p in [(x0, y0, hz), (x1, y0, hz), (x1, y1, hz), (x0, y1, hz)]], fill=(32, 32, 30))
    d.polygon([proj(p) for p in [(x1, y0, 0), (x1, y1, 0), (x1, y1, hz), (x1, y0, hz)]], fill=(206, 205, 201))
    warp(im, page_png(COUNTER[0], COUNTER[1], lambda p: counter_front(p, ink)), [(x0, y0, hz), (x1, y0, hz), (x1, y0, 0), (x0, y0, 0)], proj)
    return im


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(OUT_DEFAULT))
    out = Path(ap.parse_args().out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for ink in (True, False):
        tag = "ink" if ink else "white"
        scene(ink).save(out / f"scene-{tag}.png", optimize=True)
        scene(ink, "corner").save(out / f"scene-{tag}-close.png", optimize=True)
        # the three elevations side by side, with the zone lines and the picture counts
        total = sum(WALL_W.values()) + 0.6 * 4
        doc = pymupdf.open()
        page = doc.new_page(width=total * S, height=(H + 0.55) * S)
        page.draw_rect(page.rect, color=None, fill=(0.93, 0.93, 0.92), width=0)
        x = 0.6
        for k in ("A", "B", "C"):
            elevation(page, k, ink, x, 0.15)
            x += WALL_W[k] + 0.6
        pix = page.get_pixmap(matrix=pymupdf.Matrix(150 / S, 150 / S))
        Image.open(io.BytesIO(pix.tobytes("png"))).save(out / f"flat-{tag}.png", optimize=True)
        for f in production(out, ink):
            print(f.relative_to(kit.ROOT))
    print(out)


if __name__ == "__main__":
    main()
