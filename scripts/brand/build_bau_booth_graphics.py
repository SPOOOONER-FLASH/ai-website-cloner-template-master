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
PHOTO = kit.ROOT / "public" / "images" / "company" / "press-shop.webp"


@dataclass
class Wall:
    key: str
    zh: str
    width: float                     # finished width, m
    height: float = 2.50             # ASSUMED: standard stand wall height, builder to confirm
    header: float = 0.70             # header band from the top edge
    plinth: float = 0.30             # ink plinth from the floor
    lines: dict = field(default_factory=dict)
    photo: tuple[float, float, float, float] | None = None  # x from left, bottom above floor, w, h (m)


WALLS = [
    Wall("back-wall", "后墙", 6.50, lines={
        "en": "Panic exit devices, locks and door hardware.",
        "de": "Panikbeschläge, Schlösser und Türbeschläge.",
        "kicker": "BAU 2027 · München",
        "big": "Stand C4.523",
    }),
    # The side wall's open end faces the aisle (stand plan render): the photograph sits there,
    # at eye level, 1.20 × 0.80 m — the size the 2616 px file still holds at ~55 dpi.
    Wall("side-wall", "侧墙", 4.50, lines={
        "en": "Door hardware from Zhongshan, China, since 1998.",
        "de": "Türbeschläge aus Zhongshan, China – seit 1998.",
        "kicker": "OEM · Private label · Eigenmarke",
        "big": "cantonlock.com",
    }, photo=(4.50 - 0.25 - 1.20, 0.85, 1.20, 0.80)),
]
CAPTION = "Stamping workshop, Zhongshan  ·  Stanzerei, Zhongshan"
SIDE_MARGIN = 0.30


_JPEG: dict[float, bytes] = {}


def photo_jpeg(aspect: float) -> bytes:
    """The photograph centre-cropped to the panel's aspect, as a full-resolution JPEG (q 95)."""
    if aspect not in _JPEG:
        import io
        from PIL import Image
        im = Image.open(PHOTO).convert("RGB")
        w, h = im.size
        cw, ch = (w, round(w / aspect)) if w / h < aspect else (round(h * aspect), h)
        im = im.crop(((w - cw) // 2, (h - ch) // 2, (w - cw) // 2 + cw, (h - ch) // 2 + ch))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=95)
        _JPEG[aspect] = buf.getvalue()
    return _JPEG[aspect]


def draw_cloth(page: pymupdf.Page, o: pymupdf.Point, w: Wall, s: float, proof: bool) -> None:
    """The cloth with its bleed; `o` is the top-left of the BLEED box, s = points per metre."""
    B = BLEED
    full = pymupdf.Rect(o.x, o.y, o.x + (w.width + 2 * B) * s, o.y + (w.height + 2 * B) * s)
    page.draw_rect(full, color=None, fill=WHITE, width=0)
    X = lambda m: o.x + (B + m) * s          # noqa: E731  metres from the trim's left edge
    Y = lambda m: o.y + (B + m) * s          # noqa: E731  metres from the trim's top edge

    # Plinth: ink from the floor line up, running out into the bleed on three sides.
    page.draw_rect(pymupdf.Rect(full.x0, Y(w.height - w.plinth), full.x1, full.y1), color=None, fill=INK, width=0)

    # Header band: mark left, two lines under it, stand or address right, a hairline under.
    mark, mark_h = hm.horizontal(), 0.20
    mark_w = mark_h * mark.width / mark.height   # place_mark centres; a rect of the mark's own aspect keeps it flush left
    place_mark(page, pymupdf.Rect(X(SIDE_MARGIN), Y(0.12), X(SIDE_MARGIN + mark_w), Y(0.12 + mark_h)), mark)
    text(page, X(SIDE_MARGIN), Y(0.47), w.lines["en"], 0.085 * s, "medium")
    text(page, X(SIDE_MARGIN), Y(0.585), w.lines["de"], 0.060 * s, "text", GREY)
    text(page, X(w.width - SIDE_MARGIN), Y(0.205), w.lines["kicker"], 0.055 * s, "medium", GREY, track=40, align="right")
    text(page, X(w.width - SIDE_MARGIN), Y(0.40), w.lines["big"], 0.150 * s, "display-semibold", align="right")
    page.draw_line((full.x0, Y(w.header)), (full.x1, Y(w.header)), color=INK, width=0.004 * s)

    if w.photo:
        px, bottom, pw, ph = w.photo
        r = pymupdf.Rect(X(px), Y(w.height - bottom - ph), X(px + pw), Y(w.height - bottom))
        page.insert_image(r, stream=photo_jpeg(pw / ph), keep_proportion=False)
        text(page, X(px), Y(w.height - w.plinth / 2) + 0.018 * s, CAPTION, 0.045 * s, "medium", WHITE)

    if proof:
        # Not printed: the trim line and the zone the boards may occupy.
        trim = pymupdf.Rect(X(0), Y(0), X(w.width), Y(w.height))
        page.draw_rect(trim, color=(0.85, 0.1, 0.1), width=0.6, dashes="[4 3] 0")
        zone = pymupdf.Rect(X(0.05), Y(w.header + 0.05), X(w.width - 0.05), Y(w.height - w.plinth - 0.05))
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
        "颜色：只用墨色和白。墨色建议四色黑 C60 M50 Y50 K100（大面积底边），文字同色；不用金色、不加渐变。",
        "墙高 2.50 m、楣头 0.70 m、底边 0.30 m 是按标准展位假设的，必须由搭建方确认真实尺寸后重出文件（改 WALLS 一行即可）。",
        "照片：冲压车间实拍，2616 px，1.20 × 0.80 m 约 55 dpi，喷绘布近看略软；如有原始相机文件请提供，可放大到 1.8 m 宽。",
        "侧墙照片放在靠通道一端（按效果图）；若侧墙朝向不同，左右翻转位置，文字不翻。展台前台正面已有 H 标，不在本次范围。",
        "文字只用已确认的事实：BAU 2027、C4.523、1998 年、中山、OEM / 自有品牌、网址。不写认证、不写产能。",
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
