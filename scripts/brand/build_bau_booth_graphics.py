"""BAU 2027 stand C4.523: wall spray-cloth (喷绘布) artwork for the ad company, plus the proposal sheet.

    python scripts/brand/build_bau_booth_graphics.py [--out-dir DIR]

Client, 2026-10-16: 「装展示板以外的空间用什么样的广告图片 做一下 bau的 东西喷绘布 15 公分出血，你出方案」.
The product boards already exist and hang on top of the cloth. So the cloth carries only what
must not be covered: the header band (楣头) above the boards, an ink plinth below them, and one
real factory photograph at the aisle end of the side wall. Everything in the board zone is
plain white, so the boards can go anywhere without hiding a word.

Writes to <out-dir> (default docs/design-references/bau-2027-booth-graphics/):
  BAU2027-C4-523-喷绘方案.pdf       A3 landscape proposal: both walls at scale, the board zone,
                                     every panel's finished and bleed size, print notes
  制作文件-1比10/<panel>.pdf        each cloth alone, vector, 1:10, page = bleed box, TrimBox set
  preview-<panel>.png               screen previews

Rules carried over from the site and the 10-11 signage: ink on white, no brass
(「白底墨色不要黑金」); no certification claims, no invented facts (copy is from
content/bau-2027.json and src/data/company.ts); the only photograph is a real one from the
factory (public/images/company/press-shop.webp, the unbranded source). Wall sizes below are
what the stand plan says (6.50 × 4.50 m) plus ASSUMED heights: the builder must confirm them,
and the file is regenerated with the real numbers in WALLS.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass, field
from pathlib import Path

import pymupdf

import hyde_mark as hm
import kit
from kit import GREY, INK, RULE, WHITE, place_mark, text

M = 100 * kit.MM          # 1 m at 1:10 = 100 mm on the page
BLEED = 0.15              # client: 15 cm bleed on every side
PHOTOS = kit.ROOT / "public" / "images" / "company"
QR_URL = "https://cantonlock.com/bau-2027/"   # spec sheets, the featured models and the meeting form
SIDE_MARGIN = 0.30


@dataclass
class Wall:
    key: str
    zh: str
    width: float                     # finished width, m
    height: float = 2.50             # ASSUMED: standard stand wall height, builder to confirm
    header: float = 0.70             # header band from the top edge
    plinth: float = 0.30             # ink plinth from the floor
    lines: dict = field(default_factory=dict)
    base: list[str] = field(default_factory=list)   # white items set across the plinth
    qr: bool = False


WALLS = [
    # One idea per wall, in large type, the way the category leaders run their stands
    # (SIMONSWERK "Only a detail?", dormakaba "For Every Place That Matters"). Both lines are
    # facts from content/bau-2027.json: much of the output leaves under customers' brands, and
    # a drawing or a sample is tooled.
    Wall("back-wall", "后墙", 6.50, lines={
        "motto": "Your brand. Our factory.",
        "motto_de": "Ihre Marke. Unser Werk.",
        "line": "Panic exit devices · Locks · Door hardware",
        "kicker": "BAU 2027 · Messe München",
        "big": "Stand C4.523",
    }, base=["Since 1998", "Zhongshan, Guangdong, China", "ISO 9001:2015 stamping plant",
             "OEM & private label", "MOQ 300–5,000 pcs"]),
    # The side wall's open end faces the aisle (stand plan render), so the factory column is there.
    Wall("side-wall", "侧墙", 4.50, lines={
        "motto": "Made to your drawing.",
        "motto_de": "Gefertigt nach Ihrer Zeichnung.",
        "line": "Door hardware from Zhongshan, China, since 1998",
        "kicker": "Website · Webseite",
        "big": "cantonlock.com",
    }, base=["tec@cantonlock.com", "WhatsApp +1 703 967 7493"], qr=True),
]

# Product zones (client, 2026-10-16: 「可以放那个产品的图片……做的产品小图做背景……巴西逃生锁，4柱锁体，
# 拉手，不锈钢拉手……放新产品 从仓库找到阿里巴巴热卖款，结合巴西逃生锁，阿根廷锁体……现在的留白太多了」).
# Every tile is a real product photograph from public/images (the site's own uploads). The core
# zones lead with the models the client's Alibaba data shows buyers ask about most
# (docs/research/2026-09-11-alibaba-product-performance.json): 307, 311, 305, 310, 6068, 564,
# 5836, 1073D, 587, 102, 9014S, LH1016. NEW marks the 2026-10 additions.
# (image path under public/images, label, new?)
P, H, BR, AR = "products/", "products-hyde/", "brazil-collection/", "argentina-collection/"
ZONES = {
    "back-wall": [
        ("Panic exit devices", "Panikbeschläge",
         "Single and double doors, side latch or top-and-bottom rods, with outside trims.",
         [(H + "307-panic-exit-device", "307", False), (H + "311-panic-exit-device", "311", False),
          (H + "305-fire-door-panic-exit-device", "305", False), (H + "310-panic-exit-device", "310", False),
          (H + "308-d-d-panic-exit-device", "308-D", True), (H + "037-ps-panic-exit-device-trim", "037 PS", True)]),
        ("Mortise lock cases", "Einsteckschlösser",
         "Security cases with four round bolts, 85 mm centre, 50 or 60 mm backset.",
         [(H + "lc14-85-50mm-lock-case", "LC14 85×50", False), (H + "lc04-85-60-lock-case", "LC04 85×60", False),
          (H + "6068-mortise-lever-handle-lock", "6068", False), (H + "lc05-8560-lock-case", "LC05 8560", False),
          (H + "lc35-8550-lock-case", "LC35 8550", False), (H + "hy006et-lock-case", "HY006ET", False)]),
        ("Stainless steel handles", "Edelstahl-Drücker und Stoßgriffe",
         "Lever handles on roses and pull handles for glass and timber doors.",
         [(H + "102-glass-door-handle", "102", False), (H + "9014s-stainless-steel-handle", "9014S", False),
          (H + "lh1016-stainless-steel-handle", "LH1016", False), (H + "9087-ss-stainless-steel-handle", "9087 SS", False),
          (H + "8829-bl-lever-handle", "8829 BL", True), (H + "9007e-stainless-steel-handle", "9007E", False)]),
        ("Rim locks and knob locks", "Kasten- und Knaufschlösser",
         "Night latches, rim locks and cylindrical locks for entrance and interior doors.",
         [(H + "564-night-latch-and-rim-lock", "564", False), (H + "5836-night-latch-and-rim-lock", "5836", False),
          (H + "1073d-night-latch-and-rim-lock", "1073D", False), (H + "587-sset-light-duty-cylindrical-lock", "587 SSET", False),
          (H + "d104-ss-deadbolts", "D104 SS", True), (H + "5871-sset-heavy-duty-cylindrical-lock", "5871 SSET", False)]),
    ],
    "side-wall": [
        ("Panic bars for Brazil", "Barras antipânico · für Brasilien",
         "Leading Brazilian fire-door makers buy their panic bars from us.",
         [(BR + "br1-sk", "BR1-SK", False), (BR + "br5-s", "BR5-S", False), (BR + "br2-sk", "BR2-SK", False),
          (BR + "br6-d", "BR6-D", False), (BR + "br1-stl", "BR1-STL", False), (BR + "br2-tk", "BR2-TK", False),
          (BR + "br5-tk", "BR5-TK", False), (BR + "br7-t", "BR7-T", False)]),
        ("Mortise locks for Argentina", "Cerraduras · für Argentinien",
         "AR-4 and AR-5 lock bodies and deadlocks, with faceplate and case dimensions for every model.",
         [(AR + "ar5-100-entero", "AR5-100", False), (AR + "ar5-102-entero", "AR5-102", False),
          (AR + "ar5-104", "AR5-104", False), (AR + "ar5-105", "AR5-105", False), (AR + "ar5-106", "AR5-106", False),
          (AR + "ar5-107", "AR5-107", False), (AR + "ar4-110", "AR4-110", False), (AR + "ar4-111-doble-perno", "AR4-111", False)]),
    ],
}
BODY = (0.955, 0.950, 0.940)     # the warm light grey the tiles sit on

_JPEG: dict[tuple, bytes] = {}


def photo_jpeg(name: str, aspect: float, focus: float = 0.5) -> bytes:
    """The photograph cropped to the panel's aspect around `focus`, full resolution, JPEG q 95."""
    key = (name, round(aspect, 4), focus)
    if key not in _JPEG:
        import io
        from PIL import Image
        im = Image.open(PHOTOS / name).convert("RGB")
        w, h = im.size
        if w / h > aspect:
            cw, ch = round(h * aspect), h
            x0, y0 = round((w - cw) * focus), 0
        else:
            cw, ch = w, round(w / aspect)
            x0, y0 = 0, (h - ch) // 2
        im = im.crop((x0, y0, x0 + cw, y0 + ch))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=95)
        _JPEG[key] = buf.getvalue()
    return _JPEG[key]


_TILE: dict[str, bytes] = {}


def tile_jpeg(path: str) -> bytes:
    """A product photograph made square for a tile: the small corner mark cleared, the product
    trimmed to its own extent and centred with even margins. Nothing in the product is touched."""
    if path not in _TILE:
        import io
        from PIL import Image, ImageChops
        im = Image.open(kit.ROOT / "public" / "images" / f"{path}.webp").convert("RGB")
        w, h = im.size
        # The site photos carry a small HYDE mark in one corner (top-left on most, top-right or
        # bottom-left on some). In each corner, find the dark cluster; clear it only if it is small
        # and isolated (a white ring around it), so a product edge reaching a corner is never touched.
        g = im.convert("L")
        px = g.load()
        zone_w, zone_h = int(0.26 * w), int(0.13 * h)
        for cx0, cy0 in ((0, 0), (w - zone_w, 0), (0, h - zone_h), (w - zone_w, h - zone_h)):
            dark = [(x, y) for y in range(cy0, cy0 + zone_h) for x in range(cx0, cx0 + zone_w) if px[x, y] < 225]
            if not dark:
                continue
            x0, y0 = min(p[0] for p in dark), min(p[1] for p in dark)
            x1, y1 = max(p[0] for p in dark), max(p[1] for p in dark)
            pad = int(0.025 * w)
            ex = (max(x0 - pad, 0), max(y0 - pad, 0), min(x1 + pad, w - 1), min(y1 + pad, h - 1))
            ring = [px[x, y] for y in range(ex[1], ex[3] + 1) for x in (ex[0], ex[2])] + \
                   [px[x, y] for x in range(ex[0], ex[2] + 1) for y in (ex[1], ex[3])]
            if (x1 - x0) < 0.22 * w and (y1 - y0) < 0.05 * h and min(ring) > 235:
                im.paste((255, 255, 255), (ex[0], ex[1], ex[2] + 1, ex[3] + 1))
                g.paste(255, (ex[0], ex[1], ex[2] + 1, ex[3] + 1))
                px = g.load()
        diff = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 18 else 0)
        bb = diff.getbbox() or (0, 0, w, h)
        im = im.crop(bb)
        side = int(max(im.size) * 1.12)
        sq = Image.new("RGB", (side, side), (255, 255, 255))
        sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        buf = io.BytesIO()
        sq.save(buf, "JPEG", quality=92)
        _TILE[path] = buf.getvalue()
    return _TILE[path]


def draw_zones(page, X, Y, s, w: "Wall") -> None:
    """The body of the wall: product zones on a warm grey field, each with a heading, a German
    line, one sentence of fact and a grid of real product tiles with their model numbers."""
    zones = ZONES[w.key]
    top, bottom = w.header + 0.06, w.height - w.plinth - 0.06
    left, right = 0.18, w.width - 0.18
    gutter = 0.16
    zw = (right - left - gutter * (len(zones) - 1)) / len(zones)
    for i, (title, de, fact, items) in enumerate(zones):
        zx = left + i * (zw + gutter)
        text(page, X(zx), Y(top + 0.085), title, 0.068 * s, "semibold")
        text(page, X(zx), Y(top + 0.145), de, 0.042 * s, "text", GREY)
        text(page, X(zx), Y(top + 0.205), fact, 0.036 * s, "text", INK)
        cols = 4 if len(items) > 6 else 3
        gap = 0.03
        label_h = 0.055
        grid_top = top + 0.25
        rows = (len(items) + cols - 1) // cols
        t = min((zw - gap * (cols - 1)) / cols, (bottom - grid_top - rows * label_h - gap * (rows - 1)) / rows)
        for j, (path, label, new) in enumerate(items):
            cx = zx + (j % cols) * (t + gap)
            cy = grid_top + (j // cols) * (t + label_h + gap)
            r = pymupdf.Rect(X(cx), Y(cy), X(cx + t), Y(cy + t))
            page.insert_image(r, stream=tile_jpeg(path), keep_proportion=True)
            text(page, X(cx), Y(cy + t + 0.040), label, 0.034 * s, "medium")
            if new:
                tw = kit.text_width("NEW", 0.028 * s, "semibold") + 0.03 * s
                page.draw_rect(pymupdf.Rect(r.x0, r.y0, r.x0 + tw, r.y0 + 0.05 * s), color=None, fill=INK, width=0)
                text(page, r.x0 + 0.015 * s, r.y0 + 0.035 * s, "NEW", 0.028 * s, "semibold", WHITE)


def draw_qr(page: pymupdf.Page, r: pymupdf.Rect, data: str) -> None:
    """A vector QR code (error level M, 4-module quiet zone) filling the square `r`."""
    import segno
    q = segno.make(data, error="m", micro=False)
    rows = list(q.matrix)
    n = len(rows) + 8
    m = r.width / n
    page.draw_rect(r, color=None, fill=WHITE, width=0)
    for y, row in enumerate(rows):
        for x, v in enumerate(row):
            if v:
                page.draw_rect(pymupdf.Rect(r.x0 + (x + 4) * m, r.y0 + (y + 4) * m, r.x0 + (x + 5) * m + 0.01,
                                            r.y0 + (y + 5) * m + 0.01), color=None, fill=INK, width=0)


def tab(page, x, y_bottom, label, s):
    """A small ink tab with a white label, sitting on the bottom-left corner of a photograph."""
    size = 0.034 * s
    w = kit.text_width(label, size, "medium") + 0.05 * s
    h = 0.065 * s
    page.draw_rect(pymupdf.Rect(x, y_bottom - h, x + w, y_bottom), color=None, fill=INK, width=0)
    text(page, x + 0.025 * s, y_bottom - 0.022 * s, label, size, "medium", WHITE)


def draw_cloth(page: pymupdf.Page, o: pymupdf.Point, w: Wall, s: float, proof: bool) -> None:
    """The cloth with its bleed; `o` is the top-left of the BLEED box, s = points per metre."""
    B = BLEED
    full = pymupdf.Rect(o.x, o.y, o.x + (w.width + 2 * B) * s, o.y + (w.height + 2 * B) * s)
    page.draw_rect(full, color=None, fill=WHITE, width=0)
    X = lambda m: o.x + (B + m) * s          # noqa: E731  metres from the trim's left edge
    Y = lambda m: o.y + (B + m) * s          # noqa: E731  metres from the trim's top edge
    right = w.width - SIDE_MARGIN

    # Plinth: ink from the floor line up, running out into the bleed on three sides, carrying
    # one row of facts in white, spread evenly from margin to margin.
    page.draw_rect(pymupdf.Rect(full.x0, Y(w.height - w.plinth), full.x1, full.y1), color=None, fill=INK, width=0)
    if w.base:
        size, base_y = 0.058 * s, Y(w.height - w.plinth / 2) + 0.018 * s
        widths = [kit.text_width(t, size, "medium") for t in w.base]
        gap = ((right - SIDE_MARGIN) * s - sum(widths)) / max(len(w.base) - 1, 1)
        x = X(SIDE_MARGIN)
        for t, tw in zip(w.base, widths):
            text(page, x, base_y, t, size, "medium", WHITE)
            if t is not w.base[-1]:
                page.draw_line((x + tw + gap / 2, base_y - 0.045 * s), (x + tw + gap / 2, base_y + 0.008 * s),
                               color=(0.55, 0.53, 0.5), width=0.003 * s)
            x += tw + gap

    # Header band: the mark and the product line on the left, the wall's one idea in large type
    # beside it, the stand or the address (and the QR code) on the right.
    mark, mark_h = hm.horizontal(), 0.18
    mark_w = mark_h * mark.width / mark.height   # place_mark centres; a rect of the mark's own aspect keeps it flush left
    place_mark(page, pymupdf.Rect(X(SIDE_MARGIN), Y(0.15), X(SIDE_MARGIN + mark_w), Y(0.15 + mark_h)), mark)
    if w.qr:
        q = 0.46
        draw_qr(page, pymupdf.Rect(X(right - q), Y(0.12), X(right), Y(0.12 + q)), QR_URL)
        right -= q + 0.08
    big = 0.105 if w.qr else 0.125
    big_w = kit.text_width(w.lines["big"], big * s, "display-semibold") / s
    text(page, X(right), Y(0.205), w.lines["kicker"], 0.045 * s, "medium", GREY, track=30, align="right")
    text(page, X(right), Y(0.36), w.lines["big"], big * s, "display-semibold", align="right")
    if w.qr:
        text(page, X(right), Y(0.47), "Scan for spec sheets and to book a meeting.", 0.040 * s, "text", GREY, align="right")
        text(page, X(right), Y(0.535), "Scannen: Datenblätter und Terminvereinbarung.", 0.040 * s, "text", GREY, align="right")
    if w.qr:
        # A 4.50 m wall cannot hold mark, motto and QR block on one line: the motto goes under the mark.
        room = right - big_w - 0.30 - SIDE_MARGIN
        size = min(0.115, room / kit.text_width(w.lines["motto"], 1, "display-semibold"))
        text(page, X(SIDE_MARGIN), Y(0.485), w.lines["motto"], size * s, "display-semibold")
        text(page, X(SIDE_MARGIN), Y(0.60), w.lines["motto_de"], 0.055 * s, "text", GREY)
    else:
        text(page, X(SIDE_MARGIN), Y(0.53), w.lines["line"], 0.042 * s, "medium", GREY)
        # The motto starts after the mark and gets the room left before the right block.
        mx = SIDE_MARGIN + mark_w + 0.45
        room = right - big_w - 0.35 - mx
        size = min(0.15, room / kit.text_width(w.lines["motto"], 1, "display-semibold"))
        assert size > 0.08, f"{w.key}: the motto has only {room:.2f} m"
        text(page, X(mx), Y(0.36), w.lines["motto"], size * s, "display-semibold")
        text(page, X(mx), Y(0.53), w.lines["motto_de"], 0.070 * s, "text", GREY)
    page.draw_line((full.x0, Y(w.header)), (full.x1, Y(w.header)), color=INK, width=0.004 * s)

    # Body: the warm grey field and the product zones.
    page.draw_rect(pymupdf.Rect(full.x0, Y(w.header) + 0.002 * s, full.x1, Y(w.height - w.plinth)), color=None, fill=BODY, width=0)
    draw_zones(page, X, Y, s, w)

    if proof:
        # Not printed: the trim line and the zone the boards may occupy.
        trim = pymupdf.Rect(X(0), Y(0), X(w.width), Y(w.height))
        page.draw_rect(trim, color=(0.85, 0.1, 0.1), width=0.6, dashes="[4 3] 0")
        pass


def production(out: Path) -> list[Path]:
    files = []
    for w in WALLS:
        doc = pymupdf.open()
        s = M
        W, H = (w.width + 2 * BLEED) * s, (w.height + 2 * BLEED) * s
        page = doc.new_page(width=W, height=H)
        draw_cloth(page, pymupdf.Point(0, 0), w, s, proof=False)
        page.set_trimbox(pymupdf.Rect(BLEED * s, BLEED * s, W - BLEED * s, H - BLEED * s))
        name = f"BAU2027-C4-523-{w.key}-{w.width:.2f}x{w.height:.2f}m-bleed15cm-1to10.pdf"
        files.append(kit.save_pdf(doc, out / "制作文件-1比10" / name, f"BAU 2027 C4.523 {w.key}"))
        png = out / f"preview-{w.key}.png"
        page.get_pixmap(dpi=40).save(png)
    return files


def cjk(page, x, y, txt, size, bold=False, color=INK):
    return text(page, x, y, txt, size, "cjk-bold" if bold else "cjk", color)


def proposal(out: Path) -> Path:
    doc = pymupdf.open()
    A3 = pymupdf.Rect(0, 0, 1190.55, 841.89)
    page = doc.new_page(width=A3.width, height=A3.height)
    pad = 40
    cjk(page, pad, 52, "BAU 2027 · C4.523 展位墙面喷绘方案（第四版）", 20, bold=True)
    cjk(page, pad, 74, "两块整墙喷绘布：楣头一句主张，中间按品类排满官网实拍产品小图并配说明，底边放公司事实与联系方式。红色虚线 = 成品边（不印）。", 9.5, color=GREY)
    # Both walls at one scale, sized so they and the notes share the sheet.
    room = A3.height - 100 - 140 - len(WALLS) * 30
    s = min((A3.width - 2 * pad) / (WALLS[0].width + 2 * BLEED), room / sum(w.height + 2 * BLEED for w in WALLS))
    cjk(page, A3.width - pad - 120, 52, f"示意比例约 1:{round(100 / (s / kit.MM / 10)) * 1}", 9.5, color=GREY)
    y = 100
    for w in WALLS:
        cjk(page, pad, y, f"{w.zh}　成品 {w.width:.2f} × {w.height:.2f} m　含出血 {w.width + 2 * BLEED:.2f} × {w.height + 2 * BLEED:.2f} m", 10, bold=True)
        draw_cloth(page, pymupdf.Point(pad, y + 8), w, s, proof=True)
        y += (w.height + 2 * BLEED) * s + 30
    notes = [
        "材料：喷绘布（灯箱布/刀刮布按搭建方墙体），四边各出血 15 cm；文件为 1:10 PDF，放大 10 倍输出，TrimBox 即成品边。底色暖灰、小图白底，只用墨色和白；照片原样输出，不调色、不 AI 放大。",
        "墙高 2.50 m、楣头 0.70 m、底边 0.30 m 是按标准展位假设的，必须由搭建方确认真实尺寸后重出文件（改 WALLS 一行即可）。",
        "产品区全部是官网实拍小图（角上的小标已擦，产品本身未动）：后墙 4 区＝逃生锁、四柱锁体、不锈钢执手/拉手、外装锁/球锁，以阿里巴巴询盘最多的型号为主；侧墙 2 区＝巴西逃生锁、阿根廷锁体。NEW＝10 月新品。",
        "展板：布面已经排满产品，原有展板如果还要挂墙会盖住小图——建议放在展台前台或独立支架上；若一定挂墙，请给我展板尺寸和位置，我在布上留出空位。",
        "二维码（侧墙右上，46 cm）指向 cantonlock.com/bau-2027/（规格书 + 预约见面），已解码验证。底边：后墙为公司事实，侧墙为邮箱和 WhatsApp。",
        "楣头主张（后墙 Your brand. Our factory. / 侧墙 Made to your drawing.）与各区说明句都取自官网已确认事实；不写产能、不写其他认证。电子锁：产品库里没有可确认的电子锁，1073D 未标「电子」，待确认。",
        "建议（不印）：在展位开放角放一扇独立实物演示门（0.90×2.10 m 门扇带门框，装逃生锁和外执手），不靠墙以免挡住楣头。",
    ]
    for i, n in enumerate(notes):
        cjk(page, pad, A3.height - 24 - (len(notes) - 1 - i) * 15, f"{i + 1}. {n}", 8.6, color=INK)
    doc.subset_fonts()
    return kit.save_pdf(doc, out / "BAU2027-C4-523-喷绘方案.pdf", "BAU 2027 C4.523 booth graphics proposal")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(kit.ROOT / "docs" / "design-references" / "bau-2027-booth-graphics"))
    out = Path(ap.parse_args().out_dir)
    for f in production(out) + [proposal(out)]:
        print(f.relative_to(kit.ROOT) if f.is_relative_to(kit.ROOT) else f)


if __name__ == "__main__":
    main()
