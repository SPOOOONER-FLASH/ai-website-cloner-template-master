"""HYDE brand kit package: every lockup, both colours, every format and size, plus a spec sheet.

    python scripts/brand/build_brand_package.py [--out-dir DIR]

Client, 2026-10-17: 「logo brand kit 整理一份发我，需要所有规格尺寸的，图案、纯文字的」.

Five lockups, all drawn by hyde_mark.py so every file is the same mark:
  icon               the lever-H symbol alone (图案)
  wordmark           the letters HYDE alone (纯文字)
  horizontal         icon + wordmark side by side (主标志)
  stacked            icon over wordmark
  horizontal-legal   horizontal with the legal company name under it

Each in ink (#14130F, for light grounds) and white (for dark grounds), as
  SVG  outlined vector, for web and the ad company
  PDF  outlined vector, for print (no font needed)
  PNG  transparent, 256 to 4096 px wide
  PNG  on its ground colour, 1024 and 2048 px (for Word, PPT, WhatsApp)
plus favicons and square avatars of the icon, and HYDE-品牌规范-2026.pdf with the
proportions, clear space, minimum sizes, colours and the file list.

Writes to tmp/claude-brand/HYDE-Brand-Kit-2026/ and a zip beside it (tmp/ is ignored by
git: the package is re-derivable, only this generator is tracked). The wordmark SVGs are
also written to docs/brand/hyde-2026/marks/ next to the other masters.
"""
from __future__ import annotations

import argparse
import io
import shutil
import zipfile
from pathlib import Path

import pymupdf
from PIL import Image

import hyde_mark as hm
import kit
from kit import GREY, INK, RULE, place_mark, text

OUT_DEFAULT = kit.ROOT / "tmp" / "claude-brand"
MARKS = kit.ROOT / "docs" / "brand" / "hyde-2026" / "marks"
COLOURS = {"ink": hm.INK, "white": hm.WHITE}
GROUND = {"ink": (255, 255, 255), "white": (20, 19, 15)}       # the ground each colour is made for
PNG_WIDTHS = [256, 512, 1024, 2048, 4096]
GROUND_WIDTHS = [1024, 2048]
FAVICONS = [16, 32, 48, 64, 180, 192, 512]
AVATARS = [400, 800, 1080]


def wordmark() -> hm.Mark:
    return hm.Mark(hm.wordmark_width(), hm.CAP, hm.wordmark_shapes(0, 0, 1))


LOCKUPS = {
    "icon": ("图案（图标）", hm.icon),
    "wordmark": ("纯文字", wordmark),
    "horizontal": ("横版（主标志）", hm.horizontal),
    "stacked": ("竖版", hm.stacked),
    "horizontal-legal": ("横版 + 公司全称", hm.horizontal_legal),
}


def mark_doc(name: str, colour: str) -> tuple[pymupdf.Document, hm.Mark]:
    """One page, the mark plus its clear space on every side, transparent ground."""
    m = LOCKUPS[name][1]()
    pad = hm.CLEAR
    doc = pymupdf.open()
    page = doc.new_page(width=m.width + 2 * pad, height=m.height + 2 * pad)
    place_mark(page, pymupdf.Rect(pad, pad, pad + m.width, pad + m.height), m, colour, legal=(name == "horizontal-legal"))
    return doc, m


def png(doc: pymupdf.Document, width: int, ground=None) -> Image.Image:
    page = doc[0]
    z = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=True)
    im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
    if ground is None:
        return im
    bg = Image.new("RGBA", im.size, ground + (255,))
    bg.alpha_composite(im)
    return bg.convert("RGB")


def outlined_pdf(doc: pymupdf.Document, path: Path) -> None:
    """Vector PDF with every glyph as a path, so print shops need no font."""
    svg = kit.outlined_svg(doc[0])
    src = pymupdf.open(stream=svg.encode(), filetype="svg")
    pymupdf.open("pdf", src.convert_to_pdf()).save(path, deflate=True)


def square(size: int, colour_key: str, fill: float) -> Image.Image:
    """The icon centred on a square of its ground colour, the icon `fill` of the side."""
    doc, _ = mark_doc("icon", COLOURS[colour_key])
    icon = png(doc, max(int(size * fill * (doc[0].rect.width / (hm.ICON_W))), 8))
    canvas = Image.new("RGBA", (size, size), GROUND[colour_key] + (255,))
    icon.thumbnail((int(size * fill), int(size * fill)), Image.LANCZOS)
    canvas.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
    return canvas.convert("RGB")


# ------------------------------------------------------------------------- spec sheet
A4L = pymupdf.Rect(0, 0, 841.89, 595.28)


def minimum_sizes() -> dict[str, tuple[str, str]]:
    """Print and screen minimums. Horizontal (≥30 mm / 120 px) and icon (≥8 mm / 24 px tall) are
    the 2026-10-11 guide's. The others are derived so the letters are never smaller than they
    are in the horizontal lockup at its minimum: same cap height, so the same legibility."""
    h = hm.horizontal()
    cap_ratio = hm.CAP * hm.WM_SCALE / h.width               # cap height per unit of horizontal width
    cap_mm, cap_px = 30 * cap_ratio, 120 * cap_ratio
    wm = wordmark()
    st = hm.stacked()
    st_cap = hm.CAP * hm.WM_SCALE * 0.82
    return {
        "icon": ("高 ≥ 8 mm", "高 ≥ 24 px"),
        "wordmark": (f"宽 ≥ {cap_mm * wm.width / wm.height:.0f} mm", f"宽 ≥ {cap_px * wm.width / wm.height:.0f} px"),
        "horizontal": ("宽 ≥ 30 mm", "宽 ≥ 120 px"),
        "stacked": (f"宽 ≥ {cap_mm / st_cap * st.width:.0f} mm", f"宽 ≥ {cap_px / st_cap * st.width:.0f} px"),
        "horizontal-legal": ("宽 ≥ 60 mm", "宽 ≥ 240 px"),
    }


def spec_sheet(path: Path) -> None:
    doc = pymupdf.open()
    mins = minimum_sizes()

    def head(p, title, n, total):
        text(p, 48, 54, "HYDE BRAND KIT 2026", 7.5, "medium", GREY, track=160)
        text(p, 48, 82, title, 20, "cjk-bold", INK)
        text(p, A4L.width - 48, A4L.height - 30, f"HYDE 品牌规范 2026 · {n}/{total}", 7.5, "cjk", GREY, align="right")
        p.draw_line((48, 96), (A4L.width - 48, 96), color=RULE, width=0.5)

    # 1. the five lockups with their proportions and minimum sizes
    p = doc.new_page(width=A4L.width, height=A4L.height)
    head(p, "五种标志组合 · 比例与最小尺寸", 1, 3)
    y = 120
    for name, (label, fn) in LOCKUPS.items():
        m = fn()
        box = pymupdf.Rect(60, y, 330, y + 70)
        place_mark(p, box, m, hm.INK, legal=(name == "horizontal-legal"))
        text(p, 360, y + 22, label, 11, "cjk-bold", INK)
        text(p, 360, y + 40, f"文件名 hyde-{name}-ink / -white   ·   宽高比 {m.width / m.height:.2f} : 1", 8.5, "cjk", GREY)
        text(p, 360, y + 56, f"最小尺寸  印刷 {mins[name][0]}   ·   屏幕 {mins[name][1]}", 8.5, "cjk", GREY)
        p.draw_line((48, y + 80), (A4L.width - 48, y + 80), color=RULE, width=0.4)
        y += 90

    # 2. clear space, colours, type, don'ts
    p = doc.new_page(width=A4L.width, height=A4L.height)
    head(p, "留白、颜色、字体", 2, 3)
    m = hm.horizontal()
    s = 300 / m.width
    pad = hm.CLEAR * s
    x0, y0 = 70 + pad, 140 + pad
    p.draw_rect(pymupdf.Rect(x0 - pad, y0 - pad, x0 + 300 + pad, y0 + m.height * s + pad), color=(0.75, 0.2, 0.15), width=0.6,
                dashes="[3 2] 0")
    place_mark(p, pymupdf.Rect(x0, y0, x0 + 300, y0 + m.height * s), m)
    text(p, 70, y0 + m.height * s + pad + 22, "虚线框 = 最小留白：四周各留 1.5 个图标竖杆宽度，框内不放任何文字或图形。", 9, "cjk", INK)
    rows = [
        ("墨色（主色）", f"HEX {hm.INK}  ·  RGB 20 / 19 / 15  ·  CMYK 0/5/25/92（建议，以打样为准）；大面积可用 K100，喷绘布用 C60 M50 Y50 K100"),
        ("白色", "HEX #FFFFFF  ·  用于墨色、深色或照片底上"),
        ("背景规则", "浅色底用墨色标志，深色底用白色标志；不用其他颜色，不加描边、阴影、渐变（官网和目录只用黑白两色）"),
        ("字体", "Archivo（网站、目录同一字体，SIL OFL 开源授权，可免费商用）；中文配思源黑体或微软雅黑"),
        ("公司全称", hm.LEGAL),
        ("禁止", "拉伸变形、改字距、换字体、旋转（锁架竖排等特殊物料除外）、在花底上直接放、重新描摹"),
    ]
    y = 330
    for k, v in rows:
        text(p, 70, y, k, 9.5, "cjk-bold", INK)
        text(p, 170, y, v, 9, "cjk", GREY)
        y += 30
    for i, (cname, ground) in enumerate((("ink", (1, 1, 1)), ("white", (0.078, 0.075, 0.059)))):
        r = pymupdf.Rect(470 + i * 170, 130, 620 + i * 170, 250)
        p.draw_rect(r, color=RULE if cname == "ink" else None, fill=ground, width=0.5)
        place_mark(p, pymupdf.Rect(r.x0 + 20, r.y0 + 40, r.x1 - 20, r.y1 - 40), hm.horizontal(), COLOURS[cname])
        text(p, r.x0 + r.width / 2, r.y1 + 16, "浅底用墨色" if cname == "ink" else "深底用白色", 8.5, "cjk", GREY, align="center")

    # 3. the file list
    p = doc.new_page(width=A4L.width, height=A4L.height)
    head(p, "文件清单 · 用哪个", 3, 3)
    rows = [
        ("01-SVG", "矢量，网站和设计软件用（Illustrator、Figma、CorelDRAW 都能打开）。5 种组合 × 墨/白 = 10 个"),
        ("02-PDF-print", "矢量 PDF，文字已转曲。发给印刷厂、广告公司、做招牌用这个。10 个"),
        ("03-PNG-transparent", f"透明底 PNG，宽 {' / '.join(str(w) for w in PNG_WIDTHS)} px，5 种组合 × 墨/白 × 5 个尺寸 = 50 个"),
        ("04-PNG-on-ground", f"带底色 PNG（墨标白底、白标墨底），宽 {' / '.join(str(w) for w in GROUND_WIDTHS)} px，放 Word、PPT、邮件签名"),
        ("05-icon-avatar", f"方形头像（WhatsApp、LinkedIn、阿里巴巴店铺）{' / '.join(str(a) for a in AVATARS)} px；网站图标 favicon {' / '.join(str(f) for f in FAVICONS)} px 和 .ico"),
        ("HYDE-品牌规范-2026.pdf", "本文件"),
    ]
    y = 130
    for k, v in rows:
        text(p, 60, y, k, 10, "semibold", INK)
        text(p, 250, y, v, 9, "cjk", GREY)
        p.draw_line((48, y + 14), (A4L.width - 48, y + 14), color=RULE, width=0.4)
        y += 38
    text(p, 60, y + 20, "选哪个：印刷、喷绘、招牌 → PDF 或 SVG；网页、PPT、社交媒体 → PNG；头像 → 05 文件夹。", 9.5, "cjk-bold", INK)
    text(p, 60, y + 44, "所有文件都由同一个程序生成（scripts/brand/build_brand_package.py），任何尺寸缺了可以几秒重出。", 8.5, "cjk", GREY)
    kit.save_pdf(doc, path, "HYDE 品牌规范 2026")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(OUT_DEFAULT))
    root = Path(ap.parse_args().out_dir) / "HYDE-Brand-Kit-2026"
    if root.exists():
        shutil.rmtree(root)
    dirs = {k: root / k for k in ("01-SVG", "02-PDF-print", "03-PNG-transparent", "04-PNG-on-ground", "05-icon-avatar")}
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)
    MARKS.mkdir(parents=True, exist_ok=True)
    for name in LOCKUPS:
        for cname, col in COLOURS.items():
            doc, _ = mark_doc(name, col)
            stem = f"hyde-{name}-{cname}"
            svg = kit.outlined_svg(doc[0])
            (dirs["01-SVG"] / f"{stem}.svg").write_text(svg, "utf8")
            if name == "wordmark":
                (MARKS / f"{stem}.svg").write_text(svg, "utf8")
            outlined_pdf(doc, dirs["02-PDF-print"] / f"{stem}.pdf")
            for w in PNG_WIDTHS:
                png(doc, w).save(dirs["03-PNG-transparent"] / f"{stem}-{w}px.png", optimize=True)
            for w in GROUND_WIDTHS:
                png(doc, w, GROUND[cname]).save(dirs["04-PNG-on-ground"] / f"{stem}-on-{'white' if cname == 'ink' else 'ink'}-{w}px.png",
                                                optimize=True)
    for cname in COLOURS:
        for a in AVATARS:
            square(a, cname, 0.56).save(dirs["05-icon-avatar"] / f"hyde-avatar-{cname}-{a}px.png", optimize=True)
    for f in FAVICONS:
        square(f, "ink", 0.78).save(dirs["05-icon-avatar"] / f"hyde-favicon-{f}px.png", optimize=True)
    square(256, "ink", 0.78).save(dirs["05-icon-avatar"] / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    spec_sheet(root / "HYDE-品牌规范-2026.pdf")
    zpath = root.parent / "HYDE-Brand-Kit-2026.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(root.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(root.parent))
    n = sum(1 for f in root.rglob("*") if f.is_file())
    print(f"{n} files -> {root}")
    print(zpath)


if __name__ == "__main__":
    main()
