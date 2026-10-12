"""Factory signage for the 140th Canton Fair visits: design sheet + production files for the ad company.

    py scripts/brand/build_signage.py [--out-dir DIR]

Client, 2026-10-11: a welcome banner, a reception wall logo, visitor-route signs and a gate
sign, designed so an ad company can make them, and a plan for where they hang. Writes:
  <out-dir>/广交会-厂内标识-设计与制作说明.pdf      A3 landscape: every sign at scale, dimensions,
                                                     materials, then the route plan and the job list
  <out-dir>/制作文件-1比10矢量/*.pdf                 each sign alone, vector, at 1:10 of real size

Rules carried over from the site: no certification claims, no invented facts. The zones are
the processes the company states it runs (stamp, polish, assemble, inspect) plus showroom,
packing and meeting room; the client adjusts them to the real floor. Colours are the
website's two: ink on white (client 2026-10-11: 「白底墨色不要黑金」), no brass or titanium. The Canton Fair logo is
a low-resolution placeholder taken from the client's screenshot; the ad company must use the
organiser's official vector file.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import pymupdf

import hyde_mark as hm
import kit
from kit import GREY, INK, RULE, WHITE, place_mark, text

CN_NAME = "广州海狄五金建材有限公司"   # confirmed by the client 2026-10-11
CF_LOGO = kit.ROOT / "tmp" / "claude-brand" / "canton-fair-140-red.png"
A3L = pymupdf.Rect(0, 0, 1190.55, 841.89)
MM = kit.MM

ZONES = [
    ("展厅", "Showroom"), ("冲压车间", "Stamping"), ("抛光车间", "Polishing"),
    ("装配车间", "Assembly"), ("质检", "Quality inspection"), ("包装", "Packing"),
    ("会议室", "Meeting room"),
]


def cjk(page, x, y, txt, size, bold=True, color=INK, align="left"):
    return text(page, x, y, txt, size, "cjk-bold" if bold else "cjk", color, align=align)


# --------------------------------------------------------------------------- signs
# Each draw function fills `r` (the sign's face at any scale). k = points per mm on the face.


def gate_sign(p, r, k):
    # English leads, Chinese is a small line under it: the visitors are foreign buyers
    # (client 2026-10-11: 「中文字小很小。英文大。主要是给外国人看」).
    p.draw_rect(r, color=None, fill=WHITE, width=0)
    h = r.height
    mark_r = pymupdf.Rect(r.x0 + 0.06 * r.width, r.y0 + 0.24 * h, r.x0 + 0.47 * r.width, r.y1 - 0.24 * h)
    place_mark(p, mark_r, hm.horizontal(), hm.INK)
    x = r.x0 + 0.53 * r.width
    p.draw_line((x - 0.025 * r.width, r.y0 + 0.24 * h), (x - 0.025 * r.width, r.y1 - 0.24 * h), color=INK, width=max(0.6, 6 * k))
    room = r.x1 - 0.05 * r.width - x
    lines = ("CANTON HYLAND HARDWARE &", "BUILDING MATERIAL CO., LTD.")
    en = min(0.12 * h, min(room / kit.font("semibold").text_length(t, 1) for t in lines))
    text(p, x, r.y0 + 0.42 * h, lines[0], en, "semibold", INK)
    text(p, x, r.y0 + 0.42 * h + 1.2 * en, lines[1], en, "semibold", INK)
    cjk(p, x, r.y0 + 0.42 * h + 1.2 * en + 0.95 * en, CN_NAME, 0.42 * en, bold=False, color=GREY)


def reception_wall(p, r, k):
    p.draw_rect(r, color=None, fill=WHITE, width=0)
    m = hm.stacked()
    mr = pymupdf.Rect(r.x0, r.y0 + 0.14 * r.height, r.x1, r.y0 + 0.66 * r.height)
    place_mark(p, mr, m, hm.INK)
    cx = (r.x0 + r.x1) / 2
    size = min(0.042 * r.height, 0.8 * r.width / kit.font("semibold").text_length(hm.LEGAL, 1))
    text(p, cx, r.y0 + 0.79 * r.height, hm.LEGAL, size, "semibold", INK, align="center")
    cjk(p, cx, r.y0 + 0.79 * r.height + 1.5 * size, CN_NAME, 0.45 * size, bold=False, color=GREY, align="center")


def fit(t, size, room, key="display-semibold", track=0):
    """`size`, or smaller if `t` would not fit in `room` (tracking in 1/1000 em)."""
    return min(size, room / (kit.font(key).text_length(t, 1) + track / 1000 * (len(t) - 1)))


# Every sign below: English is the large line, Chinese a small grey line under it. The
# visitors are foreign buyers (client 2026-10-12: 「所有指示 广告 中文和英文大小调换 中文小英文大」).


def welcome_banner(p, r, k):
    p.draw_rect(r, color=None, fill=WHITE, width=0)
    h = r.height
    logo = pymupdf.Rect(r.x0 + 0.03 * r.width, r.y0 + 0.12 * h, r.x0 + 0.03 * r.width + 0.76 * h, r.y1 - 0.12 * h)
    if CF_LOGO.exists():
        p.insert_image(logo, filename=str(CF_LOGO))
        p.draw_rect(logo, color=(0.95, 0.6, 0.1), width=max(0.5, 3 * k), dashes="[4 3] 0")
    left, right = logo.x1 + 0.03 * r.width, r.x1 - 0.22 * r.width   # between the fair logo and HYDE
    cx = (left + right) / 2
    head = "WELCOME, 140TH CANTON FAIR BUYERS"
    size = fit(head, 0.2 * h, right - left, track=40)
    text(p, cx, r.y0 + 0.52 * h, head, size, "display-semibold", INK, align="center", track=40)
    cjk(p, cx, r.y0 + 0.52 * h + 0.22 * h, "热烈欢迎第140届广交会客商莅临参观", 0.09 * h, bold=False, color=GREY, align="center")
    mr = pymupdf.Rect(r.x1 - 0.19 * r.width, r.y0 + 0.3 * h, r.x1 - 0.03 * r.width, r.y1 - 0.3 * h)
    place_mark(p, mr, hm.horizontal(), hm.INK)
    p.draw_line((r.x0, r.y1 - 0.06 * h), (r.x1, r.y1 - 0.06 * h), color=INK, width=max(0.6, 8 * k))


def route_board(p, r, k):
    p.draw_rect(r, color=None, fill=WHITE, width=0)
    w, h = r.width, r.height
    place_mark(p, pymupdf.Rect(r.x0 + 0.08 * w, r.y0 + 0.05 * h, r.x0 + 0.6 * w, r.y0 + 0.11 * h), hm.horizontal(), hm.INK)
    text(p, r.x0 + 0.08 * w, r.y0 + 0.2 * h, "FACTORY TOUR", 0.05 * h, "display-semibold", INK)
    cjk(p, r.x0 + 0.08 * w, r.y0 + 0.235 * h, "参观路线", 0.02 * h, bold=False, color=GREY)
    top, bottom = r.y0 + 0.3 * h, r.y1 - 0.08 * h
    step = (bottom - top) / (len(ZONES) - 1)
    lx = r.x0 + 0.13 * w
    p.draw_line((lx, top), (lx, bottom), color=INK, width=max(0.6, 6 * k))
    room = r.x1 - 0.08 * w - (lx + 0.07 * w)
    for i, (cn, en) in enumerate(ZONES):
        y = top + i * step
        p.draw_circle((lx, y), 0.028 * h, color=None, fill=INK)
        text(p, lx, y + 0.012 * h, str(i + 1), 0.032 * h, "bold", WHITE, align="center")
        text(p, lx + 0.07 * w, y + 0.01 * h, en.upper(), fit(en.upper(), 0.03 * h, room, "semibold"), "semibold", INK)
        cjk(p, lx + 0.07 * w, y + 0.036 * h, cn, 0.016 * h, bold=False, color=GREY)
    text(p, r.x1 - 0.08 * w, top + 0.01 * h, "YOU ARE HERE", 0.02 * h, "semibold", INK, align="right")
    cjk(p, r.x1 - 0.08 * w, top + 0.033 * h, "您在这里", 0.013 * h, bold=False, color=GREY, align="right")


def zone_plate(i: int) -> Callable:
    cn, en = ZONES[i]

    def draw(p, r, k):
        p.draw_rect(r, color=None, fill=WHITE, width=0)
        w, h = r.width, r.height
        text(p, r.x0 + 0.08 * w, r.y0 + 0.5 * h, f"{i + 1:02d}", 0.4 * h, "display-semibold", INK)
        t = en.upper()
        text(p, r.x0 + 0.08 * w, r.y0 + 0.72 * h, t, fit(t, 0.12 * h, 0.84 * w), "display-semibold", INK)
        cjk(p, r.x0 + 0.08 * w, r.y0 + 0.86 * h, cn, 0.065 * h, bold=False, color=GREY)
        place_mark(p, pymupdf.Rect(r.x1 - 0.2 * w, r.y0 + 0.1 * h, r.x1 - 0.08 * w, r.y0 + 0.28 * h), hm.icon(), hm.INK)
    return draw


def arrow_plate(p, r, k):
    p.draw_rect(r, color=None, fill=WHITE, width=0)
    w, h = r.width, r.height
    t = "NEXT  02  STAMPING"
    text(p, r.x0 + 0.06 * w, r.y0 + 0.52 * h, t, fit(t, 0.26 * h, 0.66 * w), "display-semibold", INK)
    cjk(p, r.x0 + 0.06 * w, r.y0 + 0.8 * h, "下一站  02  冲压车间", 0.12 * h, bold=False, color=GREY)
    ax, ay = r.x1 - 0.16 * w, r.y0 + 0.5 * h
    s = 0.22 * h
    pts = [(ax - s, ay - s * 0.18), (ax + s * 0.2, ay - s * 0.18), (ax + s * 0.2, ay - s * 0.6),
           (ax + s * 1.05, ay), (ax + s * 0.2, ay + s * 0.6), (ax + s * 0.2, ay + s * 0.18), (ax - s, ay + s * 0.18)]
    p.draw_polyline(pts + [pts[0]], color=None, fill=INK, closePath=True)


@dataclass
class Sign:
    key: str
    title: str
    size: tuple[float, float]   # mm, width x height
    draw: Callable
    qty: str
    material: str
    place: str


SIGNS = [
    Sign("gate", "门头招牌", (6000, 1200), gate_sign, "1",
         "白色铝塑板或白色烤漆铝板底板；标志用黑色烤漆不锈钢立体字（厚 50 mm）；英文全称黑色烤漆立体字（厚 30 mm），是主要文字；中文全称只做一行小字，黑色平面字（UV 直印或刻字膜）",
         "厂区大门上方或主楼正面，下沿离地 ≥ 3 m；尺寸按门头实际宽度等比缩放"),
    Sign("reception", "前台背景墙", (3600, 1600), reception_wall, "1",
         "白色墙面或白色烤漆铝板背板；标志黑色烤漆立体字（不锈钢或亚克力），厚 30 mm，离墙 20 mm 暗装；英文全称 10 mm 黑色亚克力字；中文全称一行小字，黑色平面字",
         "接待前台正后方墙面，标志中心离地约 1.8 m；前台台面不要高过标志下沿"),
    Sign("welcome", "欢迎横幅", (6000, 900), welcome_banner, "1–2",
         "白底黑字。户外喷绘布（加厚，四边打扣眼）或室内 KT 板；广交会标志必须用主办方官方矢量文件（本稿为截图占位，分辨率不够印刷）",
         "大门内侧或接待楼入口上方，参观期间悬挂；第二块可挂在展厅入口"),
    Sign("route", "参观路线总图", (600, 900), route_board, "1",
         "5 mm 白色亚克力或白色铝板，墨色 UV 直印，配黑色烤漆落地展架（总高约 1.6 m）",
         "接待区或展厅入口，客户进门第一眼能看到的位置"),
]
SIGNS += [Sign(f"zone-{i + 1:02d}", f"区域门牌 {i + 1:02d} {cn}", (400, 300), zone_plate(i), "1",
               "3 mm 白色铝板墨色 UV 直印或白色亚克力丝印，背面双面胶 + 螺丝固定",
               f"{cn}入口旁墙面或门框右侧，牌中心离地 1.5 m") for i, (cn, _) in enumerate(ZONES)]
SIGNS.append(Sign("arrow", "方向指示牌（模板）", (600, 200), arrow_plate, "按需",
                  "3 mm 白色铝板墨色 UV 直印；同一模板按下一站编号和方向改文字、镜像箭头",
                  "每个拐角和岔路口，离地 1.5 m 墙面，或落地牌"))


# --------------------------------------------------------------------------- sheets


def dim_line(p, x0, y0, x1, y1, label, color=GREY):
    p.draw_line((x0, y0), (x1, y1), color=color, width=0.5)
    for (x, y) in ((x0, y0), (x1, y1)):
        p.draw_line((x - 3, y - 3) if y0 == y1 else (x - 3, y), (x + 3, y + 3) if y0 == y1 else (x + 3, y), color=color, width=0.5)
    if y0 == y1:
        text(p, (x0 + x1) / 2, y0 - 4, label, 8, "medium", color, align="center")
    else:
        text(p, x0 + 6, (y0 + y1) / 2, label, 8, "medium", color)


def design_page(doc, s: Sign, n: int, total: int) -> None:
    p = doc.new_page(width=A3L.width, height=A3L.height)
    text(p, 48, 52, f"{n:02d} / {total:02d}", 8, "medium", GREY, track=160)
    cjk(p, 48, 84, s.title, 22)
    text(p, A3L.width - 48, 84, f"{s.size[0]:g} × {s.size[1]:g} mm", 14, "semibold", INK, align="right")
    p.draw_line((48, 100), (A3L.width - 48, 100), color=RULE, width=0.5)
    area = pymupdf.Rect(90, 140, A3L.width - 90, 560)
    k = min(area.width / s.size[0], area.height / s.size[1])
    w, h = s.size[0] * k, s.size[1] * k
    r = pymupdf.Rect(area.x0 + (area.width - w) / 2, area.y0 + (area.height - h) / 2, 0, 0)
    r.x1, r.y1 = r.x0 + w, r.y0 + h
    s.draw(p, r, k)
    p.draw_rect(r, color=RULE, width=0.6)   # edge of a white sign; not in the production file
    dim_line(p, r.x0, r.y0 - 14, r.x1, r.y0 - 14, f"{s.size[0]:g} mm")
    dim_line(p, r.x1 + 14, r.y0, r.x1 + 14, r.y1, f"{s.size[1]:g} mm")
    y = 610
    for label, value in (("材料与工艺", s.material), ("位置与安装", s.place), ("数量", s.qty)):
        cjk(p, 48, y, label, 10)
        rc = p.insert_textbox(pymupdf.Rect(150, y - 11, A3L.width - 48, y + 40), value, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=10, color=INK, lineheight=1.5)
        if rc < 0:
            raise ValueError(f"{s.key}: note overflows")
        y += 52
    if s.key == "welcome":
        cjk(p, 48, A3L.height - 36, "注意：橙色虚线框内的广交会标志是截图占位，请向主办方索取官方矢量文件后替换", 10, color=(0.75, 0.2, 0.15))


def plan_page(doc, total: int) -> None:
    p = doc.new_page(width=A3L.width, height=A3L.height)
    text(p, 48, 52, "PLAN", 8, "medium", GREY, track=160)
    cjk(p, 48, 84, "怎么挂：参观动线与摆放位置（示意，按厂区实际调整）", 22)
    p.draw_line((48, 100), (A3L.width - 48, 100), color=RULE, width=0.5)
    stops = [("大门", "门头招牌 + 欢迎横幅"), ("接待区", "前台背景墙 + 参观路线总图")] + \
            [(cn, f"区域门牌 {i + 1:02d}") for i, (cn, _) in enumerate(ZONES)]
    x0, x1, y = 90, A3L.width - 90, 230
    step = (x1 - x0) / (len(stops) - 1)
    p.draw_line((x0, y), (x1, y), color=INK, width=2)
    for i, (name, what) in enumerate(stops):
        x = x0 + i * step
        p.draw_circle((x, y), 15, color=None, fill=INK)
        text(p, x, y + 5, "★" if i < 2 else str(i - 1), 12, "cjk-bold" if i < 2 else "bold", WHITE, align="center")
        cjk(p, x, y - 30, name, 11, align="center")
        p.insert_textbox(pymupdf.Rect(x - step / 2 + 4, y + 26, x + step / 2 - 4, y + 70), what, fontname="f-cjk",
                         fontfile=str(kit.FONTS["cjk"]), fontsize=8.5, color=GREY, align=1, lineheight=1.4)
    tips = [
        "1  每个拐角、岔路口放一块方向指示牌，写下一站编号和名称，客户不用问路。",
        "2  门牌统一贴在每个区域入口的同一侧（建议右侧），中心离地 1.5 m，同一高度看起来最整齐。",
        "3  生产车间内走地面黄线通道，指示牌不挡消防通道、不挂在设备上；参观路线避开正在作业的冲床正前方。",
        "4  欢迎横幅挂在大门内侧（客户下车第一眼），背景墙标志在接待前台正后方，路线总图放在客户进门方向。",
        "5  请发一张厂区平面图或几张照片（大门、接待区、各车间入口），我按实际尺寸把位置标准确，再出最终版。",
    ]
    y = 380
    for t in tips:
        rc = p.insert_textbox(pymupdf.Rect(90, y - 12, A3L.width - 90, y + 30), t, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=11, color=INK, lineheight=1.5)
        if rc < 0:
            raise ValueError("tip overflows")
        y += 44


def job_list_page(doc) -> None:
    p = doc.new_page(width=A3L.width, height=A3L.height)
    text(p, 48, 52, "JOB LIST", 8, "medium", GREY, track=160)
    cjk(p, 48, 84, "制作清单（给广告公司）", 22)
    p.draw_line((48, 100), (A3L.width - 48, 100), color=RULE, width=0.5)
    cols = [(48, "项目"), (250, "尺寸 mm"), (360, "数量"), (430, "材料与工艺")]
    y = 130
    for x, h in cols:
        cjk(p, x, y, h, 10, color=GREY)
    y += 10
    for s in SIGNS:
        if s.key.startswith("zone-") and s.key != "zone-01":
            continue
        title = "区域门牌 01–07（7 块）" if s.key == "zone-01" else s.title
        qty = "7" if s.key == "zone-01" else s.qty
        p.draw_line((48, y), (A3L.width - 48, y), color=RULE, width=0.4)
        cjk(p, 48, y + 20, title, 10)
        text(p, 250, y + 20, f"{s.size[0]:g} × {s.size[1]:g}", 10, "medium", INK)
        cjk(p, 360, y + 20, qty, 10, bold=False)
        rc = p.insert_textbox(pymupdf.Rect(430, y + 8, A3L.width - 48, y + 60), s.material, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=9, color=INK, lineheight=1.45)
        if rc < 0:
            raise ValueError(f"{s.key}: material overflows")
        y += 66
    notes = [
        "颜色只用两种，和官网一致：墨色 #14130F（CMYK 0/5/25/92；立体字和大面积用黑色烤漆或 K100）和白色。不用金色、铜色、钛金。",
        "字体：英文 Archivo（开源，随文件附）；中文请换成思源黑体 Bold（免费可商用），本稿中文为微软雅黑排版示意，微软雅黑商用需另购授权。",
        "文件：本 PDF 为矢量，“制作文件-1比10矢量”文件夹内每块牌一个 PDF，按 10 倍放大即实际尺寸；标志源文件见 HYDE 标志规范。",
        "开工前请先出一块门牌打样，确认颜色和字号后再批量做。",
    ]
    y += 16
    for t in notes:
        rc = p.insert_textbox(pymupdf.Rect(48, y, A3L.width - 48, y + 40), t, fontname="f-cjk",
                              fontfile=str(kit.FONTS["cjk"]), fontsize=9.5, color=INK, lineheight=1.5)
        if rc < 0:
            raise ValueError("note overflows")
        y += 34


def production_file(s: Sign, out_dir: Path) -> Path:
    """The sign alone at 1:10 of real size, vector."""
    doc = pymupdf.open()
    k = MM / 10
    p = doc.new_page(width=s.size[0] * k, height=s.size[1] * k)
    s.draw(p, p.rect, k)
    return kit.save_pdf(doc, out_dir / f"{s.key}-{s.size[0]:g}x{s.size[1]:g}mm-1比10.pdf", f"HYDE {s.title}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(kit.ROOT / "tmp" / "claude-brand" / "out"))
    out = Path(ap.parse_args().out_dir)
    doc = pymupdf.open()
    total = len(SIGNS)
    for n, s in enumerate(SIGNS, 1):
        design_page(doc, s, n, total)
    plan_page(doc, total)
    job_list_page(doc)
    sheet = kit.save_pdf(doc, out / "广交会-厂内标识-设计与制作说明.pdf", "HYDE factory signage, 140th Canton Fair")
    files = [production_file(s, out / "制作文件-1比10矢量") for s in SIGNS]
    print(f"sheet -> {sheet} ({len(doc)} pages); {len(files)} production files")


if __name__ == "__main__":
    main()
