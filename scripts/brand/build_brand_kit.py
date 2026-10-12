"""HYDE brand kit 2026: refined mark files + a 4-page usage guide for the client and the ad company.

    py scripts/brand/build_brand_kit.py [--out-dir DIR]

Writes:
  docs/brand/hyde-2026/marks/*.svg      icon / horizontal / stacked / horizontal-legal x ink / white / brass
  <out-dir>/HYDE-标志规范-2026.pdf       the guide (default tmp/claude-brand/out)
"""
from __future__ import annotations

import argparse
from pathlib import Path

import pymupdf

import hyde_mark as hm
import kit
from kit import BRASS, GREY, INK, LIGHT, MM, RULE, WHITE, place_mark, text

MARKS = kit.ROOT / "docs" / "brand" / "hyde-2026" / "marks"
OLD = kit.ROOT / "public" / "images" / "brand" / "hyde" / "hyde-logo-horizontal-black.svg"
A4L = pymupdf.Rect(0, 0, 841.89, 595.28)
COLOURS = {"ink": hm.INK, "white": hm.WHITE, "brass": hm.BRASS}


def write_marks() -> list[Path]:
    MARKS.mkdir(parents=True, exist_ok=True)
    out = []
    for name, fn in (("icon", hm.icon), ("horizontal", hm.horizontal), ("stacked", hm.stacked)):
        for cname, col in COLOURS.items():
            p = MARKS / f"hyde-{name}-{cname}.svg"
            p.write_text(hm.svg(fn(), color=col, pad=hm.CLEAR), "utf8")
            out.append(p)
    # The legal lockup goes through a PDF page so its text can be exported as outlines.
    m = hm.horizontal_legal()
    for cname, col in COLOURS.items():
        doc = pymupdf.open()
        pad = hm.CLEAR
        page = doc.new_page(width=m.width + 2 * pad, height=m.height + 2 * pad)
        place_mark(page, pymupdf.Rect(pad, pad, pad + m.width, pad + m.height), m, col, legal=True)
        p = MARKS / f"hyde-horizontal-legal-{cname}.svg"
        p.write_text(kit.outlined_svg(page), "utf8")
        out.append(p)
    return out


def header(page, title: str, kicker: str, n: int) -> None:
    text(page, 48, 54, kicker, 7.5, "medium", BRASS, track=160)
    text(page, 48, 82, title, 20, "cjk-bold", INK)
    text(page, A4L.width - 48, A4L.height - 30, f"HYDE 标志规范 2026 · {n}/4", 7.5, "cjk", GREY, align="right")
    page.draw_line((48, 96), (A4L.width - 48, 96), color=RULE, width=0.5)


def page_cover(doc) -> None:
    p = doc.new_page(width=A4L.width, height=A4L.height)
    place_mark(p, pymupdf.Rect(150, 180, A4L.width - 150, 340), hm.horizontal())
    text(p, A4L.width / 2, 420, "HYDE 标志精修 · 2026", 15, "cjk-bold", INK, align="center")
    text(p, A4L.width / 2, 444, "THE HYDE MARK, REFINED", 8, "medium", BRASS, align="center", track=220)
    text(p, A4L.width / 2, A4L.height - 40, hm.LEGAL, 7, "medium", GREY, align="center", track=120)


def page_changes(doc) -> None:
    p = doc.new_page(width=A4L.width, height=A4L.height)
    header(p, "新旧对比：保留原标志，只做精修", "BEFORE / AFTER", 2)
    old = pymupdf.open(OLD)
    old_pdf = pymupdf.open("pdf", old.convert_to_pdf())
    text(p, 60, 138, "原版", 9, "cjk-bold", GREY)
    p.show_pdf_page(pymupdf.Rect(60, 150, 400, 235), old_pdf, 0)
    text(p, 450, 138, "精修版", 9, "cjk-bold", BRASS)
    place_mark(p, pymupdf.Rect(450, 150, 790, 235), hm.horizontal())
    notes = [
        ("1  字距", "原版 H–Y 54、Y–D 50、D–E 64，D 与 E 之间明显偏松。精修版按光学字距：H–Y 46、Y–D 47、D–E 50，四个字母看起来等距。"),
        ("2  图标横杠", "横杠和竖杠同为 34 时，横的看起来更粗。横杠改为 32，并上移 2，落在视觉中心。字母本身原来就做了这个修正。"),
        ("3  字母外角", "字母的外角加 3% 的小圆角，和图标的圆头呼应；内角（Y 的分叉、E 的内角）保持锐利，字不会变软。"),
        ("4  使用规范", "补齐四种组合、三种颜色、安全留白、最小尺寸和禁用示例，招牌、目录、网站从此用同一个标志。"),
    ]
    y = 290
    for title, body in notes:
        text(p, 60, y, title, 10.5, "cjk-bold", INK)
        rc = p.insert_textbox(pymupdf.Rect(170, y - 11, A4L.width - 60, y + 40), body, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=9.5, color=INK, lineheight=1.5)
        if rc < 0:
            raise ValueError("note overflows")
        y += 62


def page_lockups(doc) -> None:
    p = doc.new_page(width=A4L.width, height=A4L.height)
    header(p, "四种组合 × 三种颜色", "LOCKUPS", 3)
    rows = [("图标", hm.icon(), False), ("横版", hm.horizontal(), False),
            ("竖版", hm.stacked(), False), ("横版 + 公司全称", hm.horizontal_legal(), True)]
    cols = [("白底 · 墨色", WHITE, hm.INK), ("墨底 · 白色", INK, hm.WHITE), ("浅底 · 铜色", LIGHT, hm.BRASS)]
    x0, y0, cw, rh = 150, 112, 210, 108
    for j, (label, bg, _) in enumerate(cols):
        text(p, x0 + j * (cw + 12) + cw / 2, y0 + 4, label, 8, "cjk", GREY, align="center")
    for i, (label, mark, legal) in enumerate(rows):
        y = y0 + 14 + i * (rh + 8)
        text(p, 48, y + rh / 2 + 3, label, 9, "cjk-bold", INK)
        for j, (_, bg, col) in enumerate(cols):
            cell = pymupdf.Rect(x0 + j * (cw + 12), y, x0 + j * (cw + 12) + cw, y + rh)
            p.draw_rect(cell, color=None, fill=bg, width=0)
            if bg == WHITE:
                p.draw_rect(cell, color=RULE, width=0.5)
            place_mark(p, cell + (24, 22, -24, -22), mark, col, legal=legal)


def page_rules(doc) -> None:
    p = doc.new_page(width=A4L.width, height=A4L.height)
    header(p, "留白、最小尺寸、颜色、禁用", "RULES", 4)
    # clear space diagram
    m = hm.horizontal()
    r = place_mark(p, pymupdf.Rect(90, 150, 400, 230), m)
    s = r.width / m.width
    pad = hm.CLEAR * s
    p.draw_rect(r + (-pad, -pad, pad, pad), color=BRASS, width=0.6, dashes="[3 2] 0")
    p.draw_rect(pymupdf.Rect(r.x0 - pad, r.y0 - pad, r.x0, r.y0), color=None, fill=BRASS, fill_opacity=0.25)
    p.insert_textbox(pymupdf.Rect(60, r.y1 + pad + 10, 420, r.y1 + pad + 50),
                     "安全留白：四周至少 1.5 个竖杠宽度（铜色虚线，左上角色块为 1 个单位），线内不放任何文字或图形。",
                     fontname="f-cjk", fontfile=str(kit.FONTS["cjk"]), fontsize=8.5, color=INK, lineheight=1.5)
    rows = [
        ("最小尺寸", "横版印刷宽 ≥ 30 mm，屏幕宽 ≥ 120 px；图标印刷高 ≥ 8 mm，屏幕 ≥ 24 px。更小时只用图标。"),
        ("墨色", f"{hm.INK}  ·  CMYK 0/5/25/92（建议，以印刷打样为准）  ·  大面积可用 K100"),
        ("铜色", f"{hm.BRASS}  ·  CMYK 0/23/77/46（建议）  ·  实物招牌用钛金或拉丝黄铜，不用金色油漆"),
        ("白色", "墨底或铜底上反白；照片上只放在大面积纯色、干净的区域。"),
        ("字体", "Archivo（与网站、目录同一字体，SIL OFL 开源授权）；中文用思源黑体或微软雅黑。"),
    ]
    y = 345
    for k, v in rows:
        text(p, 60, y, k, 9.5, "cjk-bold", INK)
        rc = p.insert_textbox(pymupdf.Rect(130, y - 10, 440, y + 30), v, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=8.6, color=INK, lineheight=1.45)
        if rc < 0:
            raise ValueError(f"rule row overflows: {k}")
        y += 38
    # don'ts
    text(p, 480, 140, "禁用", 10.5, "cjk-bold", INK)
    donts = ["拉伸或压扁", "加描边、阴影、渐变、立体效果", "改颜色（只用墨、白、铜）",
             "重新排字母或改字距", "和旧的红色椭圆 Hyland 标志并用", "放在杂乱的照片上"]
    y = 166
    for d in donts:
        p.draw_line((482, y - 3), (490, y - 3), color=(0.75, 0.2, 0.15), width=1.2)
        text(p, 498, y, d, 9, "cjk", INK)
        y += 22
    # a squashed example, struck through
    ex = pymupdf.Rect(482, 320, 782, 350)
    src = pymupdf.open(stream=hm.svg(hm.horizontal()).encode(), filetype="svg")
    p.show_pdf_page(ex, pymupdf.open("pdf", src.convert_to_pdf()), 0, keep_proportion=False)
    p.draw_line((ex.x0, ex.y1 + 4), (ex.x1, ex.y0 - 4), color=(0.75, 0.2, 0.15), width=1.5)
    text(p, 482, 372, "错误示例：被压扁的标志", 8, "cjk", GREY)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(kit.ROOT / "tmp" / "claude-brand" / "out"))
    args = ap.parse_args()
    marks = write_marks()
    doc = pymupdf.open()
    page_cover(doc); page_changes(doc); page_lockups(doc); page_rules(doc)
    out = kit.save_pdf(doc, Path(args.out_dir) / "HYDE-标志规范-2026.pdf", "HYDE brand mark 2026")
    print(f"{len(marks)} mark files -> {MARKS}")
    print(f"guide -> {out}")


if __name__ == "__main__":
    main()
