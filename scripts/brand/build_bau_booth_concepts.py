"""BAU 2027 stand C4.523: four wall-graphic directions, each shown in a modelled stand view.

    python scripts/brand/build_bau_booth_concepts.py [--out-dir DIR]

Client, 2026-10-16: 「原有展板挂墙，所以怎么样更有美学的设计呢，你建模自己对比下，代入场景才能感觉更清晰，
我们现在官网设计的非常好，是不是做成杂志大片的风格 你出四个预览吧 不同内容密度 不同风格 不同理念」.

So the existing boards stay on the walls, and the cloth works around them: the header band
above, the low band under them, the plinth, the gaps between. The stand is modelled in 3-D
(back wall 6.50 m, side wall 4.50 m on the right, open front and left, counter, a table, two
people for scale), each wall's artwork is drawn flat and projected onto it, and the four
directions are rendered from the same aisle viewpoint so they can be compared like for like.

Boards are ASSUMED: 0.60 × 0.85 m, bottom edge 1.00 m above the floor, 7 on the back wall and
4 on the side wall. They are drawn as grey placeholders, because their content is the client's.

Writes <out-dir>/ (default docs/design-references/bau-2027-booth-concepts/):
  concept-<A-D>-scene.png    the stand from the aisle
  concept-<A-D>-walls.png    both walls flat, with the boards
  BAU2027-四个方向对比.png     the four scenes on one sheet, with a line on each idea
Every photograph is a real one from public/images; every sentence is a fact the site already
publishes (content/bau-2027.json, src/components/site/ExportMap.tsx, the product records).
"""
from __future__ import annotations

import argparse
import io
import json
import math
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import build_bau_booth_graphics as g
import hyde_mark as hm
import kit
from kit import GREY, INK, WHITE, place_mark, text

S = 100.0                          # points per metre on the flat artwork page
PX_PER_M = 220                     # render resolution of the flat artwork
H = 2.50                           # ASSUMED wall height
HEADER = 0.62                      # header band, from the top
PLINTH = 0.30
BOARD_W, BOARD_H, BOARD_Z0 = 0.60, 0.85, 1.00
WALLS = {"back": 6.50, "side": 4.50}
BOARDS = {"back": 7, "side": 4}
LOW_TOP = H - BOARD_Z0 + 0.06      # top of the band under the boards, from the wall's top edge
LOW_BOTTOM = H - PLINTH - 0.05
BODY = (0.955, 0.950, 0.940)
INK_RGB = tuple(round(c * 255) for c in INK)
OUT_DEFAULT = kit.ROOT / "docs" / "design-references" / "bau-2027-booth-concepts"


def board_xs(wall: str) -> list[float]:
    n, w = BOARDS[wall], WALLS[wall]
    gap = 0.25
    span = n * BOARD_W + (n - 1) * gap
    x0 = (w - span) / 2
    return [x0 + i * (BOARD_W + gap) for i in range(n)]


# ----------------------------------------------------------------------------------- helpers
def mark(page, x, y, h, color=hm.INK, kind="horizontal"):
    m = hm.horizontal() if kind == "horizontal" else hm.icon()
    w = h * m.width / m.height
    place_mark(page, pymupdf.Rect(x * S, y * S, (x + w) * S, (y + h) * S), m, color)
    return w


def t(page, x, y, s, size, key="text", color=INK, track=0.0, align="left"):
    return text(page, x * S, y * S, s, size * S, key, color, track=track, align=align) / S


def kicker(page, x, y, s, color=GREY, align="left", size=0.034):
    return t(page, x, y, s.upper(), size, "semibold", color, track=120, align=align)


def rule(page, x0, x1, y, color=INK, w=0.004):
    page.draw_line((x0 * S, y * S), (x1 * S, y * S), color=color, width=w * S)


def image(page, x, y, w, h, data: bytes):
    page.insert_image(pymupdf.Rect(x * S, y * S, (x + w) * S, (y + h) * S), stream=data, keep_proportion=True)


def tile(path: str) -> bytes:
    return g.tile_jpeg(path)


def photo(name: str, aspect: float, focus=0.5, folder="editorial") -> bytes:
    """A photograph from public/images/<folder>/, cropped to the aspect (no generated imagery)."""
    im = Image.open(kit.ROOT / "public" / "images" / folder / name).convert("RGB")
    w, h = im.size
    if w / h > aspect:
        cw = round(h * aspect)
        x0 = round((w - cw) * focus)
        im = im.crop((x0, 0, x0 + cw, h))
    else:
        ch = round(w / aspect)
        im = im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=92)
    return buf.getvalue()


def drawing(page, name: str, x, y, w, h, color=INK):
    """A dimension drawing from public/images/drawings (vector, so it scales without loss)."""
    svg = (kit.ROOT / "public" / "images" / "drawings" / f"{name}.svg").read_text(encoding="utf-8")
    if color != INK:
        svg = svg.replace("#16150f", "#ffffff").replace("#8e8a80", "#bdb9b0")
    src = pymupdf.open(stream=svg.encode(), filetype="svg")
    pdf = pymupdf.open("pdf", src.convert_to_pdf())
    r = pdf[0].rect
    k = min(w * S / r.width, h * S / r.height)
    tw, th = r.width * k, r.height * k
    target = pymupdf.Rect(x * S + (w * S - tw) / 2, y * S + (h * S - th) / 2, 0, 0)
    target.x1, target.y1 = target.x0 + tw, target.y0 + th
    page.show_pdf_page(target, pdf, 0)


def plinth(page, w, fill=INK, items=(), color=WHITE):
    page.draw_rect(pymupdf.Rect(0, (H - PLINTH) * S, w * S, H * S), color=None, fill=fill, width=0)
    if items:
        size = 0.050
        widths = [kit.text_width(i, size * S, "medium") / S for i in items]
        gap = (w - 0.6 - sum(widths)) / max(len(items) - 1, 1)
        x = 0.30
        for i, iw in zip(items, widths):
            t(page, x, H - PLINTH / 2 + 0.018, i, size, "medium", color)
            x += iw + gap


def facts_row(page, x0, x1, y, rows, color=INK, sub=GREY, title="The factory, in figures", big=0.10):
    kicker(page, x0, y, title, sub)
    rule(page, x0, x1, y + 0.035, color, 0.003)
    cw = (x1 - x0) / len(rows)
    for i, (num, label) in enumerate(rows):
        t(page, x0 + i * cw, y + 0.035 + big * 1.15, num, big, "medium", color)
        t(page, x0 + i * cw, y + 0.035 + big * 1.15 + 0.06, label, 0.034, "text", sub)


# ----------------------------------------------------------------------------- the concepts
FIGURES = [("1998", "manufacturing since"), ("ISO 9001:2015", "stamping plant"),
           ("44", "panic exit device models"), ("300–5,000", "pieces, minimum order")]
MARKETS = ("Europe from Portugal to Finland, Russia and Turkey, North and South America, Japan, "
           "Korea, Southeast Asia and Australia.")


def concept_a(page, wall, w):
    """A · Magazine: one big headline, one editorial photograph, the figures row. Low density."""
    page.draw_rect(page.rect, color=None, fill=WHITE, width=0)
    kicker(page, 0.30, 0.13, "BAU 2027 · Hall C4 · Stand 523" if wall == "back" else "cantonlock.com")
    if wall == "back":
        mark(page, w - 0.30 - 0.9, 0.08, 0.10)
    head = "Your brand. Our factory." if wall == "back" else "Made to your drawing."
    size = min(0.30, (w - 0.6) / kit.text_width(head, 1, "display-semibold"))
    t(page, 0.28, 0.12 + size * 0.95, head, size, "display-semibold")
    t(page, 0.30, 0.12 + size * 0.95 + 0.085, "Ihre Marke. Unser Werk." if wall == "back" else "Gefertigt nach Ihrer Zeichnung.", 0.055, "text", GREY)
    if wall == "back":
        ph_w, ph_h = 1.70, LOW_BOTTOM - LOW_TOP
        image(page, 0.30, LOW_TOP, ph_w, ph_h, photo("home-panic-exit-double-door.webp", ph_w / ph_h, 0.5))
        x = 0.30 + ph_w + 0.25
        kicker(page, x, LOW_TOP + 0.05, "Panic exit devices")
        t(page, x, LOW_TOP + 0.16, "One push, and the door opens.", 0.075, "semibold")
        t(page, x, LOW_TOP + 0.24, "Push bars, outside trims and lock cases for escape and fire doors,", 0.036)
        t(page, x, LOW_TOP + 0.29, "specified as a set. 306-D on a pair of doors.", 0.036)
        facts_row(page, x + 1.95, w - 0.30, LOW_TOP + 0.05, FIGURES[:2] + FIGURES[3:], big=0.085)
    else:
        facts_row(page, 0.30, w - 0.30, LOW_TOP + 0.05, [("Germany", "office in Brohl-Lützing"), ("Since 1998", "in Zhongshan, Guangdong"), ("OEM", "under your brand")], big=0.085)
        t(page, 0.30, LOW_TOP + 0.42, MARKETS, 0.034, "text", GREY)
    plinth(page, w)


def concept_b(page, wall, w):
    """B · Ink gallery: the walls go ink like the site's dark section; the boards hang like prints."""
    page.draw_rect(page.rect, color=None, fill=INK, width=0)
    mark(page, 0.30, 0.12, 0.17, hm.WHITE)
    head = "Your brand. Our factory." if wall == "back" else "Made to your drawing."
    t(page, 1.55, 0.36, head, 0.24 if wall == "back" else 0.18, "display-semibold", WHITE)
    t(page, 1.56, 0.52, "Ihre Marke. Unser Werk." if wall == "back" else "Gefertigt nach Ihrer Zeichnung.", 0.055, "text", (0.75, 0.73, 0.70))
    t(page, w - 0.30, 0.19, "BAU 2027 · C4.523", 0.06, "medium", (0.75, 0.73, 0.70), align="right")
    if wall == "back":
        # The export map from the home page, as white dots, with the factory and the routes.
        em = json.loads((kit.ROOT / "src" / "data" / "generated" / "export-map.json").read_text(encoding="utf-8"))
        vw, vh = em["viewBox"]
        mw = 3.6
        k = mw / vw
        mh = vh * k
        ox, oy = w - 0.30 - mw, LOW_TOP - 0.02
        import re
        for xs, ys in re.findall(r"M([\d.]+) ([\d.]+)h0", em["dots"]):
            cx, cy = ox + float(xs) * k, oy + float(ys) * k
            if cy < LOW_BOTTOM:
                page.draw_circle((cx * S, cy * S), 0.006 * S, color=None, fill=(0.42, 0.41, 0.39), width=0)
        o = em["origin"]
        for tg in em["targets"]:
            x0, y0 = ox + o["x"] * k, oy + o["y"] * k
            x1, y1 = ox + tg["x"] * k, oy + tg["y"] * k
            mx, my = (x0 + x1) / 2, (y0 + y1) / 2 - math.hypot(x1 - x0, y1 - y0) * 0.28
            page.draw_bezier((x0 * S, y0 * S), (mx * S, my * S), (mx * S, my * S), (x1 * S, y1 * S), color=(0.85, 0.84, 0.80), width=0.003 * S)
            page.draw_circle((x1 * S, y1 * S), 0.012 * S, color=None, fill=WHITE, width=0)
        page.draw_circle(((ox + o["x"] * k) * S, (oy + o["y"] * k) * S), 0.022 * S, color=None, fill=WHITE, width=0)
        kicker(page, 0.30, LOW_TOP + 0.05, "Export markets", (0.70, 0.68, 0.65))
        t(page, 0.30, LOW_TOP + 0.17, "Shipped from Zhongshan", 0.085, "semibold", WHITE)
        t(page, 0.30, LOW_TOP + 0.25, "Europe from Portugal to Finland, Russia and Turkey,", 0.036, "text", (0.85, 0.84, 0.80))
        t(page, 0.30, LOW_TOP + 0.30, "North and South America, Japan, Korea, Southeast Asia", 0.036, "text", (0.85, 0.84, 0.80))
        t(page, 0.30, LOW_TOP + 0.35, "and Australia. An office in Germany: Brohl-Lützing.", 0.036, "text", (0.85, 0.84, 0.80))
    else:
        facts_row(page, 0.30, w - 0.30, LOW_TOP + 0.05, FIGURES[:2] + FIGURES[3:], WHITE, (0.70, 0.68, 0.65), big=0.085)
    page.draw_line((0, (H - PLINTH) * S), (w * S, (H - PLINTH) * S), color=(0.35, 0.34, 0.32), width=0.004 * S)
    t(page, 0.30, H - PLINTH / 2 + 0.018, "cantonlock.com", 0.05, "medium", WHITE)


TECH = [  # (drawing, product photo under public/images, model, two spec lines from the record)
    ("102-glass-door-handle", "products-hyde/102-glass-door-handle", "102", ["Pull handle, 304 stainless steel", "600 mm long · 147 mm centres"]),
    ("lc07-85-45mm-lock-case", "products-hyde/lc07-85-45mm-lock-case", "LC07", ["Mortise lock case", "85 mm centre · 45 mm backset"]),
    ("001-panic-exit-device-trim", "products-hyde/001-panic-exit-device-trim", "001", ["Outside trim for panic bars", "Plate 300 × 75 mm"]),
    ("5689-night-latch-and-rim-lock", "products-hyde/5689-night-latch-and-rim-lock", "5689", ["Night latch and rim lock", "60 mm backset"]),
]


def concept_c(page, wall, w):
    """C · Technical: a faint 10 cm grid, real dimension drawings beside the real product."""
    page.draw_rect(page.rect, color=None, fill=WHITE, width=0)
    grid = (0.90, 0.89, 0.87)
    for i in range(int(w / 0.1) + 1):
        page.draw_line((i * 0.1 * S, 0), (i * 0.1 * S, (H - PLINTH) * S), color=grid, width=0.0012 * S)
    for j in range(int(H / 0.1) + 1):
        page.draw_line((0, j * 0.1 * S), (w * S, j * 0.1 * S), color=grid, width=0.0012 * S)
    page.draw_rect(pymupdf.Rect(0, 0, w * S, HEADER * S), color=None, fill=WHITE, width=0)
    mark(page, 0.30, 0.12, 0.17)
    head = "Made to your drawing." if wall == "back" else "Your brand. Our factory."
    t(page, 1.55, 0.36, head, 0.24 if wall == "back" else 0.18, "display-semibold")
    t(page, 1.56, 0.52, "Gefertigt nach Ihrer Zeichnung." if wall == "back" else "Ihre Marke. Unser Werk.", 0.055, "text", GREY)
    t(page, w - 0.30, 0.19, "BAU 2027 · C4.523", 0.055, "medium", GREY, align="right")
    rule(page, 0, w, HEADER, INK, 0.004)
    if wall == "back":
        cw = (w - 0.6) / len(TECH)
        for i, (dr, ph, model, lines) in enumerate(TECH):
            x = 0.30 + i * cw
            box_h = LOW_BOTTOM - LOW_TOP - 0.16
            drawing(page, dr, x, LOW_TOP, cw * 0.58, box_h)
            image(page, x + cw * 0.60, LOW_TOP + 0.05, cw * 0.32, cw * 0.32, tile(ph))
            t(page, x, LOW_BOTTOM - 0.10, model, 0.05, "semibold")
            t(page, x + 0.20, LOW_BOTTOM - 0.10, lines[0], 0.032)
            t(page, x + 0.20, LOW_BOTTOM - 0.05, lines[1], 0.032, "text", GREY)
    else:
        steps = [("01", "Send a drawing", "or a sample."), ("02", "We cut the tool", "in our own workshop."),
                 ("03", "Sample", "credited against the first order."), ("04", "Production", "from 300–5,000 pieces.")]
        cw = (w - 0.6) / 4
        for i, (n, a, b) in enumerate(steps):
            x = 0.30 + i * cw
            t(page, x, LOW_TOP + 0.16, n, 0.12, "display-semibold")
            rule(page, x, x + cw - 0.08, LOW_TOP + 0.21, INK, 0.003)
            t(page, x, LOW_TOP + 0.30, a, 0.05, "semibold")
            t(page, x, LOW_TOP + 0.36, b, 0.036, "text", GREY)
    plinth(page, w, items=("Since 1998", "Zhongshan, Guangdong, China", "OEM & private label", "cantonlock.com"))


def concept_d(page, wall, w):
    """D · Catalogue: the product frieze — the v4 tiles, moved under the boards. High density."""
    page.draw_rect(page.rect, color=None, fill=WHITE, width=0)
    mark(page, 0.30, 0.12, 0.17)
    head = "Your brand. Our factory." if wall == "back" else "Made to your drawing."
    t(page, 1.55, 0.36, head, 0.24 if wall == "back" else 0.18, "display-semibold")
    t(page, 1.56, 0.52, "Ihre Marke. Unser Werk." if wall == "back" else "Gefertigt nach Ihrer Zeichnung.", 0.05, "text", GREY)
    if wall == "back":
        t(page, w - 0.30, 0.36, "C4.523", 0.10, "display-semibold", align="right")
    page.draw_rect(pymupdf.Rect(0, HEADER * S, w * S, (H - PLINTH) * S), color=None, fill=BODY, width=0)
    zones = g.ZONES["back-wall" if wall == "back" else "side-wall"]
    zw = (w - 0.36 - 0.12 * (len(zones) - 1)) / len(zones)
    for i, (title, _de, _fact, items) in enumerate(zones):
        x = 0.18 + i * (zw + 0.12)
        t(page, x, LOW_TOP + 0.05, title, 0.045, "semibold")
        n = min(len(items), 4 if wall == "back" else 6)
        ts = min((zw - 0.02 * (n - 1)) / n, LOW_BOTTOM - LOW_TOP - 0.16)
        for j, (path, label, new) in enumerate(items[:n]):
            cx = x + j * (ts + 0.02)
            image(page, cx, LOW_TOP + 0.08, ts, ts, tile(path))
            t(page, cx, LOW_TOP + 0.08 + ts + 0.04, label, 0.028, "medium")
    plinth(page, w, items=("Since 1998", "ISO 9001:2015 stamping plant", "OEM & private label", "MOQ 300–5,000 pcs"))


CONCEPTS = [
    ("A", "杂志大片", "Magazine", concept_a, "低密度。一句超大标题、一张门场景大图、一行「工厂数据」，和官网首页同一套语言。最安静、最像品牌。"),
    ("B", "墨色画廊", "Ink gallery", concept_b, "中密度。墙面整体墨色，白色展板像画廊里的作品；后墙下方是官网同款出口点阵地图和德国办事处。最醒目、最有气场。"),
    ("C", "工程图纸", "Technical", concept_c, "中密度。10 cm 淡网格 + 真实尺寸线稿与实拍并排；侧墙讲「图纸→开模→样品→量产」四步。最体现工厂专业度。"),
    ("D", "产品目录", "Catalogue", concept_d, "高密度。展板下方一整条产品小图带（热卖款、四柱锁体、执手、巴西、阿根廷）。信息最多，最像卖场。"),
]


# ------------------------------------------------------------------------------ flat render
def render_wall(fn, wall: str) -> Image.Image:
    w = WALLS[wall]
    doc = pymupdf.open()
    page = doc.new_page(width=w * S, height=H * S)
    fn(page, wall, w)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(PX_PER_M / S, PX_PER_M / S))
    im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    d = ImageDraw.Draw(im)
    # The client's existing boards (content unknown): a white panel, thin dark frame, a product
    # photograph and two grey lines standing in for their text.
    stand_ins = ["products-hyde/307-panic-exit-device", "products-hyde/lc14-85-50mm-lock-case",
                 "products-hyde/9014s-stainless-steel-handle", "products-hyde/564-night-latch-and-rim-lock",
                 "products-hyde/311-panic-exit-device", "products-hyde/102-glass-door-handle",
                 "products-hyde/305-fire-door-panic-exit-device"]
    for i, bx in enumerate(board_xs(wall)):
        x0, y0 = int(bx * PX_PER_M), int((H - BOARD_Z0 - BOARD_H) * PX_PER_M)
        x1, y1 = int((bx + BOARD_W) * PX_PER_M), int((H - BOARD_Z0) * PX_PER_M)
        sh = Image.new("L", im.size, 0)
        ImageDraw.Draw(sh).rectangle((x0 + 8, y0 + 12, x1 + 8, y1 + 12), fill=90)
        im = Image.composite(Image.new("RGB", im.size, (20, 19, 17)), im, sh.filter(ImageFilter.GaussianBlur(10)))
        d = ImageDraw.Draw(im)
        d.rectangle((x0, y0, x1, y1), fill=(255, 255, 255), outline=(30, 29, 26), width=5)
        tl = Image.open(io.BytesIO(tile(stand_ins[(i + (3 if wall == "side" else 0)) % len(stand_ins)]))).resize((x1 - x0 - 40, x1 - x0 - 40))
        im.paste(tl, (x0 + 20, y0 + 30))
        for k in range(3):
            d.rectangle((x0 + 22, y1 - 70 + k * 18, x0 + 22 + (x1 - x0 - 44) * (0.8 - 0.2 * k), y1 - 62 + k * 18), fill=(200, 198, 192))
    return im


# --------------------------------------------------------------------------------- 3-D scene
W_IMG, H_IMG = 1800, 1100
# Plan: open front along y = 0 (the aisle), back wall at y = 4.5, side wall at x = 6.5 (right),
# open left end at x = 0. The camera stands in the aisle, front-left, at eye height.
DEPTH = 4.5
CAM = np.array([-0.4, -3.9, 1.62])
TARGET = np.array([3.6, 3.1, 1.30])
FOCAL = 1180.0


def _basis():
    f = TARGET - CAM
    f /= np.linalg.norm(f)
    r = np.cross(f, [0, 0, 1.0])
    r /= np.linalg.norm(r)
    u = np.cross(r, f)
    return f, r, u


F, R, U = _basis()


def proj(p):
    d = np.array(p, float) - CAM
    z = d @ F
    return (W_IMG / 2 + FOCAL * (d @ R) / z, H_IMG * 0.50 - FOCAL * (d @ U) / z)


def homography(src, dst):
    """Coefficients for PIL's PERSPECTIVE transform: maps OUTPUT (dst) points to INPUT (src)."""
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        b += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(b, float))


def warp(canvas: Image.Image, tex: Image.Image, corners3d, shade=1.0):
    """Paste `tex` onto the 3-D quad (top-left, top-right, bottom-right, bottom-left)."""
    dst = [proj(p) for p in corners3d]
    src = [(0, 0), (tex.width, 0), (tex.width, tex.height), (0, tex.height)]
    coeffs = homography(src, dst)
    big = tex.transform(canvas.size, Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)
    if shade != 1.0:
        big = Image.eval(big, lambda v: int(v * shade))
    mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(mask).polygon(dst, fill=255)
    canvas.paste(big, (0, 0), mask)


def poly(d, pts3d, fill):
    d.polygon([proj(p) for p in pts3d], fill=fill)


def person(d, x, y, h, fill):
    foot = proj((x, y, 0))
    head = proj((x, y, h))
    ph = foot[1] - head[1]
    wb = ph * 0.13
    d.rounded_rectangle((foot[0] - wb, head[1] + ph * 0.16, foot[0] + wb, foot[1]), radius=int(wb * 0.6), fill=fill)
    r = ph * 0.065
    d.ellipse((foot[0] - r, head[1], foot[0] + r, head[1] + 2 * r), fill=fill)


def scene(back: Image.Image, side: Image.Image) -> Image.Image:
    D = DEPTH
    im = Image.new("RGB", (W_IMG, H_IMG), (214, 211, 205))
    d = ImageDraw.Draw(im)
    # hall: a darker ceiling zone fading into the hall air, a pale aisle floor
    for yy in range(int(H_IMG * 0.16)):
        c = int(70 + (214 - 70) * yy / (H_IMG * 0.16))
        d.line((0, yy, W_IMG, yy), fill=(c, c - 1, c - 4))
    horizon = proj((3.25, 60.0, 0))[1]
    d.rectangle((0, int(horizon), W_IMG, H_IMG), fill=(196, 193, 187))
    # stand carpet
    poly(d, [(0, 0, 0), (6.5, 0, 0), (6.5, D, 0), (0, D, 0)], (74, 73, 70))
    # walls; the side wall's left edge (as seen from inside) is the back corner
    warp(im, back, [(0, D, H), (6.5, D, H), (6.5, D, 0), (0, D, 0)])
    warp(im, side, [(6.5, D, H), (6.5, 0, H), (6.5, 0, 0), (6.5, D, 0)], shade=0.92)
    d = ImageDraw.Draw(im)
    poly(d, [(0, D, H), (6.5, D, H), (6.5, D + 0.06, H), (0, D + 0.06, H)], (240, 238, 233))
    poly(d, [(6.5, D, H), (6.5, 0, H), (6.56, 0, H), (6.56, D, H)], (228, 226, 221))
    poly(d, [(6.5, 0, 0), (6.5, 0, H), (6.56, 0, H), (6.56, 0, 0)], (205, 203, 198))
    poly(d, [(0, D, 0), (0, D, H), (-0.06, D, H), (-0.06, D, 0)], (205, 203, 198))
    # table and two stools, back-centre
    cx, cy = 3.6, 2.9
    d.line((proj((cx, cy, 0)), proj((cx, cy, 0.74))), fill=(40, 39, 37), width=7)
    poly(d, [(cx + 0.42 * math.cos(a), cy + 0.42 * math.sin(a), 0.74) for a in np.linspace(0, 2 * math.pi, 48)], (248, 247, 244))
    for sx, sy in ((cx - 0.8, cy - 0.1), (cx + 0.75, cy - 0.2)):
        d.line((proj((sx, sy, 0)), proj((sx, sy, 0.46))), fill=(36, 35, 33), width=6)
        poly(d, [(sx - 0.2, sy - 0.2, 0.46), (sx + 0.2, sy - 0.2, 0.46), (sx + 0.2, sy + 0.2, 0.46), (sx - 0.2, sy + 0.2, 0.46)], (36, 35, 33))
    # people for scale (1.75 m, 1.68 m), drawn back to front
    person(d, 5.3, 2.6, 1.68, (132, 129, 124))
    person(d, 2.2, 1.7, 1.75, (112, 109, 104))
    # counter at the open front-left corner, white, the icon on its front
    x0, x1, y0, y1, hz = 0.30, 1.60, 0.25, 0.80, 1.05
    poly(d, [(x0, y0, hz), (x1, y0, hz), (x1, y1, hz), (x0, y1, hz)], (250, 249, 246))
    poly(d, [(x1, y0, 0), (x1, y1, 0), (x1, y1, hz), (x1, y0, hz)], (214, 212, 207))
    doc = pymupdf.open()
    pg = doc.new_page(width=520, height=420)
    pg.draw_rect(pg.rect, color=None, fill=(244 / 255, 243 / 255, 240 / 255), width=0)
    place_mark(pg, pymupdf.Rect(205, 150, 315, 250), hm.icon())
    front = Image.open(io.BytesIO(pg.get_pixmap().tobytes("png"))).convert("RGB")
    warp(im, front, [(x0, y0, hz), (x1, y0, hz), (x1, y0, 0), (x0, y0, 0)])
    # Frame the stand: crop to its projected extent with a margin, keep the 18:11 shape.
    pts = [proj(p) for p in [(0, D, H), (6.56, D, H), (6.56, 0, H), (6.56, 0, 0), (0, 0, 0), (0, D, 0)]]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    half_w = max((max(xs) - min(xs)) / 2 * 1.12, (max(ys) - min(ys)) / 2 * 1.18 * 18 / 11)
    half_h = half_w * 11 / 18
    box = (int(cx - half_w), int(cy - half_h), int(cx + half_w), int(cy + half_h))
    # Pad with the hall colours first, so a crop that reaches past the render edge stays clean.
    pad = 400
    big = Image.new("RGB", (W_IMG + 2 * pad, H_IMG + 2 * pad), (214, 211, 205))
    ImageDraw.Draw(big).rectangle((0, pad + int(horizon), W_IMG + 2 * pad, H_IMG + 2 * pad), fill=(196, 193, 187))
    big.paste(im, (pad, pad))
    box = tuple(v + pad for v in box)
    return big.crop(box).resize((W_IMG, H_IMG), Image.LANCZOS)


# ---------------------------------------------------------------------------------- outputs
def font(size, bold=False):
    path = kit.FONTS["cjk-bold" if bold else "cjk"]
    return ImageFont.truetype(str(path), size)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(OUT_DEFAULT))
    out = Path(ap.parse_args().out_dir)
    out.mkdir(parents=True, exist_ok=True)
    scenes = []
    for key, zh, en, fn, idea in CONCEPTS:
        back, side = render_wall(fn, "back"), render_wall(fn, "side")
        flat = Image.new("RGB", (back.width + side.width + 60, back.height + 40), (255, 255, 255))
        flat.paste(back, (20, 20))
        flat.paste(side, (back.width + 40, 20))
        flat.save(out / f"concept-{key}-walls.png", optimize=True)
        sc = scene(back, side)
        sc.save(out / f"concept-{key}-scene.png", optimize=True)
        scenes.append((key, zh, en, idea, sc))
        print(f"{key} {en}: done")
    # comparison sheet, 2 × 2
    tw, th = 1200, 733
    sheet = Image.new("RGB", (2 * tw + 90, 2 * (th + 150) + 140), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    d.text((30, 30), "BAU 2027 · C4.523 墙面喷绘：四个方向（同一视角，展板按现有位置挂墙）", font=font(40, True), fill=INK_RGB)
    d.text((30, 86), "展板为占位（0.60×0.85 m，下沿离地 1.00 m，后墙 7 块、侧墙 4 块，按假设）；人物 1.75 m 作比例参照。全部图片为官网实拍，文字均为官网已发布事实。", font=font(22), fill=(110, 108, 103))
    for i, (key, zh, en, idea, sc) in enumerate(scenes):
        x, y = 30 + (i % 2) * (tw + 30), 140 + (i // 2) * (th + 150)
        sheet.paste(sc.resize((tw, th), Image.LANCZOS), (x, y))
        d.text((x, y + th + 14), f"{key}  {zh} · {en}", font=font(34, True), fill=INK_RGB)
        d.text((x, y + th + 64), idea, font=font(22), fill=(80, 78, 74))
    sheet.save(out / "BAU2027-四个方向对比.png", optimize=True)
    print(out / "BAU2027-四个方向对比.png")


if __name__ == "__main__":
    main()
