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
    factory: bool = False            # the three-photo production column at the aisle end


WALLS = [
    Wall("back-wall", "后墙", 6.50, lines={
        "en": "Panic exit devices, locks and door hardware.",
        "de": "Panikbeschläge, Schlösser und Türbeschläge.",
        "kicker": "BAU 2027 · Messe München",
        "big": "Stand C4.523",
    }, base=["Since 1998", "Zhongshan, Guangdong, China", "ISO 9001:2015 stamping plant",
             "OEM & private label", "MOQ 300–5,000 pcs"]),
    # The side wall's open end faces the aisle (stand plan render), so the factory column is there.
    Wall("side-wall", "侧墙", 4.50, lines={
        "en": "Door hardware from Zhongshan, China, since 1998.",
        "de": "Türbeschläge aus Zhongshan, China – seit 1998.",
        "kicker": "Website · Webseite",
        "big": "cantonlock.com",
    }, base=["tec@cantonlock.com", "WhatsApp +1 703 967 7493"], qr=True, factory=True),
]

# The production column: real factory photographs only, none with another sign or logo in frame
# (several site photos show the old red "Hyland" sign or Chinese plates; those stay off the stand).
# (file, crop focus 0–1 across the width, caption)
FACTORY = [
    ("press-shop.webp", 0.55, "01  Stamping · Stanzen"),
    ("polishing-line.webp", 0.45, "02  Polishing · Polieren"),
    ("factory-assembly-quality-line.webp", 0.30, "03  Assembly · Montage"),
]

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

    # Header band: mark, the line in English and German, the stand or the address on the right.
    mark, mark_h = hm.horizontal(), 0.20
    mark_w = mark_h * mark.width / mark.height   # place_mark centres; a rect of the mark's own aspect keeps it flush left
    place_mark(page, pymupdf.Rect(X(SIDE_MARGIN), Y(0.12), X(SIDE_MARGIN + mark_w), Y(0.12 + mark_h)), mark)
    text(page, X(SIDE_MARGIN), Y(0.47), w.lines["en"], 0.085 * s, "medium")
    text(page, X(SIDE_MARGIN), Y(0.585), w.lines["de"], 0.058 * s, "text", GREY)
    if w.qr:
        q = 0.46
        draw_qr(page, pymupdf.Rect(X(right - q), Y(0.12), X(right), Y(0.12 + q)), QR_URL)
        right -= q + 0.08
    text(page, X(right), Y(0.205), w.lines["kicker"], 0.050 * s, "medium", GREY, track=30, align="right")
    # With the QR code beside it the address is set smaller, so it clears the tagline on a 4.50 m wall.
    text(page, X(right), Y(0.40), w.lines["big"], (0.105 if w.qr else 0.150) * s, "display-semibold", align="right")
    if w.qr:
        text(page, X(right), Y(0.53), "Scan for spec sheets and to book a meeting.", 0.045 * s, "text", GREY, align="right")
        text(page, X(right), Y(0.60), "Scannen: Datenblätter und Terminvereinbarung.", 0.045 * s, "text", GREY, align="right")
    page.draw_line((full.x0, Y(w.header)), (full.x1, Y(w.header)), color=INK, width=0.004 * s)

    if w.factory:
        cw, gap = 1.40, 0.04
        x0 = w.width - 0.25 - cw
        text(page, X(x0), Y(w.header + 0.165), "Our production in Zhongshan", 0.065 * s, "semibold")
        text(page, X(x0), Y(w.header + 0.245), "Unsere Fertigung in Zhongshan", 0.048 * s, "text", GREY)
        top, bottom = w.header + 0.29, w.height - w.plinth - 0.08
        hero_h = (bottom - top - gap) * 0.58
        small_w, small_h = (cw - gap) / 2, bottom - top - gap - hero_h
        cells = [(x0, top, cw, hero_h), (x0, top + hero_h + gap, small_w, small_h),
                 (x0 + small_w + gap, top + hero_h + gap, small_w, small_h)]
        for (name, focus, cap), (cx, cy, cwid, chei) in zip(FACTORY, cells):
            r = pymupdf.Rect(X(cx), Y(cy), X(cx + cwid), Y(cy + chei))
            page.insert_image(r, stream=photo_jpeg(name, cwid / chei, focus), keep_proportion=False)
            tab(page, r.x0, r.y1, cap, s)

    if proof:
        # Not printed: the trim line and the zone the boards may occupy.
        trim = pymupdf.Rect(X(0), Y(0), X(w.width), Y(w.height))
        page.draw_rect(trim, color=(0.85, 0.1, 0.1), width=0.6, dashes="[4 3] 0")
        zr = (w.width - 0.25 - 1.40 - 0.10) if w.factory else w.width - 0.05
        zone = pymupdf.Rect(X(0.05), Y(w.header + 0.05), X(zr), Y(w.height - w.plinth - 0.05))
        page.draw_rect(zone, color=(0.2, 0.45, 0.8), width=0.5, dashes="[2 2] 0")


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
    cjk(page, pad, 52, "BAU 2027 · C4.523 展位喷绘方案（展板以外的墙面）", 20, bold=True)
    cjk(page, pad, 74, "两块整墙喷绘布，展板直接挂在布上。内容只放在楣头和底边，展板区留白，展板怎么排都不会挡字。红色虚线 = 成品边，蓝色虚线 = 展板可放区域（不印）。", 9.5, color=GREY)
    # Both walls at one scale, sized so they and the notes share the sheet.
    room = A3.height - 100 - 125 - len(WALLS) * 30
    s = min((A3.width - 2 * pad) / (WALLS[0].width + 2 * BLEED), room / sum(w.height + 2 * BLEED for w in WALLS))
    cjk(page, A3.width - pad - 120, 52, f"示意比例约 1:{round(100 / (s / kit.MM / 10)) * 1}", 9.5, color=GREY)
    y = 100
    for w in WALLS:
        cjk(page, pad, y, f"{w.zh}　成品 {w.width:.2f} × {w.height:.2f} m　含出血 {w.width + 2 * BLEED:.2f} × {w.height + 2 * BLEED:.2f} m", 10, bold=True)
        draw_cloth(page, pymupdf.Point(pad, y + 8), w, s, proof=True)
        y += (w.height + 2 * BLEED) * s + 30
    notes = [
        "材料：喷绘布（灯箱布/刀刮布按搭建方墙体），四边各出血 15 cm；文件为 1:10 矢量 PDF，放大 10 倍输出，TrimBox 即成品边。",
        "颜色：只用墨色和白。墨色建议四色黑 C60 M50 Y50 K100（底边），文字同色；不用金色、不加渐变。照片按原样输出，不调色、不 AI 放大。",
        "墙高 2.50 m、楣头 0.70 m、底边 0.30 m 是按标准展位假设的，必须由搭建方确认真实尺寸后重出文件（改 WALLS 一行即可）。",
        "侧墙通道端 1.40 m 宽是「工厂实拍」栏：冲压、抛光、装配三张官网实拍，挑的是画面里没有旧招牌、没有中文标牌的；这一段不挂展板。",
        "二维码（侧墙右上，46 cm）指向 cantonlock.com/bau-2027/（规格书 + 预约见面），已用解码器验证。底边：后墙为公司事实，侧墙为邮箱和 WhatsApp。",
        "文字只用已确认的事实：1998 年、中山、ISO 9001:2015（冲压厂）、OEM / 自有品牌、起订量 300–5,000 件、C4.523。不写产能、不写其他认证。",
    ]
    for i, n in enumerate(notes):
        cjk(page, pad, A3.height - 108 + i * 15, f"{i + 1}. {n}", 8.6, color=INK)
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
